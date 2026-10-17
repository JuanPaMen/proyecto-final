# Backend — Tienda de ropa

API REST con **Node.js + Express + MongoDB**, autenticación con **JWT** para el panel admin y un **chatbot con IA** que conoce el catálogo.

## Estructura

```
backend/
├── src/
│   ├── config/        # variables de entorno y conexión a MongoDB
│   ├── models/        # esquemas: Product, Message, User
│   ├── middleware/    # auth (JWT), manejo de errores, asyncHandler
│   ├── controllers/   # lógica de cada endpoint
│   ├── routes/        # definición de rutas y límites de uso
│   ├── services/      # ai.service.js (toda la lógica de IA)
│   ├── scripts/       # seed.js (crea admin y productos de ejemplo)
│   ├── app.js         # configuración de Express
│   └── server.js      # arranque
├── .env.example
└── package.json
```

## Puesta en marcha

```bash
npm install
cp .env.example .env     # y completa los valores
npm run seed             # crea el admin y 3 productos de ejemplo
npm run dev              # http://localhost:4000
```

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | público | Verifica que la API está viva |
| POST | `/api/auth/login` | público | `{ email, password }` → `{ token }` |
| GET | `/api/auth/me` | admin | Verifica el token |
| GET | `/api/products` | público | Catálogo. Filtros: `categoria`, `q`, `page`, `limit` |
| GET | `/api/products/:id` | público | Detalle de un producto |
| POST | `/api/products` | admin | Crear producto |
| PUT | `/api/products/:id` | admin | Editar producto |
| DELETE | `/api/products/:id` | admin | Eliminar producto |
| POST | `/api/contact` | público | `{ nombre, email, mensaje }` |
| GET | `/api/contact` | admin | Ver mensajes recibidos |
| PATCH | `/api/contact/:id/read` | admin | Marcar como leído |
| DELETE | `/api/contact/:id` | admin | Eliminar mensaje |
| POST | `/api/chat` | público | `{ messages: [{role, content}] }` → `{ reply }` |
| POST | `/api/ai/descripcion` | admin | `{ nombre, categoria?, detalles? }` → `{ descripcion }` |

Las rutas de admin requieren el header `Authorization: Bearer <token>`.
Todos los errores responden `{ "error": "mensaje claro" }`.

## Ejemplo desde el frontend

```js
const API = 'https://tu-backend.onrender.com/api';

// Catálogo
const { items } = await (await fetch(`${API}/products`)).json();

// Login
const res = await fetch(`${API}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { token } = await res.json();

// Chatbot (el frontend guarda el historial y lo reenvía)
const { reply } = await (await fetch(`${API}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: '¿Qué camisetas tienen?' }] }),
})).json();
```

## Despliegue

GitHub Pages solo sirve archivos estáticos, así que **el frontend va en GitHub Pages y este backend en otro servicio** (por ejemplo Render) con la base de datos en **MongoDB Atlas**.

1. Crea un clúster gratuito en MongoDB Atlas y copia la cadena de conexión a `MONGODB_URI`.
2. Sube esta carpeta a un servicio de hosting para Node (build: `npm install`, start: `npm start`).
3. Configura allí las variables del `.env.example` (nunca subas el `.env`).
4. En `FRONTEND_URL` pon el origen de GitHub Pages, por ejemplo `https://JuanPaMen.github.io`.
5. Ejecuta `npm run seed` una vez para crear el admin.
