import { Lead, Conversation } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Envelope, 
  Phone, 
  WhatsappLogo,
  Clock,
  ChatCircle,
  Heart,
  MapPin,
  CurrencyDollar,
  VideoCamera,
  PaperPlaneRight,
  Robot,
  Calendar as CalendarIcon
} from '@phosphor-icons/react'
import { useEffect, useState, useRef } from 'react'
import { getLeadMatches, toggleAI, sendAdminMessage } from '@/lib/api-client'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { SchedulingDialog } from './SchedulingDialog'

interface LeadDetailDialogProps {
  lead: Lead
  conversation?: Conversation
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (status: Lead['status']) => void
}

interface MatchScore {
  agentId: string
  score: number
  reasons: string[]
  agent?: {
    name: string
    priceMin?: number
    city?: string
    modalities?: string[]
  }
}

export function LeadDetailDialog({ 
  lead, 
  conversation, 
  open, 
  onOpenChange,
  onUpdateStatus 
}: LeadDetailDialogProps) {
  const queryClient = useQueryClient()
  const [matches, setMatches] = useState<MatchScore[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && lead.id) {
      setLoadingMatches(true)
      getLeadMatches(lead.id)
        .then(matches => setMatches(matches))
        .catch(err => logger.error('Failed to fetch matches', { error: err }))
        .finally(() => setLoadingMatches(false))
    }
  }, [open, lead.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages])

  const handleToggleAI = async (active: boolean) => {
    if (!conversation) return
    try {
      await toggleAI(conversation.id, active)
      queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] })
      toast.success(`IA ${active ? 'ativada' : 'pausada'} com sucesso`)
    } catch (error) {
      toast.error('Erro ao alterar status da IA')
    }
  }

  const handleSendMessage = async () => {
    if (!conversation || !messageInput.trim()) return
    
    setSendingMessage(true)
    try {
      await sendAdminMessage(conversation.id, messageInput)
      setMessageInput('')
      queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] })
    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSendingMessage(false)
    }
  }

  const getUrgencyBadge = (score: number) => {
    if (score >= 80) return { label: 'Crítico', variant: 'destructive' as const }
    if (score >= 60) return { label: 'Alto', variant: 'default' as const }
    if (score >= 40) return { label: 'Moderado', variant: 'secondary' as const }
    return { label: 'Baixo', variant: 'outline' as const }
  }

  const urgency = getUrgencyBadge(lead.score)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-serif mb-2">
                {lead.data.name || 'Lead sem nome'}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={urgency.variant}>{urgency.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  Score: {lead.score}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalhes do Lead</TabsTrigger>
              <TabsTrigger value="chat">Conversa Completa</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User size={20} weight="duotone" />
                    Informações de Contato
                  </h3>
                  
                  <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                    {lead.data.email && (
                      <div className="flex items-center gap-3">
                        <Envelope size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{lead.data.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {lead.data.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Telefone</p>
                          <p className="font-medium">{lead.data.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {lead.data.preferredContact && (
                      <div className="flex items-center gap-3">
                        {lead.data.preferredContact === 'whatsapp' && <WhatsappLogo size={20} className="text-muted-foreground" />}
                        {lead.data.preferredContact === 'email' && <Envelope size={20} className="text-muted-foreground" />}
                        {lead.data.preferredContact === 'phone' && <Phone size={20} className="text-muted-foreground" />}
                        <div>
                          <p className="text-xs text-muted-foreground">Preferência de Contato</p>
                          <p className="font-medium capitalize">{lead.data.preferredContact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MapPin size={20} weight="duotone" />
                    Preferências de Atendimento
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                    {(lead.data.city || lead.data.state || lead.data.cep) && (
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Localização</p>
                          <p className="font-medium">
                            {[lead.data.neighborhood, lead.data.city, lead.data.state].filter(Boolean).join(', ')}
                            {lead.data.cep && <span className="block text-xs text-muted-foreground">CEP: {lead.data.cep}</span>}
                          </p>
                        </div>
                      </div>
                    )}

                    {lead.data.modality && (
                      <div className="flex items-center gap-3">
                        <VideoCamera size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Modalidade</p>
                          <p className="font-medium capitalize">{lead.data.modality}</p>
                        </div>
                      </div>
                    )}

                    {(lead.data.budget || lead.data.budgetMax) && (
                      <div className="flex items-center gap-3">
                        <CurrencyDollar size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Orçamento</p>
                          <p className="font-medium">
                            {lead.data.budgetMax ? `Até R$ ${lead.data.budgetMax}` : lead.data.budget}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Heart size={20} weight="duotone" />
                    Informações Clínicas
                  </h3>
                  
                  <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                    {lead.data.mainConcern && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Preocupação Principal</p>
                        <p className="text-foreground">{lead.data.mainConcern}</p>
                      </div>
                    )}
                    
                    {lead.data.emotionalState && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estado Emocional</p>
                        <Badge variant={
                          lead.data.emotionalState === 'critical' ? 'destructive' :
                          lead.data.emotionalState === 'high' ? 'default' :
                          lead.data.emotionalState === 'moderate' ? 'secondary' : 'outline'
                        }>
                          {lead.data.emotionalState === 'critical' ? 'Crítico' :
                           lead.data.emotionalState === 'high' ? 'Alto' :
                           lead.data.emotionalState === 'moderate' ? 'Moderado' : 'Baixo'}
                        </Badge>
                      </div>
                    )}
                    
                    {lead.data.symptoms && lead.data.symptoms.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Sintomas Relatados</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.data.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {lead.data.duration && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duração</p>
                        <p className="text-foreground">{lead.data.duration}</p>
                      </div>
                    )}
                    
                    {lead.data.previousTherapy !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Terapia Anterior</p>
                        <p className="text-foreground">{lead.data.previousTherapy ? 'Sim' : 'Não'}</p>
                      </div>
                    )}

                    {lead.data.availability && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Disponibilidade</p>
                        <p className="text-foreground">{lead.data.availability}</p>
                      </div>
                    )}
                  </div>
                </div>

                {lead.suggestedProfessional && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <User size={20} weight="duotone" />
                      Profissional Sugerido
                    </h3>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-foreground">{lead.suggestedProfessional}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Heart size={20} weight="duotone" />
                    Psicólogos Compatíveis
                  </h3>
                  
                  {loadingMatches ? (
                    <div className="text-center py-4 text-muted-foreground">Buscando compatibilidade...</div>
                  ) : matches.length > 0 ? (
                    <div className="space-y-3">
                      {matches.map((match) => (
                        <div key={match.agentId} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-primary">Psicólogo (ID: {match.agentId.substring(0, 8)}...)</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                                  {match.score}% Compatível
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {match.reasons.map((reason, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary/50" />
                                {reason}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded-lg">
                      Nenhum psicólogo compatível encontrado.
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Clock size={20} weight="duotone" />
                    Informações do Lead
                  </h3>
                  
                  <div className="space-y-2 bg-muted/30 rounded-lg p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Criado em:</span>
                      <span className="font-medium">{new Date(lead.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Atualizado em:</span>
                      <span className="font-medium">{new Date(lead.updatedAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última atividade:</span>
                      <span className="font-medium">{new Date(lead.lastActivity).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="px-6 py-4 border-t">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus('contacted')}
                  disabled={lead.status === 'contacted'}
                >
                  Marcar como Contatado
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus('scheduled')}
                  disabled={lead.status === 'scheduled'}
                >
                  Marcar como Agendado
                </Button>
                <Button
                  onClick={() => onUpdateStatus('converted')}
                  disabled={lead.status === 'converted'}
                  className="bg-primary"
                >
                  Marcar como Convertido
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Robot size={20} className={conversation?.aiActive ? "text-green-500" : "text-muted-foreground"} />
                <div>
                  <p className="text-sm font-medium">Assistente IA</p>
                  <p className="text-xs text-muted-foreground">
                    {conversation?.aiActive ? 'Ativo e respondendo' : 'Pausado (Intervenção Humana)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-toggle" className="text-sm">IA Ativa</Label>
                <Switch 
                  id="ai-toggle" 
                  checked={conversation?.aiActive}
                  onCheckedChange={handleToggleAI}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversation?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[10px] opacity-70 block mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Enviar mensagem como atendente..."
                  disabled={sendingMessage}
                />
                <Button type="submit" disabled={sendingMessage || !messageInput.trim()}>
                  <PaperPlaneRight size={20} />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
