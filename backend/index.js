const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Backend de It's Peak funcionando");
});

// Rutas de productos
app.use("/api", productRoutes);

// Iniciar el servidor
const iniciarServidor = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

iniciarServidor();
