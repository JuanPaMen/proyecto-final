import Message from '../models/Message.js';
import { HttpError } from '../middleware/errorHandler.js';

// POST /api/contact (público) { nombre, email, mensaje }
export async function enviar(req, res) {
  const { nombre, email, mensaje } = req.body;
  // Solo se toman los 3 campos permitidos; "leido" no lo puede decidir el visitante
  await Message.create({ nombre, email, mensaje });
  res.status(201).json({ mensaje: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.' });
}

// Las siguientes son del panel admin
export async function listar(req, res) {
  const mensajes = await Message.find().sort({ createdAt: -1 });
  res.json(mensajes);
}

export async function marcarLeido(req, res) {
  const m = await Message.findByIdAndUpdate(req.params.id, { leido: true }, { new: true });
  if (!m) throw new HttpError(404, 'Mensaje no encontrado');
  res.json(m);
}

export async function eliminar(req, res) {
  const m = await Message.findByIdAndDelete(req.params.id);
  if (!m) throw new HttpError(404, 'Mensaje no encontrado');
  res.json({ mensaje: 'Mensaje eliminado' });
}
