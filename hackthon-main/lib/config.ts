// Central app configuration (server-side usage only)
// NOTE: For production, move secrets to environment variables.

export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yash',
  database: process.env.DB_NAME || 'beejsetu',
  port: Number(process.env.DB_PORT || 3306),
  // Enable SSL for hosted providers like PlanetScale by setting DB_SSL=true
  // mysql2 expects an object for ssl when enabled
  ...(process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: true } as any }
    : {}),
}

// OpenRouter API config
export const OPENROUTER = {
  apiBase: process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-3.5-turbo',
}
