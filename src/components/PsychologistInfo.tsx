import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Heart, Phone, EnvelopeSimple, MapPin } from '@phosphor-icons/react'

interface PsychologistInfoProps {
  onContact: () => void
}

export function PsychologistInfo({ onContact }: PsychologistInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Sobre o Psicólogo
        </h2>
        <p className="text-sm text-muted-foreground">
          Conheça o profissional que pode atendê-lo
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">
              Atendimento Psicológico Profissional
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Psicólogo registrado no CRP, com experiência em atendimento clínico 
              e abordagem humanizada. Especializado em acolhimento terapêutico, 
              ansiedade, depressão e processos de autoconhecimento.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
                <GraduationCap size={16} className="text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Formação</p>
                <p className="text-sm text-muted-foreground">
                  Psicologia Clínica com especializações em Terapia Cognitivo-Comportamental
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Abordagem</p>
                <p className="text-sm text-muted-foreground">
                  Atendimento humanizado, focado em criar um espaço seguro e acolhedor
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Localização</p>
                <p className="text-sm text-muted-foreground">
                  Belo Horizonte, MG - Atendimento presencial e online
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm font-medium text-foreground">Formas de Contato:</p>
          
          <div className="flex flex-col gap-2">
            <a 
              href="tel:+5531999999999"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone size={16} />
              (31) 99999-9999
            </a>
            
            <a 
              href="mailto:contato@psicologobh.com.br"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <EnvelopeSimple size={16} />
              contato@psicologobh.com.br
            </a>
          </div>

          <Button 
            onClick={onContact}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4"
          >
            Solicitar Atendimento
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-muted/50 border-muted">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Importante:</strong> Este chat não substitui 
          atendimento psicológico profissional. Em caso de emergência, procure ajuda imediata 
          no CVV (188) ou serviços de saúde mental da sua região.
        </p>
      </Card>
    </div>
  )
}
