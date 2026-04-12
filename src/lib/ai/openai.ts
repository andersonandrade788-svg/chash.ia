import OpenAI from 'openai'

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function generateWithGPT(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096
): Promise<string> {
  const openai = getClient()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })

  return completion.choices[0]?.message?.content ?? ''
}

export async function streamWithGPT(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void,
  maxTokens = 4096
): Promise<void> {
  const openai = getClient()
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: maxTokens,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content
    if (text) onChunk(text)
  }
}
