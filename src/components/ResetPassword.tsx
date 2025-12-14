import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LockKey } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we have a session (user clicked the email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Link inválido ou expirado')
        navigate('/admin')
      }
    })
  }, [navigate])

  const handleUpdatePassword = async () => {
    if (!password) return
    
    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Senha atualizada com sucesso!')
      navigate('/dashboard')
    }
    setIsLoading(false)
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <LockKey size={32} className="text-primary" weight="duotone" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Nova Senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button onClick={handleUpdatePassword} disabled={isLoading} className="w-full">
            {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
