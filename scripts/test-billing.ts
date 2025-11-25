import { GoogleGenerativeAI } from '@google/generative-ai'
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ]
})

async function testSuggestions() {
  console.log('🧪 Testando geração de sugestões com FATURAMENTO ATIVADO\n')
  
  const testMessages = [
    "💙 Como você está se sentindo hoje?",
    "💙 O que te trouxe aqui hoje? Estou aqui para ouvir. 🌸",
    "💙 Entendo que você está passando por um momento difícil. Obrigada por confiar em mim."
  ]
  
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i]
    const prompt = `Liste 3 respostas curtas (máximo 6 palavras cada) que uma pessoa em apoio psicológico poderia dar para:

"${message.substring(0, 80)}"

Formato numerado simples.`

    console.log(`\n📝 Teste ${i + 1}:`)
    console.log(`Mensagem da Sofia: "${message.substring(0, 50)}..."`)
    console.log(`Prompt length: ${prompt.length} chars\n`)
    
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        },
      })
      
      const response = result.response
      const text = response.text()
      const finishReason = response.candidates?.[0]?.finishReason
      
      console.log(`finishReason: ${finishReason}`)
      
      if (finishReason === 'STOP') {
        console.log('✅ SUCESSO! Resposta completa:\n')
        console.log(text)
        
        // Parse das sugestões
        const suggestions = text
          .split('\n')
          .map(line => line.trim())
          .map(line => line.replace(/^\d+[.)]\s*/, ''))
          .filter(line => line.length > 3 && line.length < 80)
          .slice(0, 3)
        
        console.log('\n🎯 Sugestões extraídas:')
        suggestions.forEach((s, idx) => console.log(`   ${idx + 1}. "${s}"`))
      } else {
        console.log(`❌ FALHOU: finishReason = ${finishReason}`)
        console.log('Resposta:', text || '(vazio)')
      }
      
      // Delay entre testes para evitar rate limit
      if (i < testMessages.length - 1) {
        console.log('\n⏳ Aguardando 2 segundos antes do próximo teste...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
    } catch (error: any) {
      console.error('❌ ERRO:', error.message)
    }
  }
  
  console.log('\n\n✅ Testes concluídos!')
}

testSuggestions()
