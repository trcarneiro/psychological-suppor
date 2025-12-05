import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'esm-api-ok',
    timestamp: Date.now()
  });
});

app.use((req, res) => {
  res.json({ message: 'esm-api-fallback' });
});

export default app;
