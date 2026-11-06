// Script de una sola vez: deja todos los precios con el mismo formato
// (solo dígitos). Ej: "$65.000" -> "65000".
// Uso (desde la carpeta backend):  node scripts/migrarPrecios.js
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../src/models/product.model");

const migrar = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const productos = await Product.find();
    let actualizados = 0;

    for (const producto of productos) {
      const limpio = String(producto.precio).replace(/\D/g, "");

      if (limpio && limpio !== producto.precio) {
        // updateOne evita ejecutar otras validaciones del esquema
        await Product.updateOne({ _id: producto._id }, { $set: { precio: limpio } });
        console.log(`${producto.nombre}: "${producto.precio}" -> "${limpio}"`);
        actualizados++;
      }
    }

    console.log(`Listo. Productos actualizados: ${actualizados} de ${productos.length}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

migrar();
