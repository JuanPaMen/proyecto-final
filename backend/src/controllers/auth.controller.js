const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res) => {
  try {
    const { usuario, password } = req.body;

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

    const admin = await Admin.findOne({
      usuario: usuario.trim().toLowerCase(),
    }).select("+passwordHash");

    const passwordCorrecta = admin
      ? await bcrypt.compare(password, admin.passwordHash)
      : false;

    // Mismo mensaje si falla el usuario o la contraseña, para no revelar cuál existe
    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos.",
      });
    }

    // Token firmado con JWT_SECRET que vence en 2 horas
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
