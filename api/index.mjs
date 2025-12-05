import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'pure-esm-ok',
    timestamp: Date.now()
  });
});

app.use((req, res) => {
  res.json({ message: 'pure-esm-fallback' });
});

export default app;
