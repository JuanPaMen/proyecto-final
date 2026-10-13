import { Routes, Route } from "react-router";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Productos from "./components/Productos.jsx";
import Categoria from "./Paginas/categoria.jsx";

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
        </Routes>
      </main>
    </>
  );
}

export default App;
