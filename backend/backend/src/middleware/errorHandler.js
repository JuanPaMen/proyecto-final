// Manejo centralizado de errores: el frontend siempre recibe { error: "mensaje claro" }.
export function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Errores de validación de Mongoose (campos requeridos, formato, mínimos...)
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: mensajes.join('. ') });
  }
  // ID mal formado (ej: /api/products/abc)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'El identificador no es válido' });
  }
  // Duplicados (índice unique)
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err); // el detalle técnico solo va al log, no al usuario
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message });
}

// Helper para lanzar errores con código HTTP desde los controladores.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
