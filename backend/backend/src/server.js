import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

// Solo se levanta el servidor cuando la base de datos ya conectó
connectDB()
  .then(() => app.listen(env.port, () => console.log(`API lista en http://localhost:${env.port}`)))
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });
