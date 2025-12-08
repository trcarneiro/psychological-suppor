import { useState, useEffect } from 'react'
import { Message } from '@/lib/types'

// Palavras-chave que indicam crise emocional grave
const CRISIS_KEYWORDS = [
  'suicídio', 'suicidio', 'me matar', 'tirar minha vida', 'acabar com tudo',
  'não aguento mais', 'nao aguento mais', 'quero morrer', 'morte',
  'desespero', 'desesperado', 'desesperada', 'sem saída', 'sem saida',
  'não vale a pena viver', 'nao vale a pena viver', 'acabar com a vida'
]

export function useCrisisDetection(messages: Message[]): boolean {
  const [hasCrisis, setHasCrisis] = useState(false)

  useEffect(() => {
    if (messages.length === 0) {
      setHasCrisis(false)
      return
    }

    // Analisa apenas mensagens do usuário
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(-5) // Últimas 5 mensagens

    const hasKeyword = userMessages.some(msg => {
      const content = msg.content.toLowerCase()
      return CRISIS_KEYWORDS.some(keyword => content.includes(keyword))
    })

    setHasCrisis(hasKeyword)
  }, [messages])

  return hasCrisis
}

interface CrisisFooterProps {
  show: boolean
}

export function CrisisFooter({ show }: CrisisFooterProps) {
  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white py-4 px-6 shadow-lg z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="font-bold text-lg mb-1">⚠️ Você precisa de ajuda imediata?</p>
          <p className="text-sm opacity-95">
            Se você está em crise, procure ajuda profissional agora.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 whitespace-nowrap">
          <a
            href="tel:188"
            className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-50 transition-colors text-center"
          >
            📞 CVV 188
          </a>
          <a
            href="tel:192"
            className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-50 transition-colors text-center"
          >
            🚑 SAMU 192
          </a>
        </div>
      </div>
    </div>
  )
}
