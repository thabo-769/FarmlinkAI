import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'farmlink-ai',
  aiProvider: process.env.AI_PROVIDER || 'openai-compatible',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  aiApiKey: process.env.AI_API_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
};
