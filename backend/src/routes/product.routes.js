const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

// Rutas públicas
router.get("/productos", getProducts);
router.get("/productos/:id", getProductById);

// Rutas protegidas: solo administradores
router.post("/productos", protegerAdmin, createProduct);
router.delete("/productos/:id", protegerAdmin, deleteProduct);

module.exports = router;
