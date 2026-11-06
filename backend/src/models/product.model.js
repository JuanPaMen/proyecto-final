// src/models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    // Se guarda solo con dígitos (ej: "65000"); el frontend le da formato
    precio: { type: String, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String, required: true },

    descripcion: { type: String, default: "" },
    tallas: { type: [String], default: [] },

    // Marca el producto como oferta (lo usa la sección "Ofertas" de la tienda)
    oferta: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Agrega automáticamente campos de createdAt y updatedAt
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
