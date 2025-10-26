import { Lead, Conversation } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Envelope, 
  Phone, 
  WhatsappLogo,
  Clock,
  Warning,
  ChatCircle,
  Calendar,
  Heart
} from '@phosphor-icons/react'

interface LeadDetailDialogProps {
  lead: Lead
  conversation?: Conversation
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (status: Lead['status']) => void
}

export function LeadDetailDialog({ 
  lead, 
  conversation, 
  open, 
  onOpenChange,
  onUpdateStatus 
}: LeadDetailDialogProps) {
  const getUrgencyBadge = (score: number) => {
    if (score >= 80) return { label: 'Crítico', variant: 'destructive' as const }
    if (score >= 60) return { label: 'Alto', variant: 'default' as const }
    if (score >= 40) return { label: 'Moderado', variant: 'secondary' as const }
    return { label: 'Baixo', variant: 'outline' as const }
  }

  const urgency = getUrgencyBadge(lead.score)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
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

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
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
                      <p className="text-xs text-muted-foreground">Contato Preferido</p>
                      <p className="font-medium capitalize">{lead.data.preferredContact}</p>
                    </div>
                  </div>
                )}

                {lead.data.age && (
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Idade</p>
                      <p className="font-medium">{lead.data.age} anos</p>
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

                {lead.data.budget && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Orçamento</p>
                    <p className="text-foreground">{lead.data.budget}</p>
                  </div>
                )}

                {lead.data.insuranceProvider && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Plano de Saúde</p>
                    <p className="text-foreground">{lead.data.insuranceProvider}</p>
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

            {conversation && conversation.messages.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ChatCircle size={20} weight="duotone" />
                  Histórico da Conversa
                </h3>
                
                <div className="space-y-3 bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {conversation.messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`text-xs font-medium ${message.role === 'user' ? 'text-primary' : 'text-secondary-foreground'}`}>
                        {message.role === 'user' ? 'Usuário' : 'Assistente'}
                      </div>
                      <div className={`rounded-lg px-3 py-2 max-w-[85%] ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card border border-border'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        <Separator />

        <div className="px-6 py-4">
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
      </DialogContent>
    </Dialog>
  )
}
