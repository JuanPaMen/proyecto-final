import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import FormularioProducto from "../components/FormularioProducto.jsx";
import EditarProducto from "../components/EditarProducto.jsx";

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

      // Si no hay sesión, volver al login
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        // 1. Verificar la sesión con Express
        const respuesta = await fetch("http://localhost:3000/api/auth/me", {
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

        // 2. Obtener los productos
        const respuestaProductos = await fetch(
          "http://localhost:3000/api/productos",
        );

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

  // Cerrar sesión
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
        `http://localhost:3000/api/productos/${producto._id}`,
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
      {/* Encabezado */}
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

      {/* Formulario para agregar productos */}
      <FormularioProducto
        onCreado={(nuevoProducto) => {
          setProductos((anteriores) => [...anteriores, nuevoProducto]);
        }}
      />

      {/* Formulario para editar productos */}
      {productoEditando && (
        <EditarProducto
          key={productoEditando._id}
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
      )}

      {/* Lista de productos */}
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
          <div
            key={producto._id}
            style={{
              padding: "15px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <h4>{producto.nombre}</h4>

            <p>Precio: {producto.precio}</p>

            <p>Categoría: {producto.categoria}</p>

            <p>Tallas: {producto.tallas?.join(", ") || "Sin registrar"}</p>

            <button
              type="button"
              onClick={() => setProductoEditando(producto)}
              style={{
                backgroundColor: "#006cf9",
                color: "white",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "12px",
              }}
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => eliminarProducto(producto)}
              style={{
                backgroundColor: "#d90429",
                color: "white",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "12px",
                marginLeft: "10px",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

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
