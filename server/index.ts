import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { ZodError } from 'zod'
import { PORT } from './config'
import conversationsRouter from './routes/conversations'
import leadsRouter from './routes/leads'
import agentsRouter from './routes/agents'
import settingsRouter from './routes/settings'
import messagesRouter from './routes/messages'

const app = express()

// Debug logs for Vercel deployment
console.log('[Server] Initializing...', {
  nodeEnv: process.env.NODE_ENV,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL || !!process.env.SUPABASE_URL
})

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow localhost in dev
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true)
    }

    // Allow vercel domains
    if (origin.endsWith('.vercel.app')) return callback(null, true)

    // Allow known custom domains
    const allowedDomains = [
      'https://psicologobelohorizonte.com.br',
      'https://www.psicologobelohorizonte.com.br',
      'http://psicologobelohorizonte.com.br',
      'http://www.psicologobelohorizonte.com.br'
    ]
    if (allowedDomains.includes(origin)) {
      return callback(null, true)
    }
    
    console.warn(`[CORS] Blocked origin: ${origin}`)
    // Block others
    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '1mb' }))

// Health check - mapped to /api/health
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    checks: {
      database: !!process.env.DATABASE_URL,
      gemini: !!process.env.GEMINI_API_KEY,
      supabase: !!process.env.VITE_SUPABASE_URL || !!process.env.SUPABASE_URL
    }
  })
})

app.use('/api/conversations', conversationsRouter)
app.use('/api/leads', leadsRouter)
app.use('/api/agents', agentsRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/messages', messagesRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint n�o encontrado.' })
})

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Erro não tratado:', error)
  
  // Zod validation errors
  if (error instanceof ZodError) {
    console.error('[Server] Zod validation error:', JSON.stringify(error.errors, null, 2))
    return res.status(400).json({ 
      error: 'Dados inválidos.',
      details: error.errors
    })
  }
  
  // Prisma errors
  if (error.constructor.name === 'PrismaClientKnownRequestError') {
    console.error('[Server] Prisma error:', error.message)
    return res.status(500).json({ 
      error: 'Erro de banco de dados.',
      code: (error as any).code,
      details: error.message
    })
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor.',
    message: error.message,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
  })
})

// Export app for Vercel
export default app

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`)
  })
}
