# Planning Guide

Um assistente virtual de pré-atendimento psicológico que acolhe usuários através de conversas empáticas, avalia suas necessidades emocionais e facilita o encaminhamento para atendimento profissional quando apropriado.

**Experience Qualities**:
1. **Acolhedor** - O usuário deve sentir-se ouvido e compreendido sem julgamentos, criando um espaço seguro para expressar suas emoções
2. **Humano** - Apesar de ser uma IA, a interação deve ser natural, calorosa e empática, evitando respostas robóticas ou excessivamente técnicas
3. **Confiável** - O design e comunicação devem transmitir profissionalismo e seriedade, garantindo que o usuário se sinta seguro ao compartilhar informações pessoais

**Complexity Level**: Light Application (multiple features with basic state)
  - O app possui funcionalidades de chat com IA, histórico de conversas e sistema de encaminhamento, mas mantém a simplicidade de uso como prioridade

## Essential Features

### Chat com IA Psicológica
- **Funcionalidade**: Interface de chat onde o usuário conversa com assistente de IA treinado para acolhimento psicológico inicial
- **Purpose**: Fornecer suporte emocional imediato e avaliar a necessidade de encaminhamento profissional
- **Trigger**: Usuário acessa o app e inicia uma nova conversa ou continua conversa existente
- **Progression**: Usuário digita mensagem → IA processa e responde com empatia → Conversa flui naturalmente → IA identifica padrões que sugerem necessidade de atendimento profissional
- **Success criteria**: Respostas são empáticas, coerentes com contexto anterior, e identificam corretamente situações que necessitam encaminhamento

### Sistema de Avaliação e Encaminhamento
- **Funcionalidade**: IA avalia sutilmente o estado emocional do usuário durante conversa e sugere encaminhamento quando apropriado
- **Purpose**: Garantir que casos que necessitam de atenção profissional sejam identificados e encaminhados adequadamente
- **Trigger**: Durante a conversa, quando IA identifica sinais de necessidade de suporte profissional
- **Progression**: IA detecta padrões preocupantes → Sugere de forma sensível o encaminhamento → Usuário aceita → Formulário de contato é apresentado → Informações são enviadas ao psicólogo
- **Success criteria**: Encaminhamentos são oferecidos no momento apropriado sem alarmar o usuário, formulário é simples de preencher

### Histórico de Conversas
- **Funcionalidade**: Armazena conversas anteriores permitindo continuidade do acolhimento
- **Purpose**: Permitir que usuário retome conversas e que IA tenha contexto de interações anteriores
- **Trigger**: Usuário retorna ao app e acessa histórico de conversas
- **Progression**: Usuário abre app → Visualiza conversas anteriores → Seleciona conversa → Continua de onde parou
- **Success criteria**: Conversas são persistidas corretamente e IA mantém contexto ao retomar

### Informações sobre o Psicólogo
- **Funcionalidade**: Seção com informações sobre o profissional, abordagem terapêutica e formas de contato
- **Purpose**: Construir confiança e permitir que usuário conheça o profissional antes de decidir pelo atendimento
- **Trigger**: Usuário clica em "Sobre o Psicólogo" ou recebe sugestão de encaminhamento
- **Progression**: Usuário acessa seção → Lê sobre formação e abordagem → Vê foto profissional → Decide contatar
- **Success criteria**: Informações são claras, transmitem profissionalismo e facilitam decisão de contato

## Edge Case Handling

- **Crise Emocional Grave**: Se usuário expressar pensamentos suicidas ou crise severa, IA imediatamente fornece números de emergência (CVV 188) e encoraja busca por ajuda imediata
- **Conversas Inadequadas**: Se usuário tentar conversas não relacionadas a bem-estar emocional, IA gentilmente redireciona para o propósito do app
- **Limites da IA**: IA comunica claramente que não substitui atendimento profissional e tem limitações
- **Privacidade**: Aviso claro sobre confidencialidade e limites do armazenamento de dados
- **Sem Resposta do Usuário**: Se conversa ficar inativa, mensagem suave perguntando se usuário gostaria de continuar depois

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

Animações extremamente sutis e suaves que comunicam cuidado e atenção, evitando movimentos bruscos que possam causar desconforto emocional - prioriza transições gentis que guiam sem distrair.

- **Purposeful Meaning**: Movimentos lentos e orgânicos que evocam respiração calma, reforçando a atmosfera terapêutica de presença e atenção
- **Hierarchy of Movement**: 
  - Entrada de mensagens da IA com fade-in suave (300ms) para simular pensamento empático
  - Transições entre telas com slides suaves (400ms)
  - Micro-interações em botões com subtle scale (100ms)
  - Indicador de digitação com animação pulsante orgânica

## Component Selection

- **Components**: 
  - Card para mensagens do chat e seções informativas
  - ScrollArea para área de conversação
  - Button (variant default para ações primárias, outline para secundárias, ghost para navegação)
  - Input e Textarea para formulários de encaminhamento
  - Avatar para representar usuário e IA
  - Dialog para informações importantes e confirmações
  - Badge para indicadores de status
  - Separator para divisões visuais suaves
  
- **Customizations**: 
  - Componente ChatMessage customizado com layout diferenciado para mensagens do usuário vs IA
  - Typing indicator animado customizado
  - Welcome screen com introdução calorosa
  
- **States**: 
  - Buttons com hover sutil (lift de 2px e leve brightening)
  - Inputs com focus ring suave em primary color
  - Messages com estado "enviando" com opacity reduzida
  - IA avatar pulsa suavemente quando "pensando"
  
- **Icon Selection**: 
  - ChatCircle para chat
  - User para perfil
  - PaperPlaneTilt para enviar
  - Warning para alertas importantes
  - Heart para elementos de cuidado/apoio
  - Phone para contato
  
- **Spacing**: 
  - Padding interno de cards: p-6
  - Gap entre mensagens: gap-3
  - Margin entre seções: mb-8
  - Container max-width: max-w-4xl
  
- **Mobile**: 
  - Chat ocupa altura total em mobile
  - Botões fixos no bottom em mobile
  - Sidebar com informações se torna drawer bottom-sheet
  - Font-sizes reduzem 1-2px em mobile
  - Touch targets mínimo 44px
