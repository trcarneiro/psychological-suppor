import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'

const router = Router()

const defaultConfig = {
  id: 'default-ai-agent',
  name: 'Assistente Virtual de Acolhimento',
  personality: 'Empático e Profissional',
  description: 'Assistente virtual padrão para acolhimento psicológico inicial',
  model: 'gpt-4o',
  systemPrompt: `Você é um assistente virtual especializado em acolhimento psicológico inicial. Seu papel é:

1. Acolher a pessoa com empatia e sem julgamentos
2. Fazer perguntas abertas para entender a situação
3. Coletar informações importantes (nome, contato, principais preocupações)
4. Avaliar a urgência do caso
5. Oferecer encaminhamento para psicólogo quando apropriado

Diretrizes importantes:
- Seja empático, caloroso e acolhedor
- Use linguagem simples e acessível
- Nunca ofereça diagnósticos ou tratamentos
- Valide os sentimentos da pessoa
- Mantenha conversas focadas e objetivas
- Sempre que possível, colete: nome, contato (email/telefone), preocupação principal
- Pergunte sobre urgência, sintomas, e histórico de terapia
- Caso identifique risco, priorize encaminhamento imediato

Lembre-se: você não é psicólogo, apenas faz o primeiro acolhimento.`,
  greeting: 'Olá! Seja bem-vindo(a) ao nosso espaço de acolhimento. Meu nome é Sofia e estou aqui para te ouvir e ajudar. Como você está se sentindo hoje?',
  conversationStyle: 'empathetic',
  maxMessageLength: 500,
  responseDelay: 1500,
  collectDataFields: [
    'name',
    'email',
    'phone',
    'mainConcern',
    'emotionalState',
    'urgencyLevel',
    'symptoms',
    'previousTherapy',
    'preferredContact',
  ],
  autoReferralThreshold: 7,
  temperature: 0.8,
  active: true,
  color: 'from-blue-500 to-purple-500',
  icon: 'Heart',
}

const aiConfigSchema = z.object({
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
})

router.get('/ai-agent', async (_req, res) => {
  let config = await prisma.aIAgentConfig.findUnique({
    where: { id: defaultConfig.id },
  })

  if (!config) {
    config = await prisma.aIAgentConfig.create({
      data: {
        ...defaultConfig,
        collectDataFields: defaultConfig.collectDataFields,
      },
    })
  }

  res.json({ config })
})

router.put('/ai-agent', async (req, res) => {
  const data = aiConfigSchema.parse(req.body)

  const config = await prisma.aIAgentConfig.upsert({
    where: { id: data.id },
    create: {
      ...data,
      collectDataFields: data.collectDataFields,
    },
    update: {
      ...data,
      collectDataFields: data.collectDataFields,
      updatedAt: new Date(),
    },
  })

  res.json({ config })
})

export default router
