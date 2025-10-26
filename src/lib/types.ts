export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  needsReferral?: boolean
}

export interface ReferralForm {
  name: string
  email: string
  phone: string
  preferredContact: 'email' | 'phone' | 'whatsapp'
  message: string
}
