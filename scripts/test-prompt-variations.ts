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

async function test() {
  console.log('🧪 Testando diferentes abordagens de prompt...\n')
  
  // Teste 1: Lista simples (sabemos que funciona)
  console.log('📝 Teste 1 - Lista simples (CONTROLE)')
  try {
    const result1 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Liste 3 frutas' }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result1.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result1.response.text().substring(0, 80))
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
  
  console.log('\n---\n')
  
  // Teste 2: Três respostas diretas
  console.log('📝 Teste 2 - Três respostas diretas')
  try {
    const result2 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Dê 3 respostas curtas para: Como você está?' }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result2.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result2.response.text())
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
  
  console.log('\n---\n')
  
  // Teste 3: Com "máximo X palavras"
  console.log('📝 Teste 3 - Com limite de palavras')
  try {
    const result3 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Dê 3 respostas (máximo 5 palavras cada)' }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result3.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result3.response.text())
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
  
  console.log('\n---\n')
  
  // Teste 4: Formato numerado
  console.log('📝 Teste 4 - Com formato numerado')
  try {
    const result4 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Três frutas:\n1.\n2.\n3.' }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result4.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result4.response.text())
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

test()
