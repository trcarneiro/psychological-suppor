import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { mapConversation, mapLead } from './formatters'
import { requireAuth } from '../middleware/auth'
import { findBestMatches } from '../services/matching'

const router = Router()

router.use(requireAuth)

router.get('/', async (_req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  res.json({
    leads: leads.map(lead => mapLead(lead)),
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { timestamp: 'asc' } },
          lead: true,
        },
      },
    },
  })

  if (!lead) {
    return res.status(404).json({ error: 'Lead não encontrado.' })
  }

  res.json({
    lead: mapLead(lead),
    conversation: lead.conversation ? mapConversation(lead.conversation) : undefined,
  })
})

router.get('/:id/matches', async (req, res) => {
  const { id } = req.params
  const lead = await prisma.lead.findUnique({
    where: { id },
  })

  if (!lead) {
    return res.status(404).json({ error: 'Lead não encontrado.' })
  }

  const matches = await findBestMatches(lead)
  res.json({ matches })
})

const updateStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'scheduled', 'converted', 'lost']),
})

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = updateStatusSchema.parse(req.body)

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date(),
    },
  })

  res.json({ lead: mapLead(lead) })
})

export default router
