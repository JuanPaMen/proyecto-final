import Producto from "./Producto.jsx";

import camiseta from "../assets/img/sueteralemaniadeportivo.jpg";
import polo from "../assets/img/camiseta.webp";
import jean from "../assets/img/pantalon-jean.webp";
import bermuda from "../assets/img/bermuda-jean.webp";
import gorra from "../assets/img/gorra-new-era-floral.webp";

function Productos() {
  const productos = [
    { id: 1, nombre: "Camiseta Oversize", precio: 65000, imagen: camiseta },
    { id: 2, nombre: "Polo Crema", precio: 85000, imagen: polo },
    { id: 3, nombre: "Jean Azul Claro", precio: 120000, imagen: jean },
    { id: 4, nombre: "Bermuda Casual", precio: 75000, imagen: bermuda },
    { id: 5, nombre: "Gorra New Era Floral", precio: 45000, imagen: gorra },
  ];

  return (
    <section className="productos" id="productos">
      <h2>Nuestros productos</h2>
      <p>Encuentra las prendas que sean de tu gusto.</p>

      <div className="contenedor-productos">
        {productos.map((producto) => (
          <Producto
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
      </div>
    </section>
  );
}

export default Productos;
