// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const seedDB = require('./src/config/seed'); // Importar el seed

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y luego poblar los productos
connectDB().then(async () => {
    await seedDB();
});

app.use(cors());
app.use(express.json());

const productRoutes = require('./src/routes/product.routes');

app.get('/', (req, res) => {
    res.send('¡Hola desde mi propio backend organizado, con CORS y Base de Datos!');
});

app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});