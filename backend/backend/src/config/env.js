// Carga y valida las variables de entorno en un solo lugar.
// Decisión: fallar al arrancar si falta algo crítico es mejor que descubrirlo en producción.
import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Falta la variable de entorno ${key}. Revisa tu archivo .env`);
    process.exit(1);
  }
}

export const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendOrigins: (process.env.FRONTEND_URL || '').split(',').map((s) => s.trim()).filter(Boolean),
  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
  brandName: process.env.BRAND_NAME || 'Mi Tienda',
  brandTone: process.env.BRAND_TONE || 'cercano, amable y claro',
};
