import { Link } from "react-router";

function Producto({
  id,
  nombre,
  precio,
  imagen,
  oferta,
  descuentoPorcentaje = 0,
}) {
  const descuento = Number(descuentoPorcentaje) || 0;

  const tieneDescuento = oferta && descuento > 0;

  const precioFinal = tieneDescuento
    ? Math.round(precio * (1 - descuento / 100))
    : precio;

  return (
    <div className="producto">
      <Link to={`/producto/${id}`}>
        <img src={imagen} alt={nombre} loading="lazy" />
      </Link>

      <div className="producto-info">
        {oferta && (
          <span className="etiqueta-oferta">
            {tieneDescuento ? `-${descuento}%` : "Oferta"}
          </span>
        )}

        <Link
          to={`/producto/${id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3>{nombre}</h3>
        </Link>

        {tieneDescuento && (
          <del
            style={{
              color: "#888888",
              fontSize: "14px",
            }}
          >
            ${precio.toLocaleString("es-CO")}
          </del>
        )}

        <p
          className="precio"
          style={{
            color: tieneDescuento ? "#d90429" : "#111111",
          }}
        >
          ${precioFinal.toLocaleString("es-CO")}
        </p>

        <Link to={`/producto/${id}`} className="btn-carrito btn-enlace">
          Elegir talla
        </Link>
      </div>
    </div>
  );
}

export default Producto;
