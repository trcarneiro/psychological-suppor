import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_API_KEY, GEMINI_MODEL } from '../config'

let client: GoogleGenerativeAI | null = null

function getClient() {
  if (!client && GEMINI_API_KEY) {
    client = new GoogleGenerativeAI(GEMINI_API_KEY)
  }
  return client
}

interface GenerateTextOptions {
  temperature?: number
  maxOutputTokens?: number
}

export async function generateText(prompt: string, options: GenerateTextOptions = {}) {
  if (!GEMINI_API_KEY) {
    return null
  }

  try {
    const genAI = getClient()
    if (!genAI) return null

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: options.temperature ?? 0.8,
        maxOutputTokens: options.maxOutputTokens ?? 512,
      },
    })

    const response = await model.generateContent(prompt)
    const text = response.response.text()
    return text?.trim() ?? null
  } catch (error) {
    console.error('[LLM] Erro ao gerar resposta:', error)
    return null
  }
}
