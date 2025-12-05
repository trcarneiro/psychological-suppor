import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { GEMINI_API_KEY, GEMINI_MODEL, OPENROUTER_API_KEY, OPENROUTER_MODEL, LLM_PROVIDER } from '../config'

let geminiClient: GoogleGenerativeAI | null = null

function getGeminiClient() {
  if (!geminiClient && GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY)
  }
  return geminiClient
}

interface GenerateTextOptions {
  temperature?: number
  maxOutputTokens?: number
}

// ==================== OPENROUTER ====================
async function generateWithOpenRouter(prompt: string, options: GenerateTextOptions): Promise<string | null> {
  const startTime = Date.now()
  
  console.log('[LLM:OpenRouter] ====== NOVA REQUISIÇÃO ======')
  console.log('[LLM:OpenRouter] Modelo:', OPENROUTER_MODEL)
  console.log('[LLM:OpenRouter] Prompt length:', prompt.length, 'chars')
  console.log('[LLM:OpenRouter] Temperature:', options.temperature ?? 0.8)
  console.log('[LLM:OpenRouter] MaxTokens:', options.maxOutputTokens ?? 4096)
  
  try {
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
    console.log('[LLM:OpenRouter] Response status:', response.status)
    console.log('[LLM:OpenRouter] Response time:', elapsed, 'ms')

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[LLM:OpenRouter] ❌ ERRO HTTP:', response.status)
      console.error('[LLM:OpenRouter] Error body:', errorText)
      return null
    }

    const data = await response.json()
    console.log('[LLM:OpenRouter] Response ID:', data.id)
    console.log('[LLM:OpenRouter] Model used:', data.model)
    console.log('[LLM:OpenRouter] Usage:', JSON.stringify(data.usage))
    
    if (data.choices && data.choices.length > 0) {
      const text = data.choices[0].message?.content
      console.log('[LLM:OpenRouter] Finish reason:', data.choices[0].finish_reason)
      console.log('[LLM:OpenRouter] Text length:', text?.length ?? 0)
      console.log('[LLM:OpenRouter] Text preview:', text?.substring(0, 100))
      return text?.trim() ?? null
    }

    console.error('[LLM:OpenRouter] ❌ Sem choices na resposta')
    return null
  } catch (error: any) {
    console.error('[LLM:OpenRouter] ❌ ERRO DE CONEXÃO:')
    console.error('[LLM:OpenRouter] Message:', error.message)
    console.error('[LLM:OpenRouter] Stack:', error.stack)
    return null
  }
}

// ==================== GEMINI ====================
async function generateWithGemini(prompt: string, options: GenerateTextOptions): Promise<string | null> {
  const startTime = Date.now()
  
  console.log('[LLM:Gemini] ====== NOVA REQUISIÇÃO ======')
  console.log('[LLM:Gemini] API Key prefix:', GEMINI_API_KEY?.substring(0, 10) + '...')
  console.log('[LLM:Gemini] Modelo:', GEMINI_MODEL)
  console.log('[LLM:Gemini] Prompt length:', prompt.length, 'chars')
  console.log('[LLM:Gemini] Temperature:', options.temperature ?? 0.8)
  console.log('[LLM:Gemini] MaxTokens:', options.maxOutputTokens ?? 4096)

  const genAI = getGeminiClient()
  if (!genAI) {
    console.error('[LLM:Gemini] ❌ Client não inicializado! GEMINI_API_KEY vazia?')
    return null
  }

  try {
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

    console.log('[LLM:Gemini] Chamando generateContent...')
    const response = await model.generateContent(prompt)
    const elapsed = Date.now() - startTime
    
    console.log('[LLM:Gemini] Response time:', elapsed, 'ms')
    console.log('[LLM:Gemini] PromptFeedback:', JSON.stringify(response.response.promptFeedback))
    console.log('[LLM:Gemini] Candidates:', response.response.candidates?.length ?? 0)
    
    if (response.response.candidates && response.response.candidates.length > 0) {
      const firstCandidate = response.response.candidates[0]
      console.log('[LLM:Gemini] Content:', JSON.stringify(firstCandidate.content))
      console.log('[LLM:Gemini] FinishReason:', firstCandidate.finishReason)
      
      if (response.response.usageMetadata) {
        console.log('[LLM:Gemini] Usage:', JSON.stringify(response.response.usageMetadata))
      }

      if (firstCandidate.finishReason === 'MAX_TOKENS') {
        console.warn('[LLM:Gemini] ⚠️ Resposta truncada por MAX_TOKENS!')
      }
    }
    
    const text = response.response.text()
    console.log('[LLM:Gemini] Text length:', text?.length ?? 0)
    console.log('[LLM:Gemini] Text preview:', text?.substring(0, 100))
    return text?.trim() ?? null
  } catch (error: any) {
    const elapsed = Date.now() - startTime
    console.error('[LLM:Gemini] ❌ ERRO após', elapsed, 'ms:')
    console.error('[LLM:Gemini] Name:', error.name)
    console.error('[LLM:Gemini] Message:', error.message)
    console.error('[LLM:Gemini] Stack:', error.stack?.substring(0, 500))
    if (error.response) {
      console.error('[LLM:Gemini] Response status:', error.response.status)
      console.error('[LLM:Gemini] Response data:', JSON.stringify(error.response.data))
    }
    return null
  }
}

// ==================== MAIN FUNCTION ====================
export async function generateText(prompt: string, options: GenerateTextOptions = {}): Promise<string | null> {
  console.log('[LLM] Provider configurado:', LLM_PROVIDER)
  
  // Verificar configuração
  if (LLM_PROVIDER === 'openrouter') {
    if (!OPENROUTER_API_KEY) {
      console.error('[LLM] ❌ OPENROUTER_API_KEY não configurada!')
      return null
    }
    return generateWithOpenRouter(prompt, options)
  } else {
    if (!GEMINI_API_KEY) {
      console.error('[LLM] ❌ GEMINI_API_KEY não configurada!')
      return null
    }
    return generateWithGemini(prompt, options)
  }
}
