import { useState } from "react";
import { Link } from "react-router";
import { API_URL } from "../config.js";

const METODOS = [
  { valor: "tarjeta", nombre: "Tarjeta de crédito o débito", icono: "bi-credit-card" },
  { valor: "pse", nombre: "PSE", icono: "bi-bank" },
  { valor: "nequi", nombre: "Nequi", icono: "bi-phone" },
];

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leerCarrito = () => {
  try {
    const datos = JSON.parse(localStorage.getItem("carrito") || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

const formularioInicial = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  metodoPago: "tarjeta",
};

function Pago() {
  const [carrito] = useState(leerCarrito);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState(null);

  const total = carrito.reduce(
    (suma, producto) =>
      suma + Number(producto.precio) * (producto.cantidad || 1),
    0,
  );

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // El backend valida otra vez; aquí solo damos respuesta rápida
  const validar = () => {
    if (formulario.nombre.trim().length < 2) return "Escribe tu nombre.";
    if (!EMAIL_VALIDO.test(formulario.email.trim())) return "Escribe un correo válido.";
    if (formulario.telefono && !/^\+?\d{7,15}$/.test(formulario.telefono.replace(/[\s-]/g, ""))) {
      return "El teléfono debe tener entre 7 y 15 números.";
    }
    if (formulario.direccion.trim().length < 5) return "Escribe tu dirección de entrega.";
    if (formulario.ciudad.trim().length < 2) return "Escribe tu ciudad.";
    return "";
  };

  const pagar = async (e) => {
    e.preventDefault();
    setError("");

    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setPagando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Solo se envía qué se compra: el precio lo calcula el servidor
          items: carrito.map(({ id, talla, cantidad }) => ({
            id,
            talla,
            cantidad: cantidad || 1,
          })),
          cliente: {
            nombre: formulario.nombre,
            email: formulario.email,
            telefono: formulario.telefono,
            direccion: formulario.direccion,
            ciudad: formulario.ciudad,
          },
          metodoPago: formulario.metodoPago,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo procesar el pago.");
      }

      localStorage.removeItem("carrito");
      window.dispatchEvent(new Event("carritoActualizado"));
      setPedido(datos);
    } catch (e) {
      setError(
        e instanceof TypeError
          ? "No pudimos conectar con el servidor. Intenta de nuevo en un momento."
          : e.message,
      );
    } finally {
      setPagando(false);
    }
  };

  if (pedido) {
    return (
      <section className="tarjeta-formulario pago-confirmado">
        <i className="bi bi-check-circle-fill"></i>
        <h2>¡Pago aprobado!</h2>
        <p>
          Tu referencia es <strong>{pedido.referencia}</strong>
        </p>
        <p>
          Total pagado: <strong>${Number(pedido.total).toLocaleString("es-CO")}</strong>
        </p>
        <p className="pago-nota">
          Pago simulado: es una tienda de práctica y no se cobró ningún dinero.
        </p>
        <Link to="/" className="btn-pagar">
          Seguir comprando
        </Link>
      </section>
    );
  }

  if (carrito.length === 0) {
    return (
      <section className="tarjeta-formulario pago-confirmado">
        <i className="bi bi-bag"></i>
        <h2>No hay nada para pagar</h2>
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="btn-pagar">
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="pago-pagina">
      <form className="pago-tarjeta" onSubmit={pagar} noValidate>
        <h2>Datos de entrega y pago</h2>

        <p className="pago-nota">
          Pago simulado: es una tienda de práctica, no se cobra dinero ni se piden datos de tarjeta.
        </p>

        <div className="campo">
          <label htmlFor="pago-nombre">Nombre completo</label>
          <input
            id="pago-nombre"
            name="nombre"
            type="text"
            value={formulario.nombre}
            onChange={manejarCambio}
            maxLength={80}
            autoComplete="name"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="pago-email">Correo electrónico</label>
          <input
            id="pago-email"
            name="email"
            type="email"
            value={formulario.email}
            onChange={manejarCambio}
            maxLength={120}
            autoComplete="email"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="pago-telefono">Teléfono (opcional)</label>
          <input
            id="pago-telefono"
            name="telefono"
            type="tel"
            value={formulario.telefono}
            onChange={manejarCambio}
            maxLength={20}
            autoComplete="tel"
          />
        </div>

        <div className="campo">
          <label htmlFor="pago-direccion">Dirección de entrega</label>
          <input
            id="pago-direccion"
            name="direccion"
            type="text"
            value={formulario.direccion}
            onChange={manejarCambio}
            maxLength={150}
            autoComplete="street-address"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="pago-ciudad">Ciudad</label>
          <input
            id="pago-ciudad"
            name="ciudad"
            type="text"
            value={formulario.ciudad}
            onChange={manejarCambio}
            maxLength={60}
            autoComplete="address-level2"
            required
          />
        </div>

        <fieldset className="pago-metodos">
          <legend>Método de pago</legend>

          {METODOS.map((metodo) => (
            <label
              key={metodo.valor}
              className={
                formulario.metodoPago === metodo.valor
                  ? "pago-metodo pago-metodo-activo"
                  : "pago-metodo"
              }
            >
              <input
                type="radio"
                name="metodoPago"
                value={metodo.valor}
                checked={formulario.metodoPago === metodo.valor}
                onChange={manejarCambio}
              />
              <i className={`bi ${metodo.icono}`}></i>
              {metodo.nombre}
            </label>
          ))}
        </fieldset>

        {error && (
          <p role="alert" className="aviso-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn-azul pago-boton" disabled={pagando}>
          {pagando ? "Procesando pago..." : `Pagar $${total.toLocaleString("es-CO")}`}
        </button>
      </form>

      <aside className="pago-resumen">
        <h3>Resumen del pedido</h3>

        {carrito.map((producto) => (
          <div key={`${producto.id}-${producto.talla}`} className="pago-linea">
            <div>
              <strong>{producto.nombre}</strong>
              <small>
                Talla {producto.talla} · {producto.cantidad || 1} und.
              </small>
            </div>
            <span>
              ${(Number(producto.precio) * (producto.cantidad || 1)).toLocaleString("es-CO")}
            </span>
          </div>
        ))}

        <div className="pago-total">
          <span>Total</span>
          <strong>${total.toLocaleString("es-CO")}</strong>
        </div>

        <Link to="/carrito" className="enlace-centrado">
          Volver al carrito
        </Link>
      </aside>
    </section>
  );
}

export default Pago;
