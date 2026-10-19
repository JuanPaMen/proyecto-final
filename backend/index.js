// index.js (en la raíz de backend)
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares esenciales
app.use(cors()); // Permite que tu frontend se comunique con este backend
app.use(express.json()); // Permite que el servidor entienda datos en formato JSON

// Importar las rutas de productos
const productRoutes = require('./src/routes/product.routes');

// Ruta principal de bienvenida
app.get('/', (req, res) => {
    res.send('¡Hola desde mi propio backend organizado y con CORS!');
});

// Usar las rutas de productos bajo el prefijo /api
app.use('/api', productRoutes);

// Encender el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});