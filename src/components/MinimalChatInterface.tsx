import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Message, Conversation, AIAgentConfig } from '@/lib/types'
import { PaperPlaneTilt, User, List } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getActiveAgents } from '@/lib/predefined-agents'

interface MinimalChatInterfaceProps {
  agent: AIAgentConfig
  onChangeAgent: (agent: AIAgentConfig) => void
  onAdminLogin: () => void
}

export function MinimalChatInterface({ agent, onChangeAgent, onAdminLogin }: MinimalChatInterfaceProps) {
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const currentConversation = conversations?.find(c => c.id === currentConversationId)
  const availableAgents = getActiveAgents()
  
  const iconMap: Record<string, any> = {
    'Heart': User,
    'Briefcase': User,
    'Sparkle': User,
    'Brain': User,
    'Scales': User,
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentConversation?.messages, isTyping])

  useEffect(() => {
    startNewConversation()
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputMessage])

  const generateAIResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    const historyText = conversationHistory?.map(m => `${m.role === 'user' ? 'Usuário' : agent.name}: ${m.content}`).join('\n') || ''
    
    const messageCount = conversationHistory.filter(m => m.role === 'user').length

    let contextualInstructions = ''
    if (messageCount === 1) {
      contextualInstructions = `\n\nEsta é a primeira mensagem. Agradeça e faça uma pergunta aberta.`
    } else if (messageCount === 3) {
      contextualInstructions = `\n\nTente descobrir o nome da pessoa naturalmente.`
    } else if (messageCount >= 5) {
      contextualInstructions = `\n\nPergunte sobre disponibilidade ou preferência de contato se apropriado.`
    }

    const promptText = `${agent.systemPrompt}${contextualInstructions}

Histórico:
${historyText}

Usuário: ${userMessage}

Responda:`

    try {
      const response = await window.spark.llm(promptText, agent.model)
      return response
    } catch (error) {
      console.error('Erro:', error)
      return 'Desculpe, tive uma dificuldade técnica. Pode repetir?'
    }
  }

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversa com ${agent.name}`,
      messages: [],
      leadData: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      needsReferral: false,
    }

    setConversations(prev => [newConversation, ...(prev || [])])
    setCurrentConversationId(newConversation.id)

    setTimeout(() => {
      addAssistantMessage(agent.greeting, newConversation.id)
    }, agent.responseDelay)
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
            }
          : conv
      )
    )

    setInputMessage('')
    setIsTyping(true)

    const updatedConv = conversations?.find(c => c.id === currentConversationId)
    const history = updatedConv ? [...updatedConv.messages, userMessage] : [userMessage]

    const aiResponse = await generateAIResponse(content, history)
    
    await new Promise(resolve => setTimeout(resolve, agent.responseDelay))
    
    setIsTyping(false)
    addAssistantMessage(aiResponse, currentConversationId)
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

  const handleAgentChange = (newAgent: AIAgentConfig) => {
    onChangeAgent(newAgent)
    
    if (currentConversation && currentConversation.messages.length > 0) {
      const transitionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Olá! Agora você está conversando com ${newAgent.name}. ${newAgent.greeting}`,
        timestamp: Date.now(),
      }

      setConversations(prev =>
        (prev || []).map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, transitionMessage],
                updatedAt: Date.now(),
              }
            : conv
        )
      )
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-5 -z-10`} />
      
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 px-4 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center gap-2 hover:bg-card shadow-lg hover:shadow-xl transition-all"
            >
              <List size={20} className="text-foreground" />
              <span className="text-sm font-medium text-foreground">Menu</span>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Trocar Assistente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableAgents.map((availableAgent) => (
              <DropdownMenuItem
                key={availableAgent.id}
                onClick={() => handleAgentChange(availableAgent)}
                disabled={availableAgent.id === agent.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${availableAgent.color}`} />
                <div className="flex flex-col">
                  <span className="font-medium">{availableAgent.name}</span>
                  <span className="text-xs text-muted-foreground">{availableAgent.personality}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onAdminLogin} className="cursor-pointer">
              Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-serif text-4xl font-semibold text-foreground mb-2">
            {agent.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {agent.personality}
          </p>
        </motion.div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 mb-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          <AnimatePresence mode="popLayout">
            {currentConversation?.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'flex w-full',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-3xl px-6 py-4 shadow-sm',
                    message.role === 'user'
                      ? `bg-gradient-to-br ${agent.color} text-white`
                      : 'bg-card/60 backdrop-blur-sm border border-border/50 text-foreground'
                  )}
                >
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl px-6 py-4">
                <div className="flex gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          ref={inputContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="flex gap-3 items-end bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-3 shadow-lg">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg px-3 py-2 max-h-32 scrollbar-none"
              rows={1}
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="lg"
              className={cn(
                `bg-gradient-to-r ${agent.color} hover:opacity-90 text-white rounded-2xl h-12 w-12 p-0 flex-shrink-0 shadow-md`,
                (!inputMessage.trim() || isTyping) && 'opacity-50'
              )}
            >
              <PaperPlaneTilt size={20} weight="fill" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Em crise? Ligue CVV: <span className="font-semibold">188</span> (gratuito, 24h)
          </p>
        </motion.div>
      </div>
    </div>
  )
}
