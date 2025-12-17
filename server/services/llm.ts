import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { GEMINI_API_KEYS, GEMINI_MODEL, OPENROUTER_API_KEY, OPENROUTER_MODEL, LLM_PROVIDER } from '../config'

let geminiClients: GoogleGenerativeAI[] = []

function getGeminiClient() {
  if (geminiClients.length === 0 && GEMINI_API_KEYS.length > 0) {
    geminiClients = GEMINI_API_KEYS.map(key => new GoogleGenerativeAI(key))
  }
  
  if (geminiClients.length === 0) return null

  // Simple random rotation
  const randomIndex = Math.floor(Math.random() * geminiClients.length)
  return geminiClients[randomIndex]
}

interface GenerateTextOptions {
  temperature?: number
  maxOutputTokens?: number
  model?: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ==================== OPENROUTER ====================
async function generateWithOpenRouter(prompt: string, options: GenerateTextOptions): Promise<string> {
  const startTime = Date.now()
  
  console.log('[LLM:OpenRouter] ====== NOVA REQUISIÇÃO ======')
  console.log('[LLM:OpenRouter] Modelo:', OPENROUTER_MODEL)
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://psychological-suppor.vercel.app',
      'X-Title': 'Psychological Support Chat'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.8,
      max_tokens: options.maxOutputTokens ?? 4096,
    })
  })

  const elapsed = Date.now() - startTime
  console.log('[LLM:OpenRouter] Response time:', elapsed, 'ms')

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (data.choices && data.choices.length > 0) {
    const text = data.choices[0].message?.content
    return text?.trim() ?? ''
  }

  throw new Error('OpenRouter returned no choices')
}

// ==================== GEMINI ====================
async function generateWithGemini(prompt: string, options: GenerateTextOptions): Promise<string> {
  const startTime = Date.now()
  
  const modelName = options.model || GEMINI_MODEL
  console.log('[LLM:Gemini] ====== NOVA REQUISIÇÃO ======')
  console.log('[LLM:Gemini] Modelo:', modelName)

  const genAI = getGeminiClient()
  if (!genAI) {
    throw new Error('Gemini Client not initialized (missing API Key)')
  }

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options.temperature ?? 0.8,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  })

  console.log('[LLM:Gemini] Chamando generateContent...')
  const response = await model.generateContent(prompt)
  const elapsed = Date.now() - startTime
  console.log('[LLM:Gemini] Response time:', elapsed, 'ms')
  
  let text = ''
  
  if (response.response.candidates && response.response.candidates.length > 0) {
    const firstCandidate = response.response.candidates[0]
    if (firstCandidate.finishReason === 'MAX_TOKENS') {
      console.warn('[LLM:Gemini] ⚠️ Resposta truncada por MAX_TOKENS!')
    }
    
    // Tenta extrair texto de forma segura
    try {
      if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
        text = firstCandidate.content.parts.map(part => part.text).join('')
      }
    } catch (e) {
      console.error('[LLM:Gemini] Erro ao extrair texto das partes:', e)
    }
  }
  
  // Fallback para response.text() se a extração manual falhar
  if (!text) {
    try {
      text = response.response.text()
    } catch (e) {
      console.warn('[LLM:Gemini] response.text() falhou (esperado se houver bloqueio/erro):', e)
    }
  }

  console.log('[LLM:Gemini] Text length:', text?.length ?? 0)
  return text?.trim() ?? ''
}

// ==================== MAIN FUNCTION ====================
export async function generateText(prompt: string, options: GenerateTextOptions = {}): Promise<string | null> {
  console.log('[LLM] Provider configurado:', LLM_PROVIDER)
  
  const tryProvider = async (provider: 'gemini' | 'openrouter', attempt: number = 1): Promise<string | null> => {
    try {
      if (provider === 'openrouter') {
        if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY missing')
        return await generateWithOpenRouter(prompt, options)
      } else {
        if (!GEMINI_API_KEYS || GEMINI_API_KEYS.length === 0) throw new Error('GEMINI_API_KEY missing')
        return await generateWithGemini(prompt, options)
      }
    } catch (error: any) {
      console.error(`[LLM] Erro no provider ${provider} (Tentativa ${attempt}/${MAX_RETRIES}):`, error.message)
      
      if (attempt < MAX_RETRIES) {
        console.log(`[LLM] Aguardando ${RETRY_DELAY}ms antes de tentar novamente...`)
        await delay(RETRY_DELAY * attempt) // Exponential backoff-ish
        return tryProvider(provider, attempt + 1)
      }
      throw error
    }
  }

  try {
    // Tenta o provider principal
    return await tryProvider(LLM_PROVIDER as 'gemini' | 'openrouter')
  } catch (primaryError) {
    console.error('[LLM] ❌ Provider principal falhou após todas as tentativas.', primaryError)
    
    // Fallback logic
    if (LLM_PROVIDER === 'gemini' && OPENROUTER_API_KEY) {
      console.log('[LLM] 🔄 Tentando fallback para OpenRouter...')
      try {
        return await tryProvider('openrouter')
      } catch (fallbackError) {
        console.error('[LLM] ❌ Fallback também falhou.', fallbackError)
        return null
      }
    }
    
    return null
  }
}
