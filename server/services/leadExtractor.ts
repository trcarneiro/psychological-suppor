import { generateText } from './llm'
import type { ConversationMessage } from './aiProvider'

export interface LeadDataPayload {
  name?: string | null
  email?: string | null
  phone?: string | null
  age?: number | null
  mainConcern?: string | null
  emotionalState?: 'low' | 'moderate' | 'high' | 'critical' | null
  urgencyLevel?: number | null
  symptoms?: string[] | null
  duration?: string | null
  previousTherapy?: boolean | null
  preferredContact?: 'email' | 'phone' | 'whatsapp' | null
  availability?: string | null
  budget?: string | null
  budgetMin?: number | null
  budgetMax?: number | null
  city?: string | null
  state?: string | null
  cep?: string | null
  neighborhood?: string | null
  modality?: 'online' | 'presencial' | 'hibrido' | null
  insuranceProvider?: string | null
}

function buildExtractionPrompt(history: ConversationMessage[]) {
  const conversationText = history
    .map(message => `${message.role === 'user' ? 'Usuário' : 'Assistente'}: ${message.content}`)
    .join('\n')

  return `Analise a conversa de pré-atendimento psicológico abaixo e retorne um JSON com os dados solicitados.
Se algum dado não estiver presente, utilize null.

Conversa:
${conversationText}

Retorne um JSON com as chaves:
- name, email, phone, age
- mainConcern, emotionalState (low|moderate|high|critical), urgencyLevel (1-10)
- symptoms (array de strings), duration, previousTherapy (boolean)
- preferredContact (email|phone|whatsapp), availability
- budget (texto livre), budgetMin (número), budgetMax (número)
- city, state (UF), cep, neighborhood
- modality (online|presencial|hibrido)
- insuranceProvider

Para budgetMin e budgetMax, tente inferir valores numéricos se o usuário mencionar faixas de preço (ex: "até 200 reais" -> budgetMax: 200).
Inclua apenas as chaves solicitadas.`
}

export async function extractLeadData(history: ConversationMessage[]): Promise<LeadDataPayload | null> {
  const prompt = buildExtractionPrompt(history)
  const response = await generateText(prompt, {
    temperature: 0.2,
    maxOutputTokens: 8192,
  })

  if (!response) {
    return null
  }

  try {
    const sanitized = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()
    const data = JSON.parse(sanitized) as LeadDataPayload
    return data
  } catch (error) {
    console.error('[LeadExtractor] Falha ao interpretar JSON:', response, error)
    return null
  }
}
