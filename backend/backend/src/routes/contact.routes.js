import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { enviar, listar, marcarLeido, eliminar } from '../controllers/contact.controller.js';

const router = Router();

// Evita spam en el formulario público: 5 mensajes por hora por IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: 'Has enviado muchos mensajes, intenta de nuevo más tarde' },
});

router.post('/', contactLimiter, asyncHandler(enviar));

router.get('/', requireAuth, asyncHandler(listar));
router.patch('/:id/read', requireAuth, asyncHandler(marcarLeido));
router.delete('/:id', requireAuth, asyncHandler(eliminar));

export default router;
