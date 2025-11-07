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
  const { agent, history, lastAssistantMessage } = params
  
  const historyText = history
    .slice(-6)
    .map(message => `${message.role === 'user' ? 'Usuário' : agent.name}: ${message.content}`)
    .join('\n')

  const prompt = `Você é ${agent.name}, um assistente de acolhimento psicológico.

Histórico recente da conversa:
${historyText}

Sua última mensagem foi:
"${lastAssistantMessage}"

Com base no contexto da conversa, gere EXATAMENTE 3 sugestões de resposta curtas e naturais que a pessoa poderia dar. 

Regras importantes:
- Cada sugestão deve ter no máximo 6-8 palavras
- Devem ser respostas diretas, naturais e humanas
- Se você fez uma pergunta, inclua possíveis respostas
- Mantenha o tom empático e acolhedor
- Não use aspas ou formatação especial

Retorne apenas as 3 sugestões, uma por linha, sem numeração ou marcadores.`

  const text = await generateText(prompt, {
    temperature: 0.7,
    maxOutputTokens: 150,
  })

  if (!text) return []

  const suggestions = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.length < 80)
    .slice(0, 3)

  return suggestions
}
