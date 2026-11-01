import { Routes, Route } from "react-router";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Productos from "./components/Productos.jsx";
import Categoria from "./Paginas/Categoria.jsx";
import DetalleProducto from "./Paginas/DetalleProducto.jsx";
import Carrito from "./Paginas/Carrito.jsx";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Productos />
              </>
            }
          />

          <Route path="/:categoria" element={<Categoria />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
