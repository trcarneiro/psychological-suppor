# Quickstart Guide

## Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8.0+ or PlanetScale account
- Google Cloud account with Gemini API access

## Setup

1. **Clone and install**
   ```bash
   git clone <repo>
   cd psychological-suppor
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `GEMINI_API_KEYS` - Array of API keys for rotation
   - `DATABASE_URL` - MySQL connection string
   - `DIRECT_URL` - Direct MySQL connection (for migrations)

3. **Database setup**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start development**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5000
   - Backend: http://localhost:3333

## Common Tasks

- **Add Lead field**: Update types.ts, schema.prisma, leadExtractor.ts, Dashboard.tsx
- **New AI Agent**: Add to src/lib/predefined-agents.ts
- **Deploy**: Push to main, Vercel auto-deploys

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gemini MAX_TOKENS | Simplify prompt, add 500ms delay |
| Prisma errors | Run prisma:generate |
| API 404 | Check VITE_API_URL and server port |
