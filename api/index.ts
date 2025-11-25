// Vercel Serverless Function Entry Point
console.log('[API] Loading api/index.ts...')

try {
  // @ts-ignore
  var app = require('../server/index').default
  console.log('[API] Successfully imported app from ../server/index')
} catch (e) {
  console.error('[API] Failed to import app:', e)
  throw e
}

export default app
