import { useState } from "react";
import { API_URL } from "../config.js";

// Botón del panel admin: pide a la IA una descripción del producto
// con el tono de marca y la pone en el campo "Descripción".
function BotonDescripcionIA({ nombre, categoria, tallas, onGenerada }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const generar = async () => {
    setError("");

    if (!nombre.trim()) {
      setError("Escribe primero el nombre del producto.");
      return;
    }

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      setError("Debes iniciar sesión nuevamente.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/chat/descripcion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          categoria,
          tallas: String(tallas || "")
            .split(",")
            .map((t) => t.trim().toUpperCase())
            .filter(Boolean),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? "Tu sesión expiró. Inicia sesión nuevamente."
            : datos.mensaje || "No se pudo generar la descripción.",
        );
      }

      onGenerada(datos.descripcion);
    } catch (e) {
      setError(
        e instanceof TypeError ? "No hay conexión con el servidor." : e.message,
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="ia-descripcion">
      <button type="button" className="btn-ia" onClick={generar} disabled={cargando}>
        <i className="bi bi-stars"></i>{" "}
        {cargando ? "Generando..." : "Generar descripción con IA"}
      </button>

      {error && (
        <p role="alert" className="aviso-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default BotonDescripcionIA;
