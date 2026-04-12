import { NextRequest, NextResponse } from 'next/server'
import { DEMO_COURSE } from '@/lib/ai/demo-responses'

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
  const userPrompt = buildCoursePrompt({ topic, audience, duration, level })
  const result = await generateWithModel(model, COURSE_SYSTEM_PROMPT, userPrompt, 4096)
  await incrementUsage(supabase, user.id, profile?.generations_used ?? 0)

  const jsonMatch = result.match(/\{[\s\S]*\}/)
  if (jsonMatch) return NextResponse.json({ data: JSON.parse(jsonMatch[0]) })
  return NextResponse.json({ data: result })
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    await new Promise((r) => setTimeout(r, 2000))
    return NextResponse.json({ data: DEMO_COURSE })
  }
  return handleReal(request)
}
