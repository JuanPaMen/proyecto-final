import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

import { API_URL } from "../config.js";
import { resolverImagen } from "../utils/imagenes.js";

// El precio puede venir como "$65.000" o "65000"; se deja solo el número
const obtenerPrecio = (precio) => {
  return Number(String(precio).replace(/\D/g, ""));
};

function DetalleProducto() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [recomendados, setRecomendados] = useState([]);

  useEffect(() => {
    let activo = true;

    const cargarProducto = async () => {
      try {
        setError("");
        setProducto(null);
        setTallaSeleccionada("");

        const respuesta = await fetch(`${API_URL}/api/productos/${id}`);

        if (!respuesta.ok) {
          throw new Error("Producto no encontrado");
        }

        const datos = await respuesta.json();

        if (activo) {
          setProducto(datos);
        }
      } catch (error) {
        console.error(error);

        if (activo) {
          setError("No se pudo cargar el producto.");
        }
      }
    };

    cargarProducto();

    return () => {
      activo = false;
    };
  }, [id]);

  useEffect(() => {
    if (!producto) return;

    let activo = true;

    const cargarRecomendados = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/productos`);

        if (!respuesta.ok) {
          throw new Error("Error al cargar recomendaciones");
        }

        const datos = await respuesta.json();

        const otros = datos.filter((item) => item._id !== producto._id);

        // Primero, productos de la misma categoría
        const similares = otros.filter(
          (item) => item.categoria === producto.categoria,
        );

        // Después, productos de otras categorías
        const diferentes = otros.filter(
          (item) => item.categoria !== producto.categoria,
        );

        if (activo) {
          setRecomendados([...similares, ...diferentes].slice(0, 3));
        }
      } catch (error) {
        console.error(error);

        if (activo) {
          setRecomendados([]);
        }
      }
    };

    cargarRecomendados();

    return () => {
      activo = false;
    };
  }, [producto]);

  if (error) return <p>{error}</p>;

  if (!producto) return <p>Cargando producto...</p>;

  const imagen = resolverImagen(producto.imagen);
  const precio = obtenerPrecio(producto.precio);

  const numeroWhatsApp = import.meta.env.VITE_WHATSAPP || "";

  const agregarAlCarrito = () => {
    if (!tallaSeleccionada) {
      alert("Primero selecciona una talla.");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    const existente = carrito.find(
      (item) => item.id === producto._id && item.talla === tallaSeleccionada,
    );

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id: producto._id,
        nombre: producto.nombre,
        precio,
        imagen,
        talla: tallaSeleccionada,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Avisa al Header para que actualice el contador del carrito
    window.dispatchEvent(new Event("carritoActualizado"));

    alert("¡Producto agregado al carrito!");
  };

  const consultarWhatsApp = () => {
    if (!numeroWhatsApp) {
      alert("Falta configurar el WhatsApp de la tienda.");
      return;
    }

    const mensaje = `Hola, estoy interesado en ${producto.nombre}, talla ${tallaSeleccionada || "por confirmar"}. ¿Está disponible?`;

    const enlace = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank", "noopener,noreferrer");
  };

  const compartirProducto = async () => {
    const enlace = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: producto.nombre,
          url: enlace,
        });
      } else {
        await navigator.clipboard.writeText(enlace);
        alert("¡Enlace copiado!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("No se pudo compartir el producto.");
      }
    }
  };

  return (
    <section
      className="detalle-producto"
      style={{
        width: "90%",
        maxWidth: "950px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "25px",
          alignItems: "start",
        }}
      >
        <img
          src={imagen}
          alt={producto.nombre}
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "12px",
          }}
        />

        <div>
          <h2>{producto.nombre}</h2>

          <h3 style={{ marginTop: "10px" }}>
            ${precio.toLocaleString("es-CO")}
          </h3>

          <p style={{ marginTop: "12px" }}>Categoría: {producto.categoria}</p>

          <p style={{ marginTop: "15px" }}>
            {producto.descripcion || "Descripción próximamente."}
          </p>

          <div style={{ marginTop: "20px" }}>
            <h4>Selecciona tu talla</h4>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              {producto.tallas?.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => setTallaSeleccionada(talla)}
                  aria-pressed={tallaSeleccionada === talla}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "1px solid #006cf9",
                    backgroundColor:
                      tallaSeleccionada === talla ? "#006cf9" : "white",
                    color: tallaSeleccionada === talla ? "white" : "#111111",
                  }}
                >
                  {talla}
                </button>
              ))}
            </div>

            {(!producto.tallas || producto.tallas.length === 0) && (
              <p style={{ marginTop: "10px" }}>
                Tallas pendientes de registrar.
              </p>
            )}

            {tallaSeleccionada && (
              <p style={{ marginTop: "10px" }}>
                Talla seleccionada: {tallaSeleccionada}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "18px",
            }}
          >
            <button
              className="btn-carrito btn-accion-icono"
              onClick={agregarAlCarrito}
            >
              <i className="bi bi-cart3" aria-hidden="true"></i>
              <span>Agregar al carrito</span>
            </button>

            <button
              onClick={consultarWhatsApp}
              className="btn-accion-icono"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #25D366",
                borderRadius: "10px",
                backgroundColor: "#25D366",
                color: "#ffffff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-whatsapp" aria-hidden="true"></i>
              <span>Consultar por WhatsApp</span>
            </button>

            <button
              onClick={compartirProducto}
              className="btn-accion-icono"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #111111",
                borderRadius: "10px",
                backgroundColor: "white",
                color: "#111111",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-share" aria-hidden="true"></i>
              <span>Compartir producto</span>
            </button>
          </div>

          <div className="detalle-metodos-pago">
            <h4>
              <i className="bi bi-shield-check"></i>
              Medios de pago
            </h4>

            <div className="metodos-pago-lista">
              <span>
                <i className="bi bi-phone"></i>
                Nequi
              </span>

              <span>
                <i className="bi bi-bank"></i>
                Transferencia
              </span>

              <span>
                <i className="bi bi-cash-coin"></i>
                Efectivo
              </span>
            </div>
          </div>
        </div>
      </div>

      {recomendados.length > 0 && (
        <div style={{ marginTop: "45px" }}>
          <h2>También te puede gustar</h2>

          <div className="contenedor-productos" style={{ marginTop: "20px" }}>
            {recomendados.map((item) => {
              const imagenRecomendada = resolverImagen(item.imagen);

              const precioRecomendado = obtenerPrecio(item.precio);

              return (
                <Link
                  key={item._id}
                  to={`/producto/${item._id}`}
                  className="producto"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img src={imagenRecomendada} alt={item.nombre} />

                  <div className="producto-info">
                    <h3>{item.nombre}</h3>

                    <p className="precio">
                      ${precioRecomendado.toLocaleString("es-CO")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default DetalleProducto;
