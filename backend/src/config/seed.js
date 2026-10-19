// src/config/seed.js
const Product = require('../models/product.model');

const productosIniciales = [
    { 
        id: 1, 
        nombre: 'Camiseta Oversize', 
        precio: '$65.000', 
        categoria: 'camisetas',
        imagen: 'assets/img/sueteralemaniadeportivo.jpg'
    },
    { 
        id: 2, 
        nombre: 'Camiseta oversize polo crema clara con diseño college', 
        precio: '$85.000', 
        categoria: 'polos',
        imagen: 'assets/img/camiseta.webp'
    },
    { 
        id: 3, 
        nombre: 'Jean azul claro loose con cortes, bota ancha y tiro medio', 
        precio: '120.000', 
        categoria: 'jeans',
        imagen: 'assets/img/pantalon-jean.webp'
    },
    { 
        id: 4, 
        nombre: 'Bermuda Casual', 
        precio: '$75.000', 
        categoria: 'bermudas',
        imagen: 'assets/img/bermuda-jean.webp'
    },
    { 
        id: 5, 
        nombre: 'Gorra New Era Floral 9FORTY Strapback Verde', 
        precio: '$45.000', 
        categoria: 'gorras',
        imagen: 'assets/img/gorra-new-era-floral.webp'
    }
];

const seedDB = async () => {
    try {
        // Borra los productos existentes para evitar duplicados
        await Product.deleteMany({});
        // Inserta los productos iniciales
        await Product.insertMany(productosIniciales);
        console.log('🌱 ¡Productos agregados exitosamente a la base de datos!');
    } catch (error) {
        console.error('❌ Error al sembrar la base de datos:', error);
    }
};

module.exports = seedDB;