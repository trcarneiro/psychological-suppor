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
  console.log('🧪 Testando prompt CORRIGIDO\n')
  
  const prompt = `Dê 3 respostas (máximo 5 palavras cada)`

  console.log('📝 Prompt:', prompt)
  console.log('\n---\n')
  
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 150,
      },
    })
    
    const response = result.response
    const text = response.text()
    
    console.log('✅ finishReason:', response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta completa:', text)
    console.log('\nParsing sugestões:')
    const suggestions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length < 80)
      .slice(0, 3)
    suggestions.forEach((s, i) => console.log(`  ${i + 1}. "${s}"`))
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

test()
