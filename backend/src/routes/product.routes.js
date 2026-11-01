const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Obtener todos los productos
router.get("/productos", getProducts);

// Obtener un producto por su ID
router.get("/productos/:id", getProductById);

// Agregar un producto
router.post("/productos", createProduct);

// Eliminar un producto
router.delete("/productos/:id", deleteProduct);

module.exports = router;
