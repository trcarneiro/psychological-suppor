import { useState, useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Message, Conversation, AIAgentConfig } from '@/lib/types'
import { PaperPlaneTilt, List, X } from '@phosphor-icons/react'
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
import { getRandomStarters } from '@/lib/conversation-starters'
import { createConversation, sendConversationMessage } from '@/lib/api-client'

interface MinimalChatInterfaceProps {
  agent: AIAgentConfig
  onChangeAgent: (agent: AIAgentConfig) => void
  onAdminLogin: () => void
  onClose: () => void
}

export function MinimalChatInterface({ agent, onChangeAgent, onAdminLogin, onClose }: MinimalChatInterfaceProps) {
  const queryClient = useQueryClient()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [suggestionPrompts] = useState(() => getRandomStarters(6))
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const availableAgents = getActiveAgents()
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages, isTyping])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [inputMessage])

  const delay = useCallback((ms: number) => new Promise(resolve => setTimeout(resolve, ms)), [])

  const initializeConversation = useCallback(async (agentConfig: AIAgentConfig) => {
    setIsInitializing(true)
    setIsTyping(true)
    setConversation(null)

    try {
      const result = await createConversation(agentConfig)
      await delay(result.responseDelay)
      setConversation(result.conversation)
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error)
    } finally {
      setIsInitializing(false)
      setIsTyping(false)
    }
  }, [delay, queryClient])

  useEffect(() => {
    initializeConversation(agent)
  }, [agent, initializeConversation])

  const handleSendMessage = useCallback(async () => {
    if (!conversation || isTyping || isInitializing) return

    const trimmed = inputMessage.trim()
    if (!trimmed) return

    setInputMessage('')

    const previousConversation = conversation
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }

    setConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, optimisticMessage],
    } : prev)

    setIsTyping(true)

    try {
      const result = await sendConversationMessage({
        conversationId: previousConversation.id,
        content: trimmed,
      })

      await delay(result.responseDelay)
      setConversation(result.conversation)
      
      if (result.suggestions && result.suggestions.length > 0) {
        setAiSuggestions(result.suggestions)
      }

      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
      if (result.lead) {
        await queryClient.invalidateQueries({ queryKey: ['leads'] })
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setConversation(previousConversation)
    } finally {
      setIsTyping(false)
    }
  }, [conversation, delay, inputMessage, isInitializing, isTyping, queryClient])

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAgentChange = useCallback((newAgent: AIAgentConfig) => {
    onChangeAgent(newAgent)
    setConversation(null)
  }, [onChangeAgent])

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden safe-area-inset">
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-5 -z-10`} />
      
      <div className="fixed top-3 right-3 md:top-6 md:right-6 z-50 flex gap-2 md:gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:bg-card"
        >
          <X size={18} className="text-foreground md:w-5 md:h-5" />
          <span className="sr-only">Fechar chat</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 md:h-12 px-3 md:px-4 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center gap-2 hover:bg-card shadow-lg hover:shadow-xl transition-all"
            >
              <List size={18} className="text-foreground md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium text-foreground hidden sm:inline">Menu</span>
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

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 md:px-6 py-14 md:py-12 pb-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-12 text-center"
        >
          <h1 className="font-serif text-2xl md:text-4xl font-semibold text-foreground mb-1 md:mb-2">
            {agent.name}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {agent.personality}
          </p>
        </motion.div>

        <div 
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto space-y-4 md:space-y-6 mb-4 md:mb-6 pb-4 scrollbar-thin pr-1 md:pr-2 -mx-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <AnimatePresence mode="popLayout">
            {conversation?.messages.map((message, index) => (
              <motion.div
                key={message.id || `msg-${index}`}
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
                    'max-w-[90%] md:max-w-[85%] rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 shadow-sm',
                    message.role === 'user'
                      ? `bg-gradient-to-br ${agent.color} text-white`
                      : 'bg-card/60 backdrop-blur-sm border border-border/50 text-foreground'
                  )}
                >
                  <p className="text-[15px] md:text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
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
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4">
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

        {(aiSuggestions.length > 0 || (conversation?.messages.length === 1 && suggestionPrompts.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 md:mb-6"
          >
            <p className="text-xs md:text-sm text-muted-foreground text-center mb-3 md:mb-4">
              {aiSuggestions.length > 0 ? '💭 Sugestões de resposta:' : '💭 Sugestões para começar a conversa:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {(aiSuggestions.length > 0 
                ? aiSuggestions.map(text => ({ id: text, text, icon: '💬' })) 
                : suggestionPrompts
              ).map((starter, index) => (
                <motion.button
                  key={starter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(starter.text)}
                  className="text-left p-3 md:p-4 min-h-[48px] rounded-xl md:rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:bg-card/60 hover:border-border transition-all active:scale-95"
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">{starter.icon}</span>
                    <span className="text-xs md:text-sm text-foreground leading-snug">{starter.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          ref={inputContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative sticky bottom-0 pb-safe"
        >
          <div className="flex gap-2 md:gap-3 items-end bg-card/80 md:bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-lg">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base md:text-lg px-2 md:px-3 py-2 max-h-32 scrollbar-none"
              rows={1}
              disabled={isTyping || isInitializing}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isInitializing}
              size="lg"
              className={cn(
                `bg-gradient-to-r ${agent.color} hover:opacity-90 text-white rounded-xl md:rounded-2xl h-12 w-12 md:h-12 md:w-12 p-0 flex-shrink-0 shadow-md active:scale-95 transition-transform`,
                (!inputMessage.trim() || isTyping || isInitializing) && 'opacity-50'
              )}
            >
              <PaperPlaneTilt size={20} weight="fill" className="md:w-5 md:h-5" />
            </Button>
          </div>
          
          <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2 md:mt-4 px-2">
            Em crise? Ligue CVV: <span className="font-semibold">188</span> (gratuito, 24h)
          </p>
        </motion.div>
      </div>
    </div>
  )
}
