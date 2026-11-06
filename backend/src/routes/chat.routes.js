const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  responderChat,
  generarDescripcion,
} = require("../controllers/chat.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

const router = express.Router();

// Cada consulta a la IA consume cuota: limitamos por IP (20 cada 10 minutos)
const limitarIA = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { mensaje: "Has hecho muchas consultas seguidas. Espera unos minutos." },
});

// Pública: chatbot de la tienda
router.post("/", limitarIA, responderChat);

// Solo admin: generar descripción de producto
router.post("/descripcion", protegerAdmin, limitarIA, generarDescripcion);

module.exports = router;
