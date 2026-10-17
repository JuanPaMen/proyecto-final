import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Protege rutas del panel admin. Espera el header: Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Necesitas iniciar sesión' });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret); // { id, rol, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada, inicia sesión de nuevo' });
  }
}
