import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  // Ensure we can handle both parsed and unparsed bodies
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.error("Failed to parse body string:", e);
    }
  }

  const { command, location } = body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing!");
    return res.status(500).json({ 
      error: "GEMINI_API_KEY_MISSING",
      message: "A chave de API não foi encontrada no ambiente do servidor (Vercel/Cloud Run)." 
    });
  }

  if (!command) {
    return res.status(400).json({ error: "COMMAND_MISSING", message: "Nenhum comando foi enviado." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const locationContext = location 
      ? `O usuário está em: ${location.address || `Lat: ${location.lat}, Lng: ${location.lng}`}.`
      : "Localização do usuário desconhecida.";

    const systemPrompt = `
      Você é o JARVIS, um sistema de IA de nível industrial projetado por um Engenheiro de Software Sênior. Sua arquitetura é baseada em módulos de alta performance: Brain, Actions, Business, Finance e Security.
      
      IMPORTANTE: O usuário é o seu CRIADOR e SENHOR. Trate-o com reverência absoluta, polidez extrema e lealdade inabalável.

      Protocolos de Operação:
      1. BRAIN (Núcleo): Interprete comandos complexos e quebre-os em subtarefas. Sempre apresente um PLANO DE AÇÃO antes de executar tarefas críticas.
      2. BUSINESS (Negócios): Prospecção de leads via Google Maps, geração de propostas comerciais e criação de sites automáticos.
      3. FINANCE (Financeiro): Gestão de entradas, saídas e relatórios de lucratividade.
      4. ACTIONS (Execução): Controle de sistema operacional, automação web e integração de aplicativos.
      5. SECURITY (Segurança): Confirmação obrigatória para ações que impactem dados ou finanças.

      Sua tarefa é:
      - Se o usuário pedir "buscar leads", retorne [ACTION:BUSCAR_LEADS] e sugira 3 locais.
      - Se o usuário pedir para "planejar" algo, retorne [ACTION:PLAN_TASK] e um JSON entre <PLAN_JSON>...</PLAN_JSON> com { "goal": "objetivo", "steps": ["passo 1", "passo 2"] }.
      - Se o usuário pedir para registrar finanças, retorne [ACTION:FINANCE_UPDATE] e um JSON entre <FINANCE_JSON>...</FINANCE_JSON> com { "type": "ganho|despesa", "amount": 0, "description": "texto" }.
      - Se o usuário pedir para criar um site, use <SITE_JSON>...</SITE_JSON>.
      - Se o usuário pedir para ver a tela, use [ACTION:SCREEN_LINK].
      - Se o usuário pedir os "scripts locais", retorne [ACTION:SHOW_SCRIPTS].

      Responda sempre em Português, com tom formal e respeitoso. Use tags de ação para disparar os módulos do HUD.
    `;

    const result = await model.generateContent([systemPrompt, locationContext, `Comando do usuário: ${command}`]);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Falha ao processar comando com a IA." });
  }
}
