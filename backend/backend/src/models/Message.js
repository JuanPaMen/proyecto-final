import mongoose from 'mongoose';

// Mensaje enviado desde el formulario de contacto.
const messageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no es válido'],
    },
    mensaje: { type: String, required: [true, 'El mensaje es obligatorio'], trim: true, maxlength: 2000 },
    leido: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
