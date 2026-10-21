// ==========================================
// 1. MENÚ HAMBURGUESA
// ==========================================
const menu = document.getElementById("menu-hamburguesa");
const navegacion = document.getElementById("navegacion");

if (menu && navegacion) {
    menu.addEventListener("click", function () {
        navegacion.classList.toggle("activo");
        menu.classList.toggle("abierto");
        document.body.classList.toggle("menu-abierto");
    });
}

// ==========================================
// 2. FILTROS DE CATEGORÍAS
// ==========================================
const configurarFiltros = () => {
    const categorias = document.querySelectorAll(".menu a");
    const aviso = document.getElementById("sin-productos");

    categorias.forEach(function (enlace) {
        enlace.addEventListener("click", () => {
            const categoria = enlace.dataset.categoria;
            const productosActuales = document.querySelectorAll(".producto");
            let cantidad = 0;

            productosActuales.forEach(function (producto) {
                const mostrar =
                    categoria === "todos" ||
                    producto.dataset.categoria === categoria ||
                    (categoria === "ofertas" && producto.dataset.oferta === "si");

                producto.style.display = mostrar ? "" : "none";

                if (mostrar) {
                    cantidad++;
                }
            });

            if (aviso) {
                aviso.style.display = cantidad === 0 ? "block" : "none";
            }

            if (navegacion && menu) {
                navegacion.classList.remove("activo");
                menu.classList.remove("abierto");
                document.body.classList.remove("menu-abierto");
            }
        });
    });
};

// ==========================================
// 3. SISTEMA DE CARRITO DE COMPRAS
// ==========================================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const actualizarContadorCarrito = () => {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = carrito.length;
    }
};

const inicializarEventosCarrito = () => {
    const botonesAgregar = document.querySelectorAll('.btn-carrito');

    botonesAgregar.forEach((boton) => {
        // Prevenimos duplicar eventos limpiando listeners previos o asignando directamente
        boton.onclick = (e) => {
            const tarjetaProducto = e.target.closest('.producto');
            const nombre = tarjetaProducto.querySelector('h3').textContent;
            const precio = tarjetaProducto.querySelector('.precio').textContent;
            const imagen = tarjetaProducto.querySelector('img').src;

            const productoSeleccionado = { nombre, precio, imagen };

            carrito.push(productoSeleccionado);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();

            alert(`¡"${nombre}" se agregó al carrito! 🛒`);
        };
    });
};

// ==========================================
// 4. PINTAR PRODUCTOS DESDE EL BACKEND
// ==========================================
const mostrarProductosEnPantalla = (productosArray) => {
    const contenedor = document.querySelector('.contenedor-productos');
    
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Limpiamos el contenedor

    productosArray.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.dataset.categoria = producto.categoria;

        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="precio">${producto.precio}</p>
                <button class="btn-carrito">Agregar al carrito</button>
            </div>
        `;

        contenedor.appendChild(productoDiv);
    });

    // Activamos filtros, eventos del carrito para los elementos renderizados
    configurarFiltros();
    inicializarEventosCarrito();
};

// ==========================================
// 5. CARGAR PRODUCTOS DESDE LA API (BACKEND)
// ==========================================
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        const productos = await respuesta.json();

        mostrarProductosEnPantalla(productos);
        
    } catch (error) {
        console.error('Error al cargar los productos desde la API:', error);
    }
};

// ==========================================
// 6. INICIALIZACIÓN GLOBAL AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    cargarProductos();
});