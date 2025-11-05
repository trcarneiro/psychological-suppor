# Planning Guide

Uma plataforma moderna e minimalista de pré-atendimento psicológico com múltiplos assistentes virtuais, cada um com personalidade única, e uma seção de blog completa para SEO. O usuário é recebido por uma landing page atraente que apresenta o serviço e permite acesso ao blog com artigos sobre psicologia e saúde mental. Com um clique, pode iniciar conversa com um assistente padrão. Durante a conversa, pode trocar de assistente a qualquer momento através de um menu acessível.

**Experience Qualities**:
1. **Acolhedor** - Landing page que transmite confiança e apresenta o serviço de forma clara, com acesso fácil ao conteúdo educativo
2. **Flexível** - Possibilidade de trocar de assistente durante a conversa conforme a preferência evolui
3. **Imersivo** - Após iniciar, interface de chat sem distrações que cria um espaço seguro para expressar emoções
4. **Educativo** - Blog completo com artigos otimizados para SEO sobre saúde mental e psicologia

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Múltiplos agentes de IA com personalidades distintas, troca dinâmica de agentes, chat imersivo, extração inteligente de dados, CRM completo, gestão de agentes, e blog integrado com sistema de busca e categorização

## Essential Features

### Blog de Conteúdo para SEO
- **Funcionalidade**: Seção completa de blog com artigos sobre psicologia, saúde mental, terapia e bem-estar. Sistema de busca, filtros por categoria, visualização de artigos individuais com formatação markdown, breadcrumbs para navegação hierárquica
- **Purpose**: Melhorar SEO através de conteúdo relevante e breadcrumbs estruturados, educar visitantes, estabelecer autoridade, aumentar tráfego orgânico e conversões, facilitar navegação
- **Trigger**: Usuário clica em "Blog" na landing page ou em botão de acesso ao blog
- **Progression**: Clique no botão → Visualiza lista de artigos com breadcrumbs (Home > Blog) → Pode buscar ou filtrar → Clica em artigo → Lê conteúdo completo com breadcrumbs (Home > Blog > Título do Artigo) → Call-to-action para iniciar conversa
- **Success criteria**: Grid responsivo de cards de artigos, busca funcional, filtros por categoria, artigos com markdown formatado, meta tags SEO, breadcrumbs com schema.org markup, links internos, cards com preview e tempo de leitura, design consistente com o resto do site

### Landing Page de Apresentação
- **Funcionalidade**: Página inicial moderna e atraente que apresenta o serviço, seus benefícios, como funciona, os 5 assistentes disponíveis, e botão de acesso ao blog
- **Purpose**: Gerar confiança e informar o usuário sobre o serviço antes de iniciar, oferecer acesso a conteúdo educativo, reduzindo abandono e aumentando engajamento
- **Trigger**: Usuário acessa o site
- **Progression**: App carrega → Landing page aparece com animações suaves → Usuário lê sobre o serviço ou acessa blog → Clica em "Iniciar Conversa" → É redirecionado para o chat
- **Success criteria**: Design moderno e confiável, informações claras sobre os 5 assistentes, CTAs destacados (chat e blog), animações suaves de entrada, mensagens de segurança e privacidade visíveis

### Início Rápido da Conversa
- **Funcionalidade**: Ao clicar no botão da landing page, usuário inicia conversa instantaneamente com assistente padrão (Lucas - Equilibrado)
- **Purpose**: Após apresentação, permitir início imediato sem fricção adicional (cadastros ou formulários)
- **Trigger**: Usuário clica em "Iniciar Conversa" na landing page
- **Progression**: Clique no botão → Transição suave para tela de chat → Conversa inicia automaticamente com mensagem de boas-vindas do assistente padrão
- **Success criteria**: Transição fluida entre landing e chat, conversa inicia sem cliques adicionais, assistente padrão é acolhedor e versátil

### Troca de Assistente Durante a Conversa
- **Funcionalidade**: Menu dropdown acessível no canto superior direito permite trocar de assistente a qualquer momento durante a conversa
- **Purpose**: Permitir que usuários experimentem diferentes abordagens conforme conhecem melhor suas preferências, sem perder o histórico da conversa
- **Trigger**: Usuário clica no botão "Menu" durante a conversa
- **Progression**: Clica em Menu → Visualiza lista de 5 assistentes com indicador visual → Seleciona novo assistente → Recebe mensagem de transição → Continua conversa com novo assistente
- **Success criteria**: Menu intuitivo, lista clara dos assistentes com cores identificadoras, transição suave entre assistentes, histórico preservado, mensagem de boas-vindas do novo assistente

### Múltiplos Agentes de IA com Personalidades Únicas
- **Funcionalidade**: Sistema com 5 assistentes virtuais pré-cadastrados, cada um com personalidade, abordagem e estilo únicos de atendimento
- **Purpose**: Oferecer diferentes abordagens terapêuticas que o usuário pode experimentar dinamicamente durante a conversa
- **Trigger**: Usuário troca de assistente através do menu
- **Progression**: Seleção no menu → Assistente atual preserva histórico → Novo assistente se apresenta → Continua conversa com novo estilo
- **Success criteria**: 5 agentes com personalidades distintas (Sofia - Empática, Carlos - Objetivo, Júlia - Positiva, Ana - Reflexiva, Lucas - Equilibrado e Padrão), cada um com prompts e comportamentos únicos

### Interface de Chat Imersiva e Sem Distrações
- **Funcionalidade**: Tela cheia de chat com foco total na conversa, tipografia legível, espaçamento generoso, design clean e menu discreto no canto
- **Purpose**: Criar experiência imersiva que permite foco completo na conversa, mas mantém acesso fácil a funcionalidades essenciais
- **Trigger**: Aplicação inicia automaticamente
- **Progression**: App carrega → Chat aparece imediatamente → Mensagem de boas-vindas do assistente → Usuário pode conversar ou trocar de assistente pelo menu
- **Success criteria**: Tela cheia com menu discreto acessível, fonte grande e legível, mensagens espaçadas, animações de entrada suaves, cores do gradiente atualizam conforme agente selecionado

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

- **Blog**: Artigos pré-carregados no código, busca em tempo real, filtros funcionando mesmo sem resultados (mensagem amigável), navegação entre artigo e home com breadcrumbs estruturados para SEO, breadcrumbs sempre visíveis e clicáveis
- **Landing Page**: Botão CTA claramente visível em múltiplos pontos da página para facilitar início, botão de blog sempre acessível
- **Troca de Agente**: Usuário pode trocar entre 5 agentes a qualquer momento, histórico é preservado, nova mensagem de apresentação é adicionada
- **Agente Padrão**: Lucas é o assistente padrão por ter abordagem equilibrada que agrada maioria dos usuários
- **Retorno à Landing**: Não há opção de voltar à landing após iniciar chat (evita interrupção de fluxo emocional)
- **Crise Emocional Grave**: Se usuário expressar pensamentos suicidas ou crise severa, exibir números de emergência (CVV 188) de forma proeminente
- **Conversas Inadequadas**: Agentes gentilmente redirecionam para o propósito do app
- **Limites da IA**: Agentes comunicam que não substituem atendimento profissional
- **Privacidade de Dados**: Dados armazenados localmente via useKV
- **Dados Incompletos**: Dashboard exibe "não informado" para dados não coletados
- **Múltiplos Acessos Admin**: Autenticação simples através do menu durante conversa

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
  - Landing Hero: Fade-in sequencial dos elementos (badge → título → descrição → CTA → features)
  - Feature cards landing: Fade-in com stagger, hover lift sutil (-4px) com transição de 300ms
  - CTA buttons landing: Hover com leve scale (1.02) e shadow increase
  - Agent cards: Hover lift sutil (-8px) com transição de 200ms
  - Chat messages: Slide-in com fade (y: 20 → 0) e scale (0.95 → 1)
  - Typing indicator: Animação de pulso nos dots
  - Gradientes de fundo: Efeitos sutis de blur e glow

## Component Selection

- **Components**: 
  - Card para mensagens, feature cards na landing e estatísticas no dashboard
  - Button (gradientes customizados por agente, CTAs na landing)
  - Badge para status e categorias
  - DropdownMenu para menu de troca de assistente e admin
  - ScrollArea para chat e listas
  - Textarea com auto-resize para input de chat
  
- **Customizations**: 
  - LandingHero: Hero section com título grande (80-96px), feature cards com hover lift, seção "Como Funciona", lista de assistentes, CTAs destacados com gradientes
  - MinimalChatInterface: Tela cheia com menu discreto no topo, mensagens com bolhas arredondadas (rounded-3xl), input flutuante
  - DropdownMenu: Lista de agentes com indicadores de cor, opção de admin separada
  - AgentsManagementPanel (Admin): Grid de cards com gradientes identificadores
  - Mensagens do usuário: Gradiente do agente selecionado
  - Mensagens do assistente: Card com backdrop blur
  - Menu button: Backdrop blur com hover sutil
  
- **States**: 
  - Buttons: Hover com opacity 90%, disabled com opacity 50%
  - Agent cards: Hover com lift, scale de ícone, e border highlight
  - Chat input: Focus sem ring visível, integrado ao design
  - Typing: Animação de 3 dots com stagger
  
- **Icon Selection**: 
  - List para menu dropdown (3 linhas horizontais)
  - User para representar agentes no dropdown
  - Heart para Sofia (empática) no admin
  - Briefcase para Carlos (profissional) no admin
  - Sparkle para Júlia (positiva) no admin
  - Brain para Ana (reflexiva) no admin
  - Scales para Lucas (equilibrado) no admin
  - TrendUp para métricas e conversões
  - Phone, Envelope, WhatsappLogo para contato
  - Warning para alertas e urgência
  - Clock para atividade recente
  - CheckCircle para confirmações, benefícios e status positivo
  - XCircle para desativar/remover
  - Lightbulb para orientação
  - ShieldCheck para segurança e autenticação
  - ArrowRight para next/continuar
  - ArrowLeft para voltar
  - PaperPlaneTilt para enviar mensagem
  - Eye para visualizar detalhes
  - Article para blog e artigos
  - MagnifyingGlass para busca
  - Tag para tags de artigos
  - Calendar para datas de publicação
  
- **Spacing**: 
  - Padding cards: p-6 a p-8 para sensação de amplitude
  - Gap entre agent cards: gap-6
  - Sections landing: py-20 a py-32 para espaçamento generoso
  - Container: max-w-5xl para landing, max-w-3xl para chat (foco)
  - Mensagens chat: space-y-6 para respiração
  
- **Mobile**: 
  - Landing: Hero text ajusta para menor (text-5xl), feature cards em coluna única, padding reduzido
  - Chat: Mantém tela cheia, ajusta apenas padding
  - Menu button: Mantém tamanho adequado para toque (mínimo 44px)
  - Dropdown menu: Ajusta largura para caber na tela
  - Input: Ajusta para viewport móvel
  - Touch targets: Mínimo 44px em todos botões e itens de menu
