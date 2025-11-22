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
  console.log('🧪 Testando COM e SEM emojis...\n')
  
  // Teste 1: COM emoji (como a Sofia usa)
  const msgComEmoji = "💙 Entendo que você está passando por um momento difícil."
  const prompt1 = `Gere 3 respostas curtas (máximo 6 palavras cada) que uma pessoa poderia dar para:

"${msgComEmoji.substring(0, 50)}"

Formato:
Resposta 1
Resposta 2
Resposta 3`

  console.log('📝 Teste 1 - COM EMOJI')
  console.log('Prompt:', prompt1.substring(0, 100) + '...')
  
  try {
    const result1 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt1 }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result1.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result1.response.text())
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
  
  console.log('\n---\n')
  
  // Teste 2: SEM emoji
  const msgSemEmoji = "Entendo que você está passando por um momento difícil."
  const prompt2 = `Gere 3 respostas curtas (máximo 6 palavras cada) que uma pessoa poderia dar para:

"${msgSemEmoji.substring(0, 50)}"

Formato:
Resposta 1
Resposta 2
Resposta 3`

  console.log('📝 Teste 2 - SEM EMOJI')
  console.log('Prompt:', prompt2.substring(0, 100) + '...')
  
  try {
    const result2 = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt2 }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
    })
    console.log('✅ finishReason:', result2.response.candidates?.[0]?.finishReason)
    console.log('✅ Resposta:', result2.response.text())
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

test()
