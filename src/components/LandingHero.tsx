import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Brain, Heart, Shield, Clock, ArrowRight, CheckCircle, Article } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

export function LandingHero() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/blog')}
            className="gap-2 hover:bg-primary/5"
          >
            <Article size={20} />
            Blog
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield weight="fill" size={16} />
            Atendimento confidencial e acolhedor
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Bem-vindo ao
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Psicólogo BH
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Converse com um assistente virtual de pré-atendimento psicológico. Encontre acolhimento e orientação profissional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/chat')}
              className="group h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Iniciar Conversa
              <ArrowRight 
                size={20} 
                weight="bold" 
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300" 
              />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/blog')}
              className="group h-14 px-8 text-lg hover:bg-primary/5 transition-all duration-300"
            >
              <Article size={20} className="mr-2" />
              Ver Blog
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            {
              icon: Brain,
              title: 'Assistentes Especializados',
              description: '5 perfis diferentes para você escolher a abordagem ideal'
            },
            {
              icon: Heart,
              title: 'Acolhimento Humano',
              description: 'Atendimento empático focado em suas necessidades'
            },
            {
              icon: Clock,
              title: 'Disponível 24/7',
              description: 'Converse quando precisar, sem agendamento prévio'
            },
            {
              icon: Shield,
              title: 'Privacidade Total',
              description: 'Seus dados ficam protegidos e confidenciais'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <feature.icon size={24} weight="duotone" className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                step: '1',
                title: 'Inicie a Conversa',
                description: 'Clique no botão e comece imediatamente. Não precisa de cadastro ou espera.'
              },
              {
                step: '2',
                title: 'Compartilhe Sua História',
                description: 'Converse naturalmente sobre o que está sentindo. Troque de assistente quando quiser.'
              },
              {
                step: '3',
                title: 'Receba Orientação',
                description: 'Ao final, se necessário, seremos encaminhados para um profissional adequado.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={24} weight="fill" className="text-primary" />
              Nossos Assistentes
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Lucas', trait: 'Equilibrado e versátil' },
                { name: 'Sofia', trait: 'Empática e acolhedora' },
                { name: 'Carlos', trait: 'Objetivo e prático' },
                { name: 'Júlia', trait: 'Positiva e motivadora' },
                { name: 'Ana', trait: 'Reflexiva e profunda' }
              ].map((assistant, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-medium">{assistant.name}</span>
                  <span className="text-muted-foreground">- {assistant.trait}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/chat')}
              className="group h-14 px-10 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Comece Agora
              <ArrowRight 
                size={20} 
                weight="bold" 
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300" 
              />
            </Button>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 text-sm text-muted-foreground"
        >
          <p className="mb-2">
            <strong>Importante:</strong> Este é um serviço de pré-atendimento. Não substitui consulta com profissional.
          </p>
          <p>
            Em caso de emergência, ligue para CVV 188 ou SAMU 192
          </p>
        </motion.footer>
      </div>
    </div>
  )
}


