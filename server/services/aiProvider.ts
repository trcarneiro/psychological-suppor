import { generateText } from './llm'

export interface AgentSnapshot {
  id: string
  name: string
  personality: string
  description: string
  model: string
  systemPrompt: string
  greeting: string
  conversationStyle: string
  maxMessageLength: number
  responseDelay: number
  collectDataFields: string[]
  autoReferralThreshold: number
  temperature: number
  active: boolean
  color: string
  icon: string
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

function buildPrompt(agent: AgentSnapshot, history: ConversationMessage[], userMessage: string) {
  const historyText = history
    .map(message => `${message.role === 'user' ? 'Usuário' : agent.name}: ${message.content}`)
    .join('\n')

  const userMessagesCount = history.filter(message => message.role === 'user').length + 1

  let contextualInstructions = ''
  if (userMessagesCount === 1) {
    contextualInstructions = '\n\nEsta é a primeira mensagem da pessoa. Agradeça e convide para compartilhar mais.'
  } else if (userMessagesCount === 3) {
    contextualInstructions = '\n\nBusque descobrir o nome da pessoa de forma natural.'
  } else if (userMessagesCount === 5) {
    contextualInstructions = '\n\nPergunte há quanto tempo a situação acontece.'
  } else if (userMessagesCount === 7) {
    contextualInstructions = '\n\nPergunte, com cuidado, se já buscou ajuda profissional.'
  } else if (userMessagesCount >= 9) {
    contextualInstructions = '\n\nConsidere sugerir acompanhamento profissional e pergunte sobre preferência de contato.'
  }

  return `${agent.systemPrompt}${contextualInstructions}

Histórico da conversa:
${historyText}

Usuário: ${userMessage}

Responda de forma empática, em 2-4 frases, mantendo tom humano e acolhedor:`
}

export async function generateAssistantReply(params: {
  agent: AgentSnapshot
  history: ConversationMessage[]
  userMessage: string
}) {
  const { agent, history, userMessage } = params
  const prompt = buildPrompt(agent, history, userMessage)

  const text = await generateText(prompt, {
    temperature: agent.temperature ?? 0.8,
    maxOutputTokens: 8192,
  })

  if (!text) {
    return 'Desculpe, encontrei uma dificuldade técnica ao responder agora. Podemos tentar novamente?'
  }

  const truncated = text.length > agent.maxMessageLength
    ? `${text.slice(0, agent.maxMessageLength)}…`
    : text

  return truncated
}

function getFallbackSuggestions(assistantMessage: string): string[] {
  const lower = assistantMessage.toLowerCase()
  
  if (lower.includes('como você') || lower.includes('como está') || lower.includes('tudo bem')) {
    return ['Estou bem, obrigado(a)', 'Poderia estar melhor', 'Tenho tido dias difíceis']
  }
  
  if (lower.includes('quanto tempo')) {
    return ['Algumas semanas', 'Há alguns meses', 'Já faz um tempo']
  }

  if (lower.includes('ajuda profissional') || lower.includes('psicólogo') || lower.includes('terapia')) {
    return ['Ainda não busquei', 'Já tentei antes', 'Estou considerando']
  }

  if (lower.includes('nome') || lower.includes('chama')) {
    return ['Prefiro não dizer', 'Me chamo...', 'Pode me chamar de...']
  }
  
  if (lower.includes('olá') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde') || lower.includes('boa noite')) {
    return ['Olá, tudo bem?', 'Oi, preciso desabafar', 'Olá, gostaria de conversar']
  }

  return ['Sim, entendo', 'Pode continuar', 'Gostaria de saber mais']
}

export async function generateSuggestions(params: {
  agent: AgentSnapshot
  history: ConversationMessage[]
  lastAssistantMessage: string
}) {
  const { lastAssistantMessage } = params
  
  // Prompt direto sem rótulos
  const prompt = `Gere 3 respostas curtas (máximo 6 palavras cada) que um usuário poderia dar para:

"${lastAssistantMessage.substring(0, 150)}"

Responda APENAS com as 3 frases, uma por linha, sem numeração ou rótulos.`

  console.log('[generateSuggestions] Prompt length:', prompt.length, 'chars')
  console.log('[generateSuggestions] Chamando LLM...')
  
  try {
    // Fix: Aumentar maxOutputTokens para acomodar thinking tokens do gemini-2.5-pro
    // O modelo usa ~1000-2000 thinking tokens antes de gerar resposta
    const text = await generateText(prompt, {
      temperature: 0.7,
      maxOutputTokens: 8192,
    })
    
    console.log('[generateSuggestions] API respondeu:', text?.substring(0, 100))

    let suggestions: string[] = []

    if (text && text.length > 0) {
      suggestions = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        // Remove prefixos como "Resposta 1", "Resposta 2", números, marcadores
        .map(line => line.replace(/^(resposta\s*\d+[:\s]*|[-*\d.)\s]+)/i, ''))
        .filter(line => line.length > 0 && line.length <= 60)
        // Filtra linhas que são apenas "Resposta X" sem conteúdo
        .filter(line => !/^resposta\s*\d*$/i.test(line))
        .filter(line => !/^aqui\s+est/i.test(line))
        .slice(0, 3)
    }

    // Fix 4: Completamento Híbrido
    if (suggestions.length < 3) {
      console.log(`[generateSuggestions] Apenas ${suggestions.length} sugestões geradas. Usando fallback.`)
      const fallback = getFallbackSuggestions(lastAssistantMessage)
      const combined = [...suggestions, ...fallback]
      const unique = Array.from(new Set(combined))
      suggestions = unique.slice(0, 3)
    }

    console.log('[generateSuggestions] Final:', suggestions)
    return suggestions
  } catch (error) {
    console.error('[generateSuggestions] Erro:', error)
    return getFallbackSuggestions(lastAssistantMessage).slice(0, 3)
  }
}
