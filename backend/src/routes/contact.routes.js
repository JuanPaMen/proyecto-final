const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  crearMensaje,
  listarMensajes,
  marcarLeido,
  eliminarMensaje,
} = require("../controllers/contact.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

const router = express.Router();

// Máximo 5 mensajes por hora desde la misma IP (evita spam)
const limitarEnvios = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { mensaje: "Enviaste varios mensajes seguidos. Intenta más tarde." },
});

// Pública
router.post("/", limitarEnvios, crearMensaje);

// Solo administradores
router.get("/", protegerAdmin, listarMensajes);
router.patch("/:id/leido", protegerAdmin, marcarLeido);
router.delete("/:id", protegerAdmin, eliminarMensaje);

module.exports = router;
