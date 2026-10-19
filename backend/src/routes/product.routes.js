// src/routes/product.routes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/product.controller');

// Ruta GET para obtener productos
router.get('/productos', getProducts);

// Ruta POST para agregar un producto nuevo
router.post('/productos', createProduct);

// Ruta DELETE para eliminar un producto por su _id de MongoDB
router.delete('/productos/:id', deleteProduct);

module.exports = router;