import type { Conversation, Lead, Message } from '@prisma/client'
import type { LeadDataPayload } from '../services/leadExtractor'

export function mapMessage(message: Message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp.getTime(),
  }
}

export function mapLeadData(lead: Lead | null) {
  if (!lead) return undefined

  const data: LeadDataPayload = {
    name: lead.name ?? undefined,
    email: lead.email ?? undefined,
    phone: lead.phone ?? undefined,
    age: lead.age ?? undefined,
    mainConcern: lead.mainConcern ?? undefined,
    emotionalState: lead.emotionalState ?? undefined,
    urgencyLevel: lead.urgencyLevel ?? undefined,
    symptoms: (lead.symptoms as string[] | null) ?? undefined,
    duration: lead.duration ?? undefined,
    previousTherapy: lead.previousTherapy ?? undefined,
    preferredContact: lead.preferredContact ?? undefined,
    availability: lead.availability ?? undefined,
    budget: lead.budget ?? undefined,
    insuranceProvider: lead.insuranceProvider ?? undefined,
  }

  return data
}

export function mapConversation(conversation: Conversation & { messages: Message[]; lead?: Lead | null }) {
  return {
    id: conversation.id,
    title: conversation.title,
    messages: conversation.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map(mapMessage),
    leadData: mapLeadData(conversation.lead ?? null),
    createdAt: conversation.createdAt.getTime(),
    updatedAt: conversation.updatedAt.getTime(),
    needsReferral: conversation.needsReferral,
    isConverted: conversation.isConverted,
    agentId: conversation.agentId,
    agentName: conversation.agentName,
    agentSnapshot: conversation.agentSnapshot,
  }
}

export function mapLead(lead: Lead & { conversation?: Conversation | null }) {
  return {
    id: lead.id,
    conversationId: lead.conversationId,
    data: mapLeadData(lead) ?? {},
    status: lead.status,
    score: lead.score,
    suggestedProfessional: lead.suggestedProfessional ?? undefined,
    notes: lead.notes ?? undefined,
    createdAt: lead.createdAt.getTime(),
    updatedAt: lead.updatedAt.getTime(),
    lastActivity: lead.lastActivity.getTime(),
  }
}
