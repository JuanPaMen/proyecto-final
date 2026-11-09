function Hero() {
  const verProductos = () => {
    document.getElementById("productos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="principal">
      <div className="principal-contenido">
        <span className="hero-etiqueta">IT'S PEAK • STREETWEAR</span>

        <h2>
          Nueva <span>colección.</span>
        </h2>

        <p>
          Encuentra prendas que definan tu estilo. Viste diferente, viste a tu
          manera.
        </p>

        <button type="button" onClick={verProductos} className="btn-principal">
          Explorar colección
        </button>
      </div>
    </section>
  );
}

export default Hero;
