import { Message } from '@/lib/types'
import { Avatar } from '@/components/ui/avatar'
import { Brain, User } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { memo } from 'react'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className={`w-8 h-8 flex items-center justify-center ${isUser ? 'bg-primary' : 'bg-secondary'}`}>
        {isUser ? (
          <User weight="fill" className="text-primary-foreground" size={18} />
        ) : (
          <Brain weight="fill" className="text-secondary-foreground" size={18} />
        )}
      </Avatar>
      
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card text-card-foreground border border-border rounded-tl-sm'
          }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
})
