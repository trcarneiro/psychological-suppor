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
  budgetMin?: number
  budgetMax?: number
  city?: string;
  state?: string;
  cep?: string;
  neighborhood?: string;
  modality?: 'online' | 'presencial' | 'hibrido';
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
  agentId?: string
  agentName?: string
  agentSnapshot?: AIAgentConfig
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

export interface Agent {
  id: string
  name: string
  crp: string
  specialties: string[]
  approach: string
  experience: string
  bio: string
  email: string
  phone: string
  availability: string[]
  priceRange: string
  priceMin?: number
  priceMax?: number
  city?: string
  state?: string
  neighborhood?: string
  modalities?: string[]
  acceptsInsurance: boolean
  insuranceProviders?: string[]
  photo?: string
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface AIAgentConfig {
  id: string
  name: string
  personality: string
  description: string
  model: 'gpt-4o' | 'gpt-4o-mini' | 'gemini-2.5-pro' | 'gemini-2.5-flash'
  systemPrompt: string
  greeting: string
  conversationStyle: 'empathetic' | 'professional' | 'friendly' | 'custom'
  maxMessageLength: number
  responseDelay: number
  collectDataFields: string[]
  autoReferralThreshold: number
  temperature: number
  active: boolean
  color: string
  icon: string
  createdAt: number
  updatedAt: number
}
