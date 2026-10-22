import { useState, useEffect } from "react";
import Producto from "./Producto.jsx";

function Productos({ categoria = "todos" }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const nombres = {
    todos: "Nuestros Productos",
    camisetas: "Camisetas",
    polos: "Polos",
    camisas: "Camisas",
    jeans: "Jeans",
    bermudas: "Bermudas",
    gorras: "Gorras",
    ofertas: "Ofertas",
  };

  /*Obtener productos del backend*/
  useEffect(() => {
    async function obtenerProductos() {
      try {
        const respuesta = await fetch("http://localhost:3000/api/productos");

        if (!respuesta.ok) {
          throw new Error("Error al consultar los productos");
        }

        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        console.log(error);
        setError("No se pudieron cargar los productos");
      } finally {
        setCargando(false);
      }
    }

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter(function (producto) {
    if (categoria === "todos") {
      return true;
    }

    if (categoria === "ofertas") {
      return producto.oferta;
    }

    return producto.categoria === categoria;
  });

  if (cargando) {
    return (
      <section className="productos">
        <p>Cargando productos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="productos">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="productos" id="productos">
      <h2>{nombres[categoria] || "Categoria no encontrada"}</h2>
      <p>Encuentra las prendas que sean de tu gusto</p>

      <div className="contenedor-productos">
        {productosFiltrados.map((producto) => (
          <Producto
            key={producto._id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={`${import.meta.env.BASE_URL}assets/img/${producto.imagen}`}
          />
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <p>No hay productos en esta categoria por ahora</p>
      )}
    </section>
  );
}

export default Productos;
