// ESM entry point for Vercel
export default async function handler(req, res) {
  try {
    const { default: app } = await import('../server/index.js')
    return app(req, res)
  } catch (error) {
    console.error('Failed to load server:', error)
    return res.status(500).json({ 
      error: 'Server initialization failed',
      message: error.message 
    })
  }
}
