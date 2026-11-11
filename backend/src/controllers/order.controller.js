const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { METODOS_PAGO, ESTADOS_PEDIDO } = require("../config/pagos");

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

// Mismo cálculo que hace el frontend al mostrar el precio, pero este es el que cuenta:
// el navegador solo manda qué producto, talla y cantidad, nunca el precio
const precioFinal = (producto) => {
  const precio = Number(String(producto.precio).replace(/\D/g, ""));
  const descuento = Number(producto.descuentoPorcentaje) || 0;

  return producto.oferta && descuento > 0
    ? Math.round(precio * (1 - descuento / 100))
    : precio;
};

const generarReferencia = () =>
  `PEAK-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;

const validarCliente = (cliente) => {
  const datos = {
    nombre: texto(cliente?.nombre),
    email: texto(cliente?.email),
    telefono: texto(cliente?.telefono).replace(/[\s-]/g, ""),
    direccion: texto(cliente?.direccion),
    ciudad: texto(cliente?.ciudad),
  };

  if (datos.nombre.length < 2 || datos.nombre.length > 80) {
    return { error: "Escribe tu nombre (2 a 80 caracteres)." };
  }
  if (!EMAIL_VALIDO.test(datos.email) || datos.email.length > 120) {
    return { error: "Escribe un correo válido." };
  }
  if (datos.telefono && !/^\+?\d{7,15}$/.test(datos.telefono)) {
    return { error: "El teléfono debe tener entre 7 y 15 números." };
  }
  if (datos.direccion.length < 5 || datos.direccion.length > 150) {
    return { error: "Escribe tu dirección de entrega." };
  }
  if (datos.ciudad.length < 2 || datos.ciudad.length > 60) {
    return { error: "Escribe tu ciudad." };
  }

  return { datos };
};

// Público: crea el pedido y registra el pago
const crearPedido = async (req, res) => {
  try {
    const { items, cliente, metodoPago } = req.body || {};

    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ mensaje: "Tu carrito está vacío o es demasiado grande." });
    }

    const pedidos = items.map((item) => ({
      id: item?.id,
      talla: texto(item?.talla).slice(0, 20),
      cantidad: Number(item?.cantidad),
    }));

    const itemsValidos = pedidos.every(
      (p) =>
        mongoose.isValidObjectId(p.id) &&
        Number.isInteger(p.cantidad) &&
        p.cantidad >= 1 &&
        p.cantidad <= 10,
    );

    if (!itemsValidos) {
      return res.status(400).json({ mensaje: "Hay un producto del carrito con datos no válidos." });
    }

    const { datos, error } = validarCliente(cliente);

    if (error) {
      return res.status(400).json({ mensaje: error });
    }

    if (!METODOS_PAGO.includes(metodoPago)) {
      return res.status(400).json({ mensaje: "Elige un método de pago." });
    }

    const ids = [...new Set(pedidos.map((p) => String(p.id)))];
    const productos = await Product.find({ _id: { $in: ids } }).lean();
    const porId = new Map(productos.map((p) => [String(p._id), p]));

    const lineas = [];

    for (const p of pedidos) {
      const producto = porId.get(String(p.id));

      if (!producto) {
        return res.status(400).json({
          mensaje: "Un producto del carrito ya no está disponible. Quítalo e intenta de nuevo.",
        });
      }

      if (producto.tallas?.length && !producto.tallas.includes(p.talla)) {
        return res.status(400).json({
          mensaje: `La talla ${p.talla || "elegida"} de ${producto.nombre} ya no está disponible.`,
        });
      }

      const precio = precioFinal(producto);

      if (!(precio > 0)) {
        return res.status(400).json({ mensaje: `${producto.nombre} no tiene un precio válido.` });
      }

      lineas.push({
        producto: producto._id,
        nombre: producto.nombre,
        talla: p.talla,
        cantidad: p.cantidad,
        precio,
      });
    }

    const total = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

    // Pago simulado: la tienda es de práctica y no se cobra dinero. Con una pasarela
    // real (Wompi, Mercado Pago...) aquí se pediría el cobro y el pedido solo quedaría
    // "pagado" si la pasarela lo aprueba.
    const pedido = await Order.create({
      referencia: generarReferencia(),
      items: lineas,
      total,
      cliente: datos,
      metodoPago,
      estado: "pagado",
    });

    res.status(201).json({
      referencia: pedido.referencia,
      total: pedido.total,
      estado: pedido.estado,
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error.message);
    res.status(500).json({ mensaje: "No pudimos procesar el pago. Intenta de nuevo." });
  }
};

// Admin: listar pedidos (los más nuevos primero)
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Order.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los pedidos." });
  }
};

// Admin: cambiar el estado de un pedido (por ejemplo, a "enviado")
const cambiarEstado = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: "ID no válido." });
    }

    if (!ESTADOS_PEDIDO.includes(req.body?.estado)) {
      return res.status(400).json({ mensaje: "Estado no válido." });
    }

    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { estado: req.body.estado } },
      { returnDocument: "after" },
    );

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado." });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el pedido." });
  }
};

module.exports = { crearPedido, listarPedidos, cambiarEstado };
