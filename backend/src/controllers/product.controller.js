// src/controllers/product.controller.js
const Product = require('../models/product.model');

// Obtener todos los productos desde MongoDB
const getProducts = async (req, res) => {
    try {
        const productos = await Product.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
};

// Crear un nuevo producto en MongoDB
const createProduct = async (req, res) => {
    try {
        const { id, nombre, precio, categoria, imagen } = req.body;

        // Crear una nueva instancia del modelo Product
        const nuevoProducto = new Product({
            id,
            nombre,
            precio,
            categoria,
            imagen
        });

        // Guardar en la base de datos
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct
};

// Eliminar un producto en MongoDB
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Recibimos el _id de MongoDB por la URL
        const productoEliminado = await Product.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto eliminado exitosamente', productoEliminado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
};

// No olvides exportarlo junto con los demás
module.exports = {
    getProducts,
    createProduct,
    deleteProduct
};