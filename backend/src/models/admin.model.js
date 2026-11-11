const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // select: false evita que el hash salga en las consultas normales;
    // el login lo pide a propósito con select("+passwordHash")
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
