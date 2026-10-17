// Toda la lógica de IA vive aquí. Si algún día se cambia de proveedor,
// solo se modifica este archivo y los controladores no se enteran.
import Anthropic from '@anthropic-ai/sdk';
import Product from '../models/Product.js';
import { env } from '../config/env.js';
import { HttpError } from '../middleware/errorHandler.js';

let client = null;
function getClient() {
  if (!env.anthropicKey) throw new HttpError(503, 'El asistente no está disponible en este momento');
  // Se crea una sola vez y se reutiliza
  client ??= new Anthropic({ apiKey: env.anthropicKey });
  return client;
}

// Convierte el catálogo real de la base de datos en texto para el prompt.
// Así el chatbot "conoce" los productos: si el admin cambia un precio, el bot lo sabe sin tocar código.
async function catalogoComoTexto() {
  const productos = await Product.find({ activo: true }).limit(60).lean();
  if (!productos.length) return 'Por ahora no hay productos cargados.';
  return productos
    .map((p) => {
      const partes = [`- ${p.nombre} (${p.categoria}) — $${p.precio.toLocaleString('es-CO')} COP`];
      if (p.tallas?.length) partes.push(`tallas: ${p.tallas.join(', ')}`);
      if (p.colores?.length) partes.push(`colores: ${p.colores.join(', ')}`);
      partes.push(p.stock > 0 ? `${p.stock} disponibles` : 'agotado');
      if (p.descripcion) partes.push(p.descripcion);
      return partes.join(' | ');
    })
    .join('\n');
}

// Limpia el historial que manda el frontend: nunca se confía en él ciegamente.
function limpiarHistorial(messages) {
  const limpio = (Array.isArray(messages) ? messages : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 1000) }))
    .slice(-10); // solo los últimos 10 mensajes: controla costo y tamaño
  while (limpio.length && limpio[0].role !== 'user') limpio.shift(); // la API exige empezar con "user"
  return limpio;
}

function textoDe(respuesta) {
  return respuesta.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

// Chatbot de la tienda: conoce el catálogo y habla con el tono de la marca.
export async function responderChat(messages) {
  const historial = limpiarHistorial(messages);
  if (!historial.length || historial.at(-1).role !== 'user') {
    throw new HttpError(400, 'Escribe un mensaje para el asistente');
  }

  const system = `Eres el asistente virtual de "${env.brandName}", una tienda de ropa.
Tono de marca: ${env.brandTone}.
Responde siempre en español, de forma breve (máximo 4 o 5 frases).
Solo recomienda productos del catálogo de abajo y no inventes precios, tallas ni disponibilidad.
Si algo no está en el catálogo o no lo sabes, dilo con honestidad y sugiere usar el formulario de contacto.
No hables de temas ajenos a la tienda.

CATÁLOGO ACTUAL:
${await catalogoComoTexto()}`;

  const respuesta = await getClient().messages.create({
    model: env.anthropicModel,
    max_tokens: 500,
    system,
    messages: historial,
  });
  return textoDe(respuesta);
}

// Generador de textos para el admin: crea una descripción lista para publicar.
export async function generarDescripcion({ nombre, categoria, detalles }) {
  if (!nombre) throw new HttpError(400, 'El nombre del producto es obligatorio');

  const respuesta = await getClient().messages.create({
    model: env.anthropicModel,
    max_tokens: 300,
    system: `Eres redactor de "${env.brandName}", una tienda de ropa. Tono de marca: ${env.brandTone}.
Escribe en español una descripción de producto de 2 a 3 frases, lista para publicar, sin emojis y sin inventar materiales ni datos que no te den.
Devuelve solo la descripción.`,
    messages: [{ role: 'user', content: `Producto: ${nombre}\nCategoría: ${categoria || 'sin categoría'}\nDetalles: ${detalles || 'ninguno'}` }],
  });
  return textoDe(respuesta);
}
