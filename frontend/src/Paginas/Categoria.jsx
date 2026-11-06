import { useParams } from "react-router";
import Productos from "../components/Productos.jsx";

function Categoria() {
  const { categoria } = useParams();

  return <Productos categoria={categoria} />;
}

export default Categoria;
