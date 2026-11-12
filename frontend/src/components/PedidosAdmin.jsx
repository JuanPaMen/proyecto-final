import { useState, useEffect } from "react";
import { API_URL } from "../config.js";

const ESTADOS = {
  pagado: "Pagado",
  enviado: "Enviado",
  cancelado: "Cancelado",
};

// Lista de pedidos hechos desde el carrito (solo admin)
function PedidosAdmin({ onSesionExpirada }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const token = sessionStorage.getItem("adminToken");

    fetch(`${API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((respuesta) => {
        if (respuesta.status === 401) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
        if (!respuesta.ok) throw new Error("No se pudieron cargar los pedidos.");
        return respuesta.json();
      })
      .then((datos) => {
        if (activo) setPedidos(datos);
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

  const cambiarEstado = async (pedido, estado) => {
    setError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      const respuesta = await fetch(`${API_URL}/api/pedidos/${pedido._id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      if (!respuesta.ok) throw new Error("No se pudo actualizar el pedido.");

      const actualizado = await respuesta.json();
      setPedidos((anteriores) =>
        anteriores.map((p) => (p._id === pedido._id ? actualizado : p)),
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const porEnviar = pedidos.filter((p) => p.estado === "pagado").length;

  return (
    <div className="admin-mensajes">
      <h3>
        Pedidos{" "}
        {porEnviar > 0 && <span className="insignia">{porEnviar} por enviar</span>}
      </h3>

      {cargando && <p className="estado-carga">Cargando pedidos...</p>}

      {error && (
        <p role="alert" className="aviso-error">
          {error}
        </p>
      )}

      {!cargando && pedidos.length === 0 && !error && <p>Todavía no hay pedidos.</p>}

      {pedidos.map((p) => (
        <article
          key={p._id}
          className={p.estado === "pagado" ? "mensaje-item mensaje-nuevo" : "mensaje-item"}
        >
          <header>
            <strong>{p.referencia}</strong>
            <small>{new Date(p.createdAt).toLocaleString("es-CO")}</small>
          </header>

          <p>
            {p.cliente.nombre} ·{" "}
            <a href={`mailto:${p.cliente.email}`}>{p.cliente.email}</a>
            {p.cliente.telefono && ` · ${p.cliente.telefono}`}
          </p>

          <p>
            {p.cliente.direccion}, {p.cliente.ciudad}
          </p>

          <ul className="pedido-items">
            {p.items.map((item, i) => (
              <li key={i}>
                {item.cantidad} × {item.nombre}
                {item.talla && ` (talla ${item.talla})`} — $
                {(item.precio * item.cantidad).toLocaleString("es-CO")}
              </li>
            ))}
          </ul>

          {p.iva != null && (
            <p className="pedido-iva">
              Precio base ${p.subtotal.toLocaleString("es-CO")} + IVA ${p.iva.toLocaleString("es-CO")}
            </p>
          )}

          <p className="pedido-total">
            Total: <strong>${p.total.toLocaleString("es-CO")}</strong> · {p.metodoPago} ·{" "}
            {ESTADOS[p.estado] || p.estado}
          </p>

          <div className="mensaje-acciones">
            {p.estado === "pagado" && (
              <button type="button" className="btn-azul" onClick={() => cambiarEstado(p, "enviado")}>
                Marcar como enviado
              </button>
            )}
            {p.estado !== "cancelado" && (
              <button type="button" className="btn-rojo" onClick={() => cambiarEstado(p, "cancelado")}>
                Cancelar
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default PedidosAdmin;
