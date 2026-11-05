const {
  generarTexto,
  instruccionesChat,
  instruccionesDescripcion,
} = require("../services/ia.service");

// Traduce los errores internos a mensajes claros para el usuario
const responderError = (error, res) => {
  if (error.message === "IA_NO_CONFIGURADA") {
    return res.status(503).json({ mensaje: "El asistente aún no está configurado." });
  }

  if (error.status === 429) {
    return res.status(429).json({
      mensaje: "El asistente está recibiendo muchas consultas. Intenta en un minuto.",
    });
  }

  if (error.status >= 500) {
    return res.status(503).json({
      mensaje: "El asistente está muy ocupado en este momento. Intenta de nuevo en unos segundos.",
    });
  }

  console.error("Error de IA:", error.message);
  res.status(502).json({
    mensaje: "No pude responder en este momento. Intenta de nuevo o escríbenos por Contacto.",
  });
};

// Público: conversación con el asistente de la tienda
const responderChat = async (req, res) => {
  try {
    const { mensajes } = req.body || {};

    if (!Array.isArray(mensajes) || mensajes.length === 0 || mensajes.length > 20) {
      return res.status(400).json({ mensaje: "Conversación no válida." });
    }

    // Limpiamos el historial: solo los últimos 10 mensajes, con texto corto
    const historial = mensajes
      .slice(-10)
      .map((m) => ({
        rol: m?.rol === "assistant" ? "assistant" : "user",
        texto: typeof m?.texto === "string" ? m.texto.trim().slice(0, 500) : "",
      }))
      .filter((m) => m.texto);

    // El historial debe empezar y terminar con un mensaje del usuario
    while (historial.length && historial[0].rol !== "user") historial.shift();

    if (!historial.length || historial[historial.length - 1].rol !== "user") {
      return res.status(400).json({ mensaje: "Escribe una pregunta para continuar." });
    }

    const respuesta = await generarTexto({
      instrucciones: await instruccionesChat(),
      mensajes: historial,
    });

    res.json({ respuesta });
  } catch (error) {
    responderError(error, res);
  }
};

// Admin: generar la descripción de un producto con IA
const generarDescripcion = async (req, res) => {
  try {
    const { nombre, categoria, tallas } = req.body || {};

    if (typeof nombre !== "string" || nombre.trim().length < 2 || nombre.length > 150) {
      return res.status(400).json({ mensaje: "Escribe primero el nombre del producto." });
    }

    const datos = [
      `Nombre: ${nombre.trim()}`,
      typeof categoria === "string" && categoria ? `Categoría: ${categoria.slice(0, 40)}` : "",
      Array.isArray(tallas) && tallas.length
        ? `Tallas: ${tallas.slice(0, 10).join(", ").slice(0, 60)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const descripcion = await generarTexto({
      instrucciones: instruccionesDescripcion(),
      mensajes: [{ rol: "user", texto: `Escribe la descripción de este producto:\n${datos}` }],
      maxTokens: 512,
    });

    const limpia = descripcion
      .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    res.json({ descripcion: limpia });
  } catch (error) {
    responderError(error, res);
  }
};

module.exports = { responderChat, generarDescripcion };
