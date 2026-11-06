import { useState } from "react";
import { API_URL } from "../config.js";
import BotonDescripcionIA from "./BotonDescripcionIA.jsx";

function EditarProducto({ producto, onGuardado, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre: producto.nombre,
    precio: String(producto.precio).replace(/\D/g, ""),
    categoria: producto.categoria,
    imagen: producto.imagen,
    descripcion: producto.descripcion || "",
    tallas: producto.tallas?.join(", ") || "",
    oferta: Boolean(producto.oferta),
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      setError("Debes iniciar sesión nuevamente.");
      setGuardando(false);
      return;
    }

    const cambios = {
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
            .map((t) => t.trim().toUpperCase())
            .filter(Boolean),
        ),
      ],
    };

    try {
      const respuesta = await fetch(
        `${API_URL}/api/productos/${producto._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cambios),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? "Tu sesión expiró. Inicia sesión nuevamente."
            : datos.mensaje || "No se pudo editar el producto.",
        );
      }

      onGuardado(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const estiloCampo = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "6px",
  };

  return (
    <form
      onSubmit={guardarCambios}
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "25px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Editar producto</h3>

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
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
            style={estiloCampo}
          />
        </div>

        <div>
          <label>Precio (COP)</label>
          <input
            name="precio"
            type="number"
            min="0"
            step="1"
            value={formulario.precio}
            onChange={manejarCambio}
            required
            style={estiloCampo}
          />
        </div>

        <div>
          <label>Categoría</label>
          <select
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
            style={estiloCampo}
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
            name="imagen"
            value={formulario.imagen}
            onChange={manejarCambio}
            required
            style={estiloCampo}
          />
        </div>

        <div>
          <label>Tallas disponibles</label>
          <input
            name="tallas"
            value={formulario.tallas}
            onChange={manejarCambio}
            placeholder="S, M, L, XL"
            style={estiloCampo}
          />
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          rows={4}
          style={estiloCampo}
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

      {error && (
        <p
          role="alert"
          style={{
            color: "#d90429",
            marginTop: "12px",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          type="submit"
          disabled={guardando}
          style={{
            background: "#006cf9",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          style={{
            padding: "12px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditarProducto;
