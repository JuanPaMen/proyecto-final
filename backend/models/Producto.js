const mongoose = require("mongoose");

/*estructura de losm productos */
const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },

  descripcion: {
    type: String,
  },

  precio: {
    type: Number,
    required: true,
    min: 0,
  },

  categoria: {
    type: String,
    required: true,
  },

  imagen: {
    type: String,
  },

  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  oferta: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Producto", productoSchema, "productos");
