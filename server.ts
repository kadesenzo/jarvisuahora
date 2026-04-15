import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Status Check
  app.get("/api/health", (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({ 
      status: "ok", 
      apiConfigured: !!apiKey,
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Gemini API Route
  app.post("/api/command", async (req, res) => {
    const { command, location } = req.body;
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey?.trim().replace(/^["']|["']$/g, '');

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
      console.error("GEMINI_API_KEY is missing or invalid!");
      return res.status(500).json({ 
        error: "GEMINI_API_KEY_INVALID",
        message: "A chave de API não foi encontrada ou é inválida. Verifique seus Segredos (Secrets)." 
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
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      
      if (error.message?.includes("API key not valid") || error.message?.includes("API_KEY_INVALID")) {
        return res.status(400).json({ 
          error: "API_KEY_INVALID", 
          message: "A chave de API fornecida é inválida. Verifique se copiou corretamente e se não há aspas extras." 
        });
      }
      
      res.status(500).json({ error: "Falha ao processar comando com a IA." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
