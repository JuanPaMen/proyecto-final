import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Solo existen usuarios administradores. No hay registro público:
// el admin se crea con `npm run seed`, así nadie externo puede darse de alta.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false -> el hash nunca sale en las consultas a menos que se pida a propósito
    password: { type: String, required: true, minlength: 8, select: false },
    rol: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true }
);

// Nunca se guarda la contraseña en texto plano: se encripta antes de guardar.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compararPassword = function (plana) {
  return bcrypt.compare(plana, this.password);
};

export default mongoose.model('User', userSchema);
