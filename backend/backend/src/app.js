// Configuración de Express (sin arrancar el servidor, para poder probarla aparte).
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import contactRoutes from './routes/contact.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Render y otros hostings usan un proxy; sin esto el rate-limit vería la misma IP para todos
app.set('trust proxy', 1);

app.use(helmet()); // cabeceras de seguridad por defecto
app.use(
  cors({
    // El frontend (GitHub Pages) vive en otro dominio, por eso CORS solo admite los orígenes configurados
    origin: env.frontendOrigins.length ? env.frontendOrigins : false,
  })
);
app.use(express.json({ limit: '50kb' })); // límite pequeño: esta API solo recibe texto

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', aiRoutes); // /api/chat y /api/ai/descripcion

app.use(notFound);
app.use(errorHandler);

export default app;
