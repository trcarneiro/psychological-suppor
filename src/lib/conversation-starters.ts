export interface ConversationStarter {
  id: string
  text: string
  category: 'emocional' | 'relacionamento' | 'trabalho' | 'autoconhecimento' | 'saude'
  icon: string
}

export const CONVERSATION_STARTERS: ConversationStarter[] = [
  {
    id: '1',
    text: 'Tenho me sentido ansioso(a) ultimamente',
    category: 'emocional',
    icon: '😰'
  },
  {
    id: '2',
    text: 'Estou com dificuldade para dormir',
    category: 'saude',
    icon: '😴'
  },
  {
    id: '3',
    text: 'Me sinto sobrecarregado(a) no trabalho',
    category: 'trabalho',
    icon: '💼'
  },
  {
    id: '4',
    text: 'Estou passando por problemas no relacionamento',
    category: 'relacionamento',
    icon: '💔'
  },
  {
    id: '5',
    text: 'Quero entender melhor minhas emoções',
    category: 'autoconhecimento',
    icon: '🧠'
  },
  {
    id: '6',
    text: 'Tenho me sentido triste sem motivo aparente',
    category: 'emocional',
    icon: '😢'
  },
  {
    id: '7',
    text: 'Dificuldade em tomar decisões importantes',
    category: 'autoconhecimento',
    icon: '🤔'
  },
  {
    id: '8',
    text: 'Problemas com minha família',
    category: 'relacionamento',
    icon: '👨‍👩‍👧'
  },
  {
    id: '9',
    text: 'Me sinto estressado(a) constantemente',
    category: 'emocional',
    icon: '😫'
  },
  {
    id: '10',
    text: 'Baixa autoestima e insegurança',
    category: 'autoconhecimento',
    icon: '😔'
  },
  {
    id: '11',
    text: 'Conflitos frequentes com outras pessoas',
    category: 'relacionamento',
    icon: '😠'
  },
  {
    id: '12',
    text: 'Dificuldade de concentração',
    category: 'saude',
    icon: '🎯'
  },
  {
    id: '13',
    text: 'Pensamentos negativos recorrentes',
    category: 'emocional',
    icon: '💭'
  },
  {
    id: '14',
    text: 'Estou passando por um luto',
    category: 'emocional',
    icon: '🕊️'
  },
  {
    id: '15',
    text: 'Preciso de ajuda para gerenciar meu tempo',
    category: 'trabalho',
    icon: '⏰'
  },
  {
    id: '16',
    text: 'Sinto que perdi o propósito',
    category: 'autoconhecimento',
    icon: '🧭'
  },
  {
    id: '17',
    text: 'Dificuldade em me conectar com outras pessoas',
    category: 'relacionamento',
    icon: '🤝'
  },
  {
    id: '18',
    text: 'Medo ou fobias específicas',
    category: 'emocional',
    icon: '😨'
  },
  {
    id: '19',
    text: 'Busco crescimento pessoal',
    category: 'autoconhecimento',
    icon: '🌱'
  },
  {
    id: '20',
    text: 'Só quero conversar e me sentir ouvido(a)',
    category: 'emocional',
    icon: '💬'
  }
]

export function getStartersByCategory(category: ConversationStarter['category']): ConversationStarter[] {
  return CONVERSATION_STARTERS.filter(starter => starter.category === category)
}

export function getRandomStarters(count: number = 5): ConversationStarter[] {
  const shuffled = [...CONVERSATION_STARTERS]
  // Fisher-Yates shuffle algorithm - O(n) time complexity
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}
