// Dirección del backend. En desarrollo usa localhost; en producción se define
// con la variable VITE_API_URL (ver frontend/.env.example).
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");
