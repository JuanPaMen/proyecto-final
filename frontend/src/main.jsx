import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// HashRouter: las rutas quedan como /#/admin. Así GitHub Pages no da error 404
// al recargar la página, porque la parte después del # nunca llega al servidor.
import { HashRouter } from "react-router";
import "./styles.css";
import "./componentes.css";
import App from "./App.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
