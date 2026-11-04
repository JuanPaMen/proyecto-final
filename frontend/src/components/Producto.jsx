import { Link } from "react-router";

function Producto({ id, nombre, precio, imagen }) {
  return (
    <div className="producto">
      {/* Imagen que lleva al detalle */}
      <Link to={`/producto/${id}`}>
        <img src={imagen} alt={nombre} />
      </Link>

      <div className="producto-info">
        {/* Nombre que lleva al detalle */}
        <Link
          to={`/producto/${id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <h3>{nombre}</h3>
        </Link>

        <p className="precio">${precio.toLocaleString("es-CO")}</p>

        <button className="btn-carrito">Agregar al carrito</button>
      </div>
    </div>
  );
}

export default Producto;
