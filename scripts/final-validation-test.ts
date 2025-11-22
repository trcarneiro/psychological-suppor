import 'dotenv/config'

import { PREDEFINED_AGENTS } from '../src/lib/predefined-agents'
import { generateAssistantReply, generateSuggestions } from '../server/services/aiProvider'
import type { ConversationMessage } from '../server/services/aiProvider'

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY não configurada. Configure a variável de ambiente antes de testar.')
    process.exit(1)
  }

  const agent = PREDEFINED_AGENTS[0]
  const history: ConversationMessage[] = [
    {
      role: 'user',
      content: 'Oi, estou me sentindo sobrecarregado com tantas mudanças recentes.'
    },
    {
      role: 'assistant',
      content: 'Obrigada por compartilhar isso comigo. Posso te acompanhar para entendermos melhor como apoiar você nesse momento.'
    }
  ]

  const userMessage = 'Hoje acordei muito ansioso e não consegui trabalhar direito.'

  console.log('🧪 Testando generateAssistantReply com o agente', agent.name)
  const reply = await generateAssistantReply({ agent, history, userMessage })
  console.log('\n🤖 Resposta da assistente:')
  console.log(reply)

  console.log('\n🧠 Testando generateSuggestions com a última resposta da assistente...')
  const suggestions = await generateSuggestions({ agent, history: [...history, { role: 'assistant', content: reply }], lastAssistantMessage: reply })
  console.log('\n🎯 Sugestões geradas:', suggestions)

  if (suggestions.length === 0) {
    console.log('\n⚠️ Nenhuma sugestão foi retornada. Verifique os logs para entender o motivo.')
  } else {
    console.log('\n✅ Teste concluído com sucesso!')
  }
}

main().catch(error => {
  console.error('\n❌ Erro ao executar o teste:', error)
  process.exit(1)
})
