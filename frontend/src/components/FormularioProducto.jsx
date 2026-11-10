import { useState } from "react";
import { API_URL } from "../config.js";
import BotonDescripcionIA from "./BotonDescripcionIA.jsx";

const formularioInicial = {
  nombre: "",
  precio: "",
  categoria: "camisetas",
  imagen: "",
  descripcion: "",
  tallas: "",
  oferta: false,
};

function FormularioProducto({ onCreado }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Actualizar los campos del formulario
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Guardar producto en MongoDB
  const guardarProducto = async (e) => {
    e.preventDefault();
    setMensaje("");
    setGuardando(true);

    const token = sessionStorage.getItem("adminToken");

    const nuevoProducto = {
      nombre: formulario.nombre.trim(),
      precio: formulario.precio,
      categoria: formulario.categoria,
      imagen: formulario.imagen.trim(),
      descripcion: formulario.descripcion.trim(),
      oferta: formulario.oferta,
      tallas: [
        ...new Set(
          formulario.tallas
            .split(",")
            .map((talla) => talla.trim().toUpperCase())
            .filter(Boolean),
        ),
      ],
    };

    try {
      if (!token) {
        throw new Error("Debes iniciar sesión nuevamente.");
      }

      const respuesta = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? "Sesión expirada. Inicia sesión nuevamente."
            : datos.mensaje || "No se pudo guardar el producto.",
        );
      }

      setMensaje("¡Producto agregado correctamente!");
      setFormulario(formularioInicial);

      // Actualizar la lista del panel
      onCreado(datos);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="formulario-producto"
      onSubmit={guardarProducto}
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "25px",
      }}
    >
      <div className="formulario-producto-titulo">
        <span className="formulario-producto-icono">
          <i className="bi bi-bag-plus"></i>
        </span>

        <div>
          <h3>Agregar nuevo producto</h3>
          <p>
            Completa la información de la prenda para publicarla en It's Peak.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "15px",
        }}
      >
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            required
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Camiseta Negra"
          />
        </div>

        <div>
          <label>Precio (COP)</label>
          <input
            type="number"
            name="precio"
            min="0"
            step="1"
            required
            value={formulario.precio}
            onChange={manejarCambio}
            placeholder="Ej: 65000"
          />
        </div>

        <div>
          <label>Categoría</label>
          <select
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
          >
            <option value="camisetas">Camisetas</option>
            <option value="polos">Polos</option>
            <option value="camisas">Camisas</option>
            <option value="jeans">Jeans</option>
            <option value="bermudas">Bermudas</option>
            <option value="gorras">Gorras</option>
          </select>
        </div>

        <div>
          <label>Imagen (ruta o URL)</label>
          <input
            type="text"
            name="imagen"
            required
            value={formulario.imagen}
            onChange={manejarCambio}
            placeholder="assets/img/camiseta.webp"
          />
        </div>

        <div>
          <label>Tallas disponibles</label>
          <input
            type="text"
            name="tallas"
            value={formulario.tallas}
            onChange={manejarCambio}
            placeholder="S, M, L, XL"
          />
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          placeholder="Describe las características de la prenda..."
        />
      </div>

      <BotonDescripcionIA
        nombre={formulario.nombre}
        categoria={formulario.categoria}
        tallas={formulario.tallas}
        onGenerada={(texto) =>
          setFormulario((actual) => ({ ...actual, descripcion: texto }))
        }
      />

      <label className="casilla-oferta">
        <input
          type="checkbox"
          name="oferta"
          checked={formulario.oferta}
          onChange={manejarCambio}
        />
        Producto en oferta (aparece en la sección Ofertas)
      </label>

      <button
        type="submit"
        disabled={guardando}
        style={{
          background: "#006cf9",
          color: "white",
          border: "none",
          padding: "12px 22px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "18px",
          fontWeight: "600",
        }}
      >
        {guardando ? "Guardando..." : "Guardar producto"}
      </button>

      {mensaje && (
        <p role="status" style={{ marginTop: "15px" }}>
          {mensaje}
        </p>
      )}
    </form>
  );
}

export default FormularioProducto;
