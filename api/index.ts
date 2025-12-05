// Minimal test to debug Vercel function
import express from 'express';

const app = express();

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'minimal-api-ok',
    timestamp: Date.now(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

app.use((_req, res) => {
  res.json({ message: 'minimal-api-fallback' });
});

export default app;
