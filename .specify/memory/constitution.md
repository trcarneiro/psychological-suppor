# Psychological Support Platform - Constitution

Plataforma de pré-triagem psicológica com chatbot IA para conexão de usuários com terapeutas no Brasil.

## Core Principles

### I. PT-BR Only (INEGOCIÁVEL)
Todo texto visível ao usuário, prompts de IA, mensagens de erro e toasts DEVEM ser em Português Brasileiro. Isso inclui:
- Mensagens do chatbot e agentes IA
- Labels de UI e placeholders
- Mensagens de erro e validação
- Conteúdo do blog e SEO

### II. Ética Terapêutica
O chatbot IA NUNCA deve:
- Fornecer diagnósticos clínicos
- Prescrever tratamentos ou medicamentos
- Substituir atendimento profissional
- Minimizar crises de saúde mental

O chatbot IA SEMPRE deve:
- Escutar com empatia e validar sentimentos
- Sugerir encaminhamento para profissionais
- Exibir linha de crise CVV 188 em situações críticas
- Manter tom acolhedor e humano

### III. Type Sync (CRÍTICO)
Tipos devem permanecer sincronizados entre:
1. `src/lib/types.ts` — Interfaces TypeScript
2. `prisma/schema.prisma` — Modelos de banco de dados
3. `server/routes/` — Handlers de API
4. Componentes UI (`Dashboard`, `LeadDetailDialog`)

Ao adicionar campos, atualizar TODOS os locais acima + rodar `npm run prisma:migrate`.

### IV. Gemini API Safety
Evitar erros de MAX_TOKENS:
- Usar prompts diretos (`"Gere 3 respostas curtas"`) não indiretos
- Delay de 500ms entre chamadas consecutivas
- Verificar logs `[LLM]` para diagnóstico
- Ver `GEMINI_MAX_TOKENS_EXPLAINED.md` para detalhes

### V. Component Standards
- **Icons**: Phosphor (`@phosphor-icons/react`), nomes em PascalCase (`Heart`, não `HeartIcon`)
- **Animations**: `framer-motion` com props `initial/animate/exit`
- **Styling**: Tailwind 4 + shadcn/ui, usar `cn()` para classes condicionais
- **State**: React `useState` para UI, React Query para server state

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind 4 + shadcn/ui |
| Backend | Express 5 + Prisma + MySQL |
| AI | Google Gemini API (`gemini-2.5-pro`) |
| Deploy | Vercel Serverless |

## Data Flow

```
MinimalChatInterface → POST /api/conversations/:id/messages
                     → generateAssistantReply() (Gemini)
                     → extractLeadData() (após 4+ mensagens)
                     → generateSuggestions() (delay 500ms)
                     → Response com conversation, lead, suggestions
```

## Development Workflow

```bash
npm run dev              # Client (5173) + Server (3333) concurrent
npm run prisma:generate  # Após mudanças no schema
npm run prisma:migrate   # Aplicar migrations
tsx scripts/<name>.ts    # Rodar scripts de teste
```

## Governance

Esta constitution tem precedência sobre todas as outras práticas. Alterações requerem:
1. Documentação da mudança proposta
2. Atualização do `.github/copilot-instructions.md`
3. Migração de código existente se necessário

Consulte `.github/copilot-instructions.md` para guia detalhado de desenvolvimento.

**Version**: 1.0.0 | **Ratified**: 2025-11-30 | **Last Amended**: 2025-11-30
