const express = require('express');

const app = express();

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'js-api-ok',
    timestamp: Date.now()
  });
});

app.use((req, res) => {
  res.json({ message: 'js-api-fallback' });
});

module.exports = app;
