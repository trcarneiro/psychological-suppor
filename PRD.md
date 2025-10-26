# Planning Guide

Uma plataforma moderna e minimalista de pré-atendimento psicológico com múltiplos assistentes virtuais, cada um com personalidade única, landing page contemporânea, interface de chat imersiva e dashboard CRM para gestão.

**Experience Qualities**:
1. **Minimalista** - Design clean e sem distrações, focando na essência da comunicação e experiência do usuário
2. **Moderno** - Estética contemporânea com animações sutis, gradientes suaves e tipografia elegante
3. **Acolhedor** - Interface que transmite calma e confiança, criando um espaço seguro para expressar emoções

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Múltiplos agentes de IA com personalidades distintas, landing page moderna, chat imersivo, extração inteligente de dados, CRM completo e gestão de agentes

## Essential Features

### Múltiplos Agentes de IA com Personalidades Únicas
- **Funcionalidade**: Sistema com 5 assistentes virtuais pré-cadastrados, cada um com personalidade, abordagem e estilo únicos de atendimento
- **Purpose**: Permitir que usuários escolham o assistente que melhor se alinha com suas preferências pessoais, aumentando conforto e engajamento
- **Trigger**: Usuário visualiza os agentes disponíveis na landing page
- **Progression**: Usuário vê cards dos agentes → Lê descrição de cada personalidade → Escolhe o agente que prefere → Inicia conversa personalizada
- **Success criteria**: 5 agentes com personalidades distintas (Sofia - Empática, Carlos - Objetivo, Júlia - Positiva, Ana - Reflexiva, Lucas - Equilibrado), cada um com prompts e comportamentos únicos

### Landing Page Moderna e Minimalista
- **Funcionalidade**: Página inicial clean com design contemporâneo, foco em tipografia elegante e animações sutis
- **Purpose**: Apresentar o serviço de forma moderna e convidativa, destacando os diferentes agentes disponíveis
- **Trigger**: Usuário acessa o site
- **Progression**: Hero section com tipografia grande → Cards dos agentes com gradientes e animações → CTA claro para iniciar conversa
- **Success criteria**: Design minimalista, tipografia Playfair Display para títulos, animações suaves com framer-motion, gradientes modernos, sem elementos desnecessários

### Interface de Chat Imersiva e Sem Distrações
- **Funcionalidade**: Tela cheia de chat com foco total na conversa, tipografia legível, espaçamento generoso e design clean
- **Purpose**: Criar experiência imersiva que permite foco completo na conversa sem elementos que distraiam
- **Trigger**: Usuário seleciona um agente e inicia conversa
- **Progression**: Transição suave para tela de chat → Mensagens em bolhas arredondadas → Gradiente sutil de fundo → Input minimalista
- **Success criteria**: Tela cheia sem sidebar ou menus, fonte grande e legível, mensagens espaçadas, animações de entrada suaves, cores do gradiente do agente selecionado

### Painel de Agentes Cadastrados (Admin)
- **Funcionalidade**: Visualização dos 5 agentes pré-cadastrados com suas configurações, personalidades e comportamentos
- **Purpose**: Permitir que administrador veja e entenda as características de cada agente disponível
- **Trigger**: Admin acessa aba "Agentes Cadastrados" no dashboard
- **Progression**: Admin vê grid de cards dos agentes → Clica para ver detalhes → Visualiza prompts, configurações e estilo
- **Success criteria**: Cards visuais mostrando cada agente, possibilidade de ver detalhes completos, interface organizada e clara

### Configuração do Agente de IA (Admin)
- **Funcionalidade**: Interface para configurar comportamento global da IA (modelo, temperature, delay, etc)
- **Purpose**: Permitir ajustes finos no comportamento dos agentes sem alterar suas personalidades base
- **Trigger**: Admin acessa aba "Config IA"
- **Progression**: Admin ajusta modelo (GPT-4o/GPT-4o-mini) → Define temperatura → Ajusta delay de resposta → Configura campos a coletar
- **Success criteria**: Controles claros para todas configurações, mudanças salvas com persistência, interface intuitiva
- **Funcionalidade**: IA analisa conversa e extrai automaticamente dados estruturados (nome, contato, idade, preocupação, sintomas, orçamento, disponibilidade)
- **Purpose**: Eliminar trabalho manual de qualificação e ter informações completas para personalizar abordagem profissional
- **Trigger**: Após 4+ mensagens do usuário na conversa
- **Progression**: Conversa acumula contexto → IA analisa mensagens → Extrai dados estruturados via LLM → Salva em leadData → Exibe no dashboard
- **Success criteria**: Extração precisa, dados relevantes identificados, atualizações incrementais conforme conversa avança

## Edge Case Handling

- **Escolha de Agente**: Usuário pode escolher entre 5 agentes com personalidades diferentes antes de iniciar conversa
- **Crise Emocional Grave**: Se usuário expressar pensamentos suicidas ou crise severa, exibir números de emergência (CVV 188) de forma proeminente
- **Conversas Inadequadas**: Agentes gentilmente redirecionam para o propósito do app
- **Limites da IA**: Agentes comunicam que não substituem atendimento profissional
- **Privacidade de Dados**: Dados armazenados localmente via useKV
- **Dados Incompletos**: Dashboard exibe "não informado" para dados não coletados
- **Múltiplos Acessos Admin**: Autenticação simples para demonstração

## Design Direction

O design deve evocar modernidade, minimalismo e calma - interface clean e sem distrações com foco em tipografia elegante, espaçamento generoso e animações sutis, evocando sentimentos de serenidade, sofisticação contemporânea e foco.

## Color Selection

Paleta moderna com tons neutros claros, acentos vibrantes e gradientes suaves.

- **Primary Color**: Azul/Roxo moderno (oklch(0.50 0.20 250)) - representa tecnologia e confiança
- **Secondary Colors**: Cinza claro suave (oklch(0.85 0.05 200)) para backgrounds secundários
- **Accent Color**: Coral/Laranja caloroso (oklch(0.65 0.25 30)) para CTAs e destaques
- **Foreground/Background Pairings**:
  - Background (Branco gelo oklch(0.99 0 0)): Texto escuro (oklch(0.15 0 0)) - Ratio 15.2:1 ✓
  - Card (Branco puro oklch(1 0 0)): Texto escuro (oklch(0.15 0 0)) - Ratio 16.1:1 ✓
  - Primary (Azul/Roxo oklch(0.50 0.20 250)): Texto branco (oklch(0.99 0 0)) - Ratio 7.8:1 ✓
  - Accent (Coral oklch(0.65 0.25 30)): Texto branco (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Muted (Cinza claro oklch(0.95 0.01 250)): Texto médio (oklch(0.45 0.01 250)) - Ratio 6.2:1 ✓

## Font Selection

Tipografia elegante e moderna usando Playfair Display para títulos (clássica e sofisticada) e Inter para corpo (clean e altamente legível).

- **Typographic Hierarchy**:
  - H1 (Hero): Playfair Display Bold/80-96px/tight para impacto máximo
  - H2 (Seções): Playfair Display SemiBold/40-48px/tight para hierarquia clara
  - H3 (Cards): Playfair Display SemiBold/20-24px para elegância
  - Body Chat (Mensagens): Inter Regular/18px/relaxed (1.6) para leitura confortável sem fadiga
  - Body Text: Inter Regular/16px/relaxed para conteúdo geral
  - Small: Inter Regular/14px para informações secundárias

## Animations

Animações minimalistas e intencionais que melhoram a experiência sem sobrecarregar, com foco em transições suaves e micro-interações delicadas.

- **Purposeful Meaning**: Movimentos suaves que guiam atenção, fade-ins sequenciais, hover states sutis
- **Hierarchy of Movement**: 
  - Hero: Fade-in sequencial dos elementos
  - Agent cards: Hover lift sutil (-8px) com transição de 200ms
  - Chat messages: Slide-in com fade (y: 20 → 0) e scale (0.95 → 1)
  - Typing indicator: Animação de pulso nos dots
  - CTA buttons: Hover com leve scale e movimento do ícone
  - Gradientes de fundo: Efeitos sutis de blur e glow

## Component Selection

- **Components**: 
  - Card para agent cards, mensagens, estatísticas
  - Button (gradientes customizados por agente)
  - Badge para status e categorias
  - Dialog para detalhes de agentes
  - ScrollArea para chat e listas
  - Textarea com auto-resize para input de chat
  
- **Customizations**: 
  - ModernLandingPage: Hero minimalista com tipografia grande, grid de agent cards com gradientes únicos
  - MinimalChatInterface: Tela cheia, mensagens com bolhas arredondadas (rounded-3xl), input flutuante
  - AgentsManagementPanel: Grid de cards com gradientes identificadores
  - Mensagens do usuário: Gradiente do agente selecionado
  - Mensagens do assistente: Card com backdrop blur
  
- **States**: 
  - Buttons: Hover com opacity 90%, disabled com opacity 50%
  - Agent cards: Hover com lift, scale de ícone, e border highlight
  - Chat input: Focus sem ring visível, integrado ao design
  - Typing: Animação de 3 dots com stagger
  
- **Icon Selection**: 
  - Heart para Sofia (empática)
  - User/Briefcase para Carlos (profissional)
  - Sparkle para Júlia (positiva)
  - Brain/User para Ana (reflexiva)
  - Scales/User para Lucas (equilibrado)
  - TrendUp para métricas e conversões
  - Phone, Envelope, WhatsappLogo para contato
  - Warning para alertas e urgência
  - Clock para atividade recente
  - CheckCircle para confirmações, benefícios e status positivo
  - XCircle para desativar/remover
  - Lightbulb para orientação
  - ShieldCheck para segurança e autenticação
  - X para fechar/voltar
  - ArrowRight para next/continuar
  - PaperPlaneTilt para enviar mensagem
  - Eye para visualizar detalhes
  
- **Spacing**: 
  - Padding cards: p-6 a p-8 para sensação de amplitude
  - Gap entre agent cards: gap-6
  - Sections landing: py-20 a py-32 para espaçamento generoso
  - Container: max-w-5xl para landing, max-w-3xl para chat (foco)
  - Mensagens chat: space-y-6 para respiração
  
- **Mobile**: 
  - Agent cards: Grid 3 colunas → 1 coluna
  - Hero typography: text-8xl → text-5xl
  - Chat: Mantém tela cheia, ajusta apenas padding
  - Input: Ajusta para viewport móvel
  - Touch targets: Mínimo 44px em todos botões
