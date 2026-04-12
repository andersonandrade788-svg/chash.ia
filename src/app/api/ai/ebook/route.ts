import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
import { DEMO_EBOOK_OUTLINE, DEMO_EBOOK_CONTENT } from '@/lib/ai/demo-responses'

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
  const result = await generateWithModel(model, EBOOK_SYSTEM_PROMPT, userPrompt, mode === 'full' ? 2048 : 1024)
  await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)

  if (mode === 'outline') {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return NextResponse.json({ data: JSON.parse(jsonMatch[0]) })
      } catch {
        // JSON malformado — tenta limpar e fazer parse novamente
        const cleaned = jsonMatch[0]
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
        try {
          return NextResponse.json({ data: JSON.parse(cleaned) })
        } catch {
          // Retorna como texto se ainda falhar
          return NextResponse.json({ data: result })
        }
      }
    }
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
