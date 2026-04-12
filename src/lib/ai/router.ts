import type { AIModel } from '@/types/database'
import { generateWithClaude, streamWithClaude } from './claude'
import { generateWithGPT, streamWithGPT } from './openai'
import { generateWithGemini, streamWithGemini } from './gemini'

export async function generateWithModel(
  model: AIModel,
  systemPrompt: string,
  userPrompt: string,
  maxTokens?: number
): Promise<string> {
  switch (model) {
    case 'claude':
      return generateWithClaude(systemPrompt, userPrompt, maxTokens)
    case 'gpt':
      return generateWithGPT(systemPrompt, userPrompt, maxTokens)
    case 'gemini':
      return generateWithGemini(systemPrompt, userPrompt)
    default:
      return generateWithClaude(systemPrompt, userPrompt, maxTokens)
  }
}

export async function streamWithModel(
  model: AIModel,
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void,
  maxTokens?: number
): Promise<void> {
  switch (model) {
    case 'claude':
      return streamWithClaude(systemPrompt, userPrompt, onChunk, maxTokens)
    case 'gpt':
      return streamWithGPT(systemPrompt, userPrompt, onChunk, maxTokens)
    case 'gemini':
      return streamWithGemini(systemPrompt, userPrompt, onChunk)
    default:
      return streamWithClaude(systemPrompt, userPrompt, onChunk, maxTokens)
  }
}
