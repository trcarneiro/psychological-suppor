export interface QuickReply {
  id: string
  text: string
  category: 'afirmacao' | 'exploracao' | 'detalhamento' | 'acordo'
}

export const QUICK_REPLIES: QuickReply[] = [
  // Afirmações
  {
    id: 'sim',
    text: 'Sim',
    category: 'afirmacao',
  },
  {
    id: 'nao',
    text: 'Não',
    category: 'afirmacao',
  },
  {
    id: 'talvez',
    text: 'Talvez',
    category: 'afirmacao',
  },
  
  // Exploração
  {
    id: 'conta-mais',
    text: 'Pode me contar mais sobre isso',
    category: 'exploracao',
  },
  {
    id: 'como-assim',
    text: 'Como assim?',
    category: 'exploracao',
  },
  {
    id: 'o-que-fazer',
    text: 'O que posso fazer?',
    category: 'exploracao',
  },
  
  // Detalhamento
  {
    id: 'ha-tempos',
    text: 'Já faz um tempo',
    category: 'detalhamento',
  },
  {
    id: 'recentemente',
    text: 'Aconteceu recentemente',
    category: 'detalhamento',
  },
  {
    id: 'sempre',
    text: 'É algo que sempre senti',
    category: 'detalhamento',
  },
  
  // Acordo
  {
    id: 'entendo',
    text: 'Entendo',
    category: 'acordo',
  },
  {
    id: 'faz-sentido',
    text: 'Faz sentido',
    category: 'acordo',
  },
  {
    id: 'obrigado',
    text: 'Obrigado(a) por ouvir',
    category: 'acordo',
  },
]

export function getContextualReplies(messageCount: number, lastAssistantMessage: string): QuickReply[] {
  const lowerMessage = lastAssistantMessage.toLowerCase()
  
  // Se a mensagem contém pergunta direta (sim/não)
  if (lowerMessage.includes('?') && (
    lowerMessage.includes('já') ||
    lowerMessage.includes('você') ||
    lowerMessage.includes('consegue') ||
    lowerMessage.includes('tem') ||
    lowerMessage.includes('sente')
  )) {
    return [
      QUICK_REPLIES.find(r => r.id === 'sim')!,
      QUICK_REPLIES.find(r => r.id === 'nao')!,
      QUICK_REPLIES.find(r => r.id === 'talvez')!,
    ]
  }
  
  // Se menciona tempo/duração
  if (lowerMessage.includes('quanto tempo') || lowerMessage.includes('desde quando')) {
    return [
      QUICK_REPLIES.find(r => r.id === 'recentemente')!,
      QUICK_REPLIES.find(r => r.id === 'ha-tempos')!,
      QUICK_REPLIES.find(r => r.id === 'sempre')!,
    ]
  }
  
  // Respostas gerais para continuar a conversa
  if (messageCount < 5) {
    return [
      QUICK_REPLIES.find(r => r.id === 'conta-mais')!,
      QUICK_REPLIES.find(r => r.id === 'como-assim')!,
      QUICK_REPLIES.find(r => r.id === 'entendo')!,
    ]
  }
  
  // Respostas para estágio avançado
  return [
    QUICK_REPLIES.find(r => r.id === 'faz-sentido')!,
    QUICK_REPLIES.find(r => r.id === 'o-que-fazer')!,
    QUICK_REPLIES.find(r => r.id === 'obrigado')!,
  ]
}
