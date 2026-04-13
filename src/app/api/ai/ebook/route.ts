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
  const {
    EBOOK_SYSTEM_PROMPT,
    buildEbookPrompt,
    buildEbookChapterPrompt,
    buildEbookIntroPrompt,
    buildEbookConclusionPrompt,
  } = await import('@/lib/ai/prompts')
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

  // ── Modo: outline ─────────────────────────────────────────────
  if (mode === 'outline') {
    if (!niche || !audience || !promise || !level) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const userPrompt = buildEbookPrompt({ niche, audience, promise, level, mode: 'outline' })
    const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, 2000)
    await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)

    console.log('[ebook/outline] raw length:', result.length, '| preview:', result.slice(0, 300))

    // Tenta extrair JSON da resposta
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[ebook/outline] Nenhum JSON encontrado. Raw:', result.slice(0, 500))
      return NextResponse.json({ error: 'A IA não retornou o formato esperado. Tente novamente.' }, { status: 500 })
    }

    let parsed: Record<string, unknown> | null = null
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      const cleaned = jsonMatch[0].replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
      try {
        parsed = JSON.parse(cleaned)
      } catch {
        console.error('[ebook/outline] JSON inválido após cleanup:', jsonMatch[0].slice(0, 500))
        return NextResponse.json({ error: 'A IA retornou JSON inválido. Tente novamente.' }, { status: 500 })
      }
    }

    console.log('[ebook/outline] parsed keys:', Object.keys(parsed ?? {}))

    const normalized = normalizeOutline(parsed ?? {})
    console.log('[ebook/outline] chapters count:', normalized.chapters.length, '| title:', normalized.title)

    // Se normalization falhar, retorna o objeto bruto para o frontend tentar usar
    if (!normalized.title && normalized.chapters.length === 0) {
      console.error('[ebook/outline] Normalization failed. Raw parsed:', JSON.stringify(parsed).slice(0, 500))
      return NextResponse.json({ data: parsed })
    }

    return NextResponse.json({ data: normalized })
  }

  // ── Modo: chapter ─────────────────────────────────────────────
  if (mode === 'chapter') {
    const { chapterNumber, chapterTitle, chapterDescription, keyPoints, ebookTitle } = body
    const userPrompt = buildEbookChapterPrompt({
      chapterNumber, chapterTitle, chapterDescription,
      keyPoints: keyPoints ?? [],
      niche, audience, level, ebookTitle,
    })
    const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, 1500)
    await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)
    return NextResponse.json({ data: result })
  }

  // ── Modo: intro ───────────────────────────────────────────────
  if (mode === 'intro') {
    const { ebookTitle, ebookSubtitle } = body
    const userPrompt = buildEbookIntroPrompt({
      title: ebookTitle, subtitle: ebookSubtitle,
      niche, audience, promise, level,
    })
    const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, 1000)
    await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)
    return NextResponse.json({ data: result })
  }

  // ── Modo: conclusion ──────────────────────────────────────────
  if (mode === 'conclusion') {
    const { ebookTitle } = body
    const userPrompt = buildEbookConclusionPrompt({ title: ebookTitle, niche, promise })
    const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, 800)
    await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)
    return NextResponse.json({ data: result })
  }

  return NextResponse.json({ error: 'Modo inválido' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const body = await request.json()
    await new Promise((r) => setTimeout(r, 1800))
    if (body.mode === 'outline') return NextResponse.json({ data: DEMO_EBOOK_OUTLINE })
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
