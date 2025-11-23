import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

async function listModels() {
  console.log('\n📋 Listando modelos disponíveis na API...\n')
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log(`✅ Total de modelos: ${data.models?.length || 0}\n`)
    
    const geminiModels = data.models?.filter((m: any) => 
      m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent')
    )
    
    console.log('🤖 Modelos Gemini disponíveis para generateContent:\n')
    geminiModels?.forEach((model: any) => {
      const name = model.name.replace('models/', '')
      console.log(`  ✅ ${name}`)
      console.log(`     displayName: ${model.displayName}`)
      console.log(`     description: ${model.description?.substring(0, 80)}...`)
      console.log()
    })
    
  } catch (error: any) {
    console.error('❌ ERRO:', error.message)
  }
}

listModels()
