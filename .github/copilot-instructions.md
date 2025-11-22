# Psychological Support Platform - AI Agent Guide

## Architecture Overview
**Dual-Mode Application**: This is a psychological pre-screening chatbot that runs in two environments:
1. **Spark Runtime** (primary): GitHub Spark environment with `window.spark` globals, KV storage, and built-in LLM
2. **Standalone Mode** (fallback): Express server + Prisma + MySQL with Google Gemini API

The codebase maintains compatibility with both—never assume one or the other without checking runtime context.

## Navigation & State Management
- `App.tsx` is a **state machine** with single `viewMode: 'landing' | 'chat' | 'admin-login' | 'dashboard' | 'blog'`
- New screens must integrate into this union type and receive navigation callbacks (`onClose`, `onBack`, etc.)
- Entry point: `src/main.tsx` wraps `App` in `ErrorBoundary` → all errors surface through `ErrorFallback.tsx`
- No router library used—navigation is callback-based to maintain simplicity in Spark environment

## Data Persistence Strategy
**Spark Mode** (client-side):
- Uses `useKV` hook from `@github/spark/hooks` for persistent browser storage
- Active keys: `conversations`, `leads`, `agents`, `ai-agent-config`
- **Critical**: `useKV` setters require immutable updates (`.map()`, `.filter()`) to trigger re-renders
- Type definitions in `src/lib/types.ts` must match KV shapes exactly (no runtime validation)

**Standalone Mode** (server-side):
- Express API on port 3333 with Prisma ORM → MySQL database
- Routes: `/api/conversations`, `/api/leads`, `/api/agents`, `/api/settings`, `/api/messages`
- Client uses `src/lib/api-client.ts` which auto-detects API base URL via `VITE_API_URL`
- Data flows through Prisma models → see `prisma/schema.prisma` for canonical schemas

**Field Sync Requirements**: When adding fields to `Lead` or `Conversation`, update:
1. `src/lib/types.ts` interface
2. `prisma/schema.prisma` model
3. UI renderers (`Dashboard`, `LeadDetailDialog`)
4. API route handlers (`server/routes/`)

## AI Chat Flow
**Conversation Initialization**:
```tsx
MinimalChatInterface → createConversation() → seeds conversation
                    → delay by agent.responseDelay
                    → writes greeting message to state
```
- Agent greetings trigger automatically on mount—don't duplicate greeting logic
- Conversation state managed by `useState<Conversation>` in `MinimalChatInterface`
- Messages array appends on both user input and AI response

**AI Response Generation** (Dual-Path):
- **Spark**: `window.spark.llm(prompt, agent.model)` (OpenAI GPT-4o/mini)
- **Standalone**: `generateText()` from `server/services/llm.ts` (Google Gemini API)
- Both use `buildPrompt()` which injects:
  - Agent's system prompt from `agent.systemPrompt`
  - Conversation history (formatted as "Usuário: X\nAssistant: Y")
  - Contextual instructions based on message count (progressive profiling logic at messages 1, 3, 5, 7, 9+)
  
**Critical Gemini API Gotchas**:
- **MAX_TOKENS Issue**: Google's free tier has soft rate limiting; prompts with pattern `"Liste 3 respostas para: [context]"` trigger premature MAX_TOKENS errors
- **Solution**: Use direct commands (`"Liste 3 frutas"`) not indirect patterns; avoid emojis in context strings
- **Rate Limiting**: Implement 500ms delay between calls to avoid `finishReason: MAX_TOKENS` without actual token usage
- See `GEMINI_MAX_TOKENS_EXPLAINED.md` for deep dive on this quirk

**AI-Generated Suggestions**:
- ALWAYS attempt AI generation first via `generateSuggestions()` in `server/services/aiProvider.ts`
- Fallback to pattern-based suggestions in `src/lib/conversation-starters.ts` ONLY if API fails
- Suggestions only appear when conversation has exactly 1 message (initial greeting)
- Update `getRandomStarters()` for new starter prompts

**Message Editing/Deletion**:
- User messages are editable/deletable via API routes (`PATCH/DELETE /api/messages/:id`)
- Assistant messages are immutable (API rejects edits with 400 error)
- Edits trigger conversation `updatedAt` timestamp refresh

## Agent System
**5 Predefined AI Agents** in `src/lib/predefined-agents.ts`:
- Sofia (Empática) - warm, validating, emoji-friendly 🌸
- Carlos (Objetivo) - direct, structured, professional
- Júlia (Positiva) - optimistic, solution-focused
- Ana (Reflexiva) - thoughtful, philosophical
- Lucas (Equilibrado) - default, balanced approach

**Agent Properties**:
- `systemPrompt`: Core personality & instructions (2-4K chars, PT-BR)
- `greeting`: Initial message shown on conversation start
- `responseDelay`: Milliseconds to delay before showing greeting (simulates typing)
- `color`: Tailwind gradient string for UI theming
- `icon`: Phosphor icon name (must exist in `@phosphor-icons/react`)
- `temperature`: LLM randomness (0.7-1.0 typical range)
- `autoReferralThreshold`: Message count to trigger referral suggestion

**Agent Switching**:
- User can switch mid-conversation via dropdown menu
- History preserved across switches
- New agent sends transition greeting
- Agent snapshot stored in `Conversation.agentSnapshot` for audit trail

**Human Therapist Management**:
- Separate from AI agents—stored in `Agent` model via `AgentsManagement.tsx`
- Contains CRP number, specialties (array), availability, insurance info
- Used for manual referral matching in CRM dashboard

## CRM & Lead Scoring
**Lead Extraction Pipeline**:
```
User message → extractLeadData() → Partial<LeadData>
            → scoreLeadQuality() → 0-100 score
            → auto-creates Lead if score > threshold
```
- Extraction uses regex patterns + keyword matching (see `server/services/leadExtractor.ts`)
- Scoring algorithm in `server/services/leadScore.ts` weighs completeness + urgency
- Fields extracted: `name`, `email`, `phone`, `age`, `mainConcern`, `emotionalState`, `symptoms`, etc.

**Lead Statuses** (strict union):
```typescript
'new' | 'contacted' | 'scheduled' | 'converted' | 'lost'
```
- Dashboard allows manual status updates via Select components
- Filter leads by status, sort by score/date
- `LeadDetailDialog` shows full conversation context + extracted data side-by-side

**Referral Flow**:
- Triggered manually or auto-suggested when `messages.length >= agent.autoReferralThreshold`
- `ReferralDialog` component captures preferred contact method
- Sets `Conversation.needsReferral = true` flag
- Admin sees referral-needed leads highlighted in dashboard

## Blog & SEO
**Content Architecture**:
- Articles stored as static objects in `src/lib/blog-articles.ts` (not database-driven)
- Each article includes:
  - Markdown content (rendered via `marked` library)
  - `metaDescription` & `keywords` for SEO
  - Schema.org structured data (auto-generated by `generateStructuredData()`)
  - Category, tags, read time, author

**SEO Implementation**:
- `BlogArticleView` calls `updateDocumentMeta()` which:
  - Sets `document.title`, meta description, keywords
  - Injects `<script type="application/ld+json">` with Article schema
- Breadcrumbs with schema.org markup: `Home > Blog > [Category] > Article`
- **Canonical URLs**: All point to `psicologobelohorizonte.com.br` (hardcoded domain)

**Content Workflow**:
```typescript
createArticle(rawArticle) → adds structuredData
                          → BLOG_ARTICLES array
BlogSection → grid of BlogCard components
           → click → BlogArticleView → markdown render + SEO meta injection
```

**Search & Filtering**:
- `searchArticles(query)` searches title/excerpt/content
- `getAllCategories()` extracts unique categories from articles
- Filters apply client-side (no API calls)

## Styling & UI Patterns
**Tailwind 4** with shadcn/ui components:
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Primitives in `src/components/ui/` are Radix UI wrapped with Tailwind
- Theming via CSS variables in `src/styles/theme.css`
- Responsive design uses `@container` queries for component-level breakpoints

**Animation Standards**:
- `framer-motion` for all transitions
- Typical pattern: `<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>`
- Maintain `initial/animate/exit` props when editing animated components
- Use `AnimatePresence` for conditional rendering with exit animations

**Icon Usage**:
- Phosphor Icons (`@phosphor-icons/react`) for UI
- Heroicons (`@heroicons/react`) for fallback/utility icons
- Icon names in agent config must match exact Phosphor export names

## Development Workflow
**Local Development**:
```bash
npm install                    # Install dependencies
npm run dev                    # Start both client (Vite) + server (Express)
npm run dev:client             # Client only (port 5173)
npm run dev:server             # Server only (port 3333)
```

**Environment Variables** (`.env`):
```
# Standalone server mode
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-2.5-pro
DATABASE_URL=mysql://...
DIRECT_URL=mysql://...

# Optional Supabase auth
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# API endpoint override
VITE_API_URL=http://localhost:3333
```

**Database Workflow**:
```bash
npm run prisma:generate       # Generate Prisma client after schema changes
npm run prisma:migrate        # Apply migrations
```

**Build & Deployment**:
```bash
npm run build                  # TypeScript compile + Vite build
npm run preview                # Test production build locally
```

**Testing Scripts** (in `scripts/`):
- `test-gemini-model.ts` - validate Gemini API connectivity
- `test-suggestions.ts` - test AI suggestion generation
- `gemini-sample.ts` - minimal Gemini API test
- Run via: `tsx scripts/<name>.ts`

## Critical Constraints
1. **PT-BR Only**: All user-facing text, prompts, errors, toasts must be in Brazilian Portuguese
2. **No Diagnoses**: AI agents NEVER provide clinical diagnoses—only empathetic listening & referral suggestions
3. **Emergency Protocol**: Critical emotional states trigger CVV 188 (Brazilian crisis line) messaging
4. **Privacy**: No conversation data leaves client in Spark mode; standalone mode uses MySQL with audit trails
5. **Mobile-First**: UI must work on small screens—use responsive Tailwind breakpoints
6. **Accessibility**: Maintain ARIA labels, keyboard navigation in all interactive components

## Common Patterns
**Adding a New Field to Leads**:
1. Add to `LeadData` interface in `src/lib/types.ts`
2. Add to Prisma `Lead` model in `prisma/schema.prisma`
3. Run `npm run prisma:migrate`
4. Update `extractLeadData()` in `server/services/leadExtractor.ts`
5. Update `Dashboard` and `LeadDetailDialog` renderers
6. Update `scoreLeadQuality()` if field affects scoring

**Creating a New AI Agent**:
1. Add to `PREDEFINED_AGENTS` array in `src/lib/predefined-agents.ts`
2. Define unique `id`, `name`, `personality`, `systemPrompt` (PT-BR, empathetic tone)
3. Set `color` (Tailwind gradient), `icon` (Phosphor icon name)
4. Choose `temperature` (0.7-1.0), `responseDelay` (1000-2000ms)
5. Update `getDefaultAgent()` if changing default agent
6. Ensure icon name exists in Phosphor library

**Adding a Blog Article**:
1. Call `createArticle()` in `src/lib/blog-articles.ts`
2. Provide markdown `content`, `metaDescription`, `keywords` (SEO critical)
3. Set category (must be one of existing categories or add new)
4. Calculate `readTime` (words / 200 WPM)
5. Set `publishedAt` in ISO string format
6. Add to `BLOG_ARTICLES` array (order determines display order)

## Debugging Tips
- **Spark Runtime Detection**: Check `typeof window !== 'undefined' && window.spark`
- **API Failures**: Check browser console for CORS errors, 404s → likely `VITE_API_URL` misconfigured
- **Gemini MAX_TOKENS**: See logs for `finishReason: MAX_TOKENS` → simplify prompt or add delay
- **State Not Updating**: Verify `useKV` setter uses immutable update (`.map()`/`.filter()`, not `.push()`)
- **Missing Icons**: Phosphor icon names are PascalCase without "Icon" suffix (e.g., `Heart` not `HeartIcon`)
- **Prisma Errors**: Run `npm run prisma:generate` after schema changes, check MySQL connection in `.env`

## Project-Specific Idioms
- **"Agent"** = AI persona OR human therapist (context-dependent—check if `Agent` type or `AIAgentConfig` type)
- **"Lead"** = potential client extracted from conversation data
- **"Referral"** = handoff from AI to human therapist
- **"Score"** = lead quality metric (0-100, combines completeness + urgency + sentiment)
- **"Conversation Starters"** = suggestion chips shown after first AI message
- **"KV"** = key-value storage (Spark's persistent localStorage-like API)
