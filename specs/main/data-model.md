# Data Model

## Entity Relationship

```
Conversation 1:N Message
Conversation 1:1 Lead
Conversation N:1 AIAgentConfig
Agent (human) manages Lead
```

## Entities

### Conversation
- id: string (UUID)
- createdAt: DateTime
- updatedAt: DateTime
- userId: string
- aiAgentId: string (FK AIAgentConfig)
- status: enum (active, completed, abandoned)

### Message
- id: string (UUID)
- conversationId: string (FK Conversation)
- role: enum (user, assistant, system)
- content: string
- createdAt: DateTime

### Lead
- id: string (UUID)
- conversationId: string (FK Conversation)
- name: string?
- email: string?
- phone: string?
- status: enum (new, contacted, scheduled, converted, lost)
- score: int (0-100)
- issues: string[]
- urgency: enum (low, medium, high, critical)
- createdAt: DateTime
- updatedAt: DateTime

### AIAgentConfig
- id: string (slug)
- name: string
- personality: string
- systemPrompt: string
- greeting: string
- temperature: float
- color: string
- icon: string

Sync with:
- src/lib/types.ts (TypeScript interfaces)
- prisma/schema.prisma (Database models)
