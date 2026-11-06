import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import { API_URL } from "../config.js";

const SALUDO = {
  rol: "assistant",
  texto:
    "¡Hola! Soy el asistente de It's Peak. Te ayudo a elegir prendas, tallas y precios. ¿Qué buscas hoy?",
};

// Preguntas rápidas para que el cliente no tenga que escribir
const SUGERENCIAS = ["¿Qué jeans tienen?", "¿Hay ofertas?", "Busco una gorra"];

function ChatBot() {
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([SALUDO]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const finRef = useRef(null);

  // Mantener visible el último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando, abierto]);

  // En el panel de administración no mostramos el asistente
  if (pathname.startsWith("/admin")) return null;

  const enviar = async (pregunta) => {
    const limpia = pregunta.trim();
    if (!limpia || cargando) return;

    const historial = [...mensajes, { rol: "user", texto: limpia }];
    setMensajes(historial);
    setTexto("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Los mensajes de error no forman parte de la conversación
          mensajes: historial.filter((m) => !m.error).slice(-10),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No pude responder en este momento.");
      }

      setMensajes([...historial, { rol: "assistant", texto: datos.respuesta }]);
    } catch (error) {
      setMensajes([
        ...historial,
        {
          rol: "assistant",
          error: true,
          texto:
            error instanceof TypeError
              ? "No pude conectarme con el servidor. Intenta de nuevo en un momento."
              : error.message,
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    enviar(texto);
  };

  return (
    <>
      {abierto && (
        <section className="chat-ventana" aria-label="Asistente de It's Peak">
          <header className="chat-encabezado">
            <strong>Asistente It's Peak</strong>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar el asistente"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </header>

          <div className="chat-mensajes" role="log" aria-live="polite">
            {mensajes.map((m, i) => (
              <p
                key={i}
                className={`chat-burbuja ${
                  m.rol === "user" ? "chat-usuario" : "chat-asistente"
                } ${m.error ? "chat-error" : ""}`}
              >
                {m.texto}
              </p>
            ))}

            {cargando && (
              <p className="chat-burbuja chat-asistente chat-escribiendo">
                Escribiendo...
              </p>
            )}

            {/* Sugerencias: solo mientras no se ha preguntado nada */}
            {mensajes.length === 1 && !cargando && (
              <div className="chat-sugerencias">
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={finRef} />
          </div>

          <form className="chat-formulario" onSubmit={manejarEnvio}>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta..."
              maxLength={300}
              aria-label="Tu pregunta"
            />
            <button type="submit" disabled={cargando || !texto.trim()}>
              <i className="bi bi-send-fill"></i>
              <span className="solo-lectores">Enviar</span>
            </button>
          </form>

          <small className="chat-aviso">
            Respuestas generadas por IA. No compartas datos personales.
          </small>
        </section>
      )}

      <button
        type="button"
        className="chat-boton"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar el asistente" : "Abrir el asistente"}
      >
        <i className={abierto ? "bi bi-x-lg" : "bi bi-chat-dots-fill"}></i>
      </button>
    </>
  );
}

export default ChatBot;
