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
    return 'Desculpe, encontrei uma dificuldade técnica ao responder agora. Podemos tentar novamente?'}

  const truncated = text.length > agent.maxMessageLength
    ? `${text.slice(0, agent.maxMessageLength - 1)}…`
    : text

  return truncated
}
