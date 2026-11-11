// Busca automáticamente todas las imágenes de src/assets/img, así no hay que
// importar cada una a mano. Para agregar una nueva, solo guárdala en esa carpeta.
const locales = import.meta.glob("../assets/img/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const porNombre = Object.fromEntries(
  Object.entries(locales).map(([ruta, url]) => [ruta.split("/").pop(), url]),
);

const SIN_IMAGEN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" fill="#888" font-family="sans-serif" font-size="20" text-anchor="middle">Sin imagen</text></svg>',
  );

// Recibe lo que está guardado en MongoDB (ej: "assets/img/camiseta.webp" o una
// URL completa) y devuelve algo que el navegador pueda mostrar.
export function resolverImagen(ruta = "") {
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith("data:")) return ruta;
  return porNombre[ruta.split("/").pop()] || SIN_IMAGEN;
}
