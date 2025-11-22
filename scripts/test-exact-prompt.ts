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
  console.log('🧪 Testando com prompt EXATO do aiProvider.ts...\n')
  
  const lastAssistantMessage = "💙 Entendo que você está passando por um momento difícil. Obrigada por confiar em mim para compartilhar isso. 🌸 Como posso te ajudar melhor hoje?"
  
  const prompt = `Gere 3 respostas curtas (máximo 6 palavras cada) que uma pessoa poderia dar para:

"${lastAssistantMessage.substring(0, 50)}"

Formato:
Resposta 1
Resposta 2
Resposta 3`

  console.log('📝 Prompt length:', prompt.length, 'chars')
  console.log('📝 Prompt:\n', prompt)
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
    
    console.log('✅ Resposta:', text)
    console.log('finishReason:', response.candidates?.[0]?.finishReason)
    console.log('content:', JSON.stringify(response.candidates?.[0]?.content, null, 2))
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2))
    }
  }
}

test()
