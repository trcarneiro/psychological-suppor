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

async function testDifferentPrompts() {
  console.log('🧪 Testando DIFERENTES formatos de prompt\n')
  
  const prompts = [
    {
      name: 'Lista simples',
      text: 'Liste 3 frutas'
    },
    {
      name: 'Três nomes',
      text: 'Dê 3 nomes de pessoas'
    },
    {
      name: 'Três cores',
      text: 'Liste 3 cores'
    },
    {
      name: 'Respostas curtas (SEM contexto)',
      text: 'Dê 3 respostas curtas (máximo 5 palavras)'
    },
    {
      name: 'Com contexto emocional',
      text: 'Liste 3 respostas para: "Como você está?"'
    }
  ]
  
  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i]
    
    console.log(`\n📝 Teste ${i + 1}: ${p.name}`)
    console.log(`Prompt: "${p.text}"\n`)
    
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: p.text }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        },
      })
      
      const response = result.response
      const text = response.text()
      const finishReason = response.candidates?.[0]?.finishReason
      
      if (finishReason === 'STOP') {
        console.log(`✅ SUCESSO! finishReason: ${finishReason}`)
        console.log(`Resposta: ${text.substring(0, 100)}...`)
      } else {
        console.log(`❌ FALHOU: finishReason = ${finishReason}`)
        console.log(`Resposta: ${text || '(vazio)'}`)
      }
      
      // Delay
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
      
    } catch (error: any) {
      console.error('❌ ERRO:', error.message)
    }
  }
  
  console.log('\n✅ Testes concluídos!')
}

testDifferentPrompts()
