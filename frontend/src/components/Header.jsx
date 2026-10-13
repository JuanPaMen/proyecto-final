import { useState, useEffect } from "react";
import { Link } from "react-router";

function Header() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", abierto);

    return () => {
      document.body.classList.remove("menu-abierto");
    };
  }, [abierto]);

  return (
    <header className="header1" id="inicio">
      <div className="logo">
        <h1>It's Peak</h1>
      </div>

      <nav
        className={abierto ? "navegacion activo" : "navegacion"}
        id="navegacion"
        onClick={() => setAbierto(false)}
      >
        <ul className="menu">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/camisetas">Camisetas</Link>
          </li>
          <li>
            <Link to="/polos">Polos</Link>
          </li>
          <li>
            <Link to="/camisas">Camisas</Link>
          </li>
          <li>
            <Link to="/jeans">Jeans</Link>
          </li>
          <li>
            <Link to="/bermudas">Bermudas</Link>
          </li>
          <li>
            <Link to="/gorras">Gorras</Link>
          </li>
          <li>
            <Link to="/ofertas">Ofertas</Link>
          </li>
        </ul>
      </nav>

      <div className="cart-icon">
        <a href="#">
          <i className="bi bi-cart3"></i> Carrito (0)
        </a>
      </div>

      <div className="admin">
        <a href="#">admin</a>
      </div>

      <button
        className={abierto ? "menu-hamburguesa abierto" : "menu-hamburguesa"}
        id="menu-hamburguesa"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="navegacion"
      >
        <svg
          className="abrir"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>

        <span className="bi bi-x-lg cerrar" aria-hidden="true"></span>
      </button>
    </header>
  );
}

export default Header;
