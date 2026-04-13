import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
import { DEMO_EBOOK_OUTLINE, DEMO_EBOOK_CONTENT } from '@/lib/ai/demo-responses'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOutline(raw: Record<string, any>) {
  const get = (...keys: string[]) => {
    for (const k of keys) if (raw[k] !== undefined) return raw[k]
    return undefined
  }

  const chapters =
    get('chapters', 'capitulos', 'capítulos', 'Chapters', 'Capítulos') ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedChapters = (Array.isArray(chapters) ? chapters : []).map((ch: any) => ({
    number: ch.number ?? ch.numero ?? ch.número ?? ch.num ?? 0,
    title: ch.title ?? ch.titulo ?? ch.título ?? ch.name ?? '',
    description: ch.description ?? ch.descricao ?? ch.descrição ?? ch.objetivo ?? '',
    keyPoints: ch.keyPoints ?? ch.key_points ?? ch.pontos ?? ch.pontosPrincipais ?? ch.tópicos ?? ch.topicos ?? [],
  }))

  return {
    title: get('title', 'titulo', 'título', 'nome') ?? '',
    subtitle: get('subtitle', 'subtitulo', 'subtítulo', 'sub_titulo') ?? '',
    tagline: get('tagline', 'slogan', 'frase', 'fraseImpacto', 'frase_impacto') ?? '',
    chapters: normalizedChapters,
    targetAudience: get('targetAudience', 'target_audience', 'publicoAlvo', 'público_alvo', 'publico_alvo', 'publicoIdeal') ?? '',
    mainBenefit: get('mainBenefit', 'main_benefit', 'beneficioPrincipal', 'beneficio_principal', 'transformacao', 'transformação') ?? '',
    potentialScore: get('potentialScore', 'potential_score', 'pontuacao', 'pontuação', 'score') ?? 75,
  }
}

async function handleReal(request: NextRequest) {
  const { createClient } = await import('@/lib/supabase/server')
  const { generateWithModel } = await import('@/lib/ai/router')
  const { EBOOK_SYSTEM_PROMPT, buildEbookPrompt } = await import('@/lib/ai/prompts')
  const { checkUsageLimit, incrementUsage } = await import('@/lib/supabase/usage')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { allowed, profile } = await checkUsageLimit(supabase, user.id)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Limite de gerações atingido. Faça upgrade para o plano Pro.' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { niche, audience, promise, level, mode, model = 'claude' } = body
  if (!niche || !audience || !promise || !level) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const userPrompt = buildEbookPrompt({ niche, audience, promise, level, mode })
  // outline precisa de ~2000 tokens para 7 capítulos com descrições em PT
  const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, mode === 'full' ? 3000 : 2000)
  await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)

  if (mode === 'outline') {
    console.log('[ebook/route] raw length:', result.length, '| first 200:', result.slice(0, 200))

    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      let parsed: Record<string, unknown> | null = null
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch {
        const cleaned = jsonMatch[0]
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
        try {
          parsed = JSON.parse(cleaned)
        } catch {
          console.error('[ebook/route] JSON inválido:', jsonMatch[0].slice(0, 500))
          return NextResponse.json({ error: 'A IA retornou JSON inválido. Tente novamente.' }, { status: 500 })
        }
      }

      console.log('[ebook/route] outline keys:', Object.keys(parsed ?? {}))

      const normalized = normalizeOutline(parsed ?? {})
      console.log('[ebook/route] normalized chapters count:', normalized.chapters.length)

      if (!normalized.title && !normalized.chapters.length) {
        console.error('[ebook/route] Normalização falhou. Raw keys:', Object.keys(parsed ?? {}))
        // Retorna o parsed bruto para o frontend conseguir algo
        return NextResponse.json({ data: parsed })
      }

      return NextResponse.json({ data: normalized })
    }
    console.error('[ebook/route] Nenhum JSON encontrado. Raw:', result.slice(0, 500))
    return NextResponse.json({ error: 'A IA não retornou o formato esperado. Tente novamente.' }, { status: 500 })
  }
  return NextResponse.json({ data: result })
}

export async function POST(request: NextRequest) {
  // ── Modo Demo ────────────────────────────────────
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const body = await request.json()
    await new Promise((r) => setTimeout(r, 1800))

    if (body.mode === 'outline') {
      return NextResponse.json({ data: DEMO_EBOOK_OUTLINE })
    }
    return NextResponse.json({ data: DEMO_EBOOK_CONTENT })
  }

  try {
    return await handleReal(request)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    console.error('[ebook/route]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
