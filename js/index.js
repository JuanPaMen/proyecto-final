const menu = document.getElementById("menu-hamburguesa");
const navegacion = document.getElementById("navegacion");

menu.addEventListener("click", function () {
  navegacion.classList.toggle("activo");
  menu.classList.toggle("abierto");
  document.body.classList.toggle("menu-abierto");
});

/*Categorias de productos (nav) */
const Categorias = document.querySelectorAll(".menu a");
const productos = document.querySelectorAll(".producto");
const aviso = document.getElementById("sin-productos");

Categorias.forEach(function (enlace) {
  enlace.addEventListener("click", () => {
    const categoria = enlace.dataset.categoria;
    let cantidad = 0;

    productos.forEach(function (producto) {
      const mostrar =
        categoria === "todos" ||
        producto.dataset.categoria === categoria ||
        (categoria === "ofertas" && producto.dataset.oferta === "si");

      producto.style.display = mostrar ? "" : "none";

      if (mostrar) {
        cantidad++;
      }
    });

    aviso.style.display = cantidad === 0 ? "block" : "none";

    navegacion.classList.remove("activo");
    menu.classList.remove("abierto");
    document.body.classList.remove("menu-abierto");
  });
});
