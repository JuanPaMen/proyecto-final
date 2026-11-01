import { useState } from "react";
import { Link } from "react-router";

function Carrito() {
  const [carrito, setCarrito] = useState(() => {
    try {
      const datos = JSON.parse(localStorage.getItem("carrito") || "[]");
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  });

  // Guardar los cambios del carrito
  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // Aumentar o disminuir cantidades
  const cambiarCantidad = (id, talla, cambio) => {
    const actualizado = carrito.map((producto) => {
      if (producto.id === id && producto.talla === talla) {
        return {
          ...producto,
          cantidad: Math.max(1, (producto.cantidad || 1) + cambio),
        };
      }

      return producto;
    });

    guardarCarrito(actualizado);
  };

  // Eliminar un producto
  const eliminarProducto = (id, talla) => {
    const actualizado = carrito.filter(
      (producto) => !(producto.id === id && producto.talla === talla),
    );

    guardarCarrito(actualizado);
  };

  // Calcular el total
  const total = carrito.reduce(
    (suma, producto) => suma + Number(producto.precio) * producto.cantidad,
    0,
  );

  return (
    <section className="productos">
      <h2>Mi carrito de compras</h2>
      <p>Revisa los productos que seleccionaste.</p>

      {carrito.length === 0 ? (
        <div>
          <p>Tu carrito está vacío.</p>
          <Link to="/">Volver a la tienda</Link>
        </div>
      ) : (
        <>
          {carrito.map((producto) => (
            <div
              key={`${producto.id}-${producto.talla}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                background: "white",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "12px",
                flexWrap: "wrap",
              }}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: "100px",
                  borderRadius: "8px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3>{producto.nombre}</h3>
                <p>Talla: {producto.talla}</p>

                <p>${Number(producto.precio).toLocaleString("es-CO")}</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      cambiarCantidad(producto.id, producto.talla, -1)
                    }
                  >
                    −
                  </button>

                  <span>{producto.cantidad}</span>

                  <button
                    onClick={() =>
                      cambiarCantidad(producto.id, producto.talla, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => eliminarProducto(producto.id, producto.talla)}
                  style={{
                    marginTop: "12px",
                    color: "#d90429",
                    cursor: "pointer",
                  }}
                >
                  Eliminar producto
                </button>
              </div>
            </div>
          ))}

          <h2 style={{ textAlign: "right" }}>
            Total: ${total.toLocaleString("es-CO")}
          </h2>
        </>
      )}
    </section>
  );
}

export default Carrito;
