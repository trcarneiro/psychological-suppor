import dotenv from 'dotenv'

dotenv.config()

export const PORT = Number(process.env.PORT || 3333)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro'
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''


