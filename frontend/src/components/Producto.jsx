import { Link } from "react-router";

function Producto({ id, nombre, precio, imagen, oferta }) {
  return (
    <div className="producto">
      <Link to={`/producto/${id}`}>
        <img src={imagen} alt={nombre} loading="lazy" />
      </Link>

      <div className="producto-info">
        {oferta && <span className="etiqueta-oferta">Oferta</span>}

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

        {/* La talla se elige en el detalle, por eso el botón lleva allá */}
        <Link to={`/producto/${id}`} className="btn-carrito btn-enlace">
          Elegir talla
        </Link>
      </div>
    </div>
  );
}

export default Producto;
