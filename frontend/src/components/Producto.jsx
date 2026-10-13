function Producto({ nombre, precio, imagen }) {
  return (
    <div className="producto">
      <img src={imagen} alt={nombre} />

      <div className="producto-info">
        <h3>{nombre}</h3>
        <p className="precio">${precio.toLocaleString("es-CO")}</p>
        <button className="btn-carrito">Agregar al carrito</button>
      </div>
    </div>
  );
}

export default Producto;
