import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dixwysghljgqvewfmmcj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeHd5c2dobGpncXZld2ZtbWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjIwOTEsImV4cCI6MjA3OTEzODA5MX0.A6PiB_FouhHhXrMx1aD2BxdXKVsdzDHQrXWjHDZfx8k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log('🔍 Testando Supabase Auth...\n')
  
  // Test 1: Check if we can get session (should be null if not logged in)
  const { data: sessionData } = await supabase.auth.getSession()
  console.log('✅ Conexão com Supabase OK')
  console.log('📌 Sessão atual:', sessionData.session ? 'Ativa' : 'Nenhuma')
  
  // Test 2: Try to sign up a test user (will fail if email already exists)
  console.log('\n🔧 Tentando criar usuário de teste...')
  const testEmail = 'admin@teste.com'
  const testPassword = 'admin123'
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        role: 'admin'
      }
    }
  })
  
  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      console.log('ℹ️  Usuário já existe:', testEmail)
    } else {
      console.error('❌ Erro ao criar usuário:', signUpError.message)
    }
  } else {
    console.log('✅ Usuário criado com sucesso!')
    console.log('📧 Email:', testEmail)
    console.log('🔑 Senha:', testPassword)
    console.log('👤 Role: admin')
  }
  
  // Test 3: Try to sign in
  console.log('\n🔐 Testando login...')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })
  
  if (signInError) {
    console.error('❌ Erro ao fazer login:', signInError.message)
    console.log('\n💡 Você precisa criar usuários no Supabase Dashboard:')
    console.log('   1. Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/users')
    console.log('   2. Clique em "Add user" → "Create new user"')
    console.log('   3. Email: admin@exemplo.com')
    console.log('   4. Password: admin123')
    console.log('   5. Auto Confirm User: ✅ (marque esta opção)')
  } else {
    console.log('✅ Login realizado com sucesso!')
    console.log('👤 User ID:', signInData.user?.id)
    console.log('📧 Email:', signInData.user?.email)
    console.log('🎭 Role:', signInData.user?.user_metadata?.role || 'não definido')
  }
}

testAuth()
