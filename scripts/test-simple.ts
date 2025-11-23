import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

async function testSimplePrompt() {
  console.log('\n🧪 Testando resposta simples do Gemini...\n')
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    
    // Teste com gemini-1.5-flash
    console.log('📝 Teste 1: gemini-1.5-flash')
    const model1 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result1 = await model1.generateContent('Diga apenas: Olá')
    console.log('✅ Resposta:', result1.response.text())
    console.log('✅ finishReason:', result1.response.candidates?.[0]?.finishReason)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Teste com gemini-2.5-flash  
    console.log('\n📝 Teste 2: gemini-2.5-flash')
    const model2 = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result2 = await model2.generateContent('Diga apenas: Olá')
    console.log('✅ Resposta:', result2.response.text())
    console.log('✅ finishReason:', result2.response.candidates?.[0]?.finishReason)
    
  } catch (error: any) {
    console.error('❌ ERRO:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    }
  }
  
  console.log('\n✅ Teste concluído!\n')
}

testSimplePrompt()
