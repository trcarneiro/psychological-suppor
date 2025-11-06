**Project Snapshot**
- React 19 + Vite + TypeScript; entry `src/main.tsx` mounts `App` under `ErrorBoundary` for graceful fallback via `src/ErrorFallback.tsx`.
- `App.tsx` drives navigation with a single `viewMode` union; new screens must plug into this state machine and provide setters for navigation.
- Spark runtime is expected (see `runtime.config.json`); browser globals like `window.spark` exist only there, so guard or mock them when running outside Spark.

**Runtime Data Stores**
- Persistent state relies on `useKV` from `@github/spark/hooks`; keys already used: `conversations`, `leads`, `agents`, `ai-agent-config`.
- Shape definitions live in `src/lib/types.ts`; update interfaces before changing stored payloads to avoid runtime casting issues.
- `useKV` setters must preserve immutable updates (map/filter over previous arrays) to keep reactivity and caching intact.

**Chat Flow**
- `MinimalChatInterface` seeds a conversation on mount, schedules the agent greeting with `responseDelay`, and writes every message to the KV array—maintain this handshake when altering the flow.
- AI replies are produced via `window.spark.llm(prompt, agent.model)` with prompts built from `agent.systemPrompt` plus contextual instructions; never bypass `generateAIResponse` when adding branches.
- Suggestion chips surface only when the conversation has one message; update `getRandomStarters` in `src/lib/conversation-starters.ts` for new copy.

**CRM & Admin Panels**
- `Dashboard` derives lead records from conversation `leadData` then merges with stored `leads`; any new lead field requires sync across `Lead`, `Conversation.leadData`, and UI renderers.
- Status updates happen via Select components writing back to KV; keep statuses within the `'new' | 'contacted' | 'scheduled' | 'converted' | 'lost'` union.
- `AgentsManagement` stores human therapists (comma-separated inputs become arrays); respect the `Agent` timestamps when editing to avoid losing audit info.

**AI Agent Catalog**
- Static presets live in `src/lib/predefined-agents.ts`; each agent defines gradient `color`, `icon`, and long-form system prompt—update `iconMap` usages (`MinimalChatInterface`, `AgentsManagementPanel`) when adding icons.
- `AIAgentConfig` component writes a single configurable agent to KV under `ai-agent-config`; keep slider ranges (`temperature`, `autoReferralThreshold`) aligned with the interface bounds.

**Blog & SEO Stack**
- Articles are Markdown strings defined via `createArticle` in `src/lib/blog-articles.ts`, which injects schema.org data through `generateStructuredData`.
- `BlogArticleView` renders Markdown with `marked` and mutates document metadata using `updateDocumentMeta`; always supply `metaDescription`/`keywords` to prevent fallback copy.
- Category and search helpers (`getAllCategories`, `searchArticles`) are exported from the same module; reuse them instead of reimplementing filters.

**Styling Conventions**
- Tailwind 4 utility classes dominate; use `cn` from `src/lib/utils.ts` when conditionally composing class names.
- UI primitives under `src/components/ui/` follow shadcn patterns; prefer them over raw elements for consistent theming.
- Animations lean on `framer-motion`; maintain `initial/animate` props when editing animated blocks.

**Build & Tooling**
- Install/run with `npm install`, `npm run dev`, `npm run build`, `npm run lint`; `npm run kill` leverages `fuser` (skip on Windows).
- TypeScript config is under `tsconfig.json`; keep imports path-resolved via `@/` alias defined by Vite.
- Vite preview: `npm run preview` (after build) for production-like testing.

**Localization & Tone**
- All copy, prompts, and toasts are PT-BR; maintain localized language, including empathy cues in agent prompts.
- Emergency guidance references Brazilian services (e.g., CVV 188); adjust only with stakeholder approval.
