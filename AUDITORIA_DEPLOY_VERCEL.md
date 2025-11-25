# 🔍 AUDITORIA DE DEPLOY (VERCEL)

**Data:** 24/11/2025
**Status:** ❌ ERRO CRÍTICO EM PRODUÇÃO (500 Internal Server Error)

---

## 🚨 DIAGNÓSTICO DO ERRO 500

Com base no print enviado e nos logs, o erro `FUNCTION_INVOCATION_FAILED` indica que a aplicação está falhando ao tentar processar a requisição.

### 1. Causa Mais Provável: Variáveis de Ambiente Ausentes
Recentemente, endurecemos a segurança no arquivo `server/middleware/auth.ts`.

**O Código diz:**
```typescript
const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY
// ...
if (!isConfigured) {
  if (process.env.NODE_ENV === 'development') {
    // ... permite dev
  } else {
    console.error('[Auth] CRÍTICO: Supabase não configurado em produção. Bloqueando acesso.')
    return res.status(500).json({ error: 'Erro de configuração de autenticação.' })
  }
}
```

**O Problema:**
O arquivo `.env` **NÃO** é enviado para o GitHub (por segurança). O Vercel não sabe quais são as chaves a menos que você as configure manualmente no painel.

**Se você não configurou `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas configurações do projeto na Vercel, a API vai retornar erro 500 imediatamente.**

### 2. Segunda Causa Provável: Conexão com Banco de Dados
O Prisma precisa da variável `DATABASE_URL`. Se ela não estiver na Vercel, ou se o banco de dados (IP `67.205.159.161`) bloquear conexões externas (firewall), a aplicação vai quebrar.

### 3. Terceira Causa: Prisma Binary Targets
Embora o log de build mostre sucesso, é uma boa prática definir explicitamente os alvos de compilação para o ambiente Linux da Vercel.

---

## 🛠️ PLANO DE CORREÇÃO IMEDIATA

### PASSO 1: Configurar Variáveis na Vercel (CRÍTICO)
Acesse o painel da Vercel > Settings > Environment Variables e adicione **EXATAMENTE** os valores que estão no seu arquivo `.env` local:

1.  `DATABASE_URL`
2.  `DIRECT_URL`
3.  `GEMINI_API_KEY`
4.  `GEMINI_MODEL`
5.  `VITE_SUPABASE_URL`
6.  `VITE_SUPABASE_ANON_KEY`
7.  `VITE_API_URL` (Defina como a URL do seu site na Vercel, ex: `https://psychological-suppor.vercel.app`)

### PASSO 2: Atualizar `schema.prisma`
Para garantir compatibilidade com a Vercel, vamos adicionar `binaryTargets`.

**Ação Recomendada:**
Editar `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

### PASSO 3: Verificar Logs de Runtime da Vercel
No painel da Vercel, vá em "Logs" e filtre por "Errors". Se o erro for "Supabase não configurado", o Passo 1 resolve. Se for "Can't reach database", verifique se o seu banco MySQL aceita conexões de qualquer IP (ou dos IPs da Vercel).

---

## 🔄 PRÓXIMA AÇÃO
Vou aplicar a correção do **PASSO 2** (Prisma Binary Targets) agora mesmo, pois isso requer alteração de código.

**Você precisa realizar o PASSO 1 manualmente no site da Vercel.**
