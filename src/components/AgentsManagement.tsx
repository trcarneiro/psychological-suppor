import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Agent } from '@/lib/types'
import {
  UserCircle,
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  Envelope,
  Phone,
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function AgentsManagement() {
  const [agents, setAgents] = useKV<Agent[]>('agents', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    crp: '',
    specialties: '',
    approach: '',
    experience: '',
    bio: '',
    email: '',
    phone: '',
    availability: '',
    priceRange: '',
    acceptsInsurance: false,
    insuranceProviders: '',
    active: true,
  })

  const filteredAgents = useMemo(() => {
    if (!agents) return []
    
    if (!searchQuery) return agents

    const query = searchQuery.toLowerCase()
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(query) ||
      agent.crp.toLowerCase().includes(query) ||
      agent.specialties.some(s => s.toLowerCase().includes(query)) ||
      agent.email.toLowerCase().includes(query)
    )
  }, [agents, searchQuery])

  const openCreateDialog = () => {
    setEditingAgent(null)
    setFormData({
      name: '',
      crp: '',
      specialties: '',
      approach: '',
      experience: '',
      bio: '',
      email: '',
      phone: '',
      availability: '',
      priceRange: '',
      acceptsInsurance: false,
      insuranceProviders: '',
      active: true,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({
      name: agent.name,
      crp: agent.crp,
      specialties: agent.specialties.join(', '),
      approach: agent.approach,
      experience: agent.experience,
      bio: agent.bio,
      email: agent.email,
      phone: agent.phone,
      availability: agent.availability.join(', '),
      priceRange: agent.priceRange,
      acceptsInsurance: agent.acceptsInsurance,
      insuranceProviders: agent.insuranceProviders?.join(', ') || '',
      active: agent.active,
    })
    setIsDialogOpen(true)
  }

  const handleSaveAgent = () => {
    if (!formData.name || !formData.crp || !formData.email) {
      toast.error('Preencha os campos obrigatórios: Nome, CRP e Email')
      return
    }

    const agentData: Agent = {
      id: editingAgent?.id || `agent-${Date.now()}`,
      name: formData.name,
      crp: formData.crp,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
      approach: formData.approach,
      experience: formData.experience,
      bio: formData.bio,
      email: formData.email,
      phone: formData.phone,
      availability: formData.availability.split(',').map(s => s.trim()).filter(Boolean),
      priceRange: formData.priceRange,
      acceptsInsurance: formData.acceptsInsurance,
      insuranceProviders: formData.insuranceProviders
        ? formData.insuranceProviders.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
      active: formData.active,
      createdAt: editingAgent?.createdAt || Date.now(),
      updatedAt: Date.now(),
    }

    if (editingAgent) {
      setAgents(prev => (prev || []).map(a => (a.id === editingAgent.id ? agentData : a)))
      toast.success('Agente atualizado com sucesso')
    } else {
      setAgents(prev => [...(prev || []), agentData])
      toast.success('Agente cadastrado com sucesso')
    }

    setIsDialogOpen(false)
  }

  const handleDeleteAgent = (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agente?')) {
      setAgents(prev => (prev || []).filter(a => a.id !== agentId))
      toast.success('Agente excluído com sucesso')
    }
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev =>
      (prev || []).map(a =>
        a.id === agentId ? { ...a, active: !a.active, updatedAt: Date.now() } : a
      )
    )
    toast.success('Status do agente atualizado')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            Agentes de Atendimento
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os psicólogos disponíveis para atendimento
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus size={16} />
          Adicionar Agente
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar por nome, CRP, especialidade..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <UserCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="grid gap-4">
          {filteredAgents.length === 0 ? (
            <Card className="p-12 text-center">
              <UserCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Nenhum agente encontrado'
                  : 'Nenhum agente cadastrado. Adicione o primeiro agente.'}
              </p>
            </Card>
          ) : (
            filteredAgents.map(agent => (
              <Card key={agent.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                      <Badge variant={agent.active ? 'default' : 'secondary'}>
                        {agent.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">CRP: {agent.crp}</span>
                    </div>

                    {agent.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{agent.bio}</p>
                    )}

                    {agent.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {agent.email && (
                        <div className="flex items-center gap-1">
                          <Envelope size={16} />
                          <span>{agent.email}</span>
                        </div>
                      )}
                      {agent.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={16} />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {agent.approach && (
                        <div>
                          <span className="font-medium text-foreground">Abordagem:</span>{' '}
                          <span className="text-muted-foreground">{agent.approach}</span>
                        </div>
                      )}
                      {agent.experience && (
                        <div>
                          <span className="font-medium text-foreground">Experiência:</span>{' '}
                          <span className="text-muted-foreground">{agent.experience}</span>
                        </div>
                      )}
                      {agent.priceRange && (
                        <div>
                          <span className="font-medium text-foreground">Valor:</span>{' '}
                          <span className="text-muted-foreground">{agent.priceRange}</span>
                        </div>
                      )}
                    </div>

                    {agent.acceptsInsurance && agent.insuranceProviders && (
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Convênios:</span>{' '}
                        <span className="text-muted-foreground">
                          {agent.insuranceProviders.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(agent)}
                      className="gap-2"
                    >
                      <PencilSimple size={16} />
                      Editar
                    </Button>
                    <Button
                      variant={agent.active ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleAgentStatus(agent.id)}
                      className="gap-2"
                    >
                      {agent.active ? (
                        <>
                          <XCircle size={16} />
                          Desativar
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="gap-2"
                    >
                      <Trash size={16} />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAgent ? 'Editar Agente' : 'Adicionar Novo Agente'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do psicólogo. Campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crp">CRP *</Label>
                <Input
                  id="crp"
                  value={formData.crp}
                  onChange={e => setFormData(prev => ({ ...prev, crp: e.target.value }))}
                  placeholder="01/12345"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Breve descrição profissional..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={e => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                placeholder="Ansiedade, Depressão, TCC (separar por vírgula)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approach">Abordagem</Label>
                <Input
                  id="approach"
                  value={formData.approach}
                  onChange={e => setFormData(prev => ({ ...prev, approach: e.target.value }))}
                  placeholder="TCC, Psicanálise, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experiência</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="10 anos, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="psicologo@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(31) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Disponibilidade</Label>
              <Input
                id="availability"
                value={formData.availability}
                onChange={e => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="Segunda a Sexta 9h-18h (separar por vírgula)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceRange">Faixa de Preço</Label>
                <Input
                  id="priceRange"
                  value={formData.priceRange}
                  onChange={e => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                  placeholder="R$ 150 - R$ 200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceProviders">Convênios</Label>
                <Input
                  id="insuranceProviders"
                  value={formData.insuranceProviders}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, insuranceProviders: e.target.value }))
                  }
                  placeholder="Unimed, Amil (separar por vírgula)"
                  disabled={!formData.acceptsInsurance}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="acceptsInsurance"
                checked={formData.acceptsInsurance}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, acceptsInsurance: checked }))
                }
              />
              <Label htmlFor="acceptsInsurance">Aceita convênios</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Agente ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgent}>
              {editingAgent ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
