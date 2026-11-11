const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("node:readline");
const { Writable } = require("node:stream");
require("dotenv").config();

const Admin = require("../src/models/admin.model");

// Ocultar las contraseñas al escribirlas
let ocultar = false;

const salida = new Writable({
  write(texto, encoding, callback) {
    if (!ocultar) process.stdout.write(texto);
    callback();
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: salida,
  terminal: true,
});

const preguntar = (mensaje, secreto = false) => {
  return new Promise((resolve) => {
    if (secreto) {
      process.stdout.write(mensaje);
      ocultar = true;
      rl.question("", (respuesta) => {
        ocultar = false;
        console.log();
        resolve(respuesta);
      });
    } else {
      rl.question(mensaje, resolve);
    }
  });
};

const crearAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Admin.init();

    console.log("MongoDB conectado");
    console.log("Configuración de administradores");

    for (let i = 1; i <= 2; i++) {
      console.log(`\nAdministrador ${i}`);

      const usuario = (await preguntar("Usuario: ")).trim().toLowerCase();

      if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) {
        console.log("Usuario inválido. Inténtalo de nuevo.");
        i--;
        continue;
      }

      const existe = await Admin.exists({ usuario });

      if (existe) {
        console.log("Ese usuario ya existe.");
        i--;
        continue;
      }

      const password = await preguntar("Contraseña (mínimo 12 caracteres): ");

      const confirmar = await preguntar("Confirmar contraseña: ");

      if (password.length < 12 || password !== confirmar) {
        console.log("Las contraseñas no coinciden o son muy cortas.");
        i--;
        continue;
      }

      // Costo 12: más lento de calcular, más difícil de adivinar por fuerza bruta
      const passwordHash = await bcrypt.hash(password, 12);

      await Admin.create({
        usuario,
        passwordHash,
      });

      console.log(`Administrador ${usuario} creado correctamente`);
    }

    console.log("\nConfiguración finalizada.");
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

crearAdmins();
