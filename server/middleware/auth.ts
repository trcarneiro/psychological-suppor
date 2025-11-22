import { createClient } from '@supabase/supabase-js'
import { Request, Response, NextFunction } from 'express'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'

const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY

const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!isConfigured) {
    console.warn('[Auth] Supabase não configurado. Permitindo acesso irrestrito (DEV MODE).')
    // @ts-ignore
    req.user = { id: 'admin-dev', email: 'admin@dev.local' }
    return next()
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' })
  }

  const token = authHeader.split(' ')[1]
  
  if (!supabase) {
    return res.status(500).json({ error: 'Erro interno de configuração de auth.' })
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }

  // @ts-ignore - Adicionando user ao request
  req.user = user
  next()
}
