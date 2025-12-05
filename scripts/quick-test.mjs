/**
 * Script de teste simplificado para verificar o funcionamento do chat
 * Executa: node scripts/quick-test.mjs
 */

const API_BASE = 'http://localhost:3333/api';

// Agente Sofia (o mesmo que está em src/lib/predefined-agents.ts)
const sofiaAgent = {
  id: 'sofia',
  name: 'Sofia',
  personality: 'Acolhedora e empática',
  description: 'Especialista em ansiedade e acolhimento inicial',
  model: 'gemini-2.5-pro',
  systemPrompt: 'Você é Sofia, uma psicóloga virtual acolhedora.',
  greeting: 'Olá! Sou a Sofia, estou aqui para te ouvir. Como você está se sentindo hoje?',
  conversationStyle: 'empático',
  maxMessageLength: 500,
  responseDelay: 1500,
  collectDataFields: ['name', 'age', 'mainConcern'],
  autoReferralThreshold: 7,
  temperature: 0.8,
  active: true,
  color: 'from-pink-500 to-rose-400',
  icon: 'Heart'
};

async function test() {
  console.log('\n🧪 TESTE RÁPIDO DO CHAT\n');
  
  try {
    // 1. Health check
    console.log('1️⃣ Verificando health...');
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    console.log('   ✅ Health:', health.status);
    
    // 2. Criar conversa com agente Sofia
    console.log('\n2️⃣ Criando conversa com Sofia...');
    const createRes = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: sofiaAgent }),
    });
    
    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Erro ao criar conversa: ${createRes.status} - ${errText}`);
    }
    
    const conversation = await createRes.json();
    const convId = conversation.conversation?.id || conversation.id;
    console.log(`   ✅ Conversa criada: ${convId}`);
    console.log(`   📩 Mensagem inicial: ${conversation.conversation?.messages?.[0]?.content?.slice(0, 80) || 'N/A'}...`);
    
    // 3. Enviar mensagem do usuário
    console.log('\n3️⃣ Enviando mensagem do usuário...');
    const response1 = await fetch(`${API_BASE}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Olá, estou me sentindo muito ansioso ultimamente.' }),
    });
    
    if (!response1.ok) {
      const errText = await response1.text();
      throw new Error(`Erro ao enviar mensagem: ${response1.status} - ${errText}`);
    }
    
    const msg1 = await response1.json();
    const lastMsg = msg1.conversation?.messages?.slice(-1)[0];
    console.log(`   ✅ Resposta da IA: ${lastMsg?.content?.slice(0, 100)}...`);
    console.log(`   💬 Total de mensagens: ${msg1.conversation?.messages?.length}`);
    
    if (msg1.suggestions?.length > 0) {
      console.log(`   💡 Sugestões: ${msg1.suggestions.slice(0, 3).join(' | ')}`);
    }
    
    // 4. Enviar mais mensagens para extrair lead
    console.log('\n4️⃣ Enviando mais mensagens para testar extração de lead...');
    
    const response2 = await fetch(`${API_BASE}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Meu nome é João Silva, tenho 32 anos.' }),
    }).then(r => r.json());
    console.log(`   ✅ Mensagem 2 enviada, total: ${response2.conversation?.messages?.length}`);
    
    const response3 = await fetch(`${API_BASE}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Nunca fiz terapia antes, mas acho que preciso.' }),
    }).then(r => r.json());
    console.log(`   ✅ Mensagem 3 enviada, total: ${response3.conversation?.messages?.length}`);
    
    const response4 = await fetch(`${API_BASE}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Isso começou há cerca de 3 meses.' }),
    }).then(r => r.json());
    console.log(`   ✅ Mensagem 4 enviada, total: ${response4.conversation?.messages?.length}`);
    
    // 5. Verificar lead
    console.log('\n5️⃣ Verificando lead extraído...');
    if (response4.lead) {
      console.log(`   ✅ Lead extraído:`);
      console.log(`      Nome: ${response4.lead.name || 'não detectado'}`);
      console.log(`      Idade: ${response4.lead.age || 'não detectado'}`);
      console.log(`      Terapia anterior: ${response4.lead.previousTherapy !== null ? (response4.lead.previousTherapy ? 'Sim' : 'Não') : 'não detectado'}`);
      console.log(`      Score: ${response4.lead.score || 0}`);
    } else {
      console.log('   ⚠️ Lead ainda não foi extraído');
    }
    
    // 6. Stats
    console.log('\n6️⃣ Estatísticas...');
    const stats = await fetch(`${API_BASE}/leads/stats`).then(r => r.json());
    console.log(`   ✅ Stats:`, stats);
    
    // 7. Cleanup
    console.log('\n7️⃣ Limpando conversa de teste...');
    await fetch(`${API_BASE}/conversations/${convId}`, { method: 'DELETE' });
    console.log('   ✅ Conversa deletada');
    
    console.log('\n✅ TODOS OS TESTES PASSARAM!\n');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

test();
