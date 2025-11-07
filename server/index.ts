import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { PORT } from './config'
import conversationsRouter from './routes/conversations'
import leadsRouter from './routes/leads'
import agentsRouter from './routes/agents'
import settingsRouter from './routes/settings'
import messagesRouter from './routes/messages'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.use('/api/conversations', conversationsRouter)
app.use('/api/leads', leadsRouter)
app.use('/api/agents', agentsRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/messages', messagesRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' })
})

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Erro não tratado:', error)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})
