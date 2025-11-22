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

async function testWithIncreasedTokens() {
  console.log('🧪 Testando com maxOutputTokens AUMENTADO para 400\n')
  console.log('Motivo: Gemini 2.5 usa "thinking tokens" que contam no limite!')
  console.log('No teste anterior: 53 prompt + 149 thinking = 202 total > 150 limite\n')
  
  const prompt = `Dê 3 respostas curtas (máximo 6 palavras cada)`
  
  console.log('📝 Prompt:', prompt)
  console.log('Length:', prompt.length, 'chars')
  console.log('maxOutputTokens: 400 (era 150-200)\n')
  
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 400, // AUMENTADO!
      },
    })
    
    const response = result.response
    const text = response.text()
    const finishReason = response.candidates?.[0]?.finishReason
    
    console.log(`finishReason: ${finishReason}`)
    
    if (finishReason === 'STOP') {
      console.log('\n✅ SUCESSO! Resposta completa:')
      console.log(text)
      
      // Parse
      const suggestions = text
        .split('\n')
        .map(line => line.trim())
        .map(line => line.replace(/^\d+[.)]\s*/, ''))
        .filter(line => line.length > 3 && line.length < 80)
        .slice(0, 3)
      
      console.log('\n🎯 Sugestões processadas:')
      suggestions.forEach((s, idx) => console.log(`   ${idx + 1}. "${s}"`))
      
      console.log('\n🎉 PROBLEMA RESOLVIDO! Thinking tokens agora têm espaço.')
    } else {
      console.log(`\n❌ Ainda falhou: finishReason = ${finishReason}`)
      console.log('Resposta:', text || '(vazio)')
    }
    
    // Mostrar metadados se disponível
    if ((result.response as any).usageMetadata) {
      const meta = (result.response as any).usageMetadata
      console.log('\n📊 Token Usage:')
      console.log('  Prompt tokens:', meta.promptTokenCount)
      console.log('  Thinking tokens:', meta.thoughtsTokenCount || 0)
      console.log('  Output tokens:', meta.candidatesTokenCount || 0)
      console.log('  Total:', meta.totalTokenCount)
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
  }
}

testWithIncreasedTokens()
