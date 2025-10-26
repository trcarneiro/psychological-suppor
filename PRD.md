# Planning Guide

Uma plataforma completa de pré-atendimento psicológico com landing page profissional, IA conversacional para acolhimento inicial, e dashboard CRM para gestão de leads e conversões.

**Experience Qualities**:
1. **Profissional** - Design de landing page que transmite credibilidade e seriedade, posicionando o serviço como solução confiável em saúde mental
2. **Acolhedor** - A IA oferece conversas empáticas que fazem o usuário sentir-se ouvido e compreendido, criando um espaço seguro para expressar emoções
3. **Inteligente** - Sistema automatizado de coleta de dados e qualificação de leads que mapeia informações sutilmente durante a conversa para otimizar conversões

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - O app possui landing page, chat com IA, extração inteligente de dados, CRM completo com gestão de leads, sistema de scoring e autenticação administrativa

## Essential Features

### Landing Page Profissional
- **Funcionalidade**: Página inicial moderna, dinâmica e persuasiva que apresenta o serviço de forma impactante com animações sutis e design atraente
- **Purpose**: Converter visitantes em usuários do chat através de um design envolvente que inspira confiança e encoraja ação imediata
- **Trigger**: Usuário acessa o site pela primeira vez
- **Progression**: Usuário visualiza hero section animada → Lê sobre como funciona com cards interativos → Vê benefícios do serviço com hover effects → Sente urgência no CTA final → Clica para iniciar conversa
- **Success criteria**: Design moderno com animações framer-motion, gradientes atrativos, CTAs destacados com hover effects, badges informativos, taxa de conversão elevada para chat

### Chat com IA (Primeiro Atendimento Obrigatório)
- **Funcionalidade**: Interface de chat onde **o agente de IA sempre faz o primeiro atendimento**, conversando empaticamente enquanto coleta dados estruturados do lead sutilmente antes de encaminhar para um psicólogo humano
- **Purpose**: Fornecer acolhimento inicial padronizado, qualificar leads com informações valiosas e preparar o terreno para o atendimento profissional
- **Trigger**: Usuário clica em "Conversar Agora" na landing page
- **Progression**: Usuário inicia chat → **IA faz acolhimento inicial obrigatório** → Conversa flui naturalmente → IA extrai dados (nome, contato, preocupação, urgência) → Sistema calcula score do lead → IA sugere encaminhamento para psicólogo cadastrado → Sistema seleciona profissional adequado
- **Success criteria**: 100% dos atendimentos começam pela IA, dados extraídos com precisão, usuário não percebe coleta forçada, conversas naturais e empáticas, encaminhamento apropriado para agente humano

### Cadastro e Gestão de Agentes (Psicólogos)
- **Funcionalidade**: Sistema administrativo completo para cadastrar, editar, ativar/desativar e gerenciar psicólogos disponíveis para atendimento
- **Purpose**: Manter base de profissionais atualizada para encaminhamento inteligente de leads qualificados pela IA
- **Trigger**: Administrador acessa aba "Agentes" no dashboard
- **Progression**: Admin clica em "Adicionar Agente" → Preenche dados completos (nome, CRP, especialidades, abordagem, experiência, bio, contato, disponibilidade, valores, convênios) → Salva cadastro → Agente fica disponível para matching com leads → Sistema pode sugerir profissional baseado em especialidades e necessidades do lead
- **Success criteria**: Interface intuitiva de CRUD, todos campos relevantes capturados, busca e filtros funcionais, status ativo/inativo gerenciável, dados persistidos corretamente

### Dashboard CRM Administrativo
- **Funcionalidade**: Painel completo de gestão com duas abas principais: Leads (gestão de pipeline) e Agentes (gestão de profissionais)
- **Purpose**: Permitir que administrador gerencie tanto o pipeline de leads quanto a equipe de psicólogos disponíveis
- **Trigger**: Administrador faz login com senha
- **Progression**: Admin acessa → Visualiza estatísticas gerais → Alterna entre aba Leads e Agentes → Filtra leads por status/prioridade → Gerencia cadastro de profissionais → Abre detalhes de lead → Vê conversa completa e dados extraídos → Atualiza status → Marca como convertido
- **Success criteria**: Interface clara com navegação por tabs, dados organizados, fácil gestão de pipeline e profissionais, métricas de conversão visíveis

### Sistema de Scoring e Priorização
- **Funcionalidade**: Algoritmo automático que calcula score de leads baseado em urgência, estado emocional e dados coletados
- **Purpose**: Priorizar leads com maior necessidade e potencial de conversão para otimizar tempo do profissional
- **Trigger**: Dados são extraídos da conversa pela IA
- **Progression**: IA extrai dados → Sistema calcula score (urgência × estado emocional) → Lead é classificado (crítico/alto/moderado/baixo) → Dashboard exibe leads ordenados por prioridade
- **Success criteria**: Scoring reflete real urgência, leads críticos destacados, priorização eficaz

### Extração Automatizada de Dados do Lead
- **Funcionalidade**: IA analisa conversa e extrai automaticamente dados estruturados (nome, contato, idade, preocupação, sintomas, orçamento, disponibilidade)
- **Purpose**: Eliminar trabalho manual de qualificação e ter informações completas para personalizar abordagem profissional
- **Trigger**: Após 4+ mensagens do usuário na conversa
- **Progression**: Conversa acumula contexto → IA analisa mensagens → Extrai dados estruturados via LLM → Salva em leadData → Exibe no dashboard
- **Success criteria**: Extração precisa, dados relevantes identificados, atualizações incrementais conforme conversa avança

## Edge Case Handling

- **Primeiro Atendimento Sempre pela IA**: 100% dos usuários DEVEM passar pelo agente de IA primeiro. Nenhum atendimento humano inicia sem qualificação prévia pela IA. A IA conduz conversa completa e só então sugere encaminhamento
- **Crise Emocional Grave**: Se usuário expressar pensamentos suicidas ou crise severa, IA imediatamente fornece números de emergência (CVV 188) e marca lead como crítico no dashboard
- **Conversas Inadequadas**: Se usuário tentar conversas não relacionadas a bem-estar emocional, IA gentilmente redireciona para o propósito do app
- **Limites da IA**: IA comunica claramente que não substitui atendimento profissional e tem limitações
- **Privacidade de Dados**: Dados são armazenados localmente, acesso ao dashboard requer autenticação
- **Dados Incompletos**: Dashboard exibe "não informado" para dados não coletados, permite admin adicionar notas manualmente
- **Sem Resposta do Usuário**: Se conversa ficar inativa, mensagem suave perguntando se usuário gostaria de continuar depois
- **Múltiplos Acessos Admin**: Senha simples para demonstração, com aviso de que em produção deveria ter autenticação robusta
- **Agentes Inativos**: Sistema não sugere agentes marcados como inativos, permitindo gerenciar disponibilidade sem deletar cadastros
- **Matching de Especialidades**: Sistema pode sugerir agente mais adequado baseado nas especialidades cadastradas e preocupação principal do lead

## Design Direction

O design deve evocar calma, segurança e profissionalismo terapêutico - utilizando paleta suave que remete a ambientes acolhedores de consultório, com interface minimalista que não sobrecarrega emocionalmente o usuário já vulnerável, evocando sentimentos de serenidade, confiança e cuidado atencioso.

## Color Selection

Paleta Análoga com tons suaves de azul e verde que evocam tranquilidade, combinados com neutros quentes para acolhimento.

- **Primary Color**: Azul sereno suave (representa confiança, calma e profissionalismo terapêutico)
- **Secondary Colors**: Verde menta claro (esperança e renovação) e cinza quente (neutralidade acolhedora)
- **Accent Color**: Coral suave para CTAs importantes (transmite calor humano sem ser agressivo)
- **Foreground/Background Pairings**:
  - Background (Bege muito claro oklch(0.97 0.01 85)): Texto principal cinza escuro (oklch(0.25 0.01 260)) - Ratio 12.1:1 ✓
  - Card (Branco oklch(1 0 0)): Texto principal cinza escuro (oklch(0.25 0.01 260)) - Ratio 14.8:1 ✓
  - Primary (Azul sereno oklch(0.55 0.08 240)): Texto branco (oklch(0.99 0 0)) - Ratio 5.2:1 ✓
  - Secondary (Verde menta oklch(0.88 0.04 160)): Texto cinza escuro (oklch(0.25 0.01 260)) - Ratio 10.5:1 ✓
  - Accent (Coral suave oklch(0.70 0.12 35)): Texto branco (oklch(0.99 0 0)) - Ratio 4.7:1 ✓
  - Muted (Cinza quente oklch(0.93 0.01 85)): Texto cinza médio (oklch(0.50 0.01 260)) - Ratio 5.8:1 ✓

## Font Selection

Tipografia deve transmitir profissionalismo caloroso e legibilidade excepcional, utilizando Inter para interface (moderna e acessível) e Crimson Pro para títulos (humanista e acolhedora).

- **Typographic Hierarchy**:
  - H1 (Título Principal): Crimson Pro SemiBold/32px/tight letter-spacing para criar presença calorosa
  - H2 (Seções): Inter SemiBold/24px/normal spacing para clareza estrutural
  - H3 (Subtítulos): Inter Medium/18px/normal spacing
  - Body (Mensagens Chat): Inter Regular/16px/relaxed line-height (1.6) para leitura confortável
  - Small (Timestamps): Inter Regular/14px/subtle color para informação secundária
  - Button Text: Inter Medium/15px/slight letter-spacing para clareza em ações

## Animations

Animações estratégicas e envolventes que comunicam modernidade e guiam o usuário naturalmente através da jornada, criando momentos de encanto que incentivam a conversão sem comprometer a performance.

- **Purposeful Meaning**: Movimentos fluidos com framer-motion que evocam sensação de cuidado profissional, com elementos que respondem ao hover e scroll para criar engajamento ativo
- **Hierarchy of Movement**: 
  - Hero section com fade-in sequencial dos elementos (badge → ícone → título → descrição → CTAs) para narrativa visual
  - Cards de benefícios com hover lift e scale para indicar interatividade
  - CTAs principais com gradient animado, bounce no ícone e translate no arrow ao hover
  - Ícone de sparkle com rotação e scale infinito para capturar atenção
  - Scroll-triggered animations nos cards de "Como Funciona" e benefícios com stagger effect
  - Transições entre telas mantêm slides suaves (400ms)

## Component Selection

- **Components**: 
  - Card para mensagens, leads, agentes, seções informativas e estatísticas do dashboard
  - ScrollArea para área de conversação, lista de leads e lista de agentes
  - Button (variant default para ações primárias, outline para secundárias, ghost para navegação)
  - Input e Textarea para formulários, busca e cadastro de agentes
  - Label para campos de formulário
  - Badge para status de leads, prioridades, tags e status de agentes (ativo/inativo)
  - Dialog para detalhes de lead, confirmações e formulário de cadastro de agentes
  - Tabs para alternar entre Leads e Agentes no dashboard, e entre visualizações de leads
  - Select para filtros, mudança de status e campos de seleção
  - Separator para divisões visuais
  - Avatar para representar usuário e IA
  - Switch para campos booleanos (aceita convênios, agente ativo)
  
- **Customizations**: 
  - LandingPage: Seções hero, benefícios, como funciona com gradientes suaves
  - ChatMessage: Layout diferenciado para mensagens do usuário vs IA
  - Dashboard: Cards de estatísticas, navegação por tabs (Leads/Agentes), tabela de leads, sistema de filtros
  - AgentsManagement: CRUD completo de agentes com formulário detalhado, busca, cards de agentes com todas informações
  - LeadDetailDialog: Visualização completa de dados do lead e histórico de conversa
  - AdminLogin: Tela de autenticação simples com validação
  - TypingIndicator: Animação orgânica de digitação
  
- **States**: 
  - Buttons: Hover com subtle lift, estados disabled durante loading
  - Inputs: Focus ring suave em primary color
  - Lead cards: Hover com shadow para indicar clicável
  - Agent cards: Hover para indicar interatividade, badges de status
  - Status badges: Cores diferentes por estado (novo, contatado, convertido, perdido)
  - Score indicators: Cores de urgência (crítico=vermelho, alto=laranja, moderado=azul, baixo=cinza)
  - Agent status: Badge visual indicando ativo (verde) ou inativo (cinza)
  
- **Icon Selection**: 
  - Heart para branding e cuidado emocional
  - ChatCircle para chat e mensagens
  - Users para gestão de leads
  - UserCircle para perfil de agentes e gestão de profissionais
  - TrendUp para métricas e conversões
  - Phone, Envelope, WhatsappLogo para contato
  - Warning para alertas e urgência
  - Clock para atividade recente
  - CheckCircle para confirmações, benefícios e status positivo
  - XCircle para desativar/remover
  - Lightbulb para orientação
  - ShieldCheck para segurança e autenticação
  - SignOut para logout
  - MagnifyingGlass para busca
  - ArrowLeft para navegação de volta
  - Plus para adicionar novos itens (agentes, notas)
  - PencilSimple para editar
  - Trash para excluir
  - Info para informações adicionais
  
- **Spacing**: 
  - Padding interno de cards: p-4 a p-6 dependendo do contexto
  - Gap entre elementos: gap-3 a gap-4
  - Sections da landing page: py-16 a py-20
  - Container max-width: max-w-7xl para dashboard, max-w-4xl para chat
  
- **Mobile**: 
  - Landing page: Grid de 3 colunas vira single column
  - Dashboard: Estatísticas empilham verticalmente, tabela com scroll horizontal
  - Chat: Ocupa altura total, sidebar de info vira drawer
  - Buttons: Touch targets mínimo 44px
  - Typography: Font-sizes ajustam em breakpoints mobile
