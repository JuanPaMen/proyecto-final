import { Link } from "react-router";

function Footer() {
  const whatsapp = import.meta.env.VITE_WHATSAPP || "";
  const instagram = import.meta.env.VITE_INSTAGRAM_URL || "";
  const tiktok = import.meta.env.VITE_TIKTOK_URL || "";

  return (
    <footer className="footer">
      <div className="footer-contenido">
        {/* Información de la marca */}
        <div className="footer-columna">
          <h2 className="footer-logo">
            IT'S <span>PEAK</span>
          </h2>

          <p>
            Ropa urbana para quienes expresan su personalidad a través de su
            estilo.
          </p>
        </div>

        {/* Navegación */}
        <div className="footer-columna">
          <h3>Explora</h3>

          <nav className="footer-enlaces">
            <Link to="/">Inicio</Link>
            <Link to="/camisetas">Camisetas</Link>
            <Link to="/polos">Polos</Link>
            <Link to="/jeans">Jeans</Link>
            <Link to="/gorras">Gorras</Link>
            <Link to="/ofertas">Ofertas</Link>
          </nav>
        </div>

        {/* Contacto y redes */}
        <div className="footer-columna">
          <h3>Conecta con nosotros</h3>

          <div className="footer-enlaces">
            <Link to="/contacto">
              <i className="bi bi-envelope"></i>
              Contáctanos
            </Link>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </a>
            )}
          </div>

          <div className="footer-redes">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de It's Peak"
              >
                <i className="bi bi-instagram"></i>
              </a>
            )}

            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de It's Peak"
              >
                <i className="bi bi-tiktok"></i>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-inferior">
        <p>
          © {new Date().getFullYear()} It's Peak. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
