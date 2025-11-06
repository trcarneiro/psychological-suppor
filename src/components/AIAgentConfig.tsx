import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { AIAgentConfig as AIAgentConfigType } from '@/lib/types'
import {
  Robot,
  FloppyDisk,
  ArrowCounterClockwise,
  CheckCircle,
  Lightning,
  Gauge,
  ChatCentered,
  Sparkle,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchAiConfig, updateAiConfig } from '@/lib/api-client'

const DEFAULT_CONFIG: AIAgentConfigType = {
  id: 'default-ai-agent',
  name: 'Assistente Virtual de Acolhimento',
  personality: 'Empático e Profissional',
  description: 'Assistente virtual padrão para acolhimento psicológico inicial',
  model: 'gpt-4o',
  systemPrompt: `Você é um assistente virtual especializado em acolhimento psicológico inicial. Seu papel é:

1. Acolher a pessoa com empatia e sem julgamentos
2. Fazer perguntas abertas para entender a situação
3. Coletar informações importantes (nome, contato, principais preocupações)
4. Avaliar a urgência do caso
5. Oferecer encaminhamento para psicólogo quando apropriado

Diretrizes importantes:
- Seja empático, caloroso e acolhedor
- Use linguagem simples e acessível
- Nunca ofereça diagnósticos ou tratamentos
- Valide os sentimentos da pessoa
- Mantenha conversas focadas e objetivas
- Sempre que possível, colete: nome, contato (email/telefone), preocupação principal
- Pergunte sobre urgência, sintomas, e histórico de terapia
- Caso identifique risco, priorize encaminhamento imediato

Lembre-se: você não é psicólogo, apenas faz o primeiro acolhimento.`,
  greeting: 'Olá! Seja bem-vindo(a) ao nosso espaço de acolhimento. Meu nome é Sofia e estou aqui para te ouvir e ajudar. Como você está se sentindo hoje?',
  conversationStyle: 'empathetic',
  maxMessageLength: 500,
  responseDelay: 1500,
  collectDataFields: [
    'name',
    'email',
    'phone',
    'mainConcern',
    'emotionalState',
    'urgencyLevel',
    'symptoms',
    'previousTherapy',
    'preferredContact',
  ],
  autoReferralThreshold: 7,
  temperature: 0.8,
  active: true,
  color: 'from-blue-500 to-purple-500',
  icon: 'Heart',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const CONVERSATION_STYLES = {
  empathetic: {
    label: 'Empático e Acolhedor',
    description: 'Tom caloroso, validação de sentimentos, linguagem suave',
  },
  professional: {
    label: 'Profissional e Direto',
    description: 'Tom formal, objetivo, foco em coleta de informações',
  },
  friendly: {
    label: 'Amigável e Descontraído',
    description: 'Tom casual, próximo, conversação natural',
  },
  custom: {
    label: 'Personalizado',
    description: 'Defina manualmente no prompt do sistema',
  },
}

export function AIAgentConfig() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<AIAgentConfigType>(DEFAULT_CONFIG)
  const [hasChanges, setHasChanges] = useState(false)

  const {
    data: config,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ai-agent-config'],
    queryFn: fetchAiConfig,
    retry: 1,
  })

  useEffect(() => {
    if (config) {
      setFormData({
        ...DEFAULT_CONFIG,
        ...config,
        createdAt: config.createdAt ?? Date.now(),
        updatedAt: config.updatedAt ?? Date.now(),
      })
      setHasChanges(false)
    }
  }, [config])

  useEffect(() => {
    if (!config && !isLoading && !isError) {
      setFormData({
        ...DEFAULT_CONFIG,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      setHasChanges(true)
    }
  }, [config, isLoading, isError])

  const saveMutation = useMutation({
    mutationFn: updateAiConfig,
    onSuccess: updated => {
      queryClient.setQueryData(['ai-agent-config'], updated)
      setFormData(updated)
      setHasChanges(false)
      toast.success('Configurações salvas com sucesso!')
    },
    onError: err => {
      const message = err instanceof Error ? err.message : 'Não foi possível salvar as configurações.'
      toast.error(message)
    },
  })

  const handleSave = () => {
    saveMutation.mutate({
      ...formData,
      createdAt: formData.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    })
  }

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      setFormData({
        ...DEFAULT_CONFIG,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      setHasChanges(true)
      toast.success('Configurações restauradas. Clique em "Salvar" para aplicar.')
    }
  }

  const updateField = <K extends keyof AIAgentConfigType>(
    field: K,
    value: AIAgentConfigType[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Robot size={28} weight="duotone" />
            Configuração do Agente de IA
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure como o assistente virtual se comporta durante o atendimento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <ArrowCounterClockwise size={16} />
            Restaurar Padrão
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="gap-2"
          >
            <FloppyDisk size={16} />
            {saveMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="p-4 bg-accent/10 border-accent">
          <div className="flex items-center gap-2 text-accent-foreground">
            <Lightning size={20} weight="fill" />
            <p className="text-sm font-medium">
              Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicar.
            </p>
          </div>
        </Card>
      )}

      {isLoading && (
        <Card className="p-6 flex items-center justify-center text-sm text-muted-foreground">
          Carregando configurações do agente...
        </Card>
      )}

      {isError && (
        <Card className="p-6 bg-destructive/10 border-destructive text-destructive">
          <p className="font-semibold">Não foi possível carregar as configurações atuais.</p>
          <p className="text-sm mt-2">
            {error instanceof Error ? error.message : 'Tente novamente mais tarde.'}
          </p>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['ai-agent-config'] })} className="mt-4">
            Tentar novamente
          </Button>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-6 pr-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Ex: Assistente Virtual Sofia"
                />
                <p className="text-xs text-muted-foreground">
                  Nome exibido para os usuários durante o atendimento
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Mensagem de Saudação</Label>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={e => updateField('greeting', e.target.value)}
                  placeholder="Primeira mensagem enviada ao iniciar uma conversa..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Primeira mensagem que o agente envia ao usuário
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Agente Ativo</Label>
                  <p className="text-xs text-muted-foreground">
                    Ativa ou desativa o agente de IA
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={checked => updateField('active', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkle size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Modelo e Comportamento</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo de IA</Label>
                <Select
                  value={formData.model}
                  onValueChange={value => updateField('model', value as AIAgentConfigType['model'])}
                >
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">GPT-4o</span>
                        <span className="text-xs text-muted-foreground">
                          Mais inteligente, melhor compreensão de contexto
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4o-mini">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">GPT-4o Mini</span>
                        <span className="text-xs text-muted-foreground">
                          Mais rápido e econômico, bom para tarefas simples
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversationStyle">Estilo de Conversa</Label>
                <Select
                  value={formData.conversationStyle}
                  onValueChange={value =>
                    updateField('conversationStyle', value as AIAgentConfigType['conversationStyle'])
                  }
                >
                  <SelectTrigger id="conversationStyle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONVERSATION_STYLES).map(([key, style]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{style.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {style.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Criatividade (Temperature)</Label>
                  <span className="text-sm text-muted-foreground">{formData.temperature}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[formData.temperature]}
                  onValueChange={value => updateField('temperature', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  0 = Mais previsível e consistente | 1 = Mais criativo e variado
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ChatCentered size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Prompt do Sistema</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">Instruções para o Agente</Label>
              <Textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={e => updateField('systemPrompt', e.target.value)}
                placeholder="Defina como o agente deve se comportar..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Define o comportamento, personalidade e diretrizes do agente de IA
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gauge size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Configurações Avançadas</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxMessageLength">Tamanho Máximo da Mensagem</Label>
                <Input
                  id="maxMessageLength"
                  type="number"
                  value={formData.maxMessageLength}
                  onChange={e => updateField('maxMessageLength', parseInt(e.target.value) || 500)}
                  min={100}
                  max={2000}
                />
                <p className="text-xs text-muted-foreground">
                  Número máximo de caracteres por resposta do agente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseDelay">Delay de Resposta (ms)</Label>
                <Input
                  id="responseDelay"
                  type="number"
                  value={formData.responseDelay}
                  onChange={e => updateField('responseDelay', parseInt(e.target.value) || 1000)}
                  min={0}
                  max={5000}
                  step={500}
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de espera simulado antes de exibir a resposta (mais natural)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoReferralThreshold">
                    Limite para Encaminhamento Automático
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.autoReferralThreshold}/10
                  </span>
                </div>
                <Slider
                  id="autoReferralThreshold"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.autoReferralThreshold]}
                  onValueChange={value => updateField('autoReferralThreshold', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Nível de urgência a partir do qual o agente sugere encaminhamento imediato
                </p>
              </div>

              <div className="space-y-2">
                <Label>Campos de Dados a Coletar</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border border-border rounded-lg bg-muted/30">
                  {[
                    { key: 'name', label: 'Nome' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Telefone' },
                    { key: 'mainConcern', label: 'Preocupação Principal' },
                    { key: 'emotionalState', label: 'Estado Emocional' },
                    { key: 'urgencyLevel', label: 'Nível de Urgência' },
                    { key: 'symptoms', label: 'Sintomas' },
                    { key: 'previousTherapy', label: 'Terapia Anterior' },
                    { key: 'preferredContact', label: 'Contato Preferido' },
                  ].map(field => (
                    <div key={field.key} className="flex items-center gap-2">
                      <Switch
                        id={field.key}
                        checked={formData.collectDataFields.includes(field.key)}
                        onCheckedChange={checked => {
                          const newFields = checked
                            ? [...formData.collectDataFields, field.key]
                            : formData.collectDataFields.filter(f => f !== field.key)
                          updateField('collectDataFields', newFields)
                        }}
                      />
                      <Label htmlFor={field.key} className="text-sm cursor-pointer">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dados que o agente tentará coletar durante a conversa
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
