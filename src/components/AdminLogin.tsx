import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AdminLoginProps {
  onLogin: () => void
  onCancel: () => void
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (password === 'admin123') {
      toast.success('Login realizado com sucesso')
      onLogin()
    } else {
      toast.error('Senha incorreta')
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
              disabled={isLoading || !password}
              className="flex-1 bg-primary"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Para fins de demonstração, use a senha: <strong>admin123</strong>
          </p>
        </div>
      </Card>
    </div>
  )
}
