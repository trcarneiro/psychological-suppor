import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { mapMessage } from './formatters'

const router = Router()

const updateMessageSchema = z.object({
  content: z.string().min(1, 'Conteúdo da mensagem não pode ficar vazio.'),
})

// PATCH /api/messages/:id - Editar uma mensagem
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { content } = updateMessageSchema.parse(req.body)

  console.log('[PATCH /messages/:id] messageId:', id, 'new content:', content.substring(0, 50))

  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true },
  })

  if (!message) {
    console.error('[PATCH /messages/:id] Mensagem não encontrada:', id)
    return res.status(404).json({ error: 'Mensagem não encontrada.' })
  }

  if (message.role !== 'user') {
    console.error('[PATCH /messages/:id] Tentativa de editar mensagem do assistente')
    return res.status(400).json({ error: 'Apenas mensagens do usuário podem ser editadas.' })
  }

  const updated = await prisma.message.update({
    where: { id },
    data: { content, timestamp: new Date() },
  })

  await prisma.conversation.update({
    where: { id: message.conversationId },
    data: { updatedAt: updated.timestamp },
  })

  console.log('[PATCH /messages/:id] Mensagem editada com sucesso')
  res.json({ message: mapMessage(updated) })
})

// DELETE /api/messages/:id - Deletar uma mensagem
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  console.log('[DELETE /messages/:id] messageId:', id)

  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true },
  })

  if (!message) {
    console.error('[DELETE /messages/:id] Mensagem não encontrada:', id)
    return res.status(404).json({ error: 'Mensagem não encontrada.' })
  }

  if (message.role !== 'user') {
    console.error('[DELETE /messages/:id] Tentativa de deletar mensagem do assistente')
    return res.status(400).json({ error: 'Apenas mensagens do usuário podem ser deletadas.' })
  }

  await prisma.message.delete({ where: { id } })

  await prisma.conversation.update({
    where: { id: message.conversationId },
    data: { updatedAt: new Date() },
  })

  console.log('[DELETE /messages/:id] Mensagem deletada com sucesso')
  res.status(204).send()
})

export default router
