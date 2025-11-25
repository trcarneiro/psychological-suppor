import { generateSuggestions } from '../server/services/aiProvider';
import { config } from 'dotenv';

// Load environment variables
config();

async function run() {
  console.log('Testing generateSuggestions...');
  
  const mockAgent = {
    id: 'test',
    name: 'Test Agent',
    personality: 'Helpful',
    description: 'Test',
    model: 'gemini-2.5-flash',
    systemPrompt: 'You are a helpful assistant.',
    greeting: 'Hello',
    conversationStyle: 'casual',
    maxMessageLength: 200,
    responseDelay: 0,
    collectDataFields: [],
    autoReferralThreshold: 10,
    temperature: 0.7,
    active: true,
    color: 'blue',
    icon: 'Chat'
  };

  const mockHistory: any[] = [];
  const lastAssistantMessage = "Olá! Percebo que você está passando por um momento difícil. Gostaria de me contar mais sobre o que tem sentido ultimamente?";

  console.log(`\nInput Message: "${lastAssistantMessage}"\n`);

  const suggestions = await generateSuggestions({
    agent: mockAgent,
    history: mockHistory,
    lastAssistantMessage
  });

  console.log('\nResult Suggestions:', suggestions);
  
  if (suggestions.length === 3) {
    console.log('\n✅ SUCCESS: Generated exactly 3 suggestions.');
    // Check length of suggestions
    const longSuggestions = suggestions.filter(s => s.length > 60);
    if (longSuggestions.length > 0) {
        console.warn('⚠️ WARNING: Some suggestions are longer than 60 chars:', longSuggestions);
    } else {
        console.log('✅ LENGTH CHECK: All suggestions are within limit.');
    }
  } else {
    console.error(`\n❌ FAILURE: Generated ${suggestions.length} suggestions (expected 3).`);
  }
}

run().catch(console.error);
