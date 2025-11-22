import type { AIAgentConfig, Agent, Conversation, Lead, Message } from './types'
import { supabase, isSupabaseConfigured } from './supabase'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function buildUrl(path: string) {
  if (!API_BASE_URL) return path
  if (path.startsWith('http')) return path
  if (!path.startsWith('/')) return `${API_BASE_URL}/${path}`
  return `${API_BASE_URL}${path}`
}

function normalizeTimestamp(value: unknown) {
  if (!value) return Date.now()
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? Date.now() : parsed
  }
  if (value instanceof Date) {
    return value.getTime()
  }
  return Date.now()
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (isSupabaseConfigured()) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
  }

  const response = await fetch(buildUrl(path), {
    headers,
    ...options,
  })

  if (response.status === 204) {
    return undefined as unknown as T
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Erro ao comunicar com o servidor.')
  }

  return response.json() as Promise<T>
}

export async function fetchConversations() {
  const data = await apiFetch<{ conversations: Conversation[] }>('/api/conversations')
  return data.conversations
}

export async function fetchConversation(conversationId: string) {
  const data = await apiFetch<{ conversation: Conversation }>(`/api/conversations/${conversationId}`)
  return data.conversation
}

export async function createConversation(agent: AIAgentConfig) {
  const data = await apiFetch<{ conversation: Conversation; responseDelay: number }>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ agent }),
  })
  return data
}

export async function sendConversationMessage(params: { conversationId: string; content: string }) {
  const data = await apiFetch<{
    conversation: Conversation
    newMessages: { user: Message; assistant: Message }
    responseDelay: number
    lead?: Lead
    suggestions?: string[]
  }>(`/api/conversations/${params.conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content: params.content }),
  })
  return data
}

export async function fetchLeads() {
  const data = await apiFetch<{ leads: Lead[] }>('/api/leads')
  return data.leads
}

export async function fetchLeadDetail(leadId: string) {
  const data = await apiFetch<{ lead: Lead; conversation?: Conversation }>(`/api/leads/${leadId}`)
  return data
}

export async function updateLeadStatus(leadId: string, status: Lead['status']) {
  const data = await apiFetch<{ lead: Lead }>(`/api/leads/${leadId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return data.lead
}

export async function fetchAgents() {
  const data = await apiFetch<{ agents: Agent[] }>('/api/agents')
  return data.agents
}

export async function createAgent(payload: Partial<Agent>) {
  const data = await apiFetch<{ agent: Agent }>('/api/agents', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.agent
}

export async function updateAgent(agentId: string, payload: Partial<Agent>) {
  const data = await apiFetch<{ agent: Agent }>(`/api/agents/${agentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return data.agent
}

export async function deleteAgent(agentId: string) {
  await apiFetch<void>(`/api/agents/${agentId}`, {
    method: 'DELETE',
  })
}

export async function fetchAiConfig() {
  const data = await apiFetch<{ config: AIAgentConfig }>('/api/settings/ai-agent')
  const { createdAt, updatedAt, ...rest } = data.config as AIAgentConfig & {
    createdAt?: unknown
    updatedAt?: unknown
  }

  return {
    ...rest,
    createdAt: normalizeTimestamp(createdAt),
    updatedAt: normalizeTimestamp(updatedAt),
  }
}

export async function updateAiConfig(payload: AIAgentConfig) {
  const data = await apiFetch<{ config: AIAgentConfig }>(`/api/settings/ai-agent`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  const { createdAt, updatedAt, ...rest } = data.config as AIAgentConfig & {
    createdAt?: unknown
    updatedAt?: unknown
  }

  return {
    ...rest,
    createdAt: normalizeTimestamp(createdAt),
    updatedAt: normalizeTimestamp(updatedAt),
  }
}

export async function updateMessage(messageId: string, content: string) {
  const data = await apiFetch<{ message: Message }>(`/api/messages/${messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  })
  return data.message
}

export async function deleteMessage(messageId: string) {
  await apiFetch<void>(`/api/messages/${messageId}`, {
    method: 'DELETE',
  })
}

export async function getLeadMatches(leadId: string) {
  const data = await apiFetch<{ matches: any[] }>(`/api/leads/${leadId}/matches`)
  return data.matches
}

