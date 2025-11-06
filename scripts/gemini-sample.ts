import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('Defina GEMINI_API_KEY no arquivo .env antes de rodar este script.')
    process.exit(1)
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro'
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: modelName })

  const prompt = `Você é um assistente de acolhimento psicológico. Resuma em 3 frases acolhedoras o pedido a seguir:

"Tenho sentido muita ansiedade no trabalho e não sei como lidar com isso."`

  const result = await model.generateContent(prompt)
  console.log('\nResposta do Gemini:')
  console.log(result.response.text())
}

main().catch(error => {
  console.error('Erro ao executar script de teste do Gemini:', error)
  process.exit(1)
})
