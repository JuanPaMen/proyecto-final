import { useState } from "react";
import { Link } from "react-router";
import { desglosarIva, porcentajeIva, resumenCarrito, pesos } from "../utils/iva.js";

function Carrito() {
  // El carrito vive en localStorage, por eso sigue ahí aunque se recargue la página
  const [carrito, setCarrito] = useState(() => {
    try {
      const datos = JSON.parse(localStorage.getItem("carrito") || "[]");

      return Array.isArray(datos) ? datos : [];
    } catch {
      // Si el contenido guardado está dañado, se empieza con el carrito vacío
      return [];
    }
  });

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event("carritoActualizado"));
  };

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

  const eliminarProducto = (id, talla) => {
    guardarCarrito(
      carrito.filter(
        (producto) => !(producto.id === id && producto.talla === talla),
      ),
    );
  };

  const { subtotal, iva, total } = resumenCarrito(carrito);

  return (
    <section className="productos carrito-pagina">
      <div className="carrito-encabezado">
        <h2>Mi carrito</h2>
        <p>Revisa las prendas que elegiste.</p>
      </div>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <i className="bi bi-bag"></i>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestra colección.</p>
          <Link to="/" className="carrito-volver">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((producto) => {
              const desglose = desglosarIva(Number(producto.precio));

              return (
                <article
                  key={`${producto.id}-${producto.talla}`}
                  className="carrito-item"
                >
                  <img
                    className="carrito-foto"
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <div className="carrito-info">
                    <div className="carrito-datos">
                      <h3>{producto.nombre}</h3>

                      <p className="carrito-talla">
                        Talla: <strong>{producto.talla}</strong>
                      </p>

                      <p className="carrito-precio">{pesos(producto.precio)}</p>

                      <p className="carrito-iva">
                        Base {pesos(desglose.base)} + IVA {pesos(desglose.iva)}
                      </p>
                    </div>

                    <div className="carrito-acciones">
                      <div className="carrito-cantidad">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() =>
                            cambiarCantidad(producto.id, producto.talla, -1)
                          }
                        >
                          −
                        </button>

                        <span>{producto.cantidad || 1}</span>

                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() =>
                            cambiarCantidad(producto.id, producto.talla, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="carrito-eliminar"
                        onClick={() =>
                          eliminarProducto(producto.id, producto.talla)
                        }
                      >
                        <i className="bi bi-trash3"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="carrito-resumen carrito-desglose">
            <div>
              <span>Precio base</span>
              <span>{pesos(subtotal)}</span>
            </div>
            <div>
              <span>IVA ({porcentajeIva}%)</span>
              <span>{pesos(iva)}</span>
            </div>
            <div className="carrito-desglose-total">
              <span>Total del carrito</span>
              <strong>{pesos(total)}</strong>
            </div>
          </div>

          <Link to="/pago" className="btn-pagar">
            Pagar {pesos(total)}
          </Link>
        </>
      )}
    </section>
  );
}

export default Carrito;
