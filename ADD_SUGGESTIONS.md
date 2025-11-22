# Adicionar Sugestões ao Endpoint

No arquivo `server/routes/conversations.ts`, **ANTES** da linha `res.status(201).json({`, adicione:

```typescript
// Gerar sugestões de resposta contextuais
console.log('[SUGGESTIONS] Iniciando geração...')
let suggestions: string[] = []
try {
  suggestions = await generateSuggestions({
    agent,
    history: [...history, { role: 'assistant', content: assistantResponse }],
    lastAssistantMessage: assistantResponse,
  })
  console.log('[SUGGESTIONS] Geradas:', suggestions)
} catch (error) {
  console.error('[SUGGESTIONS] Erro:', error)
}
```

E **DENTRO** do `res.status(201).json({`, adicione após `lead:`:

```typescript
suggestions: suggestions.length > 0 ? suggestions : undefined,
```

A função `generateSuggestions` JÁ existe em `server/services/aiProvider.ts` e JÁ está importada no topo do arquivo.
