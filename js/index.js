const menu = document.getElementById("menu-hamburguesa");
const navegacion = document.getElementById("navegacion");

menu.addEventListener("click", function () {
  navegacion.classList.toggle("activo");
  menu.classList.toggle("abierto");
  document.body.classList.toggle("menu-abierto");
});
