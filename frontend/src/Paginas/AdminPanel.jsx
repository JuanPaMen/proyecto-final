import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import FormularioProducto from "../components/FormularioProducto.jsx";
import EditarProducto from "../components/EditarProducto.jsx";
import MensajesAdmin from "../components/MensajesAdmin.jsx";
import PedidosAdmin from "../components/PedidosAdmin.jsx";
import { API_URL } from "../config.js";
import { resolverImagen } from "../utils/imagenes.js";

function AdminPanel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarPanel = async () => {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        // Se valida el token con el backend: tenerlo guardado no prueba que siga vigente
        const respuesta = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (respuesta.status === 401) {
          sessionStorage.removeItem("adminToken");
          sessionStorage.removeItem("adminUsuario");

          navigate("/admin/login", { replace: true });
          return;
        }

        if (!respuesta.ok) {
          throw new Error("No se pudo verificar la sesión.");
        }

        const datosAdmin = await respuesta.json();

        const respuestaProductos = await fetch(`${API_URL}/api/productos`);

        if (!respuestaProductos.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }

        const datosProductos = await respuestaProductos.json();

        if (activo) {
          setUsuario(datosAdmin.usuario);
          setProductos(datosProductos);
        }
      } catch (error) {
        if (activo) {
          setError(error.message);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPanel();

    return () => {
      activo = false;
    };
  }, [navigate]);

  const cerrarSesion = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsuario");

    navigate("/admin/login", { replace: true });
  };

  const eliminarProducto = async (producto) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar "${producto.nombre}"?`,
    );

    if (!confirmar) return;

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      alert("Debes iniciar sesión nuevamente.");
      cerrarSesion();
      return;
    }

    try {
      const respuesta = await fetch(
        `${API_URL}/api/productos/${producto._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (respuesta.status === 401) {
        cerrarSesion();
        return;
      }

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto.");
      }

      // Actualizar la lista sin recargar la página
      setProductos((anteriores) =>
        anteriores.filter((item) => item._id !== producto._id),
      );

      // Cerrar el formulario si editábamos ese producto
      setProductoEditando((actual) =>
        actual?._id === producto._id ? null : actual,
      );

      alert("¡Producto eliminado correctamente!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (cargando) {
    return <p>Verificando acceso...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section
      style={{
        width: "90%",
        maxWidth: "1000px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ color: "#006cf9" }}>Panel de Administración</h2>

          <p>Bienvenido, {usuario}</p>
        </div>

        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: "#d90429",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <FormularioProducto
        onCreado={(nuevoProducto) => {
          setProductos((anteriores) => [...anteriores, nuevoProducto]);
        }}
      />

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "25px",
        }}
      >
        <h3>Productos registrados</h3>

        <p style={{ margin: "15px 0" }}>
          Total de productos: {productos.length}
        </p>

        {productos.map((producto) => (
          <article key={producto._id} className="admin-producto-item">
            <img
              src={resolverImagen(producto.imagen)}
              alt={producto.nombre}
              className="admin-producto-imagen"
            />

            <div className="admin-producto-contenido">
              <div className="admin-producto-encabezado">
                <h4>{producto.nombre}</h4>

                <strong className="admin-producto-precio">
                  $
                  {Number(
                    String(producto.precio).replace(/\D/g, ""),
                  ).toLocaleString("es-CO")}
                </strong>
              </div>

              <div className="admin-producto-datos">
                <span>
                  <i className="bi bi-tag"></i>
                  {producto.categoria}
                </span>

                <span>
                  <i className="bi bi-rulers"></i>
                  {producto.tallas?.length
                    ? producto.tallas.join(", ")
                    : "Sin tallas registradas"}
                </span>
              </div>

              {producto.oferta && (
                <span className="admin-producto-oferta">En oferta</span>
              )}

              <div className="admin-producto-acciones">
                <button
                  type="button"
                  className="btn-azul"
                  onClick={() => setProductoEditando(producto)}
                >
                  <i className="bi bi-pencil-square"></i>
                  Editar
                </button>

                <button
                  type="button"
                  className="btn-rojo"
                  onClick={() => eliminarProducto(producto)}
                >
                  <i className="bi bi-trash3"></i>
                  Eliminar
                </button>
              </div>
            </div>
            {/*Formulario para editar producto, esta dentro de las cards */}
            {productoEditando?._id === producto._id && (
              <div className="admin-producto-editor">
                <EditarProducto
                  key={producto._id}
                  producto={productoEditando}
                  onGuardado={(actualizado) => {
                    setProductos((anteriores) =>
                      anteriores.map((item) =>
                        item._id === actualizado._id ? actualizado : item,
                      ),
                    );

                    setProductoEditando(null);
                    alert("¡Producto actualizado correctamente!");
                  }}
                  onCancelar={() => setProductoEditando(null)}
                />
              </div>
            )}
          </article>
        ))}
      </div>

      <PedidosAdmin onSesionExpirada={cerrarSesion} />

      <MensajesAdmin onSesionExpirada={cerrarSesion} />

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "25px",
          color: "#006cf9",
        }}
      >
        Volver a la tienda
      </Link>
    </section>
  );
}

export default AdminPanel;
