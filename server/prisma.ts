import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ CRITICAL: DATABASE_URL is missing in environment variables. Prisma will fail to connect.')
}

// Initialize Prisma with a fallback URL to prevent crash on startup if env var is missing.
// This allows the server to boot and return a proper 500 error instead of crashing immediately.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl || 'mysql://fallback_missing_env_var:3306/db',
    },
  },
})

export async function disconnectPrisma() {
  await prisma.$disconnect()
}
