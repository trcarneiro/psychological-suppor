import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lead } from '@/lib/types'
import { 
  Users, 
  ChatCircle, 
  TrendUp,
  Phone,
  Envelope,
  WhatsappLogo,
  SignOut,
  MagnifyingGlass,
  Clock,
  CheckCircle,
  Warning,
  UserCircle,
  Robot
} from '@phosphor-icons/react'
import { LeadDetailDialog } from './LeadDetailDialog'
import { AIAgentConfig } from './AIAgentConfig'
import { AgentsManagementPanel } from './AgentsManagementPanel'
import { fetchLeads, updateLeadStatus as apiUpdateLeadStatus, fetchConversation } from '@/lib/api-client'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    data: leads = [],
    isLoading: leadsLoading,
    isError: leadsError,
  } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState('leads')
  
  const { data: selectedConversation } = useQuery({
    queryKey: ['conversation', selectedLead?.conversationId],
    queryFn: () => fetchConversation(selectedLead!.conversationId),
    enabled: !!selectedLead?.conversationId,
  })

  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: Lead['status'] }) => apiUpdateLeadStatus(leadId, status),
  })

  const handleUpdateLeadStatus = (leadId: string, status: Lead['status']) => {
    updateLeadStatusMutation.mutate(
      { leadId, status },
      {
        onSuccess: (updatedLead) => {
          queryClient.invalidateQueries({ queryKey: ['leads'] })
          if (selectedLead?.id === updatedLead.id) {
            setSelectedLead(updatedLead)
          }
        },
      }
    )
  }

  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            lead.data.name?.toLowerCase().includes(query) ||
            lead.data.email?.toLowerCase().includes(query) ||
            lead.data.phone?.toLowerCase().includes(query) ||
            lead.data.mainConcern?.toLowerCase().includes(query) ||
            lead.data.city?.toLowerCase().includes(query) ||
            lead.data.cep?.includes(query)
          )
        }
        
        return true
      })
      .sort((a, b) => b.score - a.score)
  }, [leads, statusFilter, searchQuery])

  const stats = useMemo(() => {
    const total = leads.length
    const newLeads = leads.filter(l => l.status === 'new').length
    const contacted = leads.filter(l => l.status === 'contacted').length
    const converted = leads.filter(l => l.status === 'converted').length
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0'
    
    return { total, newLeads, contacted, converted, conversionRate }
  }, [leads])

  const getStatusBadge = (status: Lead['status']) => {
    const variants: Record<Lead['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      new: { label: 'Novo', variant: 'default' },
      contacted: { label: 'Contatado', variant: 'secondary' },
      scheduled: { label: 'Agendado', variant: 'outline' },
      converted: { label: 'Convertido', variant: 'default' },
      lost: { label: 'Perdido', variant: 'destructive' },
    }
    
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return 'text-destructive'
    if (score >= 60) return 'text-accent'
    if (score >= 40) return 'text-primary'
    return 'text-muted-foreground'
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Dashboard CRM
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestão de leads, conversões e agentes
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/chat')}
            className="gap-2"
          >
            <SignOut size={16} />
            Sair
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="leads" className="gap-2">
                <ChatCircle size={16} />
                Leads
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <UserCircle size={16} />
                Agentes Cadastrados
              </TabsTrigger>
              <TabsTrigger value="ai-config" className="gap-2">
                <Robot size={16} />
                Config IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="flex-1 mt-6 space-y-6 overflow-hidden flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users size={24} className="text-primary" weight="duotone" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total de Leads</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock size={24} className="text-accent" weight="duotone" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.newLeads}</p>
                  <p className="text-sm text-muted-foreground">Novos Leads</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ChatCircle size={24} className="text-secondary-foreground" weight="duotone" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.contacted}</p>
                  <p className="text-sm text-muted-foreground">Em Contato</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendUp size={24} className="text-primary" weight="duotone" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                </Card>
              </div>

              <Card className="p-6 flex-1 flex flex-col min-h-0">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email, telefone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new">Novos</SelectItem>
                      <SelectItem value="contacted">Contatados</SelectItem>
                      <SelectItem value="scheduled">Agendados</SelectItem>
                      <SelectItem value="converted">Convertidos</SelectItem>
                      <SelectItem value="lost">Perdidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="list" className="flex-1 flex flex-col min-h-0">
                  <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="list">Lista</TabsTrigger>
                    <TabsTrigger value="prioritized">Por Prioridade</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list" className="flex-1 mt-4 min-h-0">
                    <ScrollArea className="h-[calc(100vh-550px)]">
                      <div className="space-y-3">
                        {leadsLoading ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Clock size={48} className="mx-auto mb-4 opacity-50 animate-spin" />
                            <p>Carregando leads...</p>
                          </div>
                        ) : leadsError ? (
                          <div className="text-center py-12 text-destructive">
                            <Warning size={48} className="mx-auto mb-4" />
                            <p>Não foi possível carregar os leads. Tente novamente mais tarde.</p>
                          </div>
                        ) : filteredLeads.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Nenhum lead encontrado</p>
                          </div>
                        ) : (
                          filteredLeads.map(lead => (
                            <Card 
                              key={lead.id} 
                              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-foreground truncate">
                                      {lead.data.name || 'Nome não informado'}
                                    </h3>
                                    {getStatusBadge(lead.status)}
                                    <span className={`text-sm font-medium ${getUrgencyColor(lead.score)}`}>
                                      Score: {lead.score}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-1 text-sm text-muted-foreground">
                                    {lead.data.email && (
                                      <div className="flex items-center gap-2">
                                        <Envelope size={16} />
                                        <span className="truncate">{lead.data.email}</span>
                                      </div>
                                    )}
                                    {lead.data.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{lead.data.phone}</span>
                                      </div>
                                    )}
                                    {lead.data.mainConcern && (
                                      <p className="line-clamp-2 mt-2 text-foreground">
                                        <strong>Preocupação:</strong> {lead.data.mainConcern}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <Select
                                    value={lead.status}
                                    onValueChange={(value) => {
                                      handleUpdateLeadStatus(lead.id, value as Lead['status'])
                                    }}
                                    disabled={updateLeadStatusMutation.isPending}
                                  >
                                    <SelectTrigger 
                                      className="w-[140px]"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">Novo</SelectItem>
                                      <SelectItem value="contacted">Contatado</SelectItem>
                                      <SelectItem value="scheduled">Agendado</SelectItem>
                                      <SelectItem value="converted">Convertido</SelectItem>
                                      <SelectItem value="lost">Perdido</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  {lead.data.preferredContact && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {lead.data.preferredContact === 'whatsapp' && <WhatsappLogo size={14} />}
                                      {lead.data.preferredContact === 'email' && <Envelope size={14} />}
                                      {lead.data.preferredContact === 'phone' && <Phone size={14} />}
                                      <span className="capitalize">{lead.data.preferredContact}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="prioritized" className="flex-1 mt-4 min-h-0">
                    <ScrollArea className="h-[calc(100vh-550px)]">
                      <div className="space-y-6">
                        {['critical', 'high', 'moderate', 'low'].map(priority => {
                          const priorityLeads = filteredLeads.filter(lead => {
                            if (priority === 'critical') return lead.score >= 80
                            if (priority === 'high') return lead.score >= 60 && lead.score < 80
                            if (priority === 'moderate') return lead.score >= 40 && lead.score < 60
                            return lead.score < 40
                          })
                          
                          if (priorityLeads.length === 0) return null
                          
                          const priorityLabels = {
                            critical: { label: 'Crítico', icon: Warning, color: 'text-destructive' },
                            high: { label: 'Alta', icon: Warning, color: 'text-accent' },
                            moderate: { label: 'Moderada', icon: Clock, color: 'text-primary' },
                            low: { label: 'Baixa', icon: CheckCircle, color: 'text-muted-foreground' }
                          }
                          
                          const config = priorityLabels[priority as keyof typeof priorityLabels]
                          const Icon = config.icon
                          
                          return (
                            <div key={priority}>
                              <div className="flex items-center gap-2 mb-3">
                                <Icon size={20} className={config.color} weight="fill" />
                                <h3 className={`font-semibold ${config.color}`}>
                                  {config.label} ({priorityLeads.length})
                                </h3>
                              </div>
                              
                              <div className="space-y-3">
                                {priorityLeads.map(lead => (
                                  <Card 
                                    key={lead.id} 
                                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedLead(lead)}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                          <h3 className="font-semibold text-foreground truncate">
                                            {lead.data.name || 'Nome não informado'}
                                          </h3>
                                          {getStatusBadge(lead.status)}
                                        </div>
                                        
                                        {lead.data.mainConcern && (
                                          <p className="line-clamp-1 text-sm text-muted-foreground">
                                            {lead.data.mainConcern}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="flex-1 mt-6 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <AgentsManagementPanel />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ai-config" className="flex-1 mt-6 overflow-hidden">
              <AIAgentConfig />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          conversation={selectedConversation ?? undefined}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          onUpdateStatus={(status) => handleUpdateLeadStatus(selectedLead.id, status)}
        />
      )}
    </div>
  )
}
