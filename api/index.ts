import { Request, Response } from 'express'

export default async function handler(req: Request, res: Response) {
  try {
    console.log('[API] Importing server module...')
    // Dynamic import to catch initialization errors
    const server = await import('../server/index')
    const app = server.default
    
    console.log('[API] Server module loaded, handling request')
    // @ts-ignore - Express app is compatible with Vercel handler signature
    return app(req, res)
  } catch (error: any) {
    console.error('[API] Critical Error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to initialize server',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      diagnostics: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasGeminiKey: !!process.env.GEMINI_API_KEY
      }
    })
  }
}
