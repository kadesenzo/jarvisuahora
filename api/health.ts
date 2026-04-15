export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  res.status(200).json({ 
    status: "ok", 
    apiConfigured: !!apiKey,
    environment: process.env.VERCEL_ENV || "development",
    region: process.env.VERCEL_REGION || "unknown"
  });
}
