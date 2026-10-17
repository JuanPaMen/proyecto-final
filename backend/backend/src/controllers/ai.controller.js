import { responderChat, generarDescripcion } from '../services/ai.service.js';

// POST /api/chat (público) { messages: [{ role: 'user'|'assistant', content }] } -> { reply }
export async function chat(req, res) {
  const reply = await responderChat(req.body.messages);
  res.json({ reply });
}

// POST /api/ai/descripcion (admin) { nombre, categoria?, detalles? } -> { descripcion }
export async function descripcion(req, res) {
  const texto = await generarDescripcion(req.body);
  res.json({ descripcion: texto });
}
