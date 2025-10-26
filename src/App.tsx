import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/ChatMessage'
import { TypingIndicator } from '@/components/TypingIndicator'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { PsychologistInfo } from '@/components/PsychologistInfo'
import { ReferralDialog } from '@/components/ReferralDialog'
import { Message, Conversation } from '@/lib/types'
import { PaperPlaneTilt, Info, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentConversation = conversations?.find(c => c.id === currentConversationId)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentConversation?.messages, isTyping])

  const generateAIResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    const historyText = conversationHistory?.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`).join('\n') || ''
    
    const promptText = `Você é um assistente de pré-atendimento psicológico empático e acolhedor. Seu papel é:

1. Ouvir atentamente e responder com empatia e sem julgamentos
2. Fazer perguntas abertas que ajudem a pessoa a se expressar
3. Validar os sentimentos da pessoa
4. Identificar sinais de que a pessoa pode precisar de atendimento profissional
5. Se identificar necessidade clara, sugerir gentilmente o encaminhamento para um psicólogo
6. Em casos de crise severa ou menção a suicídio, imediatamente sugerir CVV (188) e ajuda profissional urgente

IMPORTANTE:
- Seja caloroso, humano e empático, mas sempre lembre que não substitui um psicólogo
- Evite dar conselhos diretos ou diagnósticos
- Foque em acolher e entender
- Use linguagem simples e acessível
- Seja breve (2-4 frases por resposta)

Histórico da conversa:
${historyText}

Nova mensagem do usuário: ${userMessage}

Responda de forma empática e acolhedora:`

    try {
      const response = await window.spark.llm(promptText, 'gpt-4o-mini')
      return response
    } catch (error) {
      console.error('Erro ao gerar resposta:', error)
      return 'Peço desculpas, tive uma dificuldade técnica. Você pode repetir o que disse? Estou aqui para ouvir.'
    }
  }

  const checkForReferralNeed = (message: string): boolean => {
    const keywords = [
      'não aguento mais',
      'quero morrer',
      'suicídio',
      'me matar',
      'sem saída',
      'muito tempo',
      'semanas',
      'meses',
      'anos',
      'piorou',
      'piorando',
      'não consigo',
      'preciso de ajuda',
    ]
    
    const messageLower = message.toLowerCase()
    return keywords.some(keyword => messageLower.includes(keyword))
  }

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      needsReferral: false,
    }

    setConversations(prev => [newConversation, ...(prev || [])])
    setCurrentConversationId(newConversation.id)
    setHasStarted(true)

    setTimeout(() => {
      addAssistantMessage(
        'Olá, é um prazer ter você aqui. Este é um espaço seguro onde você pode compartilhar o que está sentindo. Como você está se sentindo hoje?',
        newConversation.id
      )
    }, 500)
  }

  const addUserMessage = async (content: string) => {
    if (!currentConversationId || !content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    setConversations(prev =>
      (prev || []).map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: Date.now(),
              needsReferral: conv.needsReferral || checkForReferralNeed(content),
            }
          : conv
      )
    )

    setInputMessage('')
    setIsTyping(true)

    const updatedConv = conversations?.find(c => c.id === currentConversationId)
    const history = updatedConv ? [...updatedConv.messages, userMessage] : [userMessage]

    const aiResponse = await generateAIResponse(content, history)
    
    setIsTyping(false)
    addAssistantMessage(aiResponse, currentConversationId)

    if (checkForReferralNeed(content) || checkForReferralNeed(aiResponse)) {
      setTimeout(() => {
        toast.info('Percebo que você pode se beneficiar de atendimento profissional', {
          description: 'Gostaria de conhecer mais sobre o psicólogo?',
          action: {
            label: 'Ver Informações',
            onClick: () => setShowInfo(true),
          },
          duration: 8000,
        })
      }, 2000)
    }
  }

  const addAssistantMessage = (content: string, conversationId: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: Date.now(),
    }

    setConversations(prev =>
      (prev || []).map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: Date.now(),
            }
          : conv
      )
    )
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isTyping) {
      addUserMessage(inputMessage)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!hasStarted && !currentConversationId) {
    return (
      <>
        <div className="h-screen bg-background">
          <WelcomeScreen onStart={startNewConversation} />
        </div>
        <Toaster position="top-center" />
      </>
    )
  }

  return (
    <>
      <div className="h-screen bg-background flex">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <header className="border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="font-serif text-xl font-semibold text-foreground">
                  Acolhimento Psicológico
                </h1>
                <p className="text-sm text-muted-foreground">
                  Espaço seguro para conversarmos
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="gap-2"
              >
                <Info size={16} />
                Sobre o Psicólogo
              </Button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 px-6">
                <div ref={scrollRef} className="py-6 space-y-4 max-w-3xl mx-auto">
                  {currentConversation?.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && <TypingIndicator />}

                  {currentConversation?.needsReferral && currentConversation.messages.length > 4 && (
                    <Card className="p-4 bg-accent/10 border-accent/30">
                      <div className="flex gap-3 items-start">
                        <Warning size={20} className="text-accent flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-1">
                          <p className="text-sm text-foreground font-medium">
                            Você pode se beneficiar de atendimento profissional
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Um psicólogo pode oferecer suporte especializado para o que você está vivenciando.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => setShowReferralDialog(true)}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground mt-2"
                          >
                            Solicitar Atendimento
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-3">
                    <Textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="resize-none min-h-[60px] max-h-[120px]"
                      rows={2}
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-6"
                    >
                      <PaperPlaneTilt size={20} weight="fill" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Este chat não substitui atendimento psicológico. Em crise, ligue CVV: 188
                  </p>
                </div>
              </div>
            </div>

            {showInfo && (
              <>
                <Separator orientation="vertical" className="h-full" />
                <div className="w-[400px] overflow-y-auto bg-card/30 p-6">
                  <PsychologistInfo onContact={() => setShowReferralDialog(true)} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ReferralDialog
        open={showReferralDialog}
        onOpenChange={setShowReferralDialog}
      />

      <Toaster position="top-center" />
    </>
  )
}

export default App
