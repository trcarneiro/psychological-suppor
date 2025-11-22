import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { GEMINI_API_KEY, GEMINI_MODEL } from '../config'

let client: GoogleGenerativeAI | null = null
const EXPECTED_MODEL = 'gemini-2.5-pro'
let warnedModelMismatch = false

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
    console.log('[LLM] GEMINI_API_KEY não configurada!')
    return null
  }

  try {
    const genAI = getClient()
    if (!genAI) {
      console.log('[LLM] Client não inicializado!')
      return null
    }

    if (GEMINI_MODEL !== EXPECTED_MODEL && !warnedModelMismatch) {
      console.warn('[LLM] ⚠️ Modelo configurado difere do recomendado!')
      console.warn('[LLM]   Atual:', GEMINI_MODEL)
      console.warn('[LLM]   Esperado:', EXPECTED_MODEL)
      console.warn('[LLM]   Ajuste GEMINI_MODEL para garantir consistência nas respostas.')
      warnedModelMismatch = true
    }

    console.log('[LLM] Gerando com modelo:', GEMINI_MODEL)
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: options.temperature ?? 0.8,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    })

    const response = await model.generateContent(prompt)
    console.log('[LLM] Response obtida. PromptFeedback:', JSON.stringify(response.response.promptFeedback))
    console.log('[LLM] Candidates:', response.response.candidates?.length ?? 0)
    
    if (response.response.candidates && response.response.candidates.length > 0) {
      const firstCandidate = response.response.candidates[0]
      console.log('[LLM] Candidate[0].content:', JSON.stringify(firstCandidate.content))
      console.log('[LLM] Candidate[0].finishReason:', firstCandidate.finishReason)
      
      if (response.response.usageMetadata) {
        console.log('[LLM] Usage Metadata:', JSON.stringify(response.response.usageMetadata))
      }

      // Se finishReason for MAX_TOKENS, avisar claramente
      if (firstCandidate.finishReason === 'MAX_TOKENS') {
        console.warn('[LLM] ⚠️ AVISO: Resposta truncada por MAX_TOKENS! Considere:')
        console.warn('[LLM]   1. Aumentar maxOutputTokens')
        console.warn('[LLM]   2. Reduzir tamanho do prompt')
        console.warn('[LLM]   Prompt length:', prompt.length, 'chars')
      }
    }
    
    const text = response.response.text()
    console.log('[LLM] Texto extraído (length:', text?.length ?? 0, '):', text?.substring(0, 100))
    return text?.trim() ?? null
  } catch (error: any) {
    console.error('[LLM] ❌ ERRO ao gerar resposta:')
    console.error('[LLM]   Modelo:', GEMINI_MODEL)
    console.error('[LLM]   Mensagem:', error.message)
    if (error.response) {
      console.error('[LLM]   Status:', error.response.status)
      console.error('[LLM]   Data:', JSON.stringify(error.response.data))
    }
    return null
  }
}
