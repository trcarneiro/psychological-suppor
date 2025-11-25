# 🕵️ Auditoria Técnica e Plano de Melhorias - Psychological Support Platform

**Data:** 23/11/2025
**Status:** Pós-Correção de Crise (API Leak & Vercel Deploy)
**Versão:** 0.0.0 (Alpha)

---

## 🚨 1. Segurança (Prioridade Crítica)

### Diagnóstico
O projeto sofreu recentemente um vazamento de chave de API (`GEMINI_API_KEY`) devido a scripts de teste com credenciais "hardcoded". Embora corrigido, o sistema ainda apresenta vulnerabilidades estruturais.

### Problemas Identificados
*   **Scripts de Teste:** Scripts na pasta `scripts/` não tinham verificação de ambiente segura (Corrigido, mas requer vigilância).
*   **Autenticação Permissiva:** O middleware `requireAuth` permite acesso irrestrito (`admin-dev`) se as variáveis do Supabase não estiverem configuradas. Em produção, se essas variáveis falharem, o painel administrativo fica aberto.
*   **CORS:** Atualmente configurado como `origin: '*'` para resolver problemas de conexão. Isso permite que qualquer site faça requisições para sua API.

### Recomendações
1.  **[CRÍTICO] Bloqueio de Fallback de Auth:** Alterar `server/middleware/auth.ts` para **bloquear** o acesso por padrão em produção se o Supabase não estiver configurado, em vez de liberar acesso admin.
2.  **[ALTA] Restrição de CORS:** Configurar `origin` no CORS para aceitar apenas o domínio de produção do Vercel e `localhost` em desenvolvimento.
3.  **[MÉDIA] Rate Limiting:** Implementar `express-rate-limit` nas rotas `/api/messages` para evitar que bots consumam sua cota da API do Gemini, gerando custos ou bloqueios.

---

## 🧠 2. Inteligência Artificial & LLM

### Diagnóstico
O uso do modelo `gemini-2.5-pro` (Thinking Model) trouxe qualidade, mas introduziu latência alta e consumo massivo de tokens de "pensamento" (1600+ tokens antes de responder).

### Problemas Identificados
*   **Latência Percebida:** O usuário vê "Digitando..." por 5-10 segundos enquanto o modelo "pensa". Isso causa ansiedade em um app de suporte psicológico.
*   **Consumo de Tokens:** O limite foi aumentado para 4096, mas isso não resolve o custo/tempo.
*   **Contexto Infinito:** O histórico da conversa é enviado integralmente a cada mensagem. Conversas longas ficarão lentas e atingirão o limite do modelo rapidamente.

### Recomendações
1.  **[ALTA] Streaming de Resposta:** Implementar respostas via *stream* (texto aparecendo letra por letra). Isso é vital para UX em modelos lentos como o "Thinking", pois dá feedback imediato ao usuário.
2.  **[MÉDIA] Janela de Contexto Deslizante:** Enviar apenas as últimas 10-15 mensagens para a API, ou implementar um mecanismo de "resumo" de conversas antigas para manter o contexto sem estourar tokens.
3.  **[BAIXA] Fallback de Modelo:** Ter um fallback automático para `gemini-1.5-flash` (muito mais rápido e barato) caso o `pro` falhe ou demore demais.

---

## 🏗️ 3. Arquitetura & Código

### Diagnóstico
O projeto usa uma arquitetura híbrida (Vite SPA + Express Backend) adaptada para Vercel Serverless. A estrutura atual é funcional mas frágil.

### Problemas Identificados
*   **Roteamento Manual:** O `App.tsx` usa um `useState` (`viewMode`) para navegação. Isso quebra o botão "Voltar" do navegador e impede links diretos para páginas (ex: `/blog/artigo-1`).
*   **Bundle Size:** O build acusou chunks > 500kB. O `App.tsx` importa todos os componentes (`Dashboard`, `AdminLogin`) de uma vez, pesando o carregamento inicial.
*   **Tipagem:** Uso de `@ts-ignore` em pontos críticos de autenticação.

### Recomendações
1.  **[ALTA] Code Splitting (Lazy Loading):** Usar `React.lazy` e `Suspense` para carregar `Dashboard` e `AdminLogin` apenas quando necessários. Isso vai reduzir drasticamente o tempo de carregamento inicial.
2.  **[MÉDIA] React Router:** Migrar o `viewMode` para `react-router-dom`. Isso habilitará URLs reais, histórico do navegador e melhor SEO para o blog.
3.  **[BAIXA] Estrutura de Pastas:** Mover `server/` para fora ou usar um framework fullstack como Next.js ou Remix no futuro para evitar a "gambiarra" de adaptação do Express para Serverless.

---

## 🎨 4. UX/UI & Acessibilidade

### Diagnóstico
A interface é limpa, mas carece de feedback de estado robusto.

### Problemas Identificados
*   **Feedback de Erro:** Erros de API (como o 500 recente) aparecem apenas no console ou travam o chat. O usuário não sabe o que aconteceu.
*   **Mobile:** O teclado virtual em celulares pode cobrir o campo de input se não houver tratamento de viewport.

### Recomendações
1.  **[ALTA] Toasts de Erro:** Exibir mensagens amigáveis ("Não foi possível conectar. Tente novamente.") usando o componente `Sonner` já instalado.
2.  **[MÉDIA] Indicador de "Pensando":** Diferenciar "Digitando..." (gerando texto) de "Pensando..." (processamento do modelo Thinking) para gerenciar a expectativa do usuário.

---

## 🚀 5. DevOps & Deploy

### Diagnóstico
O processo de deploy depende de commits manuais e "tentativa e erro" no Vercel.

### Problemas Identificados
*   **Variáveis de Ambiente:** Dependência crítica de configuração manual no painel do Vercel.
*   **Logs:** Logs de produção são difíceis de acessar/ler no Vercel (apenas console output).

### Recomendações
1.  **[MÉDIA] Validação de ENV:** Criar um script `check-env.ts` que roda no `prebuild` e falha o build se variáveis críticas (`DATABASE_URL`, `GEMINI_API_KEY`) estiverem faltando.
2.  **[BAIXA] Monitoramento:** Integrar com Sentry ou similar para rastrear erros de frontend/backend em tempo real.

---

## 📋 Plano de Ação Imediato (Sugestão)

1.  **Hoje:** Implementar **Lazy Loading** no `App.tsx` para resolver o aviso de bundle size e melhorar performance.
2.  **Hoje:** Reforçar a segurança do **CORS** e **Auth** para evitar novos vazamentos ou acessos indevidos.
3.  **Amanhã:** Implementar **Streaming** na resposta do chat (complexidade média, alto impacto).

Deseja que eu comece por algum desses itens?
