import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/products.controller.js';

const router = Router();

// Auth opcional: si viene un token válido se llena req.user, si no, sigue como visitante.
// Sirve para que la misma ruta pública pueda mostrar productos ocultos al admin.
function authOpcional(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo === 'Bearer' && token) {
    try { req.user = jwt.verify(token, env.jwtSecret); } catch { /* se trata como visitante */ }
  }
  next();
}

// Públicas (catálogo)
router.get('/', authOpcional, asyncHandler(listar));
router.get('/:id', authOpcional, asyncHandler(obtener));

// Solo admin
router.post('/', requireAuth, asyncHandler(crear));
router.put('/:id', requireAuth, asyncHandler(actualizar));
router.delete('/:id', requireAuth, asyncHandler(eliminar));

export default router;
