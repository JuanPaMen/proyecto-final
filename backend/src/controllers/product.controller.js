const Product = require("../models/product.model");

// 1. Obtener todos los productos
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

// 2. Obtener un producto individual
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

// 3. Agregar un producto
const createProduct = async (req, res) => {
  try {
    const { id, nombre, precio, categoria, imagen, descripcion, tallas } =
      req.body;

    const nuevoProducto = new Product({
      id,
      nombre,
      precio,
      categoria,
      imagen,
      descripcion,
      tallas,
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

// 4. Editar un producto
const updateProduct = async (req, res) => {
  try {
    const camposPermitidos = [
      "nombre",
      "precio",
      "categoria",
      "imagen",
      "descripcion",
      "tallas",
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

    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: cambios },
      {
        new: true,
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

// 5. Eliminar un producto
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

// Exportar las funciones
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
