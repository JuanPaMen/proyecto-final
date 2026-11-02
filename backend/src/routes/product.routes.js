const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

// Rutas públicas
router.get("/productos", getProducts);
router.get("/productos/:id", getProductById);

// Rutas protegidas
router.post("/productos", protegerAdmin, createProduct);
router.put("/productos/:id", protegerAdmin, updateProduct);
router.delete("/productos/:id", protegerAdmin, deleteProduct);

module.exports = router;
