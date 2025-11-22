import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const GEMINI_API_KEY = "AIzaSyBGz97Mic8bG2qTGwBylcJFyD52E3TM9NM"
const GEMINI_MODEL = "gemini-2.5-pro"

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
]

async function testPrompts() {
  console.log('\n🧪 Testando diferentes configurações de prompt...')
  console.log('═'.repeat(60))

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  
  const testCases = [
    {
      name: 'Teste 1: Prompt atual (178 chars)',
      prompt: `Gere 3 respostas curtas (máximo 6 palavras cada) que uma pessoa poderia dar para:

"💙 Entendo perfeitamente o quanto é importante"

Formato:
Resposta 1
Resposta 2
Resposta 3`,
      maxTokens: 150
    },
    {
      name: 'Teste 2: Prompt minimalista (80 chars)',
      prompt: `3 respostas (5 palavras):
"Entendo perfeitamente o quanto"

1.
2.
3.`,
      maxTokens: 150
    },
    {
      name: 'Teste 3: Prompt minimalista + mais tokens',
      prompt: `3 respostas (5 palavras):
"Entendo perfeitamente o quanto"

1.
2.
3.`,
      maxTokens: 300
    },
    {
      name: 'Teste 4: Prompt ULTRA mini (50 chars)',
      prompt: `3 respostas:
"Entendo"

1.
2.
3.`,
      maxTokens: 200
    },
    {
      name: 'Teste 6: High Tokens (2000)',
      prompt: '3 respostas curtas:\n1.\n2.\n3.',
      maxTokens: 2000
    }
  ]

  for (const test of testCases) {
    console.log(`\n📝 ${test.name}`)
    console.log(`   Prompt length: ${test.prompt.length} chars`)
    console.log(`   maxOutputTokens: ${test.maxTokens}`)
    
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: test.maxTokens,
        },
        safetySettings: SAFETY_SETTINGS,
      })

      const result = await model.generateContent(test.prompt)
      const response = result.response
      const candidate = response.candidates?.[0]
      
      console.log(`   ✅ finishReason: ${candidate?.finishReason}`)
      console.log(`   📊 Usage Metadata: ${JSON.stringify(response.usageMetadata)}`)
      
      if (candidate?.finishReason === 'MAX_TOKENS') {
        console.log('   ❌ MAX_TOKENS atingido!')
        console.log(`   Content: ${JSON.stringify(candidate.content)}`)
      } else {
        const text = response.text()
        console.log(`   ✅ Resposta (${text.length} chars): ${text.substring(0, 100)}...`)
        const lines = text.split('\n').filter(l => l.trim())
        console.log(`   ✅ Linhas geradas: ${lines.length}`)
        lines.forEach((l, i) => console.log(`      ${i+1}. ${l.substring(0, 50)}`))
      }
      
    } catch (error: any) {
      console.log(`   ❌ ERRO: ${error.message}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1s delay entre requests
  }

  console.log('\n═'.repeat(60))
  console.log('✅ Testes concluídos!\n')
}

testPrompts()
