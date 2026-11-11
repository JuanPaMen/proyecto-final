const Product = require("../models/product.model");

// Deja solo los dígitos del precio: "$65.000" -> "65000".
// Así todos los productos guardan el precio con el mismo formato.
const limpiarPrecio = (precio) => String(precio ?? "").replace(/\D/g, "");

const getProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(400).json({
      mensaje: "ID del producto no válido",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      nombre,
      precio,
      categoria,
      imagen,
      descripcion,
      tallas,
      oferta,
      descuentoPorcentaje,
    } = req.body;

    const precioLimpio = limpiarPrecio(precio);

    if (!precioLimpio) {
      return res.status(400).json({ mensaje: "El precio no es válido" });
    }

    const nuevoProducto = new Product({
      nombre,
      precio: precioLimpio,
      categoria,
      imagen,
      descripcion,
      tallas,
      oferta: Boolean(oferta),
      descuentoPorcentaje: descuentoPorcentaje ?? 0,
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el producto",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Solo estos campos se pueden editar; el resto de lo que llegue se ignora
    const camposPermitidos = [
      "nombre",
      "precio",
      "categoria",
      "imagen",
      "descripcion",
      "tallas",
      "oferta",
      "descuentoPorcentaje",
    ];

    const cambios = {};

    camposPermitidos.forEach((campo) => {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, campo)) {
        cambios[campo] = req.body[campo];
      }
    });

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({
        mensaje: "No se enviaron campos para actualizar",
      });
    }

    if ("precio" in cambios) {
      cambios.precio = limpiarPrecio(cambios.precio);

      if (!cambios.precio) {
        return res.status(400).json({ mensaje: "El precio no es válido" });
      }
    }

    if ("oferta" in cambios) {
      cambios.oferta = Boolean(cambios.oferta);
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: cambios },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!productoActualizado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
      productoEliminado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al eliminar el producto",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
