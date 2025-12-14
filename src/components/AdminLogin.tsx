import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, GoogleLogo, MagicWand } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const getRedirectUrl = (path: string) => {
    // Prioritize VITE_SITE_URL from .env, fallback to window.location.origin
    const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    // Remove trailing slash if present
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    return ${cleanBaseUrl}
  }

  const handleLogin = async () => {
    setIsLoading(true)
    
    if (!isSupabaseConfigured()) {
      // Fallback para modo sem Supabase
      await new Promise(resolve => setTimeout(resolve, 500))
      if (password === 'admin123') {
        toast.success('Login realizado (Modo DEV)')
        navigate('/dashboard')
      } else {
        toast.error('Senha incorreta (Modo DEV: admin123)')
      }
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Erro ao fazer login: ' + error.message)
    } else {
      toast.success('Login realizado com sucesso')
      navigate('/dashboard')
    }
    
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase não configurado')
      return
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl('/dashboard')
      }
    })

    if (error) toast.error(error.message)
  }

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Digite seu email')
      return
    }
    
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl('/dashboard')
      }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Link mágico enviado para seu email!')
    }
    setIsLoading(false)
  }

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Digite seu email para recuperar a senha')
      return
    }

    setIsResetting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl('/reset-password'),
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Email de recuperação enviado!')
    }
    setIsResetting(false)
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <ShieldCheck size={32} className="text-primary" weight="duotone" />
          </div>
          
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Acesso Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar o dashboard
          </p>
        </div>

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="password">Senha</TabsTrigger>
            <TabsTrigger value="magic">Link Mágico</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0 font-normal text-xs h-auto">
                        Esqueceu a senha?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Recuperar Senha</DialogTitle>
                        <DialogDescription>
                          Digite seu email para receber um link de redefinição de senha.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleResetPassword} disabled={isResetting} className="w-full">
                          {isResetting ? 'Enviando...' : 'Enviar Email de Recuperação'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                {isLoading ? 'Entrando...' : 'Entrar com Senha'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="magic">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                  id="magic-email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleMagicLink} disabled={isLoading} className="w-full gap-2">
                <MagicWand size={18} />
                {isLoading ? 'Enviando...' : 'Enviar Link Mágico'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <Button variant="outline" onClick={handleGoogleLogin} className="w-full gap-2 mb-6">
          <GoogleLogo size={18} weight="bold" />
          Google
        </Button>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            Voltar para o início
          </Button>
        </div>
      </Card>
    </div>
  )
}
