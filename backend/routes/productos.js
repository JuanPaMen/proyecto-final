const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos",
    });
  }
});

module.exports = router;
