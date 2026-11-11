import { useEffect, useState } from "react";

import camiseta from "../assets/img/sueteralemaniadeportivo.jpg";
import jean from "../assets/img/pantalon-jean.webp";
import gorra from "../assets/img/gorra-new-era-floral.webp";

const banners = [
  {
    imagen: camiseta,
    etiqueta: "IT'S PEAK • STREETWEAR",
    titulo: "Nueva",
    destacado: "colección.",
    descripcion: "Encuentra prendas que definan tu estilo. Viste a tu manera.",
  },
  {
    imagen: jean,
    etiqueta: "IT'S PEAK • DENIM",
    titulo: "Encuentra tu",
    destacado: "estilo.",
    descripcion: "Descubre nuestros jeans y dale personalidad a tu outfit.",
  },
  {
    imagen: gorra,
    etiqueta: "IT'S PEAK • ACCESORIOS",
    titulo: "Marca la",
    destacado: "diferencia.",
    descripcion: "Completa tu estilo urbano con nuestra colección de gorras.",
  },
];

function Hero() {
  const [actual, setActual] = useState(0);

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setActual((anterior) => (anterior + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const siguiente = () => {
    setActual((anterior) => (anterior + 1) % banners.length);
  };

  const anterior = () => {
    setActual((anterior) => (anterior - 1 + banners.length) % banners.length);
  };

  const verProductos = () => {
    document.getElementById("productos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="principal hero-carrusel"
      aria-label="Colecciones destacadas"
    >
      <div
        className="hero-pista"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {banners.map((banner, indice) => (
          <div
            key={indice}
            className="hero-diapositiva"
            aria-hidden={indice !== actual}
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(0,0,0,0.90),
                  rgba(0,0,0,0.25)
                ),
                url(${banner.imagen})
              `,
            }}
          >
            <div className="principal-contenido">
              <span className="hero-etiqueta">{banner.etiqueta}</span>

              <h2>
                {banner.titulo} <span>{banner.destacado}</span>
              </h2>

              <p>{banner.descripcion}</p>

              <button
                type="button"
                className="btn-principal"
                onClick={verProductos}
                tabIndex={indice === actual ? 0 : -1}
              >
                Explorar colección
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas */}
      <button
        type="button"
        className="hero-control hero-anterior"
        onClick={anterior}
        aria-label="Imagen anterior"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <button
        type="button"
        className="hero-control hero-siguiente"
        onClick={siguiente}
        aria-label="Imagen siguiente"
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Indicadores */}
      <div className="hero-indicadores">
        {banners.map((_, indice) => (
          <button
            key={indice}
            type="button"
            className={actual === indice ? "activo" : ""}
            onClick={() => setActual(indice)}
            aria-label={`Ver imagen ${indice + 1}`}
            aria-pressed={actual === indice}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
