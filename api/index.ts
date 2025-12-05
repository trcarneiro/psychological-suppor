// Minimal test - only express
const express = require('express') as typeof import('express').default;

const app = express();

app.get('/api/health', (_req: any, res: any) => {
  res.json({ 
    status: 'require-express-ok',
    timestamp: Date.now()
  });
});

app.use((_req: any, res: any) => {
  res.json({ message: 'fallback' });
});

module.exports = app;
export default app;
