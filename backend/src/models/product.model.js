// src/models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    precio: { type: String, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String, required: true }
}, {
    timestamps: true // Agrega automáticamente campos de createdAt y updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;