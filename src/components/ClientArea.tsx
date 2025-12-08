import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, SignOut, ChatCircle, Calendar, Clock, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { motion } from 'framer-motion'
import type { Conversation } from '@/lib/types'

export function ClientArea() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const loadConversations = useCallback(async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations?clientEmail=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      toast.error('Erro ao carregar suas conversas')
    }
    setIsLoading(false)
  }, [email])

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) return

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        setEmail(session.user.email || '')
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && email) {
      loadConversations()
    }
  }, [isAuthenticated, email, loadConversations])

  const handleSendMagicLink = async () => {
    if (!email) {
      toast.error('Digite seu email')
      return
    }

    if (!isSupabaseConfigured()) {
      toast.error('Supabase não está configurado')
      return
    }

    setIsSendingMagicLink(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/client',
      },
    })

    if (error) {
      toast.error('Erro ao enviar link: ' + error.message)
    } else {
      toast.success('Link de acesso enviado! Verifique seu email.')
    }
    setIsSendingMagicLink(false)
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setIsAuthenticated(false)
    setEmail('')
    setConversations([])
    setSelectedConversation(null)
    toast.success('Você saiu da área do cliente')
  }

  const formatDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <User size={32} className="text-primary" weight="duotone" />
              </div>
              
              <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Área do Cliente
              </h1>
              <p className="text-sm text-muted-foreground">
                Acesse suas conversas e acompanhe seu progresso
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMagicLink()}
                  disabled={isSendingMagicLink}
                />
              </div>

              <Button 
                onClick={handleSendMagicLink} 
                disabled={isSendingMagicLink}
                className="w-full"
              >
                {isSendingMagicLink ? 'Enviando...' : 'Enviar Link de Acesso'}
              </Button>

              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-sm"
                >
                  Voltar para início
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Minha Área</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <SignOut size={20} />
            Sair
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando suas conversas...</p>
          </div>
        ) : conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <ChatCircle size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma conversa encontrada</h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não iniciou nenhuma conversa conosco
            </p>
            <Button onClick={() => navigate('/chat')} className="gap-2">
              Iniciar Nova Conversa
              <ArrowRight size={20} />
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ChatCircle size={20} className="text-primary" weight="fill" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{conversation.agentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {conversation.messages?.length || 0} mensagens
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {conversation.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    {formatDate(conversation.createdAt)}
                  </div>

                  {conversation.isConverted && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                      <Calendar size={14} />
                      Convertido em atendimento
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {selectedConversation && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedConversation(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{selectedConversation.agentName}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                  >
                    Fechar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedConversation.createdAt)}
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                {selectedConversation.messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
