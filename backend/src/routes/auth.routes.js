const express = require("express");
const rateLimit = require("express-rate-limit");

const { iniciarSesion } = require("../controllers/auth.controller");

const router = express.Router();

// Limitar los intentos de inicio de sesión
const limitarIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    mensaje: "Demasiados intentos. Intenta más tarde.",
  },
});

// Ruta para iniciar sesión
router.post("/login", limitarIntentos, iniciarSesion);

module.exports = router;
