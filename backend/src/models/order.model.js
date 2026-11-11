const mongoose = require("mongoose");
const { METODOS_PAGO, ESTADOS_PEDIDO } = require("../config/pagos");

const itemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    nombre: { type: String, required: true },
    talla: { type: String, default: "" },
    cantidad: { type: Number, required: true, min: 1 },
    // Precio unitario al momento de comprar: si el producto cambia después, el pedido no
    precio: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    referencia: { type: String, required: true, unique: true },
    items: { type: [itemSchema], required: true },
    total: { type: Number, required: true, min: 1 },
    cliente: {
      nombre: { type: String, required: true, trim: true, maxlength: 80 },
      email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
      telefono: { type: String, trim: true, maxlength: 20, default: "" },
      direccion: { type: String, required: true, trim: true, maxlength: 150 },
      ciudad: { type: String, required: true, trim: true, maxlength: 60 },
    },
    metodoPago: { type: String, enum: METODOS_PAGO, required: true },
    estado: { type: String, enum: ESTADOS_PEDIDO, default: "pagado" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
