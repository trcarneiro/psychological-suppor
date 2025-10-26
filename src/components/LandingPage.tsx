import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Heart, 
  ChatCircle, 
  ShieldCheck, 
  Clock,
  UserCircle,
  Lightbulb,
  CheckCircle
} from '@phosphor-icons/react'

interface LandingPageProps {
  onStartChat: () => void
  onAdminLogin: () => void
}

export function LandingPage({ onStartChat, onAdminLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart weight="fill" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Psicólogo BH
              </h1>
              <p className="text-xs text-muted-foreground">Seu bem-estar emocional</p>
            </div>
          </div>
          
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

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-2xl mb-6">
            <Heart weight="fill" size={40} className="text-secondary-foreground" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-foreground mb-6">
            Cuide da sua saúde mental
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            Comece agora com uma conversa acolhedora. Nossa inteligência artificial 
            vai te ouvir e ajudar a encontrar o suporte profissional ideal para você.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onStartChat}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-lg px-8 py-6 h-auto"
            >
              <ChatCircle size={24} className="mr-2" weight="fill" />
              Conversar Agora - É Grátis
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Saiba Mais
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Confidencial e seguro &nbsp;•&nbsp; ✓ Disponível 24/7 &nbsp;•&nbsp; ✓ Sem compromisso
          </p>
        </div>
      </section>

      <section id="como-funciona" className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-semibold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground">
              Um processo simples e acolhedor em 3 passos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChatCircle size={32} className="text-primary" weight="duotone" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">1. Converse Livremente</h3>
              <p className="text-muted-foreground">
                Compartilhe seus sentimentos e preocupações em uma conversa natural 
                e sem julgamentos com nossa IA especializada.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb size={32} className="text-secondary-foreground" weight="duotone" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">2. Receba Orientação</h3>
              <p className="text-muted-foreground">
                Com base na conversa, analisamos suas necessidades e sugerimos 
                o profissional mais adequado para seu caso.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCircle size={32} className="text-accent" weight="duotone" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">3. Conecte-se ao Profissional</h3>
              <p className="text-muted-foreground">
                Facilitamos o contato direto com psicólogos especializados que 
                podem realmente te ajudar.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-semibold text-foreground mb-4">
              Por que escolher nosso serviço
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start p-6 bg-card rounded-xl border border-border">
              <CheckCircle size={28} className="text-primary flex-shrink-0 mt-1" weight="fill" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Atendimento Humanizado</h3>
                <p className="text-muted-foreground">
                  Nossa IA foi treinada para oferecer acolhimento empático e respeitoso, 
                  sempre priorizando seu bem-estar emocional.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-6 bg-card rounded-xl border border-border">
              <CheckCircle size={28} className="text-primary flex-shrink-0 mt-1" weight="fill" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Disponível 24/7</h3>
                <p className="text-muted-foreground">
                  Não importa a hora, estamos aqui para ouvir. Inicie uma conversa 
                  quando precisar, sem espera.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-6 bg-card rounded-xl border border-border">
              <CheckCircle size={28} className="text-primary flex-shrink-0 mt-1" weight="fill" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Total Privacidade</h3>
                <p className="text-muted-foreground">
                  Suas conversas são confidenciais e seguras. Seus dados são 
                  tratados com máximo respeito e sigilo profissional.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-6 bg-card rounded-xl border border-border">
              <CheckCircle size={28} className="text-primary flex-shrink-0 mt-1" weight="fill" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Profissionais Qualificados</h3>
                <p className="text-muted-foreground">
                  Conectamos você com psicólogos registrados no CRP, com 
                  experiência comprovada em suas áreas de especialização.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Clock size={48} className="text-accent mx-auto mb-6" weight="duotone" />
          
          <h2 className="font-serif text-4xl font-semibold text-foreground mb-4">
            Não espere mais para cuidar de você
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dar o primeiro passo pode ser difícil, mas estamos aqui para tornar 
            esse processo mais fácil e acolhedor.
          </p>
          
          <Button 
            onClick={onStartChat}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-lg px-8 py-6 h-auto"
          >
            <ChatCircle size={24} className="mr-2" weight="fill" />
            Começar Agora
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            Em caso de emergência, ligue CVV: 188 (gratuito, 24h)
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Psicólogo BH. Todos os direitos reservados.</p>
          <p className="mt-2">
            Este serviço não substitui atendimento psicológico profissional.
          </p>
        </div>
      </footer>
    </div>
  )
}
