const mongoose = require("mongoose");
const Message = require("../models/message.model");

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const crearMensaje = async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje, sitioWeb } = req.body || {};

    // "sitioWeb" es un campo oculto (honeypot): las personas no lo ven, los bots sí
    // y lo llenan. Si viene con texto, fingimos éxito y no guardamos nada.
    if (sitioWeb) {
      return res.status(201).json({ mensaje: "¡Mensaje enviado!" });
    }

    const datos = {
      nombre: typeof nombre === "string" ? nombre.trim() : "",
      email: typeof email === "string" ? email.trim() : "",
      asunto: typeof asunto === "string" ? asunto.trim() : "",
      mensaje: typeof mensaje === "string" ? mensaje.trim() : "",
    };

    if (datos.nombre.length < 2 || datos.nombre.length > 80) {
      return res.status(400).json({ mensaje: "Escribe tu nombre (2 a 80 caracteres)." });
    }
    if (!EMAIL_VALIDO.test(datos.email) || datos.email.length > 120) {
      return res.status(400).json({ mensaje: "Escribe un correo válido." });
    }
    if (datos.asunto.length > 120) {
      return res.status(400).json({ mensaje: "El asunto es muy largo (máximo 120)." });
    }
    if (datos.mensaje.length < 10 || datos.mensaje.length > 1000) {
      return res.status(400).json({ mensaje: "El mensaje debe tener entre 10 y 1000 caracteres." });
    }

    await Message.create(datos);

    res.status(201).json({ mensaje: "¡Mensaje enviado! Te responderemos pronto." });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error.message);
    res.status(500).json({ mensaje: "No pudimos enviar tu mensaje. Intenta de nuevo." });
  }
};

const listarMensajes = async (req, res) => {
  try {
    const mensajes = await Message.find().sort({ createdAt: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los mensajes." });
  }
};

const marcarLeido = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: "ID no válido." });
    }

    const mensaje = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { leido: true } },
      { returnDocument: "after" },
    );

    if (!mensaje) {
      return res.status(404).json({ mensaje: "Mensaje no encontrado." });
    }

    res.json(mensaje);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el mensaje." });
  }
};

const eliminarMensaje = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: "ID no válido." });
    }

    const eliminado = await Message.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Mensaje no encontrado." });
    }

    res.json({ mensaje: "Mensaje eliminado." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el mensaje." });
  }
};

module.exports = { crearMensaje, listarMensajes, marcarLeido, eliminarMensaje };
