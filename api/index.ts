let app: any;

try {
  console.log('[API] Loading server module...');
  const serverModule = await import('../server/index');
  app = serverModule.default;
  console.log('[API] Server module loaded successfully');
} catch (error: any) {
  console.error('[API] CRITICAL: Failed to load server module:', error.message);
  console.error('[API] Stack:', error.stack);
  
  // Create minimal error app
  const express = await import('express');
  app = express.default();
  app.use((_req: any, res: any) => {
    res.status(500).json({
      error: 'Server initialization failed',
      message: error.message,
      stack: error.stack
    });
  });
}

export default app;
