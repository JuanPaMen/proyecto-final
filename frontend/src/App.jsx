import { Routes, Route } from "react-router";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Productos from "./components/Productos.jsx";
import ChatBot from "./components/ChatBot.jsx";
import Categoria from "./Paginas/Categoria.jsx";
import DetalleProducto from "./Paginas/DetalleProducto.jsx";
import Carrito from "./Paginas/Carrito.jsx";
import Contacto from "./Paginas/Contacto.jsx";
import Pago from "./Paginas/Pago.jsx";
import AdminLogin from "./Paginas/AdminLogin.jsx";
import AdminPanel from "./Paginas/AdminPanel.jsx";
import Footer from "./components/Footer.jsx";

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
          <Route path="/pago" element={<Pago />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <Footer />

      <ChatBot />
    </>
  );
}

export default App;
