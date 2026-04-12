import { NextRequest } from 'next/server'
import { DEMO_CHAT_RESPONSES } from '@/lib/ai/demo-responses'

async function handleReal(request: NextRequest) {
  const { createClient } = await import('@/lib/supabase/server')
  const { CHAT_SYSTEM_PROMPT, AGENT_PROMPTS } = await import('@/lib/ai/prompts')
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const OpenAI = (await import('openai')).default
  const { GoogleGenerativeAI } = await import('@google/generative-ai')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Não autorizado', { status: 401 })

  const body = await request.json()
  const { messages, model = 'claude', agentId } = body
  const systemPrompt = agentId ? (AGENT_PROMPTS[agentId] ?? CHAT_SYSTEM_PROMPT) : CHAT_SYSTEM_PROMPT

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (model === 'claude') {
          const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
          const claudeStream = anthropic.messages.stream({ model: 'claude-opus-4-6', max_tokens: 2048, system: systemPrompt, messages })
          for await (const chunk of claudeStream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } else if (model === 'gpt') {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
          const s = await openai.chat.completions.create({ model: 'gpt-4o', max_tokens: 2048, stream: true, messages: [{ role: 'system', content: systemPrompt }, ...messages] })
          for await (const chunk of s) {
            const text = chunk.choices[0]?.delta?.content
            if (text) controller.enqueue(encoder.encode(text))
          }
        } else {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
          const gemModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: systemPrompt })
          const last = messages[messages.length - 1]
          const result = await gemModel.generateContentStream(last.content)
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(encoder.encode(text))
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro'
        controller.enqueue(encoder.encode(`[ERRO] ${msg}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked', 'Cache-Control': 'no-cache' } })
}

/** Simula streaming caracter por caracter no modo demo */
function createDemoStream(text: string): ReadableStream {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      const words = text.split(' ')
      for (const word of words) {
        controller.enqueue(encoder.encode(word + ' '))
        await new Promise((r) => setTimeout(r, 30))
      }
      controller.close()
    },
  })
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const response = DEMO_CHAT_RESPONSES.default
    return new Response(createDemoStream(response), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked', 'Cache-Control': 'no-cache' },
    })
  }

  return handleReal(request)
}
