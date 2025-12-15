
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key (first 10 chars):', supabaseAnonKey?.substring(0, 10))

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Try to fetch a public table or just check health
    // Since we don't know tables, let's try auth.getSession() which should work even if not logged in
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase Error:', error.message)
    } else {
      console.log('Supabase Connection Successful!')
      console.log('Session:', data.session ? 'Active' : 'None')
    }
  } catch (err) {
    console.error('Unexpected Error:', err)
  }
}

testConnection()
