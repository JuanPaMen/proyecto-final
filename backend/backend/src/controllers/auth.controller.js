import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { HttpError } from '../middleware/errorHandler.js';

// POST /api/auth/login  { email, password } -> { token }
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, 'Correo y contraseña son obligatorios');

  // Se pide explícitamente el hash porque el modelo lo oculta por defecto
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  const ok = user && (await user.compararPassword(password));

  // Mismo mensaje para "no existe" y "clave incorrecta": no damos pistas a un atacante
  if (!ok) throw new HttpError(401, 'Credenciales incorrectas');

  const token = jwt.sign({ id: user._id, rol: user.rol }, env.jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user._id, email: user.email, rol: user.rol } });
}

// GET /api/auth/me -> sirve para que el frontend verifique si el token sigue vigente
export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(401, 'Usuario no encontrado');
  res.json({ id: user._id, email: user.email, rol: user.rol });
}
