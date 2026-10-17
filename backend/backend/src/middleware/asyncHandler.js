// Envuelve controladores async para que cualquier error llegue al errorHandler
// sin repetir try/catch en cada función.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
