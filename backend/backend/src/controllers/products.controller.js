import Product from '../models/Product.js';
import { HttpError } from '../middleware/errorHandler.js';

// Campos que el cliente puede enviar. Se filtran para evitar que alguien
// modifique campos internos (_id, createdAt...) mandándolos en el body.
const CAMPOS = ['nombre', 'descripcion', 'precio', 'categoria', 'tallas', 'colores', 'imagen', 'stock', 'activo'];
const pick = (body) => Object.fromEntries(CAMPOS.filter((c) => body[c] !== undefined).map((c) => [c, body[c]]));

// GET /api/products?categoria=camisetas&q=oversize&page=1&limit=12
// Público: solo muestra productos activos. Con token de admin (?todos=true) muestra también los ocultos.
export async function listar(req, res) {
  const { categoria, q, todos } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);

  const filtro = {};
  if (!(todos === 'true' && req.user)) filtro.activo = true;
  if (categoria) filtro.categoria = categoria;
  if (q) filtro.nombre = { $regex: String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }; // se escapa el regex del usuario

  const [items, total] = await Promise.all([
    Product.find(filtro).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filtro),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function obtener(req, res) {
  const producto = await Product.findById(req.params.id);
  if (!producto || (!producto.activo && !req.user)) throw new HttpError(404, 'Producto no encontrado');
  res.json(producto);
}

export async function crear(req, res) {
  const producto = await Product.create(pick(req.body));
  res.status(201).json(producto);
}

export async function actualizar(req, res) {
  // runValidators: que las reglas del modelo también apliquen al actualizar
  const producto = await Product.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!producto) throw new HttpError(404, 'Producto no encontrado');
  res.json(producto);
}

export async function eliminar(req, res) {
  const producto = await Product.findByIdAndDelete(req.params.id);
  if (!producto) throw new HttpError(404, 'Producto no encontrado');
  res.json({ mensaje: 'Producto eliminado' });
}
