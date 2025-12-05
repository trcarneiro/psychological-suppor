
import 'dotenv/config';
import { generateText } from '../server/services/llm';

const CONCURRENT_USERS = 5;
const MESSAGES_PER_USER = 3;

async function simulateUser(userId: number) {
  console.log(`[User ${userId}] Starting conversation...`);
  const history: string[] = [];
  
  for (let i = 0; i < MESSAGES_PER_USER; i++) {
    const userMessage = `Mensagem ${i + 1} do usuário ${userId}. Estou me sentindo ansioso.`;
    history.push(`User: ${userMessage}`);
    
    const prompt = `
      Você é um psicólogo empático.
      Histórico:
      ${history.join('\n')}
      
      Responda ao usuário: ${userMessage}
    `;

    const start = Date.now();
    try {
      console.log(`[User ${userId}] Sending message ${i + 1}...`);
      const response = await generateText(prompt, { temperature: 0.7, maxOutputTokens: 8192 });
      const duration = Date.now() - start;
      
      if (response) {
        console.log(`[User ${userId}] ✅ Received response in ${duration}ms: ${response.substring(0, 50)}...`);
        history.push(`Assistant: ${response}`);
      } else {
        console.error(`[User ${userId}] ❌ Failed to get response.`);
      }
    } catch (error) {
      console.error(`[User ${userId}] ❌ Error:`, error);
    }
    
    // Random delay between messages
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  }
  console.log(`[User ${userId}] Finished.`);
}

async function runStressTest() {
  console.log(`Starting stress test with ${CONCURRENT_USERS} concurrent users...`);
  const promises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    promises.push(simulateUser(i + 1));
  }
  
  await Promise.all(promises);
  console.log('Stress test complete.');
}

runStressTest().catch(console.error);
