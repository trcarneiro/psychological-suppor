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

async function testFinalPrompt() {
  console.log('🧪 Testando PROMPT FINAL implementado no código\n')
  
  const prompt = `Dê 3 respostas curtas (máximo 6 palavras cada)`
  
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
      console.log('\n✅ SUCESSO! Resposta completa:')
      console.log(text)
      
      // Parse (mesmo processo do código)
      const suggestions = text
        .split('\n')
        .map(line => line.trim())
        .map(line => line.replace(/^\d+[.)]\s*/, ''))
        .filter(line => line.length > 3 && line.length < 80)
        .slice(0, 3)
      
      console.log('\n🎯 Sugestões processadas:')
      suggestions.forEach((s, idx) => console.log(`   ${idx + 1}. "${s}"`))
      
      if (suggestions.length >= 3) {
        console.log('\n✅ Sistema funcionando perfeitamente! 3 sugestões geradas.')
      } else {
        console.log(`\n⚠️ Apenas ${suggestions.length} sugestões - fallback será usado para completar.`)
      }
    } else {
      console.log(`\n❌ FALHOU: finishReason = ${finishReason}`)
      console.log('Resposta:', text || '(vazio)')
      console.log('\n⚠️ Sistema usará fallback contextual (padrões).')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    console.log('⚠️ Sistema usará fallback contextual.')
  }
}

testFinalPrompt()
