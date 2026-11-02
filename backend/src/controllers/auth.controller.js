const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Iniciar sesión del administrador
const iniciarSesion = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Validar los datos
    if (
      typeof usuario !== "string" ||
      typeof password !== "string" ||
      !usuario.trim() ||
      !password
    ) {
      return res.status(400).json({
        mensaje: "Ingresa usuario y contraseña.",
      });
    }

    // Buscar administrador en MongoDB
    const admin = await Admin.findOne({
      usuario: usuario.trim().toLowerCase(),
    }).select("+passwordHash");

    // Verificar usuario y contraseña
    const passwordCorrecta = admin
      ? await bcrypt.compare(password, admin.passwordHash)
      : false;

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos.",
      });
    }

    // Crear token de autenticación
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        usuario: admin.usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: admin.usuario,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);

    res.status(500).json({
      mensaje: "Error al iniciar sesión.",
    });
  }
};

module.exports = { iniciarSesion };
