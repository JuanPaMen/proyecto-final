const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/product.routes");
const authRoutes = require("./src/routes/auth.routes");
const contactRoutes = require("./src/routes/contact.routes");
const chatRoutes = require("./src/routes/chat.routes");

// Si falta una variable obligatoria, avisamos de una vez (en vez de fallar a medias)
["MONGO_URI", "JWT_SECRET"].forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`Falta la variable de entorno ${variable} (revisa backend/.env)`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// En Render/Railway hay un proxy delante de la app. Sin esto, el límite de
// intentos (express-rate-limit) vería siempre la misma IP.
app.set("trust proxy", 1);

// CORS: solo aceptamos peticiones desde los sitios de la lista CORS_ORIGIN
const origenesPermitidos = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origen) => origen.trim());

app.use(
  cors({
    origin(origen, callback) {
      // Sin "origen" = herramientas como Postman o llamadas del mismo servidor
      if (!origen || origenesPermitidos.includes(origen)) {
        return callback(null, true);
      }
      callback(new Error("Origen no permitido por CORS"));
    },
  }),
);

// Limitamos el tamaño del cuerpo para evitar envíos gigantes
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.send("Backend de It's Peak funcionando");
});

app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactRoutes);
app.use("/api/chat", chatRoutes);

// Manejo de errores general (por ejemplo, un origen bloqueado por CORS)
app.use((error, req, res, next) => {
  console.error("Error:", error.message);
  res.status(error.message.includes("CORS") ? 403 : 500).json({
    mensaje: error.message.includes("CORS")
      ? "Origen no permitido."
      : "Error interno del servidor.",
  });
});

const iniciarServidor = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

iniciarServidor();
