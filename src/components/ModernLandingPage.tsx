import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ChatCircle, 
  Sparkle,
  User,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { getActiveAgents } from '@/lib/predefined-agents'
import { AIAgentConfig } from '@/lib/types'

interface ModernLandingPageProps {
  onStartChat: (agent: AIAgentConfig) => void
  onAdminLogin: () => void
}

const iconMap: Record<string, any> = {
  'Heart': Heart,
  'Briefcase': User,
  'Sparkle': Sparkle,
  'Brain': User,
  'Scales': User,
}

export function ModernLandingPage({ onStartChat, onAdminLogin }: ModernLandingPageProps) {
  const agents = getActiveAgents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Heart weight="fill" size={22} className="text-white" />
            </div>
            <span className="font-serif text-2xl font-semibold text-foreground">
              Psicólogo BH
            </span>
          </motion.div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdminLogin}
            className="text-muted-foreground hover:text-foreground"
          >
            Admin
          </Button>
        </div>
      </header>

      <section className="relative px-6 pt-20 pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-8 px-5 py-2.5 text-sm font-medium bg-secondary/60 backdrop-blur-sm border border-secondary-foreground/10 shadow-sm"
            >
              Atendimento com IA 24/7
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-6xl md:text-8xl font-bold text-foreground mb-8 leading-none tracking-tight"
          >
            Cuide da sua
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              saúde mental
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Escolha um assistente virtual com a personalidade que mais combina com você
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-sm mb-16"
          >
            {['Confidencial', 'Disponível 24/7', 'Sem compromisso'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle size={16} className="text-primary" weight="fill" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Escolha seu assistente
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada um tem uma abordagem única para te ajudar
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => {
              const Icon = iconMap[agent.icon] || Heart
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="p-8 h-full border-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 space-y-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${agent.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={32} className="text-white" weight="duotone" />
                      </div>
                      
                      <div>
                        <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
                          {agent.name}
                        </h3>
                        <Badge variant="outline" className="mb-4">
                          {agent.personality}
                        </Badge>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {agent.description}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => onStartChat(agent)}
                        className={`w-full bg-gradient-to-r ${agent.color} hover:opacity-90 text-white group/btn`}
                      >
                        <ChatCircle size={20} className="mr-2" weight="fill" />
                        Conversar com {agent.name}
                        <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 rounded-3xl p-12 border border-border/50 backdrop-blur-sm"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent/30">
            <Sparkle size={32} className="text-white" weight="fill" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Não espere para cuidar de você
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Dar o primeiro passo pode ser difícil, mas estamos aqui para tornar esse processo mais fácil e acolhedor.
          </p>
          
          <p className="text-sm text-muted-foreground bg-card/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-border/50">
            🆘 Emergência? Ligue CVV: <span className="font-bold text-foreground">188</span> (gratuito, 24h)
          </p>
        </motion.div>
      </section>

      <footer className="border-t border-border/40 py-8 px-6 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p className="font-medium mb-2">© 2024 Psicólogo BH. Todos os direitos reservados.</p>
          <p className="text-xs">
            Este serviço não substitui atendimento psicológico profissional.
          </p>
        </div>
      </footer>
    </div>
  )
}
