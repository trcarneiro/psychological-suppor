/**
 * Script de teste completo para todas as funcionalidades da aplicação
 * Executa: npx tsx scripts/test-all-endpoints.ts
 */

const API_BASE = 'http://localhost:3333/api';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  data?: any;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<any>): Promise<void> {
  try {
    const data = await fn();
    results.push({ name, status: 'PASS', message: 'OK', data });
    console.log(`✅ ${name}`);
  } catch (error: any) {
    results.push({ name, status: 'FAIL', message: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function fetchJSON(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
  }
  
  return response.json();
}

async function runTests() {
  console.log('\n🧪 TESTE COMPLETO DA APLICAÇÃO - Psychological Support Platform\n');
  console.log('=' .repeat(60) + '\n');
  
  // ==================== 1. TESTES DE AGENTES ====================
  console.log('📋 1. TESTES DE AGENTES\n');
  
  let agents: any[] = [];
  await test('GET /api/agents - Listar agentes predefinidos', async () => {
    agents = await fetchJSON(`${API_BASE}/agents`);
    if (!Array.isArray(agents) || agents.length === 0) {
      throw new Error('Nenhum agente retornado');
    }
    return { count: agents.length, names: agents.map(a => a.name) };
  });
  
  if (agents.length > 0) {
    await test('GET /api/agents/:id - Buscar agente específico', async () => {
      const agent = await fetchJSON(`${API_BASE}/agents/${agents[0].id}`);
      if (!agent.name || !agent.systemPrompt) {
        throw new Error('Agente incompleto');
      }
      return { id: agent.id, name: agent.name };
    });
  }
  
  // ==================== 2. TESTES DE CONVERSAÇÃO ====================
  console.log('\n📋 2. TESTES DE CONVERSAÇÃO\n');
  
  let conversationId: string = '';
  
  await test('POST /api/conversations - Criar nova conversa', async () => {
    const agentId = agents[0]?.id || 'sofia';
    const conversation = await fetchJSON(`${API_BASE}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ agentId }),
    });
    
    if (!conversation.id) {
      throw new Error('Conversa não criada');
    }
    conversationId = conversation.id;
    return { id: conversation.id, title: conversation.title };
  });
  
  await test('GET /api/conversations - Listar conversas', async () => {
    const conversations = await fetchJSON(`${API_BASE}/conversations`);
    if (!Array.isArray(conversations)) {
      throw new Error('Resposta inválida');
    }
    return { count: conversations.length };
  });
  
  if (conversationId) {
    await test('GET /api/conversations/:id - Buscar conversa específica', async () => {
      const conversation = await fetchJSON(`${API_BASE}/conversations/${conversationId}`);
      if (!conversation.id || !conversation.messages) {
        throw new Error('Conversa incompleta');
      }
      return { id: conversation.id, messagesCount: conversation.messages.length };
    });
  }
  
  // ==================== 3. TESTES DE MENSAGENS (CHAT) ====================
  console.log('\n📋 3. TESTES DE MENSAGENS (CHAT)\n');
  
  if (conversationId) {
    await test('POST /api/conversations/:id/messages - Enviar mensagem', async () => {
      const response = await fetchJSON(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: 'Olá, estou me sentindo ansioso ultimamente.' }),
      });
      
      if (!response.conversation || !response.conversation.messages) {
        throw new Error('Resposta inválida');
      }
      
      const messages = response.conversation.messages;
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.role !== 'assistant') {
        throw new Error('Resposta do assistente não encontrada');
      }
      
      return { 
        messagesCount: messages.length,
        lastRole: lastMessage.role,
        responsePreview: lastMessage.content.slice(0, 100) + '...',
        hasSuggestions: !!response.suggestions
      };
    });
    
    await test('POST /api/conversations/:id/messages - Segunda mensagem', async () => {
      const response = await fetchJSON(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: 'Isso começou há algumas semanas.' }),
      });
      
      return { 
        messagesCount: response.conversation.messages.length,
        hasLead: !!response.lead
      };
    });
    
    await test('POST /api/conversations/:id/messages - Terceira mensagem (trigger lead)', async () => {
      const response = await fetchJSON(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: 'Meu nome é João e tenho 30 anos.' }),
      });
      
      return { 
        messagesCount: response.conversation.messages.length,
        hasLead: !!response.lead,
        leadName: response.lead?.name
      };
    });
    
    await test('POST /api/conversations/:id/messages - Quarta mensagem', async () => {
      const response = await fetchJSON(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: 'Nunca fiz terapia antes.' }),
      });
      
      return { 
        messagesCount: response.conversation.messages.length,
        leadExtracted: !!response.lead?.previousTherapy
      };
    });
  }
  
  // ==================== 4. TESTES DE LEADS ====================
  console.log('\n📋 4. TESTES DE LEADS\n');
  
  await test('GET /api/leads - Listar leads', async () => {
    const leads = await fetchJSON(`${API_BASE}/leads`);
    if (!Array.isArray(leads)) {
      throw new Error('Resposta inválida');
    }
    return { count: leads.length };
  });
  
  await test('GET /api/leads/stats - Estatísticas de leads', async () => {
    const stats = await fetchJSON(`${API_BASE}/leads/stats`);
    return stats;
  });
  
  // ==================== 5. TESTES DE CONFIGURAÇÕES ====================
  console.log('\n📋 5. TESTES DE CONFIGURAÇÕES\n');
  
  await test('GET /api/settings - Buscar configurações', async () => {
    const settings = await fetchJSON(`${API_BASE}/settings`);
    return settings;
  });
  
  // ==================== 6. TESTE DE DELEÇÃO ====================
  console.log('\n📋 6. TESTES DE LIMPEZA\n');
  
  if (conversationId) {
    await test('DELETE /api/conversations/:id - Deletar conversa de teste', async () => {
      // Get conversation
      await fetchJSON(`${API_BASE}/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      return { deleted: true };
    });
  }
  
  // ==================== RESUMO ====================
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 RESUMO DOS TESTES\n');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ TESTES QUE FALHARAM:\n');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }
  
  console.log('\n');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
