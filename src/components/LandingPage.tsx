import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ChatCircle, 
  ShieldCheck, 
  Clock,
  UserCircle,
  Lightbulb,
  CheckCircle,
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface LandingPageProps {
  onStartChat: () => void
  onAdminLogin: () => void
}

export function LandingPage({ onStartChat, onAdminLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Heart weight="fill" size={26} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Psicólogo BH
              </h1>
              <p className="text-xs text-muted-foreground">Seu bem-estar emocional</p>
            </div>
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

      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 text-sm font-medium bg-secondary/60 backdrop-blur-sm border border-secondary-foreground/10"
            >
              <Sparkle size={16} className="mr-2" weight="fill" />
              Atendimento com IA 24/7
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent via-accent/90 to-accent/80 rounded-3xl mb-8 shadow-2xl shadow-accent/25"
          >
            <Heart weight="fill" size={48} className="text-accent-foreground" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-semibold text-foreground mb-6 leading-tight"
          >
            Cuide da sua <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              saúde mental
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto"
          >
            Comece <span className="font-semibold text-foreground">agora</span> com uma conversa acolhedora. 
            Nossa IA vai te ouvir e ajudar a encontrar o suporte profissional ideal para você.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onStartChat}
                size="lg"
                className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/95 hover:to-accent/85 text-accent-foreground font-semibold text-lg px-10 py-7 h-auto shadow-xl shadow-accent/30 group"
              >
                <ChatCircle size={26} className="mr-3 group-hover:animate-bounce" weight="fill" />
                Conversar Agora - É Grátis
                <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-7 h-auto border-2 hover:bg-secondary/50 hover:border-secondary"
                onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Saiba Mais
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle size={14} className="text-primary" weight="fill" />
              </div>
              <span className="font-medium">Confidencial e seguro</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center">
                <CheckCircle size={14} className="text-secondary-foreground" weight="fill" />
              </div>
              <span className="font-medium">Disponível 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle size={14} className="text-accent" weight="fill" />
              </div>
              <span className="font-medium">Sem compromisso</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 px-6 bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-2 text-sm font-medium border-primary/30"
            >
              Simples e Eficaz
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Um processo acolhedor em apenas 3 passos
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChatCircle,
                number: '01',
                title: 'Converse Livremente',
                description: 'Compartilhe seus sentimentos e preocupações em uma conversa natural e sem julgamentos com nossa IA especializada.',
                color: 'from-primary/15 to-primary/5',
                iconColor: 'text-primary',
                delay: 0
              },
              {
                icon: Lightbulb,
                number: '02',
                title: 'Receba Orientação',
                description: 'Com base na conversa, analisamos suas necessidades e sugerimos o profissional mais adequado para seu caso.',
                color: 'from-secondary/30 to-secondary/10',
                iconColor: 'text-secondary-foreground',
                delay: 0.1
              },
              {
                icon: UserCircle,
                number: '03',
                title: 'Conecte-se ao Profissional',
                description: 'Facilitamos o contato direto com psicólogos especializados que podem realmente te ajudar.',
                color: 'from-accent/25 to-accent/10',
                iconColor: 'text-accent',
                delay: 0.2
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="p-8 text-center h-full border-2 hover:border-border/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="text-7xl font-bold text-muted-foreground/10 mb-4">
                      {step.number}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-card to-muted rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <step.icon size={40} className={step.iconColor} weight="duotone" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-2 text-sm font-medium border-accent/30"
            >
              Seus Benefícios
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Por que escolher nosso serviço
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                title: 'Atendimento Humanizado',
                description: 'Nossa IA foi treinada para oferecer acolhimento empático e respeitoso, sempre priorizando seu bem-estar emocional.',
                gradient: 'from-rose-500/10 to-pink-500/10',
                iconColor: 'text-rose-600',
                delay: 0
              },
              {
                icon: Clock,
                title: 'Disponível 24/7',
                description: 'Não importa a hora, estamos aqui para ouvir. Inicie uma conversa quando precisar, sem espera.',
                gradient: 'from-blue-500/10 to-cyan-500/10',
                iconColor: 'text-blue-600',
                delay: 0.1
              },
              {
                icon: ShieldCheck,
                title: 'Total Privacidade',
                description: 'Suas conversas são confidenciais e seguras. Seus dados são tratados com máximo respeito e sigilo profissional.',
                gradient: 'from-emerald-500/10 to-green-500/10',
                iconColor: 'text-emerald-600',
                delay: 0.2
              },
              {
                icon: CheckCircle,
                title: 'Profissionais Qualificados',
                description: 'Conectamos você com psicólogos registrados no CRP, com experiência comprovada em suas áreas de especialização.',
                gradient: 'from-amber-500/10 to-orange-500/10',
                iconColor: 'text-amber-600',
                delay: 0.3
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: benefit.delay }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className={`flex gap-5 items-start p-8 bg-gradient-to-br ${benefit.gradient} rounded-2xl border-2 border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 h-full group`}>
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon size={28} className={benefit.iconColor} weight="duotone" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-xl mb-3 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-accent/15 via-primary/10 to-secondary/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/40">
              <Sparkle size={40} className="text-accent-foreground" weight="fill" />
            </div>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-6xl font-semibold text-foreground mb-6 leading-tight">
            Não espere mais para <br className="hidden md:block" />
            cuidar de <span className="text-accent">você</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Dar o primeiro passo pode ser difícil, mas estamos aqui para tornar 
            esse processo mais <span className="font-semibold text-foreground">fácil e acolhedor</span>.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onStartChat}
              size="lg"
              className="bg-gradient-to-r from-accent via-accent/95 to-accent/90 hover:from-accent/95 hover:to-accent/85 text-accent-foreground font-bold text-xl px-12 py-8 h-auto shadow-2xl shadow-accent/40 group"
            >
              <ChatCircle size={28} className="mr-3 group-hover:animate-bounce" weight="fill" />
              Começar Agora
              <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform" weight="bold" />
            </Button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mt-8 bg-card/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-border/50"
          >
            🆘 Em caso de emergência, ligue CVV: <span className="font-bold text-foreground">188</span> (gratuito, 24h)
          </motion.p>
        </motion.div>
      </section>

      <footer className="border-t border-border py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart weight="fill" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Psicólogo BH
                </h3>
                <p className="text-sm text-muted-foreground">Seu bem-estar emocional</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onStartChat}
                className="hover:bg-accent/10 hover:text-accent hover:border-accent/50"
              >
                <ChatCircle size={18} className="mr-2" weight="fill" />
                Conversar
              </Button>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© 2024 Psicólogo BH. Todos os direitos reservados.</p>
            <p className="text-xs">
              Este serviço não substitui atendimento psicológico profissional. 
              Sempre consulte um profissional qualificado para diagnóstico e tratamento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
