const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const protegerAdmin = async (req, res, next) => {
  try {
    // Obtener el token enviado por el cliente
    const autorizacion = req.headers.authorization;

    if (!autorizacion?.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Acceso denegado. Inicia sesión.",
      });
    }

    const token = autorizacion.split(" ")[1];

    // Verificar que el token sea válido
    const datos = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Comprobar que el administrador existe
    const admin = await Admin.findById(datos.id);

    if (!admin) {
      return res.status(401).json({
        mensaje: "Administrador no autorizado.",
      });
    }

    req.admin = admin;

    // Permitir continuar
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Sesión inválida o expirada.",
    });
  }
};

module.exports = protegerAdmin;
