import dotenv from 'dotenv'

dotenv.config()

export const PORT = Number(process.env.PORT || 3333)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-pro'
