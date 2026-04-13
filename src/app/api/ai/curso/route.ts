import { NextRequest, NextResponse } from 'next/server'
import { DEMO_COURSE } from '@/lib/ai/demo-responses'

export const maxDuration = 60

async function handleReal(request: NextRequest) {
  const { createClient } = await import('@/lib/supabase/server')
  const { generateWithModel } = await import('@/lib/ai/router')
  const { COURSE_SYSTEM_PROMPT, buildCoursePrompt } = await import('@/lib/ai/prompts')
  const { checkUsageLimit, incrementUsage } = await import('@/lib/supabase/usage')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { allowed, profile } = await checkUsageLimit(supabase, user.id)
  if (!allowed) return NextResponse.json({ error: 'Limite atingido. Faça upgrade.' }, { status: 403 })

  const { topic, audience, duration, level, model = 'claude' } = await request.json()

  if (!topic || !audience) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const userPrompt = buildCoursePrompt({ topic, audience, duration, level })
  const result = await generateWithModel(model, COURSE_SYSTEM_PROMPT, userPrompt, 4096)
  await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)

  console.log('[curso/route] raw length:', result.length, '| first 200:', result.slice(0, 200))

  const jsonMatch = result.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return NextResponse.json({ data: JSON.parse(jsonMatch[0]) })
    } catch {
      const cleaned = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
      try {
        return NextResponse.json({ data: JSON.parse(cleaned) })
      } catch (e2) {
        console.error('[curso/route] JSON parse falhou:', e2)
        return NextResponse.json({ error: 'A IA retornou JSON inválido. Tente novamente.' }, { status: 500 })
      }
    }
  }

  console.error('[curso/route] Nenhum JSON encontrado. Raw:', result.slice(0, 500))
  return NextResponse.json({ error: 'A IA não retornou o formato esperado. Tente novamente.' }, { status: 500 })
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    await new Promise((r) => setTimeout(r, 2000))
    return NextResponse.json({ data: DEMO_COURSE })
  }

  try {
    return await handleReal(request)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    console.error('[curso/route]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
