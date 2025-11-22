import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AdminLoginProps {
  onLogin: () => void
  onCancel: () => void
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    
    if (!isSupabaseConfigured()) {
      // Fallback para modo sem Supabase
      await new Promise(resolve => setTimeout(resolve, 500))
      if (password === 'admin123') {
        toast.success('Login realizado (Modo DEV)')
        onLogin()
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
      onLogin()
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="flex-1 bg-primary"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
