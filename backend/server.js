require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productosRoutes = require("./routes/productos");
const cors = require("cors");

const app = express();

/*Permitir conexion con react */
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const PORT = process.env.PORT || 3000;

//configuracion del servidor//
app.use(express.json());
app.use("/api/productos", productosRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor de It's Peak funcionando");
});

// Conexion a MongoDB
async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "itspeak",
    });
    console.log("Base de datos:", mongoose.connection.name);

    console.log("MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error al conectar MongoDB:", error.message);
  }
}

iniciarServidor();
