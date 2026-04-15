# JARVIS SENHOR - Guia de Configuração Profissional

Este projeto foi estruturado para funcionar perfeitamente no **Google AI Studio** e na **Vercel**.

## 🚀 Como colocar Online (Vercel)

Para que o JARVIS funcione corretamente após o deploy, você **DEVE** configurar a chave de API manualmente por motivos de segurança. Nenhuma ferramenta pode "adivinhar" sua chave secreta automaticamente.

### 1. Configurar Variáveis de Ambiente
No painel da Vercel:
1. Vá em **Settings** -> **Environment Variables**.
2. Adicione uma nova variável:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** (Sua chave obtida no Google AI Studio)
3. Clique em **Save**.

### 2. Realizar Redeploy
**IMPORTANTE:** Se você adicionou a chave após o primeiro deploy, você deve:
1. Ir na aba **Deployments**.
2. Clicar nos três pontos `...` do último deploy.
3. Selecionar **Redeploy**.

## 🛠️ Estrutura do Projeto
- `/api`: Contém as funções serverless para a Vercel (Backend seguro).
- `/src`: Contém o código do Frontend (Interface do Jarvis).
- `server.ts`: Servidor para desenvolvimento local e Cloud Run.

## 🤖 Por que não é um arquivo .JAR?
Este projeto é baseado em **Node.js e React** (tecnologia web moderna), e não em Java. Portanto, não existe um arquivo `.jar`. O resultado final é um site otimizado que roda diretamente no navegador.

---
*Gerado automaticamente pelo Protocolo de Assistência JARVIS.*
