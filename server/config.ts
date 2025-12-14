import dotenv from 'dotenv'

dotenv.config()

export const PORT = Number(process.env.PORT || 3333)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

// OpenRouter config (alternativa ao Gemini)
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-pro-preview'
export const LLM_PROVIDER = process.env.LLM_PROVIDER || 'gemini' // 'gemini' ou 'openrouter'

export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''


