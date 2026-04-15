export async function processCommand(command: string, location?: { lat: number; lng: number; address?: string }) {
  try {
    const response = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command, location }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erro desconhecido no servidor" }));
      const errorMessage = errorData.error || "Erro no servidor";
      
      // Professional guidance for common Vercel/Deployment errors
      if (errorMessage.includes("API_KEY") || errorMessage.includes("configured") || response.status === 500) {
        return "Senhor, detectei um problema de configuração. " + 
               "1. Verifique se a GEMINI_API_KEY está nas 'Environment Variables' da Vercel. " +
               "2. Certifique-se de que não há aspas extras no valor da chave. " +
               "3. Após adicionar a chave, é OBRIGATÓRIO fazer um 'Redeploy' para que as alterações tenham efeito.";
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Desculpe, senhor. Tive um problema de conexão com meus servidores centrais.";
  }
}
