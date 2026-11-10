const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    asunto: { type: String, trim: true, maxlength: 120, default: "" },
    mensaje: { type: String, required: true, trim: true, maxlength: 1000 },
    leido: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
