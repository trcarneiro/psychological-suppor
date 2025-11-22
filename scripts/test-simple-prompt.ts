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

async function testSimplePrompt() {
  console.log('🧪 Testando prompt SIMPLIFICADO (sem "para:")\n')
  
  const prompt = `3 respostas curtas (máximo 6 palavras) de apoio emocional:`
  
  console.log('📝 Prompt:', prompt)
  console.log('Length:', prompt.length, 'chars\n')
  
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
      console.log('✅ SUCESSO!\n')
      console.log('Resposta completa:')
      console.log(text)
      
      // Parse
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
    }
    
  } catch (error: any) {
    console.error('❌ ERRO:', error.message)
  }
}

testSimplePrompt()
