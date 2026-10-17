// Uso: npm run seed
// Crea el usuario admin (con ADMIN_EMAIL / ADMIN_PASSWORD del .env) y, si el catálogo está vacío, productos de ejemplo.
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

await mongoose.connect(env.mongoUri);

if (!adminEmail || !adminPassword) {
  console.error('Define ADMIN_EMAIL y ADMIN_PASSWORD en el .env');
  process.exit(1);
}

if (!(await User.findOne({ email: adminEmail.toLowerCase() }))) {
  await User.create({ email: adminEmail, password: adminPassword });
  console.log(`Admin creado: ${adminEmail}`);
} else {
  console.log('El admin ya existía, no se modificó');
}

if ((await Product.countDocuments()) === 0) {
  await Product.insertMany([
    { nombre: 'Camiseta oversize', descripcion: 'Algodón suave y corte holgado.', precio: 59000, categoria: 'camisetas', tallas: ['S', 'M', 'L'], colores: ['negro', 'blanco'], stock: 20 },
    { nombre: 'Jean recto', descripcion: 'Tiro alto, ideal para todos los días.', precio: 139000, categoria: 'pantalones', tallas: ['28', '30', '32'], colores: ['azul'], stock: 12 },
    { nombre: 'Gorra clásica', descripcion: 'Ajustable, con logo bordado.', precio: 35000, categoria: 'accesorios', tallas: ['única'], colores: ['negro', 'beige'], stock: 30 },
  ]);
  console.log('Productos de ejemplo creados');
}

await mongoose.disconnect();
