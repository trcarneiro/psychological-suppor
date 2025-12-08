// server/index.ts
import express from "express";
import cors from "cors";
import { ZodError } from "zod";

// server/config.ts
import dotenv from "dotenv";
dotenv.config();
var PORT = Number(process.env.PORT || 3333);
var GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
var GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
var SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
var SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
var OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
var OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-pro-preview";
var LLM_PROVIDER = process.env.LLM_PROVIDER || "gemini";

// server/routes/conversations.ts
import { Router } from "express";
import { z } from "zod";

// server/prisma.ts
import { PrismaClient } from "@prisma/client";
var databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("\u274C CRITICAL: DATABASE_URL is missing in environment variables. Prisma will fail to connect.");
}
var prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl || "mysql://fallback_missing_env_var:3306/db"
    }
  }
});

// server/routes/formatters.ts
function mapMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp.getTime()
  };
}
function mapLeadData(lead) {
  if (!lead) return void 0;
  const data = {
    name: lead.name ?? void 0,
    email: lead.email ?? void 0,
    phone: lead.phone ?? void 0,
    age: lead.age ?? void 0,
    mainConcern: lead.mainConcern ?? void 0,
    emotionalState: lead.emotionalState ?? void 0,
    urgencyLevel: lead.urgencyLevel ?? void 0,
    symptoms: lead.symptoms ?? void 0,
    duration: lead.duration ?? void 0,
    previousTherapy: lead.previousTherapy ?? void 0,
    preferredContact: lead.preferredContact ?? void 0,
    availability: lead.availability ?? void 0,
    budget: lead.budget ?? void 0,
    insuranceProvider: lead.insuranceProvider ?? void 0
  };
  return data;
}
function mapConversation(conversation) {
  return {
    id: conversation.id,
    title: conversation.title,
    messages: conversation.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map(mapMessage),
    leadData: mapLeadData(conversation.lead ?? null),
    createdAt: conversation.createdAt.getTime(),
    updatedAt: conversation.updatedAt.getTime(),
    needsReferral: conversation.needsReferral,
    isConverted: conversation.isConverted,
    agentId: conversation.agentId,
    agentName: conversation.agentName,
    agentSnapshot: conversation.agentSnapshot
  };
}
function mapLead(lead) {
  return {
    id: lead.id,
    conversationId: lead.conversationId,
    data: mapLeadData(lead) ?? {},
    status: lead.status,
    score: lead.score,
    suggestedProfessional: lead.suggestedProfessional ?? void 0,
    notes: lead.notes ?? void 0,
    createdAt: lead.createdAt.getTime(),
    updatedAt: lead.updatedAt.getTime(),
    lastActivity: lead.lastActivity.getTime()
  };
}

// server/services/llm.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
var geminiClient = null;
function getGeminiClient() {
  if (!geminiClient && GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return geminiClient;
}
var MAX_RETRIES = 3;
var RETRY_DELAY = 2e3;
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function generateWithOpenRouter(prompt, options) {
  const startTime = Date.now();
  console.log("[LLM:OpenRouter] ====== NOVA REQUISI\xC7\xC3O ======");
  console.log("[LLM:OpenRouter] Modelo:", OPENROUTER_MODEL);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://psychological-suppor.vercel.app",
      "X-Title": "Psychological Support Chat"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature ?? 0.8,
      max_tokens: options.maxOutputTokens ?? 4096
    })
  });
  const elapsed = Date.now() - startTime;
  console.log("[LLM:OpenRouter] Response time:", elapsed, "ms");
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    const text = data.choices[0].message?.content;
    return text?.trim() ?? "";
  }
  throw new Error("OpenRouter returned no choices");
}
async function generateWithGemini(prompt, options) {
  const startTime = Date.now();
  console.log("[LLM:Gemini] ====== NOVA REQUISI\xC7\xC3O ======");
  console.log("[LLM:Gemini] Modelo:", GEMINI_MODEL);
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error("Gemini Client not initialized (missing API Key)");
  }
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: options.temperature ?? 0.8,
      maxOutputTokens: options.maxOutputTokens ?? 8192
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ]
  });
  console.log("[LLM:Gemini] Chamando generateContent...");
  const response = await model.generateContent(prompt);
  const elapsed = Date.now() - startTime;
  console.log("[LLM:Gemini] Response time:", elapsed, "ms");
  let text = "";
  if (response.response.candidates && response.response.candidates.length > 0) {
    const firstCandidate = response.response.candidates[0];
    if (firstCandidate.finishReason === "MAX_TOKENS") {
      console.warn("[LLM:Gemini] \u26A0\uFE0F Resposta truncada por MAX_TOKENS!");
    }
    try {
      if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
        text = firstCandidate.content.parts.map((part) => part.text).join("");
      }
    } catch (e) {
      console.error("[LLM:Gemini] Erro ao extrair texto das partes:", e);
    }
  }
  if (!text) {
    try {
      text = response.response.text();
    } catch (e) {
      console.warn("[LLM:Gemini] response.text() falhou (esperado se houver bloqueio/erro):", e);
    }
  }
  console.log("[LLM:Gemini] Text length:", text?.length ?? 0);
  return text?.trim() ?? "";
}
async function generateText(prompt, options = {}) {
  console.log("[LLM] Provider configurado:", LLM_PROVIDER);
  const tryProvider = async (provider, attempt = 1) => {
    try {
      if (provider === "openrouter") {
        if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY missing");
        return await generateWithOpenRouter(prompt, options);
      } else {
        if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
        return await generateWithGemini(prompt, options);
      }
    } catch (error) {
      console.error(`[LLM] Erro no provider ${provider} (Tentativa ${attempt}/${MAX_RETRIES}):`, error.message);
      if (attempt < MAX_RETRIES) {
        console.log(`[LLM] Aguardando ${RETRY_DELAY}ms antes de tentar novamente...`);
        await delay(RETRY_DELAY * attempt);
        return tryProvider(provider, attempt + 1);
      }
      throw error;
    }
  };
  try {
    return await tryProvider(LLM_PROVIDER);
  } catch (primaryError) {
    console.error("[LLM] \u274C Provider principal falhou ap\xF3s todas as tentativas.", primaryError);
    if (LLM_PROVIDER === "gemini" && OPENROUTER_API_KEY) {
      console.log("[LLM] \u{1F504} Tentando fallback para OpenRouter...");
      try {
        return await tryProvider("openrouter");
      } catch (fallbackError) {
        console.error("[LLM] \u274C Fallback tamb\xE9m falhou.", fallbackError);
        return null;
      }
    }
    return null;
  }
}

// server/services/aiProvider.ts
function buildPrompt(agent, history, userMessage) {
  const historyText = history.map((message) => `${message.role === "user" ? "Usu\xE1rio" : agent.name}: ${message.content}`).join("\n");
  const userMessagesCount = history.filter((message) => message.role === "user").length + 1;
  let contextualInstructions = "";
  if (userMessagesCount === 1) {
    contextualInstructions = "\n\nEsta \xE9 a primeira mensagem da pessoa. Agrade\xE7a e convide para compartilhar mais.";
  } else if (userMessagesCount === 3) {
    contextualInstructions = "\n\nBusque descobrir o nome da pessoa de forma natural.";
  } else if (userMessagesCount === 5) {
    contextualInstructions = "\n\nPergunte h\xE1 quanto tempo a situa\xE7\xE3o acontece.";
  } else if (userMessagesCount === 7) {
    contextualInstructions = "\n\nPergunte, com cuidado, se j\xE1 buscou ajuda profissional.";
  } else if (userMessagesCount >= 9) {
    contextualInstructions = "\n\nConsidere sugerir acompanhamento profissional e pergunte sobre prefer\xEAncia de contato.";
  }
  return `${agent.systemPrompt}${contextualInstructions}

Hist\xF3rico da conversa:
${historyText}

Usu\xE1rio: ${userMessage}

Responda de forma emp\xE1tica, em 2-4 frases, mantendo tom humano e acolhedor:`;
}
async function generateAssistantReply(params) {
  const { agent, history, userMessage } = params;
  const prompt = buildPrompt(agent, history, userMessage);
  const text = await generateText(prompt, {
    temperature: agent.temperature ?? 0.8,
    maxOutputTokens: 8192
  });
  if (!text) {
    return "Desculpe, encontrei uma dificuldade t\xE9cnica ao responder agora. Podemos tentar novamente?";
  }
  const truncated = text.length > agent.maxMessageLength ? `${text.slice(0, agent.maxMessageLength)}\u2026` : text;
  return truncated;
}
function getFallbackSuggestions(assistantMessage) {
  const lower = assistantMessage.toLowerCase();
  if (lower.includes("como voc\xEA") || lower.includes("como est\xE1") || lower.includes("tudo bem")) {
    return ["Estou bem, obrigado(a)", "Poderia estar melhor", "Tenho tido dias dif\xEDceis"];
  }
  if (lower.includes("quanto tempo")) {
    return ["Algumas semanas", "H\xE1 alguns meses", "J\xE1 faz um tempo"];
  }
  if (lower.includes("ajuda profissional") || lower.includes("psic\xF3logo") || lower.includes("terapia")) {
    return ["Ainda n\xE3o busquei", "J\xE1 tentei antes", "Estou considerando"];
  }
  if (lower.includes("nome") || lower.includes("chama")) {
    return ["Prefiro n\xE3o dizer", "Me chamo...", "Pode me chamar de..."];
  }
  if (lower.includes("ol\xE1") || lower.includes("oi") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite")) {
    return ["Ol\xE1, tudo bem?", "Oi, preciso desabafar", "Ol\xE1, gostaria de conversar"];
  }
  return ["Sim, entendo", "Pode continuar", "Gostaria de saber mais"];
}
async function generateSuggestions(params) {
  const { lastAssistantMessage } = params;
  const prompt = `Gere 3 respostas curtas (m\xE1ximo 6 palavras cada) que um usu\xE1rio poderia dar para:

"${lastAssistantMessage.substring(0, 150)}"

Responda APENAS com as 3 frases, uma por linha, sem numera\xE7\xE3o ou r\xF3tulos.`;
  console.log("[generateSuggestions] Prompt length:", prompt.length, "chars");
  console.log("[generateSuggestions] Chamando LLM...");
  try {
    const text = await generateText(prompt, {
      temperature: 0.7,
      maxOutputTokens: 8192
    });
    console.log("[generateSuggestions] API respondeu:", text?.substring(0, 100));
    let suggestions = [];
    if (text && text.length > 0) {
      suggestions = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).map((line) => line.replace(/^(resposta\s*\d+[:\s]*|[-*\d.)\s]+)/i, "")).filter((line) => line.length > 0 && line.length <= 60).filter((line) => !/^resposta\s*\d*$/i.test(line)).filter((line) => !/^aqui\s+est/i.test(line)).slice(0, 3);
    }
    if (suggestions.length < 3) {
      console.log(`[generateSuggestions] Apenas ${suggestions.length} sugest\xF5es geradas. Usando fallback.`);
      const fallback = getFallbackSuggestions(lastAssistantMessage);
      const combined = [...suggestions, ...fallback];
      const unique = Array.from(new Set(combined));
      suggestions = unique.slice(0, 3);
    }
    console.log("[generateSuggestions] Final:", suggestions);
    return suggestions;
  } catch (error) {
    console.error("[generateSuggestions] Erro:", error);
    return getFallbackSuggestions(lastAssistantMessage).slice(0, 3);
  }
}

// server/services/leadExtractor.ts
function buildExtractionPrompt(history) {
  const conversationText = history.map((message) => `${message.role === "user" ? "Usu\xE1rio" : "Assistente"}: ${message.content}`).join("\n");
  return `Analise a conversa de pr\xE9-atendimento psicol\xF3gico abaixo e retorne um JSON com os dados solicitados.
Se algum dado n\xE3o estiver presente, utilize null.

Conversa:
${conversationText}

Retorne um JSON com as chaves:
- name, email, phone, age
- mainConcern, emotionalState (low|moderate|high|critical), urgencyLevel (1-10)
- symptoms (array de strings), duration, previousTherapy (boolean)
- preferredContact (email|phone|whatsapp), availability
- budget (texto livre), budgetMin (n\xFAmero), budgetMax (n\xFAmero)
- city, state (UF), cep, neighborhood
- modality (online|presencial|hibrido)
- insuranceProvider

Para budgetMin e budgetMax, tente inferir valores num\xE9ricos se o usu\xE1rio mencionar faixas de pre\xE7o (ex: "at\xE9 200 reais" -> budgetMax: 200).
Inclua apenas as chaves solicitadas.`;
}
async function extractLeadData(history) {
  const prompt = buildExtractionPrompt(history);
  const response = await generateText(prompt, {
    temperature: 0.2,
    maxOutputTokens: 8192
  });
  if (!response) {
    return null;
  }
  try {
    const sanitized = response.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(sanitized);
    return data;
  } catch (error) {
    console.error("[LeadExtractor] Falha ao interpretar JSON:", response, error);
    return null;
  }
}

// server/services/leadScore.ts
function calculateLeadScore(data) {
  if (!data) return 0;
  const urgency = (data.urgencyLevel ?? 0) * 10;
  let emotionalWeight = 0;
  switch (data.emotionalState) {
    case "critical":
      emotionalWeight = 30;
      break;
    case "high":
      emotionalWeight = 20;
      break;
    case "moderate":
      emotionalWeight = 10;
      break;
    default:
      emotionalWeight = 0;
  }
  const symptomBonus = Array.isArray(data.symptoms) ? Math.min(data.symptoms.length, 5) * 2 : 0;
  let completenessBonus = 0;
  if (data.name) completenessBonus += 5;
  if (data.phone || data.email) completenessBonus += 10;
  if (data.city || data.state || data.cep) completenessBonus += 5;
  if (data.budget || data.budgetMin || data.budgetMax) completenessBonus += 10;
  if (data.modality) completenessBonus += 5;
  return Math.min(urgency + emotionalWeight + symptomBonus + completenessBonus, 100);
}

// server/services/referral.ts
var REFERRAL_KEYWORDS = [
  "n\xE3o aguento mais",
  "quero morrer",
  "suic\xEDdio",
  "me matar",
  "sem sa\xEDda",
  "piorou",
  "piorando",
  "n\xE3o consigo",
  "preciso de ajuda",
  "vou desistir",
  "desistir de tudo",
  "matar",
  "autoagress"
];
function shouldSuggestReferral(message) {
  const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return REFERRAL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

// server/middleware/auth.ts
import { createClient } from "@supabase/supabase-js";
var isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;
var supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
var requireAuth = async (req, res, next) => {
  if (!isConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Auth] Supabase n\xE3o configurado. Permitindo acesso irrestrito (DEV MODE).");
      req.user = { id: "admin-dev", email: "admin@dev.local" };
      return next();
    } else {
      console.error("[Auth] CR\xCDTICO: Supabase n\xE3o configurado em produ\xE7\xE3o. Bloqueando acesso.");
      return res.status(500).json({ error: "Erro de configura\xE7\xE3o de autentica\xE7\xE3o." });
    }
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token de autentica\xE7\xE3o n\xE3o fornecido." });
  }
  const token = authHeader.split(" ")[1];
  if (!supabase) {
    return res.status(500).json({ error: "Erro interno de configura\xE7\xE3o de auth." });
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Token inv\xE1lido ou expirado." });
  }
  req.user = user;
  next();
};

// server/routes/conversations.ts
var router = Router();
var agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  personality: z.string(),
  description: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  greeting: z.string(),
  conversationStyle: z.string(),
  maxMessageLength: z.number(),
  responseDelay: z.number(),
  collectDataFields: z.array(z.string()),
  autoReferralThreshold: z.number(),
  temperature: z.number(),
  active: z.boolean(),
  color: z.string(),
  icon: z.string(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional()
});
var createConversationSchema = z.object({
  agent: agentSchema
});
var sendMessageSchema = z.object({
  content: z.string().min(1, "Mensagem n\xE3o pode ficar vazia.")
});
router.get("/", requireAuth, async (_req, res) => {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { timestamp: "asc" } },
      lead: true
    }
  });
  res.json({
    conversations: conversations.map(mapConversation)
  });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { timestamp: "asc" } },
      lead: true
    }
  });
  if (!conversation) {
    return res.status(404).json({ error: "Conversa n\xE3o encontrada." });
  }
  res.json({ conversation: mapConversation(conversation) });
});
router.post("/", async (req, res, next) => {
  try {
    console.log("[POST /conversations] Body received:", JSON.stringify(req.body, null, 2));
    const { agent } = createConversationSchema.parse(req.body);
    const conversation = await prisma.conversation.create({
      data: {
        title: `Conversa com ${agent.name}`,
        agentId: agent.id,
        agentName: agent.name,
        agentSnapshot: agent
      }
    });
    const greetingContent = agent.greeting || "Ol\xE1! Como posso ajudar voc\xEA hoje?";
    const greetingMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: greetingContent
      }
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: greetingMessage.timestamp }
    });
    const withMessages = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: { orderBy: { timestamp: "asc" } },
        lead: true
      }
    });
    res.status(201).json({
      conversation: mapConversation(withMessages),
      responseDelay: agent.responseDelay
    });
  } catch (error) {
    console.error("[POST /conversations] Error:", error);
    next(error);
  }
});
router.post("/:id/messages", async (req, res) => {
  const { id } = req.params;
  const { content } = sendMessageSchema.parse(req.body);
  console.log("[POST /conversations/:id/messages] conversationId:", id);
  console.log("[POST /conversations/:id/messages] user content:", content);
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { timestamp: "asc" } },
      lead: true
    }
  });
  if (!conversation) {
    console.error("[POST /conversations/:id/messages] Conversa n\xE3o encontrada:", id);
    return res.status(404).json({ error: "Conversa n\xE3o encontrada." });
  }
  const agent = conversation.agentSnapshot;
  console.log("[POST /conversations/:id/messages] Agent:", agent.name, "Model:", agent.model);
  const userMessageRecord = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content
    }
  });
  const history = [
    ...conversation.messages.map((message) => ({
      role: message.role,
      content: message.content
    })),
    {
      role: "user",
      content
    }
  ];
  console.log("[POST /conversations/:id/messages] Gerando resposta do assistente...");
  let assistantResponse;
  try {
    assistantResponse = await generateAssistantReply({
      agent,
      history,
      userMessage: content
    });
    console.log("[POST /conversations/:id/messages] \u2705 Resposta gerada completa:");
    console.log("[POST /conversations/:id/messages] Comprimento:", assistantResponse.length, "caracteres");
    console.log("[POST /conversations/:id/messages] Conte\xFAdo:", assistantResponse);
  } catch (error) {
    console.error("[POST /conversations/:id/messages] Erro ao gerar resposta:", error);
    throw error;
  }
  const assistantMessageRecord = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: assistantResponse
    }
  });
  const referralTriggered = shouldSuggestReferral(content) || shouldSuggestReferral(assistantResponse);
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      needsReferral: conversation.needsReferral || referralTriggered,
      updatedAt: assistantMessageRecord.timestamp
    }
  });
  let leadRecord = conversation.lead;
  const totalUserMessages = history.filter((message) => message.role === "user").length;
  if (totalUserMessages >= 4) {
    const leadData = await extractLeadData([
      ...history,
      {
        role: "assistant",
        content: assistantResponse
      }
    ]);
    if (leadData) {
      const score = calculateLeadScore(leadData);
      leadRecord = await prisma.lead.upsert({
        where: { conversationId: conversation.id },
        create: {
          conversationId: conversation.id,
          name: leadData.name ?? void 0,
          email: leadData.email ?? void 0,
          phone: leadData.phone ?? void 0,
          age: leadData.age ?? void 0,
          mainConcern: leadData.mainConcern ?? void 0,
          emotionalState: leadData.emotionalState ?? void 0,
          urgencyLevel: leadData.urgencyLevel ?? void 0,
          symptoms: leadData.symptoms ?? void 0,
          duration: leadData.duration ?? void 0,
          previousTherapy: leadData.previousTherapy ?? void 0,
          preferredContact: leadData.preferredContact ?? void 0,
          availability: leadData.availability ?? void 0,
          budget: leadData.budget ?? void 0,
          budgetMin: leadData.budgetMin ?? void 0,
          budgetMax: leadData.budgetMax ?? void 0,
          city: leadData.city ?? void 0,
          state: leadData.state ?? void 0,
          cep: leadData.cep ?? void 0,
          neighborhood: leadData.neighborhood ?? void 0,
          modality: leadData.modality ?? void 0,
          insuranceProvider: leadData.insuranceProvider ?? void 0,
          score,
          lastActivity: /* @__PURE__ */ new Date()
        },
        update: {
          name: leadData.name ?? void 0,
          email: leadData.email ?? void 0,
          phone: leadData.phone ?? void 0,
          age: leadData.age ?? void 0,
          mainConcern: leadData.mainConcern ?? void 0,
          emotionalState: leadData.emotionalState ?? void 0,
          urgencyLevel: leadData.urgencyLevel ?? void 0,
          symptoms: leadData.symptoms ?? void 0,
          duration: leadData.duration ?? void 0,
          previousTherapy: leadData.previousTherapy ?? void 0,
          preferredContact: leadData.preferredContact ?? void 0,
          availability: leadData.availability ?? void 0,
          budget: leadData.budget ?? void 0,
          budgetMin: leadData.budgetMin ?? void 0,
          budgetMax: leadData.budgetMax ?? void 0,
          city: leadData.city ?? void 0,
          state: leadData.state ?? void 0,
          cep: leadData.cep ?? void 0,
          neighborhood: leadData.neighborhood ?? void 0,
          modality: leadData.modality ?? void 0,
          insuranceProvider: leadData.insuranceProvider ?? void 0,
          score,
          lastActivity: /* @__PURE__ */ new Date()
        }
      });
    }
  }
  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    include: {
      messages: { orderBy: { timestamp: "asc" } },
      lead: true
    }
  });
  console.log("[SUGG] Aguardando 500ms antes de gerar sugest\xF5es (previne rate limit)...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("[SUGG] Iniciando gera\xE7\xE3o de sugest\xF5es...");
  let suggestions = [];
  try {
    suggestions = await generateSuggestions({ agent, history: [...history, { role: "assistant", content: assistantResponse }], lastAssistantMessage: assistantResponse });
    console.log("[SUGG] \u2705 Geradas:", suggestions);
  } catch (e) {
    console.error("[SUGG] \u274C Erro ao gerar sugest\xF5es:", e);
    console.log("[SUGG] \u2139\uFE0F Fallback contextual ser\xE1 usado automaticamente");
  }
  res.status(201).json({
    conversation: mapConversation(updatedConversation),
    newMessages: {
      user: mapMessage(userMessageRecord),
      assistant: mapMessage(assistantMessageRecord)
    },
    responseDelay: agent.responseDelay,
    lead: leadRecord ? mapLead(leadRecord) : void 0,
    suggestions: suggestions.length > 0 ? suggestions : void 0
  });
});
var conversations_default = router;

// server/routes/leads.ts
import { Router as Router2 } from "express";
import { z as z2 } from "zod";

// server/services/matching.ts
async function findBestMatches(lead) {
  const agents = await prisma.agent.findMany({
    where: { active: true }
  });
  const scores = agents.map((agent) => {
    let score = 0;
    const reasons = [];
    if (lead.modality === "presencial" || lead.modality === "hibrido") {
      if (agent.city && lead.city && agent.city.toLowerCase() === lead.city.toLowerCase()) {
        score += 30;
        reasons.push(`Atende em ${agent.city}`);
        if (agent.neighborhood && lead.neighborhood && agent.neighborhood.toLowerCase() === lead.neighborhood.toLowerCase()) {
          score += 10;
          reasons.push(`Bairro ${agent.neighborhood} compat\xEDvel`);
        }
      }
    }
    if (lead.modality && agent.modalities) {
      const agentModalities = agent.modalities;
      if (agentModalities.includes(lead.modality)) {
        score += 20;
        reasons.push(`Atende na modalidade ${lead.modality}`);
      }
    }
    if (lead.budgetMax && agent.priceMin) {
      if (lead.budgetMax >= agent.priceMin) {
        score += 25;
        reasons.push("Dentro do or\xE7amento");
      } else if (lead.budgetMax >= agent.priceMin * 0.8) {
        score += 10;
        reasons.push("Pr\xF3ximo do or\xE7amento");
      }
    }
    if (lead.availability && agent.availability) {
      const leadAvail = lead.availability.toLowerCase();
      const agentAvail = agent.availability.map((a) => a.toLowerCase());
      const hasMatch = agentAvail.some((a) => leadAvail.includes(a) || a.includes(leadAvail));
      if (hasMatch) {
        score += 15;
        reasons.push("Hor\xE1rio compat\xEDvel");
      }
    }
    return {
      agentId: agent.id,
      score,
      reasons
    };
  });
  return scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

// server/routes/leads.ts
var router2 = Router2();
router2.use(requireAuth);
router2.get("/", async (_req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: { updatedAt: "desc" }
  });
  res.json({
    leads: leads.map((lead) => mapLead(lead))
  });
});
router2.get("/:id", async (req, res) => {
  const { id } = req.params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { timestamp: "asc" } },
          lead: true
        }
      }
    }
  });
  if (!lead) {
    return res.status(404).json({ error: "Lead n\xE3o encontrado." });
  }
  res.json({
    lead: mapLead(lead),
    conversation: lead.conversation ? mapConversation(lead.conversation) : void 0
  });
});
router2.get("/:id/matches", async (req, res) => {
  const { id } = req.params;
  const lead = await prisma.lead.findUnique({
    where: { id }
  });
  if (!lead) {
    return res.status(404).json({ error: "Lead n\xE3o encontrado." });
  }
  const matches = await findBestMatches(lead);
  res.json({ matches });
});
var updateStatusSchema = z2.object({
  status: z2.enum(["new", "contacted", "scheduled", "converted", "lost"])
});
router2.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = updateStatusSchema.parse(req.body);
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status,
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  res.json({ lead: mapLead(lead) });
});
var leads_default = router2;

// server/routes/agents.ts
import { Router as Router3 } from "express";
import { z as z3 } from "zod";
var router3 = Router3();
router3.use(requireAuth);
var agentBodySchema = z3.object({
  name: z3.string(),
  crp: z3.string(),
  specialties: z3.array(z3.string()).optional(),
  approach: z3.string().optional(),
  experience: z3.string().optional(),
  bio: z3.string().optional(),
  email: z3.string().email(),
  phone: z3.string().optional(),
  availability: z3.array(z3.string()).optional(),
  priceRange: z3.string().optional(),
  acceptsInsurance: z3.boolean().optional(),
  insuranceProviders: z3.array(z3.string()).optional(),
  photo: z3.string().optional(),
  active: z3.boolean().optional()
});
router3.get("/", async (_req, res) => {
  const agents = await prisma.agent.findMany({
    orderBy: { name: "asc" }
  });
  res.json({ agents });
});
router3.post("/", async (req, res) => {
  const data = agentBodySchema.parse(req.body);
  const agent = await prisma.agent.create({
    data: {
      name: data.name,
      crp: data.crp,
      specialties: data.specialties ?? [],
      approach: data.approach,
      experience: data.experience,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      availability: data.availability ?? [],
      priceRange: data.priceRange,
      acceptsInsurance: data.acceptsInsurance ?? false,
      insuranceProviders: data.insuranceProviders ?? [],
      photo: data.photo,
      active: data.active ?? true
    }
  });
  res.status(201).json({ agent });
});
router3.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = agentBodySchema.parse(req.body);
  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: data.name,
      crp: data.crp,
      specialties: data.specialties ?? [],
      approach: data.approach,
      experience: data.experience,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      availability: data.availability ?? [],
      priceRange: data.priceRange,
      acceptsInsurance: data.acceptsInsurance ?? false,
      insuranceProviders: data.insuranceProviders ?? [],
      photo: data.photo,
      active: data.active ?? true
    }
  });
  res.json({ agent });
});
router3.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.agent.delete({ where: { id } });
  res.status(204).end();
});
var agents_default = router3;

// server/routes/settings.ts
import { Router as Router4 } from "express";
import { z as z4 } from "zod";
var router4 = Router4();
router4.use(requireAuth);
var defaultConfig = {
  id: "default-ai-agent",
  name: "Assistente Virtual de Acolhimento",
  personality: "Emp\xE1tico e Profissional",
  description: "Assistente virtual padr\xE3o para acolhimento psicol\xF3gico inicial",
  model: "gpt-4o",
  systemPrompt: `Voc\xEA \xE9 um assistente virtual especializado em acolhimento psicol\xF3gico inicial. Seu papel \xE9:

1. Acolher a pessoa com empatia e sem julgamentos
2. Fazer perguntas abertas para entender a situa\xE7\xE3o
3. Coletar informa\xE7\xF5es importantes (nome, contato, principais preocupa\xE7\xF5es)
4. Avaliar a urg\xEAncia do caso
5. Oferecer encaminhamento para psic\xF3logo quando apropriado

Diretrizes importantes:
- Seja emp\xE1tico, caloroso e acolhedor
- Use linguagem simples e acess\xEDvel
- Nunca ofere\xE7a diagn\xF3sticos ou tratamentos
- Valide os sentimentos da pessoa
- Mantenha conversas focadas e objetivas
- Sempre que poss\xEDvel, colete: nome, contato (email/telefone), preocupa\xE7\xE3o principal
- Pergunte sobre urg\xEAncia, sintomas, e hist\xF3rico de terapia
- Caso identifique risco, priorize encaminhamento imediato

Lembre-se: voc\xEA n\xE3o \xE9 psic\xF3logo, apenas faz o primeiro acolhimento.`,
  greeting: "Ol\xE1! Seja bem-vindo(a) ao nosso espa\xE7o de acolhimento. Meu nome \xE9 Sofia e estou aqui para te ouvir e ajudar. Como voc\xEA est\xE1 se sentindo hoje?",
  conversationStyle: "empathetic",
  maxMessageLength: 500,
  responseDelay: 1500,
  collectDataFields: [
    "name",
    "email",
    "phone",
    "mainConcern",
    "emotionalState",
    "urgencyLevel",
    "symptoms",
    "previousTherapy",
    "preferredContact"
  ],
  autoReferralThreshold: 7,
  temperature: 0.8,
  active: true,
  color: "from-blue-500 to-purple-500",
  icon: "Heart"
};
var aiConfigSchema = z4.object({
  id: z4.string(),
  name: z4.string(),
  personality: z4.string(),
  description: z4.string(),
  model: z4.string(),
  systemPrompt: z4.string(),
  greeting: z4.string(),
  conversationStyle: z4.string(),
  maxMessageLength: z4.number(),
  responseDelay: z4.number(),
  collectDataFields: z4.array(z4.string()),
  autoReferralThreshold: z4.number(),
  temperature: z4.number(),
  active: z4.boolean(),
  color: z4.string(),
  icon: z4.string()
});
router4.get("/ai-agent", async (_req, res) => {
  let config = await prisma.aIAgentConfig.findUnique({
    where: { id: defaultConfig.id }
  });
  if (!config) {
    config = await prisma.aIAgentConfig.create({
      data: {
        ...defaultConfig,
        collectDataFields: defaultConfig.collectDataFields
      }
    });
  }
  res.json({ config });
});
router4.put("/ai-agent", async (req, res) => {
  const data = aiConfigSchema.parse(req.body);
  const config = await prisma.aIAgentConfig.upsert({
    where: { id: data.id },
    create: {
      ...data,
      collectDataFields: data.collectDataFields
    },
    update: {
      ...data,
      collectDataFields: data.collectDataFields,
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  res.json({ config });
});
var settings_default = router4;

// server/routes/messages.ts
import { Router as Router5 } from "express";
import { z as z5 } from "zod";
var router5 = Router5();
var updateMessageSchema = z5.object({
  content: z5.string().min(1, "Conte\xFAdo da mensagem n\xE3o pode ficar vazio.")
});
router5.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = updateMessageSchema.parse(req.body);
  console.log("[PATCH /messages/:id] messageId:", id, "new content:", content.substring(0, 50));
  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true }
  });
  if (!message) {
    console.error("[PATCH /messages/:id] Mensagem n\xE3o encontrada:", id);
    return res.status(404).json({ error: "Mensagem n\xE3o encontrada." });
  }
  if (message.role !== "user") {
    console.error("[PATCH /messages/:id] Tentativa de editar mensagem do assistente");
    return res.status(400).json({ error: "Apenas mensagens do usu\xE1rio podem ser editadas." });
  }
  const updated = await prisma.message.update({
    where: { id },
    data: { content, timestamp: /* @__PURE__ */ new Date() }
  });
  await prisma.conversation.update({
    where: { id: message.conversationId },
    data: { updatedAt: updated.timestamp }
  });
  console.log("[PATCH /messages/:id] Mensagem editada com sucesso");
  res.json({ message: mapMessage(updated) });
});
router5.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("[DELETE /messages/:id] messageId:", id);
  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true }
  });
  if (!message) {
    console.error("[DELETE /messages/:id] Mensagem n\xE3o encontrada:", id);
    return res.status(404).json({ error: "Mensagem n\xE3o encontrada." });
  }
  if (message.role !== "user") {
    console.error("[DELETE /messages/:id] Tentativa de deletar mensagem do assistente");
    return res.status(400).json({ error: "Apenas mensagens do usu\xE1rio podem ser deletadas." });
  }
  await prisma.message.delete({ where: { id } });
  await prisma.conversation.update({
    where: { id: message.conversationId },
    data: { updatedAt: /* @__PURE__ */ new Date() }
  });
  console.log("[DELETE /messages/:id] Mensagem deletada com sucesso");
  res.status(204).send();
});
var messages_default = router5;

// server/index.ts
var app = express();
console.log("[Server] Initializing...", {
  nodeEnv: process.env.NODE_ENV,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL || !!process.env.SUPABASE_URL
});
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    const allowedDomains = [
      "https://psicologobelohorizonte.com.br",
      "https://www.psicologobelohorizonte.com.br",
      "http://psicologobelohorizonte.com.br",
      "http://www.psicologobelohorizonte.com.br"
    ];
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    checks: {
      database: !!process.env.DATABASE_URL,
      gemini: !!process.env.GEMINI_API_KEY,
      supabase: !!process.env.VITE_SUPABASE_URL || !!process.env.SUPABASE_URL
    }
  });
});
app.use("/api/conversations", conversations_default);
app.use("/api/leads", leads_default);
app.use("/api/agents", agents_default);
app.use("/api/settings", settings_default);
app.use("/api/messages", messages_default);
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint n\uFFFDo encontrado." });
});
app.use((error, _req, res, _next) => {
  console.error("[Server] Erro n\xE3o tratado:", error);
  if (error instanceof ZodError) {
    console.error("[Server] Zod validation error:", JSON.stringify(error.errors, null, 2));
    return res.status(400).json({
      error: "Dados inv\xE1lidos.",
      details: error.errors
    });
  }
  if (error.constructor.name === "PrismaClientKnownRequestError") {
    console.error("[Server] Prisma error:", error.message);
    return res.status(500).json({
      error: "Erro de banco de dados.",
      code: error.code,
      details: error.message
    });
  }
  res.status(500).json({
    error: "Erro interno do servidor.",
    message: error.message,
    stack: process.env.NODE_ENV !== "production" ? error.stack : void 0
  });
});
var index_default = app;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}
export {
  index_default as default
};
