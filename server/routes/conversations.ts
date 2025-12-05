import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { mapConversation, mapMessage, mapLead } from './formatters'
import { generateAssistantReply, generateSuggestions, type AgentSnapshot, type ConversationMessage } from '../services/aiProvider'
import { extractLeadData } from '../services/leadExtractor'
import { calculateLeadScore } from '../services/leadScore'
import { shouldSuggestReferral } from '../services/referral'
import { requireAuth } from '../middleware/auth'

const router = Router()

const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  personality: z.string(),
  description: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  greeting: z.string(),
  conversationStyle: z.string(),
  maxMessageLength: z.number(),
  responseDelay: z.number(),
  collectDataFields: z.array(z.string()),
  autoReferralThreshold: z.number(),
  temperature: z.number(),
  active: z.boolean(),
  color: z.string(),
  icon: z.string(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

const createConversationSchema = z.object({
  agent: agentSchema,
})

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Mensagem não pode ficar vazia.'),
})

router.get('/', requireAuth, async (_req, res) => {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      lead: true,
    },
  })

  res.json({
    conversations: conversations.map(mapConversation),
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      lead: true,
    },
  })

  if (!conversation) {
    return res.status(404).json({ error: 'Conversa não encontrada.' })
  }

  res.json({ conversation: mapConversation(conversation) })
})

router.post('/', async (req, res, next) => {
  try {
    console.log('[POST /conversations] Body received:', JSON.stringify(req.body, null, 2))
    const { agent } = createConversationSchema.parse(req.body)

  const conversation = await prisma.conversation.create({
    data: {
      title: `Conversa com ${agent.name}`,
      agentId: agent.id,
      agentName: agent.name,
      agentSnapshot: agent,
    },
  })

  const greetingContent = agent.greeting || 'Olá! Como posso ajudar você hoje?'

  const greetingMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: greetingContent,
    },
  })

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: greetingMessage.timestamp },
  })

  const withMessages = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      lead: true,
    },
  })

    res.status(201).json({
      conversation: mapConversation(withMessages!),
      responseDelay: agent.responseDelay,
    })
  } catch (error) {
    console.error('[POST /conversations] Error:', error)
    next(error)
  }
})

router.post('/:id/messages', async (req, res) => {
  const { id } = req.params
  const { content } = sendMessageSchema.parse(req.body)

  console.log('[POST /conversations/:id/messages] conversationId:', id)
  console.log('[POST /conversations/:id/messages] user content:', content)

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      lead: true,
    },
  })

  if (!conversation) {
    console.error('[POST /conversations/:id/messages] Conversa não encontrada:', id)
    return res.status(404).json({ error: 'Conversa não encontrada.' })
  }

  const agent = conversation.agentSnapshot as unknown as AgentSnapshot
  console.log('[POST /conversations/:id/messages] Agent:', agent.name, 'Model:', agent.model)

  const userMessageRecord = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content,
    },
  })

  const history: ConversationMessage[] = [
    ...conversation.messages.map(message => ({
      role: message.role,
      content: message.content,
    })),
    {
      role: 'user' as const,
      content,
    },
  ]

  console.log('[POST /conversations/:id/messages] Gerando resposta do assistente...')
  let assistantResponse: string
  try {
    assistantResponse = await generateAssistantReply({
      agent,
      history,
      userMessage: content,
    })
    console.log('[POST /conversations/:id/messages] Resposta gerada:', assistantResponse.substring(0, 100))
  } catch (error) {
    console.error('[POST /conversations/:id/messages] Erro ao gerar resposta:', error)
    throw error
  }

  const assistantMessageRecord = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: assistantResponse,
    },
  })

  const referralTriggered = shouldSuggestReferral(content) || shouldSuggestReferral(assistantResponse)

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      needsReferral: conversation.needsReferral || referralTriggered,
      updatedAt: assistantMessageRecord.timestamp,
    },
  })

  let leadRecord = conversation.lead
  const totalUserMessages = history.filter(message => message.role === 'user').length

  if (totalUserMessages >= 4) {
    const leadData = await extractLeadData([
      ...history,
      {
        role: 'assistant',
        content: assistantResponse,
      },
    ])

    if (leadData) {
      const score = calculateLeadScore(leadData)

      leadRecord = await prisma.lead.upsert({
        where: { conversationId: conversation.id },
        create: {
          conversationId: conversation.id,
          name: leadData.name ?? undefined,
          email: leadData.email ?? undefined,
          phone: leadData.phone ?? undefined,
          age: leadData.age ?? undefined,
          mainConcern: leadData.mainConcern ?? undefined,
          emotionalState: leadData.emotionalState ?? undefined,
          urgencyLevel: leadData.urgencyLevel ?? undefined,
          symptoms: leadData.symptoms ?? undefined,
          duration: leadData.duration ?? undefined,
          previousTherapy: leadData.previousTherapy ?? undefined,
          preferredContact: leadData.preferredContact ?? undefined,
          availability: leadData.availability ?? undefined,
          budget: leadData.budget ?? undefined,
          budgetMin: leadData.budgetMin ?? undefined,
          budgetMax: leadData.budgetMax ?? undefined,
          city: leadData.city ?? undefined,
          state: leadData.state ?? undefined,
          neighborhood: leadData.neighborhood ?? undefined,
          modality: leadData.modality ?? undefined,
          insuranceProvider: leadData.insuranceProvider ?? undefined,
          score,
          lastActivity: new Date(),
        },
        update: {
          name: leadData.name ?? undefined,
          email: leadData.email ?? undefined,
          phone: leadData.phone ?? undefined,
          age: leadData.age ?? undefined,
          mainConcern: leadData.mainConcern ?? undefined,
          emotionalState: leadData.emotionalState ?? undefined,
          urgencyLevel: leadData.urgencyLevel ?? undefined,
          symptoms: leadData.symptoms ?? undefined,
          duration: leadData.duration ?? undefined,
          previousTherapy: leadData.previousTherapy ?? undefined,
          preferredContact: leadData.preferredContact ?? undefined,
          availability: leadData.availability ?? undefined,
          budget: leadData.budget ?? undefined,
          budgetMin: leadData.budgetMin ?? undefined,
          budgetMax: leadData.budgetMax ?? undefined,
          city: leadData.city ?? undefined,
          state: leadData.state ?? undefined,
          neighborhood: leadData.neighborhood ?? undefined,
          modality: leadData.modality ?? undefined,
          insuranceProvider: leadData.insuranceProvider ?? undefined,
          score,
          lastActivity: new Date(),
        },
      })
    }
  }

  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    include: {
      messages: { orderBy: { timestamp: 'asc' } },
      lead: true,
    },
  })

  // Delay estratégico antes de gerar sugestões
  // Previne rate limiting do Gemini FREE tier (5 RPM, 1M TPM)
  // Pequeno delay (500ms) reduz chance de MAX_TOKENS em chamadas rápidas
  console.log('[SUGG] Aguardando 500ms antes de gerar sugestões (previne rate limit)...')
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('[SUGG] Iniciando geração de sugestões...')
  let suggestions: string[] = []
  try {
    suggestions = await generateSuggestions({ agent, history: [...history, { role: 'assistant', content: assistantResponse }], lastAssistantMessage: assistantResponse })
    console.log('[SUGG] ✅ Geradas:', suggestions)
  } catch (e) { 
    console.error('[SUGG] ❌ Erro ao gerar sugestões:', e)
    console.log('[SUGG] ℹ️ Fallback contextual será usado automaticamente')
  }

  res.status(201).json({
    conversation: mapConversation(updatedConversation!),
    newMessages: {
      user: mapMessage(userMessageRecord),
      assistant: mapMessage(assistantMessageRecord),
    },
    responseDelay: agent.responseDelay,
    lead: leadRecord ? mapLead(leadRecord) : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  })
})

export default router
