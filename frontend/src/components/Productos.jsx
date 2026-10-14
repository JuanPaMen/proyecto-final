import Producto from "./Producto.jsx";
import productos from "../datos/productos.js";

function Productos({ categoria = "todos" }) {
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

  const productosFiltrados = productos.filter(function (producto) {
    if (categoria === "todos") {
      return true;
    }

    if (categoria === "ofertas") {
      return producto.oferta;
    }

    return producto.categoria === categoria;
  });

  return (
    <section className="productos" id="productos">
      <h2>{nombres[categoria] || "Categoria no encontrada"}</h2>
      <p>Encuentra las prendas que sean de tu gusto</p>

      <div className="contenedor-productos">
        {productosFiltrados.map((producto) => (
          <Producto
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
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
