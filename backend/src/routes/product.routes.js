const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/product.controller');

// Definimos la ruta para obtener productos
router.get('/productos', getProducts);

module.exports = router;