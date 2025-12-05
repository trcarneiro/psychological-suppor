import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let serverApp = null;
let loadError = null;

// Health endpoint that always works
app.get('/api/health', (req, res) => {
  res.json({ 
    status: serverApp ? 'server-loaded' : 'server-not-loaded',
    error: loadError,
    timestamp: Date.now()
  });
});

// Load server async
const loadServer = async () => {
  try {
    console.log('[API] Loading server...');
    const module = await import('../server/index.js');
    serverApp = module.default;
    console.log('[API] Server loaded successfully');
  } catch (err) {
    loadError = err.message + '\n' + err.stack;
    console.error('[API] Failed to load server:', err);
  }
};

// Start loading
loadServer();

// Proxy to server or return error
app.use((req, res, next) => {
  if (serverApp) {
    return serverApp(req, res, next);
  }
  res.status(500).json({
    error: 'Server not loaded',
    details: loadError
  });
});

export default app;
