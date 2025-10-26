export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  extractedData?: Partial<LeadData>
}

export interface LeadData {
  name?: string
  email?: string
  phone?: string
  age?: number
  mainConcern?: string
  emotionalState?: 'low' | 'moderate' | 'high' | 'critical'
  urgencyLevel?: number
  symptoms?: string[]
  duration?: string
  previousTherapy?: boolean
  preferredContact?: 'email' | 'phone' | 'whatsapp'
  availability?: string
  budget?: string
  insuranceProvider?: string
}

export interface Lead {
  id: string
  conversationId: string
  data: LeadData
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'lost'
  score: number
  suggestedProfessional?: string
  notes?: string
  createdAt: number
  updatedAt: number
  lastActivity: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  leadData?: LeadData
  createdAt: number
  updatedAt: number
  needsReferral?: boolean
  isConverted?: boolean
}

export interface ReferralForm {
  name: string
  email: string
  phone: string
  preferredContact: 'email' | 'phone' | 'whatsapp'
  message: string
}

export interface Professional {
  id: string
  name: string
  specialties: string[]
  approach: string
  experience: string
  availability: string[]
  priceRange: string
  acceptsInsurance: boolean
  image?: string
}
