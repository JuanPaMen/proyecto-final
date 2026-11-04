import { useState, useEffect } from "react";
import Producto from "./Producto.jsx";

// Imágenes que ya tenemos
import camiseta from "../assets/img/sueteralemaniadeportivo.jpg";
import polo from "../assets/img/camiseta.webp";
import jean from "../assets/img/pantalon-jean.webp";
import bermuda from "../assets/img/bermuda-jean.webp";
import gorra from "../assets/img/gorra-new-era-floral.webp";

// Relacionamos las imágenes con sus nombres
const imagenes = {
  "sueteralemaniadeportivo.jpg": camiseta,
  "camiseta.webp": polo,
  "pantalon-jean.webp": jean,
  "bermuda-jean.webp": bermuda,
  "gorra-new-era-floral.webp": gorra,
};

function Productos({ categoria }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("Error al cargar productos");
        }
        return respuesta.json();
      })
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudieron cargar los productos."));
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

      {error && <p>{error}</p>}

      {/* Mensaje cuando no hay productos */}
      {!error && productos.length > 0 && productosFiltrados.length === 0 && (
        <p>No hay productos en esta categoría por ahora.</p>
      )}

      <div className="contenedor-productos">
        {productosFiltrados.map((producto) => {
          const archivo = producto.imagen?.split("/").pop();

          const precio = Number(String(producto.precio).replace(/\D/g, ""));

          return (
            <Producto
              key={producto._id}
              id={producto._id}
              nombre={producto.nombre}
              precio={precio}
              imagen={imagenes[archivo] || producto.imagen}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Productos;
