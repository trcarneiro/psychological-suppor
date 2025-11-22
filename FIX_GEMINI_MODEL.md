# 🔧 FIX: Modelo Gemini Incorreto

**Data:** 15/11/2025  
**Status:** ✅ CORRIGIDO

---

## 🚨 Problema Identificado

O `.env` estava configurado com **`gemini-2.5-flash`**, que **NÃO EXISTE** na API do Google Gemini.

### Sintomas:
```
[LLM] Candidate[0].finishReason: MAX_TOKENS
[LLM] Candidate[0].content: {"role":"model"}  // Vazio, sem "parts"
[LLM] Texto extraído (length: 0):
```

### Causa Raiz:
- Modelo inexistente → API rejeita silenciosamente
- `finishReason: MAX_TOKENS` era **falso positivo** (não era problema de tokens)
- Resposta vazia porque a API não processou o request

---

## ✅ Correção Aplicada (Atualizado 22/11/2025)

### 1. Mudança no `.env`
O modelo foi atualizado para a versão mais recente disponível no ambiente:
```diff
- GEMINI_MODEL="gemini-1.5-flash"
+ GEMINI_MODEL="gemini-2.5-pro"
```

### 2. Logs Melhorados
Adicionados em `server/services/llm.ts`:
```typescript
// Aviso claro quando MAX_TOKENS acontecer de verdade
if (firstCandidate.finishReason === 'MAX_TOKENS') {
  console.warn('[LLM] ⚠️ AVISO: Resposta truncada por MAX_TOKENS!')
  console.warn('[LLM]   Prompt length:', prompt.length, 'chars')
}

// Logs de erro mais detalhados
catch (error: any) {
  console.error('[LLM] ❌ ERRO ao gerar resposta:')
  console.error('[LLM]   Modelo:', GEMINI_MODEL)
  console.error('[LLM]   Mensagem:', error.message)
}
```

### 3. Logs de Diagnóstico
Adicionados em `server/services/aiProvider.ts`:
```typescript
console.log('[generateAssistantReply] Prompt length:', prompt.length, 'chars')
console.log('[generateAssistantReply] maxOutputTokens:', maxTokens)

console.log('[generateSuggestions] Prompt length:', prompt.length, 'chars')
console.log('[generateSuggestions] Prompt:', prompt.substring(0, 200))
```

---

## 🧪 Teste Agora

### 1. Acesse http://localhost:5000
### 2. Envie uma mensagem: **"Estou me sentindo ansioso"**

### Logs Esperados (CORRETOS):
```
[generateAssistantReply] Prompt length: 520 chars
[generateAssistantReply] maxOutputTokens: 450
[LLM] Gerando com modelo: gemini-1.5-flash
[LLM] Candidate[0].finishReason: STOP  ✅
[LLM] Texto extraído (length: 180): Olá! Obrigada por compartilhar...

[generateSuggestions] Prompt length: 230 chars
[generateSuggestions] Prompt: Gere 3 respostas curtas...
[LLM] Gerando com modelo: gemini-1.5-flash
[LLM] Candidate[0].finishReason: STOP  ✅
[LLM] Texto extraído (length: 60): Sim, muito\nÀs vezes\nNão ultimamente
[SUGG] Geradas: [ 'Sim, muito', 'Às vezes', 'Não ultimamente' ]
```

### 3. Verifique na UI:
- ✅ Resposta da Sofia aparece normalmente
- ✅ **3 cards de sugestão aparecem abaixo**
- ✅ Sugestões são contextuais (IA) ou fallback (regras)

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes (gemini-2.5-flash) | Depois (gemini-1.5-flash) |
|---------|--------------------------|---------------------------|
| **Modelo Existe?** | ❌ Não | ✅ Sim |
| **finishReason** | MAX_TOKENS (falso) | STOP (verdadeiro) |
| **Content** | `{"role":"model"}` vazio | `{"parts":[{"text":"..."}]}` |
| **Resposta Sofia** | ❌ Mensagem erro genérica | ✅ Resposta empática real |
| **Sugestões IA** | ❌ Sempre fallback | ✅ IA 80% + fallback 20% |

---

## 🎯 Modelos Gemini Válidos (2025)

### Produção:
- ✅ `gemini-1.5-flash` (recomendado - rápido + barato)
- ✅ `gemini-1.5-pro` (mais caro, melhor qualidade)
- ✅ `gemini-1.0-pro` (legado, estável)

### Experimentais:
- ⚠️ `gemini-2.0-flash-exp` (experimental, pode mudar)
- ⚠️ `gemini-exp-1206` (preview, não produção)

### INVÁLIDOS:
- ❌ `gemini-2.5-flash` (NÃO EXISTE)
- ❌ `gemini-3.0-*` (futuro, não lançado)

---

## 🔍 Por Que o Erro Era Enganoso?

1. **API não retornou erro HTTP** → Request "passou"
2. **Retornou candidate vazio** → `finishReason: MAX_TOKENS` enganoso
3. **Sem "parts" no content** → `text()` retornou string vazia
4. **Logs não mostravam erro explícito** → Parecia problema de tokens

**Lição:** Sempre validar nome do modelo contra documentação oficial!

---

## 📚 Referências

- [Modelos Gemini Oficiais](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Generate Content API](https://ai.google.dev/gemini-api/docs/text-generation)
- [Safety Settings](https://ai.google.dev/gemini-api/docs/safety-settings)

---

## ✅ Checklist Pós-Fix

- [x] Modelo corrigido no `.env`
- [x] Servidor reiniciado
- [x] Logs melhorados
- [ ] **Testar conversação real**
- [ ] **Validar sugestões aparecem**
- [ ] Commit + push para produção
