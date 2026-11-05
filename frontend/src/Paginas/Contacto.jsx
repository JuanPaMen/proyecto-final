import { useState } from "react";
import { API_URL } from "../config.js";

const formularioInicial = {
  nombre: "",
  email: "",
  asunto: "",
  mensaje: "",
  sitioWeb: "", // campo oculto anti-spam: debe quedar vacío
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MENSAJE = 1000;

function Contacto() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "error", texto }

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Validamos en el navegador para dar respuesta rápida (el backend valida otra vez)
  const validar = () => {
    if (formulario.nombre.trim().length < 2) {
      return "Escribe tu nombre.";
    }
    if (!EMAIL_VALIDO.test(formulario.email.trim())) {
      return "Escribe un correo válido.";
    }
    if (formulario.mensaje.trim().length < 10) {
      return "El mensaje debe tener al menos 10 caracteres.";
    }
    return "";
  };

  const enviar = async (e) => {
    e.preventDefault();
    setAviso(null);

    const problema = validar();
    if (problema) {
      setAviso({ tipo: "error", texto: problema });
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo enviar el mensaje.");
      }

      setAviso({ tipo: "ok", texto: datos.mensaje });
      setFormulario(formularioInicial);
    } catch (error) {
      setAviso({
        tipo: "error",
        // TypeError = no hubo conexión con el servidor
        texto:
          error instanceof TypeError
            ? "No pudimos conectar con el servidor. Intenta de nuevo en un momento."
            : error.message,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="tarjeta-formulario">
      <h2>Contáctanos</h2>
      <p>¿Dudas sobre una prenda, una talla o tu pedido? Escríbenos.</p>

      <form onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor="contacto-nombre">Nombre</label>
          <input
            id="contacto-nombre"
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
          <label htmlFor="contacto-email">Correo electrónico</label>
          <input
            id="contacto-email"
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
          <label htmlFor="contacto-asunto">Asunto (opcional)</label>
          <input
            id="contacto-asunto"
            name="asunto"
            type="text"
            value={formulario.asunto}
            onChange={manejarCambio}
            maxLength={120}
          />
        </div>

        <div className="campo">
          <label htmlFor="contacto-mensaje">Mensaje</label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            rows={5}
            value={formulario.mensaje}
            onChange={manejarCambio}
            maxLength={MAX_MENSAJE}
            required
          />
          <small className="contador">
            {formulario.mensaje.length}/{MAX_MENSAJE}
          </small>
        </div>

        {/* Honeypot: invisible para las personas, los bots suelen llenarlo */}
        <div className="campo-oculto" aria-hidden="true">
          <label htmlFor="contacto-web">No llenar este campo</label>
          <input
            id="contacto-web"
            name="sitioWeb"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formulario.sitioWeb}
            onChange={manejarCambio}
          />
        </div>

        {aviso && (
          <p
            role={aviso.tipo === "error" ? "alert" : "status"}
            className={aviso.tipo === "ok" ? "aviso-ok" : "aviso-error"}
          >
            {aviso.texto}
          </p>
        )}

        <button type="submit" className="btn-azul" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </section>
  );
}

export default Contacto;
