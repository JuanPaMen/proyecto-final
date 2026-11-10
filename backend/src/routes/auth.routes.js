const express = require("express");
const rateLimit = require("express-rate-limit");

const { iniciarSesion } = require("../controllers/auth.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

const router = express.Router();

// Máximo 5 intentos de login cada 15 minutos por IP, para frenar la fuerza bruta
const limitarIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    mensaje: "Demasiados intentos. Intenta más tarde.",
  },
});

router.post("/login", limitarIntentos, iniciarSesion);

router.get("/me", protegerAdmin, (req, res) => {
  res.json({
    usuario: req.admin.usuario,
  });
});

module.exports = router;
