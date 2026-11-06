import { useState, useEffect } from "react";
import { API_URL } from "../config.js";

// Lista de mensajes enviados desde el formulario de contacto (solo admin)
function MensajesAdmin({ onSesionExpirada }) {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Petición al backend con el token del administrador
  const llamar = async (ruta, opciones = {}) => {
    const token = sessionStorage.getItem("adminToken");

    const respuesta = await fetch(`${API_URL}/api/contacto${ruta}`, {
      ...opciones,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (respuesta.status === 401) {
      onSesionExpirada();
      throw new Error("Tu sesión expiró.");
    }

    if (!respuesta.ok) {
      throw new Error("No se pudo completar la acción.");
    }

    return respuesta.json();
  };

  useEffect(() => {
    let activo = true;

    const token = sessionStorage.getItem("adminToken");

    fetch(`${API_URL}/api/contacto`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("No se pudieron cargar los mensajes.");
        return respuesta.json();
      })
      .then((datos) => {
        if (activo) setMensajes(datos);
      })
      .catch((e) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const marcarLeido = async (id) => {
    try {
      const actualizado = await llamar(`/${id}/leido`, { method: "PATCH" });
      setMensajes((anteriores) =>
        anteriores.map((m) => (m._id === id ? actualizado : m)),
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const eliminar = async (mensaje) => {
    if (!window.confirm(`¿Eliminar el mensaje de ${mensaje.nombre}?`)) return;

    try {
      await llamar(`/${mensaje._id}`, { method: "DELETE" });
      setMensajes((anteriores) => anteriores.filter((m) => m._id !== mensaje._id));
    } catch (e) {
      setError(e.message);
    }
  };

  const sinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="admin-mensajes">
      <h3>
        Mensajes de contacto{" "}
        {sinLeer > 0 && <span className="insignia">{sinLeer} sin leer</span>}
      </h3>

      {cargando && <p className="estado-carga">Cargando mensajes...</p>}

      {error && (
        <p role="alert" className="aviso-error">
          {error}
        </p>
      )}

      {!cargando && mensajes.length === 0 && !error && (
        <p>Todavía no hay mensajes.</p>
      )}

      {mensajes.map((m) => (
        <article
          key={m._id}
          className={m.leido ? "mensaje-item" : "mensaje-item mensaje-nuevo"}
        >
          <header>
            <strong>{m.nombre}</strong>
            <small>{new Date(m.createdAt).toLocaleString("es-CO")}</small>
          </header>

          <p>
            <a href={`mailto:${m.email}`}>{m.email}</a>
          </p>

          {m.asunto && <p className="mensaje-asunto">{m.asunto}</p>}

          <p className="mensaje-texto">{m.mensaje}</p>

          <div className="mensaje-acciones">
            {!m.leido && (
              <button type="button" className="btn-azul" onClick={() => marcarLeido(m._id)}>
                Marcar como leído
              </button>
            )}
            <button type="button" className="btn-rojo" onClick={() => eliminar(m)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default MensajesAdmin;
