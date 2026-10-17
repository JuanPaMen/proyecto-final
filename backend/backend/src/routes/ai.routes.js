import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { chat, descripcion } from '../controllers/ai.controller.js';

const router = Router();

// Cada mensaje al chatbot cuesta dinero (API de IA): se limita por IP para evitar abusos
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  message: { error: 'Has hecho muchas preguntas seguidas, espera unos minutos' },
});

router.post('/chat', chatLimiter, asyncHandler(chat));
router.post('/ai/descripcion', requireAuth, asyncHandler(descripcion));

export default router;
