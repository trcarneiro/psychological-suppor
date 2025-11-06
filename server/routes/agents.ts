import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'

const router = Router()

const agentBodySchema = z.object({
  name: z.string(),
  crp: z.string(),
  specialties: z.array(z.string()).optional(),
  approach: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  availability: z.array(z.string()).optional(),
  priceRange: z.string().optional(),
  acceptsInsurance: z.boolean().optional(),
  insuranceProviders: z.array(z.string()).optional(),
  photo: z.string().optional(),
  active: z.boolean().optional(),
})

router.get('/', async (_req, res) => {
  const agents = await prisma.agent.findMany({
    orderBy: { name: 'asc' },
  })

  res.json({ agents })
})

router.post('/', async (req, res) => {
  const data = agentBodySchema.parse(req.body)

  const agent = await prisma.agent.create({
    data: {
      name: data.name,
      crp: data.crp,
      specialties: data.specialties ?? [],
      approach: data.approach,
      experience: data.experience,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      availability: data.availability ?? [],
      priceRange: data.priceRange,
      acceptsInsurance: data.acceptsInsurance ?? false,
      insuranceProviders: data.insuranceProviders ?? [],
      photo: data.photo,
      active: data.active ?? true,
    },
  })

  res.status(201).json({ agent })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const data = agentBodySchema.parse(req.body)

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: data.name,
      crp: data.crp,
      specialties: data.specialties ?? [],
      approach: data.approach,
      experience: data.experience,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      availability: data.availability ?? [],
      priceRange: data.priceRange,
      acceptsInsurance: data.acceptsInsurance ?? false,
      insuranceProviders: data.insuranceProviders ?? [],
      photo: data.photo,
      active: data.active ?? true,
    },
  })

  res.json({ agent })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await prisma.agent.delete({ where: { id } })
  res.status(204).end()
})

export default router
