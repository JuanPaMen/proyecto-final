import camiseta from "../assets/img/sueteralemaniadeportivo.jpg";
import polo from "../assets/img/camiseta.webp";
import jean from "../assets/img/pantalon-jean.webp";
import bermuda from "../assets/img/bermuda-jean.webp";
import gorra from "../assets/img/gorra-new-era-floral.webp";
import Categoria from "../Paginas/categoria";

const Productos = [
  {
    id: 1,
    nombre: "Camiseta Oversize",
    precio: 65000,
    imagen: camiseta,
    categoria: "camisetas",
    oferta: false,
  },
  {
    id: 2,
    nombre: "Polo Crema",
    precio: 85000,
    imagen: polo,
    categoria: "polos",
    oferta: false,
  },
  {
    id: 3,
    nombre: "Jean Azul Claro",
    precio: 120000,
    imagen: jean,
    categoria: "jeans",
    oferta: false,
  },
  {
    id: 4,
    nombre: "Bermuda Casual",
    precio: 75000,
    imagen: gorra,
    categoria: "bermudas",
    oferta: false,
  },
  {
    id: 5,
    nombre: "Gorra New Era Floral",
    precio: 45000,
    imagen: gorra,
    categoria: "gorras",
    oferta: false,
  },
];

export default Productos;
