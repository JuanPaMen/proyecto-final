import mongoose from 'mongoose';

// Producto del catálogo de ropa.
// "activo" permite ocultar un producto sin borrarlo desde el panel admin.
const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 120 },
    descripcion: { type: String, trim: true, maxlength: 1000, default: '' },
    precio: { type: Number, required: [true, 'El precio es obligatorio'], min: [0, 'El precio no puede ser negativo'] },
    categoria: { type: String, trim: true, default: 'general' }, // camisetas, pantalones, accesorios...
    tallas: { type: [String], default: [] },
    colores: { type: [String], default: [] },
    imagen: { type: String, trim: true, default: '' }, // URL de la imagen
    stock: { type: Number, min: 0, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
