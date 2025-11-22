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
  // Prompt simplificado: evita "para:" que causa MAX_TOKENS
  const prompt = `Liste 3 respostas curtas (m�ximo 6 palavras):`
  const text = await generateText(prompt, {
    temperature: agent.temperature ?? 0.8,
    maxOutputTokens: Math.min(Math.ceil(agent.maxMessageLength * 1.5), 1024),
  })

  if (!text) {
    return 'Desculpe, encontrei uma dificuldade técnica ao responder agora. Podemos tentar novamente?'
  }

  const truncated = text.length > agent.maxMessageLength
    ? `${text.slice(0, agent.maxMessageLength - 1)}…`
    : text

  return truncated
}

export async function generateSuggestions(params: {
  agent: AgentSnapshot
  history: ConversationMessage[]
  lastAssistantMessage: string
}) {
  const { lastAssistantMessage } = params
  
  // Prompt ultra-simplificado para economizar tokens
  const prompt = `Gere 3 respostas curtas (máximo 6 palavras cada) que uma pessoa poderia dar para:

"${lastAssistantMessage.substring(0, 50)}"

Formato:
Resposta 1
Resposta 2
Resposta 3`

  console.log('[generateSuggestions] Prompt length:', prompt.length, 'chars')
  console.log('[generateSuggestions] Chamando LLM...')
  
  try {
    const text = await generateText(prompt, {
      temperature: 0.9,
      maxOutputTokens: 150, // Reduzido drasticamente
    })
    
    console.log('[generateSuggestions] Resposta LLM:', text)

    if (!text || text.length === 0) {
      console.log('[generateSuggestions] LLM retornou vazio! Usando fallback...')
      return getFallbackSuggestions(lastAssistantMessage)
    }

    const suggestions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length < 80)
      .slice(0, 3)

    console.log('[generateSuggestions] Sugestões processadas:', suggestions)
    
    // Se conseguiu menos de 3, completa com fallback
    if (suggestions.length < 3) {
      const fallback = getFallbackSuggestions(lastAssistantMessage)
      return [...suggestions, ...fallback].slice(0, 3)
    }
    
    return suggestions
  } catch (error) {
    console.error('[generateSuggestions] Erro:', error)
    return getFallbackSuggestions(lastAssistantMessage)
  }
}

// Sugestões de fallback baseadas em padrões comuns
function getFallbackSuggestions(assistantMessage: string): string[] {
  const lower = assistantMessage.toLowerCase()
  
  // Detecta perguntas e oferece respostas apropriadas
  if (lower.includes('como você') || lower.includes('como está')) {
    return ['Estou bem, obrigado(a)', 'Poderia estar melhor', 'Tenho tido dias difíceis']
  }
  
  if (lower.includes('o que') || lower.includes('qual')) {
    return ['Não tenho certeza ainda', 'Preciso pensar melhor', 'Gostaria de explorar isso']
  }
  
  if (lower.includes('quanto tempo') || lower.includes('há quanto')) {
    return ['Algumas semanas', 'Há alguns meses', 'Já faz um tempo']
  }
  
  if (lower.includes('ajuda profissional') || lower.includes('psicólogo') || lower.includes('terapia')) {
    return ['Ainda não busquei', 'Já tentei antes', 'Estou considerando']
  }
  
  if (lower.includes('compartilhar') || lower.includes('contar') || lower.includes('falar')) {
    return ['Sim, gostaria de falar', 'Prefiro não entrar em detalhes', 'Posso tentar explicar']
  }
  
  // Padrão genérico para qualquer situação
  return [
    'Sim, entendo',
    'Pode continuar',
    'Gostaria de saber mais'
  ]
}
