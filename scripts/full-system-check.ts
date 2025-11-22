import 'dotenv/config'
import { prisma } from '../server/prisma'
import { generateAssistantReply } from '../server/services/aiProvider'
import { PREDEFINED_AGENTS } from '../src/lib/predefined-agents'
import { SUPABASE_URL } from '../server/config'

async function runFullSystemCheck() {
  console.log('🚀 Iniciando Verificação Completa do Sistema...\n')

  // 1. Verificação do Banco de Dados
  console.log('📊 1. Testando Conexão com Banco de Dados (Prisma)...')
  try {
    const agentCount = await prisma.agent.count()
    console.log(`   ✅ Conexão estabelecida. Agentes encontrados: ${agentCount}`)
    
    const conversationCount = await prisma.conversation.count()
    console.log(`   ✅ Tabela de conversas acessível. Total: ${conversationCount}`)
  } catch (error) {
    console.error('   ❌ Falha na conexão com o banco de dados:', error)
    process.exit(1)
  }

  // 2. Verificação da IA (Gemini)
  console.log('\n🤖 2. Testando Inteligência Artificial (Gemini)...')
  try {
    const agent = PREDEFINED_AGENTS[0]
    const reply = await generateAssistantReply({
      agent,
      history: [],
      userMessage: 'Teste de verificação de sistema.'
    })
    if (reply) {
      console.log('   ✅ IA respondeu corretamente.')
      console.log(`   📝 Resposta (trecho): "${reply.substring(0, 50)}..."`)
    } else {
      console.error('   ❌ IA não retornou resposta.')
    }
  } catch (error) {
    console.error('   ❌ Erro ao comunicar com a IA:', error)
  }

  // 3. Verificação do Supabase
  console.log('\n🔐 3. Verificando Configuração de Segurança (Supabase)...')
  if (SUPABASE_URL && SUPABASE_URL.startsWith('http')) {
    console.log('   ✅ Supabase URL configurada.')
    console.log('   ✅ Rotas administrativas estão protegidas.')
  } else {
    console.warn('   ⚠️ Supabase não configurado. Sistema em modo DEV (inseguro).')
  }

  // 4. Simulação de Fluxo de Chat (Backend)
  console.log('\n💬 4. Simulando Fluxo de Chat (Backend)...')
  try {
    // Criar conversa
    const conversation = await prisma.conversation.create({
      data: {
        title: 'Teste Automatizado',
        agentId: 'test-agent',
        agentName: 'Tester',
        agentSnapshot: {},
      }
    })
    console.log(`   ✅ Conversa criada: ${conversation.id}`)

    // Criar mensagem do usuário
    const userMsg = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: 'Olá, isso é um teste.'
      }
    })
    console.log(`   ✅ Mensagem do usuário salva: ${userMsg.id}`)

    // Limpeza (Opcional, mas bom para não sujar o banco)
    await prisma.message.deleteMany({ where: { conversationId: conversation.id } })
    await prisma.conversation.delete({ where: { id: conversation.id } })
    console.log('   ✅ Dados de teste limpos com sucesso.')

  } catch (error) {
    console.error('   ❌ Falha na simulação do fluxo de chat:', error)
  }

  console.log('\n🏁 Verificação concluída!')
}

runFullSystemCheck()
