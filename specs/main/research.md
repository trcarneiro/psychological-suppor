# Research: Technology Decisions

## 1. LLM Provider Selection
**Decision**: Google Gemini 2.5-flash
**Rationale**: Already integrated, lower cost, good PT-BR support
**Alternatives**: OpenAI GPT-4, Claude 3.5 - higher cost

## 2. Data Extraction Strategy
**Decision**: LLM-based JSON extraction via leadExtractor.ts
**Rationale**: Already implemented, accurate extraction from natural conversation
**Key**: Progressive profiling over 9+ messages

## 3. Lead Scoring
**Decision**: Multi-factor scoring (0-100)
**Factors**: completeness, urgency, emotional state, engagement
**File**: server/services/leadScore.ts

## 4. Authentication
**Decision**: Simple admin login (local state)
**Rationale**: MVP approach, upgrade to JWT for production

## 5. Deployment
**Decision**: Vercel Serverless via api/index.ts
**Rationale**: Zero-config, automatic scaling, integrated with GitHub

## 6. Real-time Updates
**Decision**: Polling-based (useQuery refetch)
**Alternative**: WebSockets - deferred for v2
