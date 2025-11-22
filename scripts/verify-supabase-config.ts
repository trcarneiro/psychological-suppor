import 'dotenv/config'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../server/config'

console.log('--- Verificando Configuração do Supabase ---')

if (SUPABASE_URL && SUPABASE_URL.startsWith('http')) {
  console.log('✅ SUPABASE_URL carregada corretamente:', SUPABASE_URL)
} else {
  console.error('❌ SUPABASE_URL inválida ou ausente:', SUPABASE_URL)
}

if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20) {
  console.log('✅ SUPABASE_ANON_KEY carregada corretamente (tamanho ok).')
} else {
  console.error('❌ SUPABASE_ANON_KEY inválida ou ausente.')
}

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  console.log('\n🎉 Configuração válida! O modo de segurança deve estar ATIVO.')
} else {
  console.log('\n⚠️ Configuração incompleta. O sistema deve estar em modo DEV (inseguro).')
}
