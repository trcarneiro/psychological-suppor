# Psychological Support Platform - AI Agent Guide

## Architecture Overview
**Psychological pre-screening chatbot** for connecting users with therapists in Brazil. Runs as:
- **Standalone Mode**: Express server (port 3333) + Prisma/MySQL + Google Gemini API
- **Vercel Deployment**: Serverless via `api/index.ts` → re-exports Express app

```
src/App.tsx (state machine)    server/index.ts (API)
├── LandingHero                ├── /api/conversations
├── MinimalChatInterface       ├── /api/leads
├── BlogSection                ├── /api/agents
├── AdminLogin                 ├── /api/messages
└── Dashboard                  └── /api/settings
```

**Navigation**: Single `viewMode` state (`'landing' | 'chat' | 'admin-login' | 'dashboard' | 'blog'`). No router—use callbacks (`onClose`, `onBack`).

## Data Flow & Sync
**Types must stay synchronized across**:
1. `src/lib/types.ts` – TypeScript interfaces
2. `prisma/schema.prisma` – Database models
3. API routes in `server/routes/`
4. UI components (`Dashboard`, `LeadDetailDialog`)

**Key entities**: `Conversation`, `Message`, `Lead`, `Agent` (human therapist), `AIAgentConfig` (chatbot persona)

## AI Chat System
**5 AI Agents** in `src/lib/predefined-agents.ts`: Sofia, Carlos, Júlia, Ana, Lucas. Each has `systemPrompt`, `greeting`, `temperature`, `color`, `icon`.

**Message flow** (`server/routes/conversations.ts`):
```
POST /api/conversations/:id/messages
  → generateAssistantReply() (Gemini)
  → extractLeadData() after 4+ messages
  → generateSuggestions() (500ms delay to avoid rate limits)
```

**Gemini API gotchas** (see `GEMINI_MAX_TOKENS_EXPLAINED.md`):
- Avoid indirect prompts like `"Liste 3 respostas para: [context]"`—causes premature `MAX_TOKENS`
- Use direct commands: `"Gere 3 respostas curtas"`
- 500ms delay between API calls prevents rate limiting

**Progressive profiling** in `server/services/aiProvider.ts`:
- Message 1: Welcome greeting
- Message 3: Ask for name naturally
- Message 5: Ask about duration
- Message 7: Ask about previous therapy
- Message 9+: Suggest professional referral

## Lead Extraction & Scoring
**Auto-extraction** triggers after 4 user messages via `server/services/leadExtractor.ts` (LLM-based JSON extraction).

**Lead statuses**: `'new' | 'contacted' | 'scheduled' | 'converted' | 'lost'`

**Score calculation** in `server/services/leadScore.ts` weighs: completeness, urgency, emotional state (0-100).

## Blog & SEO
**Static articles** in `src/lib/blog-articles.ts` (~8500 lines). Use `createArticle()` which auto-generates Schema.org structured data.

**SEO**: All content in PT-BR. Canonical URLs point to `psicologobelohorizonte.com.br`.

## Development Commands
```bash
npm run dev              # Client (5173) + Server (3333) concurrent
npm run prisma:generate  # After schema.prisma changes
npm run prisma:migrate   # Apply DB migrations
tsx scripts/<name>.ts    # Run test scripts
```

**Required `.env`**:
```
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-2.5-pro
DATABASE_URL=mysql://...
DIRECT_URL=mysql://...
```

## Critical Rules
1. **PT-BR only**: All UI text, prompts, errors in Brazilian Portuguese
2. **No diagnoses**: AI only listens empathetically—never diagnose
3. **CVV 188**: Crisis footer shows Brazilian crisis line
4. **Icon names**: Phosphor icons, PascalCase (`Heart`, not `HeartIcon`)
5. **Animations**: `framer-motion` with `initial/animate/exit` props

## Common Tasks

### Add field to Lead
1. `src/lib/types.ts` → `LeadData` interface
2. `prisma/schema.prisma` → `Lead` model
3. `npm run prisma:migrate`
4. `server/services/leadExtractor.ts` → prompt update
5. UI updates in `Dashboard`, `LeadDetailDialog`

### Create AI Agent
Add to `PREDEFINED_AGENTS` in `src/lib/predefined-agents.ts`:
```typescript
{
  id: 'unique-slug',
  name: 'Nome',
  personality: 'Descrição curta',
  systemPrompt: 'PT-BR, empático, 2-4K chars',
  greeting: 'Mensagem inicial',
  color: 'from-color-500 to-color-400',  // Tailwind gradient
  icon: 'PhosphorIconName',
  temperature: 0.8,
  responseDelay: 1500,
}
```

### Add Blog Article
Use `createArticle()` in `src/lib/blog-articles.ts` with `metaDescription`, `keywords` for SEO.

## UI Patterns
- **Styling**: Tailwind 4 + shadcn/ui components in `src/components/ui/`
- **Class merging**: `cn()` from `src/lib/utils.ts`
- **Toasts**: `sonner` via `<Toaster />` in App.tsx

## Debugging
| Issue | Check |
|-------|-------|
| API 404/CORS | `VITE_API_URL` in `.env`, server running on 3333 |
| Gemini MAX_TOKENS | Simplify prompt, add delay, check `[LLM]` logs |
| Prisma errors | Run `npm run prisma:generate`, verify `DATABASE_URL` |
| Missing icons | Verify Phosphor export name (PascalCase) |
