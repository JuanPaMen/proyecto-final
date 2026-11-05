// Información del negocio que usa la IA para responder "como la tienda".
// COMPLETA los datos con null o texto real. Si algo está en null, el asistente
// dirá que no tiene ese dato y enviará al cliente al formulario de contacto.
module.exports = {
  nombre: "It's Peak",

  // Cómo habla la marca. Cámbialo para que suene a ustedes.
  tono:
    "Cercano, juvenil y seguro de sí mismo. Tutea al cliente, usa español colombiano natural " +
    "(sin exagerar la jerga), sé amable y directo. Máximo un emoji por respuesta.",

  datos: {
    queVendemos: "Ropa urbana: camisetas, polos, camisas, jeans, bermudas y gorras.",
    ciudad: null, // Ej: "Cartagena"
    envios: null, // Ej: "Enviamos a todo el país por transportadora, 2 a 5 días hábiles"
    metodosPago: null, // Ej: "Transferencia, Nequi y contra entrega en Cartagena"
    horarioAtencion: null, // Ej: "Lunes a sábado, 9 a. m. a 6 p. m."
    cambiosYDevoluciones: null, // Ej: "Cambios dentro de los 8 días con etiqueta"
    whatsapp: null, // Ej: "+57 300 000 0000"
  },
};
