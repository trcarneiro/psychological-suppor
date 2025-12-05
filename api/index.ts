import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Debug endpoint - no external dependencies
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'debug-ok',
    timestamp: Date.now(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    }
  });
});

// Try to load server dynamically
let serverLoaded = false;
let serverError: string | null = null;

async function loadServer() {
  try {
    const serverModule = await import('../server/index');
    return serverModule.default;
  } catch (error: any) {
    serverError = error.message + '\n' + error.stack;
    console.error('[API] Server load error:', error);
    return null;
  }
}

// Debug endpoint for server load status
app.get('/api/debug', (_req: Request, res: Response) => {
  res.json({ 
    serverLoaded,
    serverError
  });
});

// Load server and proxy requests
loadServer().then((serverApp) => {
  if (serverApp) {
    serverLoaded = true;
    app.use(serverApp);
  }
});

// Fallback
app.use((_req: Request, res: Response) => {
  if (!serverLoaded) {
    res.status(500).json({ 
      error: 'Server not loaded',
      details: serverError
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

export default app;
