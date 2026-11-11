const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  crearPedido,
  listarPedidos,
  cambiarEstado,
} = require("../controllers/order.controller");

const protegerAdmin = require("../middlewares/auth.middleware");

const router = express.Router();

// Máximo 10 pedidos por hora desde la misma IP
const limitarPedidos = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { mensaje: "Hiciste varios pedidos seguidos. Intenta más tarde." },
});

// Pública
router.post("/", limitarPedidos, crearPedido);

// Solo administradores
router.get("/", protegerAdmin, listarPedidos);
router.patch("/:id/estado", protegerAdmin, cambiarEstado);

module.exports = router;
