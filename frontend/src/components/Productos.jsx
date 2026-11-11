import { useState, useEffect } from "react";
import Producto from "./Producto.jsx";
import { API_URL } from "../config.js";
import { resolverImagen } from "../utils/imagenes.js";

function Productos({ categoria }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Cargamos todos los productos una sola vez; el filtro por categoría es local
  useEffect(() => {
    let activo = true;

    fetch(`${API_URL}/api/productos`)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("Error al cargar productos");
        }
        return respuesta.json();
      })
      .then((datos) => {
        if (activo) setProductos(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    if (!categoria) return true;

    if (categoria === "ofertas") {
      return producto.oferta === true;
    }

    return producto.categoria === categoria;
  });

  return (
    <section className="productos" id="productos">
      <h2>Nuestros productos</h2>
      <p>Encuentra las prendas que sean de tu gusto.</p>

      {cargando && <p className="estado-carga">Cargando productos...</p>}

      {error && (
        <p role="alert" className="aviso-error">
          {error}
        </p>
      )}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <p>No hay productos en esta categoría por ahora.</p>
      )}

      <div className="contenedor-productos">
        {productosFiltrados.map((producto) => (
          <Producto
            key={producto._id}
            id={producto._id}
            nombre={producto.nombre}
            precio={Number(String(producto.precio).replace(/\D/g, ""))}
            imagen={resolverImagen(producto.imagen)}
            oferta={producto.oferta}
          />
        ))}
      </div>
    </section>
  );
}

export default Productos;
