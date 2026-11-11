# It's Peak – Tienda de ropa (proyecto final Jóvenes creaTIvos, ruta avanzada)

Aplicación web full stack para una tienda de ropa: catálogo, carrito, formulario de contacto,
panel de administración con login y un asistente con inteligencia artificial que conoce el
catálogo y habla con el tono de la marca.

## Estructura

```
proyecto-final/
├── frontend/              React + Vite (se publica en GitHub Pages)
│   └── src/
│       ├── Paginas/       Pantallas: detalle, carrito, contacto, admin...
│       ├── components/    Piezas reutilizables: Header, ChatBot, formularios...
│       ├── utils/         Funciones auxiliares (imágenes)
│       └── config.js      Dirección del backend (VITE_API_URL)
├── backend/               Node.js + Express + MongoDB (se publica en Render)
│   ├── index.js           Arranque del servidor, CORS y rutas
│   ├── scripts/           Tareas de una sola vez (crear administradores)
│   └── src/
│       ├── config/        Conexión a la base de datos y datos del negocio (para la IA)
│       ├── models/        Esquemas de MongoDB
│       ├── routes/        Qué URL llama a qué función
│       ├── controllers/   Lógica de cada ruta
│       ├── middlewares/   Protección de rutas del admin (JWT)
│       └── services/      Servicio de IA
└── .github/workflows/     Despliegue automático del frontend
```

## Cómo ejecutarlo en tu computador

Necesitas Node.js 20 o superior y una base de datos MongoDB (por ejemplo, gratis en MongoDB Atlas).

**Backend**
```bash
cd backend
cp .env.example .env     # en Windows: copy .env.example .env
npm install
npm run admins           # crea los administradores
npm run dev
```

**Frontend** (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

| Dónde | Variable | Para qué sirve |
|---|---|---|
| backend/.env | `MONGO_URI` | Conexión a MongoDB |
| backend/.env | `JWT_SECRET` | Clave para firmar el login del admin |
| backend/.env | `CORS_ORIGIN` | Sitios autorizados para llamar a la API |
| backend/.env | `AI_PROVIDER`, `GEMINI_API_KEY`, `GEMINI_MODEL` | Asistente con IA (Gemini tiene capa gratuita) |
| frontend/.env | `VITE_API_URL` | Dirección del backend desplegado |
| frontend/.env | `VITE_WHATSAPP` | Número de WhatsApp de la tienda |

El archivo `.env` nunca se sube a GitHub (está en `.gitignore`).

## API

| Método y ruta | Acceso | Descripción |
|---|---|---|
| `GET /api/productos` | Público | Lista de productos |
| `GET /api/productos/:id` | Público | Un producto |
| `POST/PUT/DELETE /api/productos` | Admin | Crear, editar, eliminar |
| `POST /api/auth/login` | Público | Inicio de sesión (máx. 5 intentos / 15 min) |
| `GET /api/auth/me` | Admin | Verifica la sesión |
| `POST /api/contacto` | Público | Guarda un mensaje (máx. 5 / hora) |
| `GET/PATCH/DELETE /api/contacto` | Admin | Ver, marcar como leído, eliminar mensajes |
| `POST /api/pedidos` | Público | Crea un pedido y registra el pago simulado (máx. 10 / hora) |
| `GET/PATCH /api/pedidos` | Admin | Ver pedidos y cambiar su estado |
| `POST /api/chat` | Público | Conversación con el asistente de IA |
| `POST /api/chat/descripcion` | Admin | Genera la descripción de un producto |

## Decisiones técnicas

- **Frontend y backend separados:** el frontend es estático y vive en GitHub Pages; el backend
  necesita un servidor, por eso va aparte (Render) y se comunican por la API.
- **HashRouter:** GitHub Pages no entiende las rutas de React; con `#` la página no da 404 al recargar.
- **La IA pasa por el backend:** la API key nunca llega al navegador. El backend arma las
  instrucciones con el catálogo real de MongoDB y los datos de `backend/src/config/negocio.js`.
- **Seguridad:** contraseñas con bcrypt, sesión con JWT de 2 horas, límites de intentos,
  CORS restringido y validación de datos en el servidor.
