import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PREDEFINED_AGENTS } from '@/lib/predefined-agents'
import { AIAgentConfig } from '@/lib/types'
import { Heart, User, Sparkle, Eye } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

const iconMap: Record<string, typeof Heart> = {
  'Heart': Heart,
  'Briefcase': User,
  'Sparkle': Sparkle,
  'Brain': User,
  'Scales': User,
}

export function AgentsManagementPanel() {
  const [agents] = useState<AIAgentConfig[]>(PREDEFINED_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<AIAgentConfig | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleViewAgent = (agent: AIAgentConfig) => {
    setSelectedAgent(agent)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
          Agentes Cadastrados
        </h2>
        <p className="text-sm text-muted-foreground">
          Gerencie os assistentes virtuais disponíveis para atendimento
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => {
          const Icon = iconMap[agent.icon] || Heart

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-5`} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <Icon size={24} className="text-white" weight="duotone" />
                    </div>
                    
                    <Badge variant={agent.active ? 'default' : 'secondary'}>
                      {agent.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-1 text-foreground">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {agent.personality}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground mb-1">Modelo</div>
                      <div className="font-medium">{agent.model}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground mb-1">Temperatura</div>
                      <div className="font-medium">{agent.temperature}</div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewAgent(agent)}
                    className="w-full gap-2"
                  >
                    <Eye size={16} />
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedAgent && (
                <>
                  <div className={`w-10 h-10 bg-gradient-to-br ${selectedAgent.color} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const Icon = iconMap[selectedAgent.icon] || Heart
                      return <Icon size={20} className="text-white" weight="duotone" />
                    })()}
                  </div>
                  <div>
                    <div className="text-xl font-serif">{selectedAgent.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {selectedAgent.personality}
                    </div>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Configurações e comportamento do assistente virtual
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Descrição</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Modelo</Label>
                    <Badge variant="outline">{selectedAgent.model}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Temperatura</Label>
                    <Badge variant="outline">{selectedAgent.temperature}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Estilo</Label>
                    <Badge variant="outline">{selectedAgent.conversationStyle}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Delay</Label>
                    <Badge variant="outline">{selectedAgent.responseDelay}ms</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Mensagem de Saudação</Label>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    {selectedAgent.greeting}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Prompt do Sistema</Label>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-xs max-h-60 overflow-y-auto">
                    {selectedAgent.systemPrompt}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Campos Coletados</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.collectDataFields.map(field => (
                      <Badge key={field} variant="secondary">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
