import { Button } from '@/components/ui/button'
import { Heart, ChatCircle, ShieldCheck } from '@phosphor-icons/react'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Heart weight="fill" size={32} className="text-secondary-foreground" />
          </div>
          
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Bem-vindo ao Acolhimento
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Um espaço seguro para você compartilhar seus sentimentos e pensamentos. 
            Estou aqui para ouvir, acolher e ajudar você a encontrar o suporte que precisa.
          </p>
        </div>

        <div className="grid gap-4 text-left">
          <div className="flex gap-4 items-start p-4 bg-card rounded-xl border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center">
              <ChatCircle size={20} className="text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Conversa Empática</h3>
              <p className="text-sm text-muted-foreground">
                Converse livremente sobre o que está sentindo. Não há julgamentos aqui.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-card rounded-xl border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Confidencial e Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Suas conversas são privadas e armazenadas apenas no seu dispositivo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onStart}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            Iniciar Conversa
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Este não é um atendimento psicológico profissional. Se você está em crise, 
            ligue para o CVV: 188 (24h, gratuito)
          </p>
        </div>
      </div>
    </div>
  )
}
