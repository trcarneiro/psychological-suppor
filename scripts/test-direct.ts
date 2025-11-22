import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = "AIzaSyBGz97Mic8bG2qTGwBylcJFyD52E3TM9NM"

async function testDirect() {
  console.log('\n🧪 Teste DIRETO com gemini-2.5-flash...\n')
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    console.log('📝 Teste 1: Prompt super simples')
    const result1 = await model.generateContent('Diga: Olá')
    console.log('Resposta:', result1.response.text())
    console.log('finishReason:', result1.response.candidates?.[0]?.finishReason)
    console.log()
    
    console.log('📝 Teste 2: 3 sugestões')
    const result2 = await model.generateContent('Liste 3 frutas')
    console.log('Resposta:', result2.response.text())
    console.log('finishReason:', result2.response.candidates?.[0]?.finishReason)
    
  } catch (error: any) {
    console.error('❌ ERRO:', error.message)
  }
}

testDirect()
