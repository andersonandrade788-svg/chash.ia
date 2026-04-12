import { GoogleGenerativeAI } from '@google/generative-ai'

function getClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
}

export async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: systemPrompt,
  })

  const result = await model.generateContent(userPrompt)
  return result.response.text()
}

export async function streamWithGemini(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const model = getClient().getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: systemPrompt,
  })

  const result = await model.generateContentStream(userPrompt)
  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) onChunk(text)
  }
}
