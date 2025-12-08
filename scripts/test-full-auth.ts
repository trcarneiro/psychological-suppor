import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dixwysghljgqvewfmmcj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeHd5c2dobGpncXZld2ZtbWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjIwOTEsImV4cCI6MjA3OTEzODA5MX0.A6PiB_FouhHhXrMx1aD2BxdXKVsdzDHQrXWjHDZfx8k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFullAuthFlow() {
  console.log('🔐 Teste Completo de Autenticação Supabase\n')
  console.log('=' .repeat(60))
  
  // Test 1: Verificar configuração
  console.log('\n1️⃣  Verificando Configuração...')
  console.log('   URL:', supabaseUrl)
  console.log('   ✅ Configuração OK\n')
  
  // Test 2: Criar usuário admin
  console.log('2️⃣  Criando usuário admin de teste...')
  const adminEmail = 'admin@exemplo.com'
  const adminPassword = 'admin123'
  
  const { data: adminSignUp, error: adminSignUpError } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
      data: {
        role: 'admin',
        name: 'Administrador'
      }
    }
  })
  
  if (adminSignUpError) {
    if (adminSignUpError.message.includes('already registered')) {
      console.log('   ℹ️  Usuário admin já existe')
    } else {
      console.log('   ❌ Erro:', adminSignUpError.message)
    }
  } else {
    console.log('   ✅ Admin criado:', adminEmail)
    console.log('   📧 Verificar email para confirmar conta')
  }
  
  // Test 3: Criar usuário client
  console.log('\n3️⃣  Criando usuário cliente de teste...')
  const clientEmail = 'cliente@exemplo.com'
  const clientPassword = 'cliente123'
  
  const { data: clientSignUp, error: clientSignUpError } = await supabase.auth.signUp({
    email: clientEmail,
    password: clientPassword,
    options: {
      data: {
        role: 'client',
        name: 'Cliente Teste'
      }
    }
  })
  
  if (clientSignUpError) {
    if (clientSignUpError.message.includes('already registered')) {
      console.log('   ℹ️  Usuário cliente já existe')
    } else {
      console.log('   ❌ Erro:', clientSignUpError.message)
    }
  } else {
    console.log('   ✅ Cliente criado:', clientEmail)
    console.log('   📧 Verificar email para confirmar conta')
  }
  
  // Test 4: Tentar login com admin
  console.log('\n4️⃣  Testando login como admin...')
  const { data: adminLogin, error: adminLoginError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  })
  
  if (adminLoginError) {
    console.log('   ❌ Erro no login:', adminLoginError.message)
    
    if (adminLoginError.message.includes('Email not confirmed')) {
      console.log('\n   ⚠️  AÇÃO NECESSÁRIA:')
      console.log('   1. Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/users')
      console.log('   2. Encontre o usuário:', adminEmail)
      console.log('   3. Clique nos 3 pontos → "Confirm user"')
      console.log('   4. Repita para:', clientEmail)
      console.log('\n   OU configure para auto-confirmar:')
      console.log('   1. Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/providers')
      console.log('   2. Clique em "Email" → Edit')
      console.log('   3. Desmarque "Enable email confirmations"')
      console.log('   4. Save')
    }
  } else {
    console.log('   ✅ Login bem-sucedido!')
    console.log('   👤 User ID:', adminLogin.user?.id)
    console.log('   📧 Email:', adminLogin.user?.email)
    console.log('   🎭 Role:', adminLogin.user?.user_metadata?.role)
    console.log('   📛 Nome:', adminLogin.user?.user_metadata?.name)
    
    // Test 5: Verificar sessão
    console.log('\n5️⃣  Verificando sessão ativa...')
    const { data: sessionData } = await supabase.auth.getSession()
    
    if (sessionData.session) {
      console.log('   ✅ Sessão ativa')
      console.log('   ⏰ Expira em:', new Date(sessionData.session.expires_at! * 1000).toLocaleString('pt-BR'))
    } else {
      console.log('   ❌ Sem sessão ativa')
    }
    
    // Test 6: Fazer logout
    console.log('\n6️⃣  Fazendo logout...')
    await supabase.auth.signOut()
    console.log('   ✅ Logout bem-sucedido')
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('\n✅ PRÓXIMOS PASSOS:\n')
  console.log('1. Siga as instruções em SUPABASE_SETUP.md')
  console.log('2. Configure o Google OAuth (opcional)')
  console.log('3. Confirme os usuários no dashboard do Supabase')
  console.log('4. Execute: npm run dev')
  console.log('5. Acesse: http://localhost:5173/admin')
  console.log('6. Teste login com:')
  console.log('   - Email: admin@exemplo.com | Senha: admin123')
  console.log('   - Email: cliente@exemplo.com | Senha: cliente123')
  console.log('\n🚀 Pronto para usar!\n')
}

testFullAuthFlow().catch(console.error)
