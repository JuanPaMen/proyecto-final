import { useParams } from "react-router";

function Categoria() {
  const { categoria } = useParams();

  return (
    <section className="productos">
      <h2>{categoria}</h2>
      <p>Aqui encontrarás nuestros productos de esta categoria</p>
    </section>
  );
}

export default Categoria;
