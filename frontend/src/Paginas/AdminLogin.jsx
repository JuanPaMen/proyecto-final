import { useState } from "react";
import { Link } from "react-router";

function AdminLogin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al iniciar sesión");
      }

      // Guardar temporalmente la sesión
      sessionStorage.setItem("adminToken", datos.token);
      sessionStorage.setItem("adminUsuario", datos.usuario);

      setPassword("");
      setAutenticado(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsuario");
    setAutenticado(false);
    setUsuario("");
    setPassword("");
  };

  return (
    <section
      style={{
        maxWidth: "420px",
        width: "90%",
        margin: "65px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#006cf9",
          marginBottom: "10px",
        }}
      >
        IT'S PEAK
      </h2>

      <p
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Panel de administración
      </p>

      {autenticado ? (
        <div style={{ textAlign: "center" }}>
          <h3>¡Bienvenido, {usuario}!</h3>

          <p style={{ marginTop: "15px" }}>
            Has iniciado sesión correctamente.
          </p>

          <p style={{ marginTop: "10px" }}>
            Próximamente conectaremos el panel para gestionar los productos.
          </p>

          <button
            onClick={cerrarSesion}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              backgroundColor: "#d90429",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <form onSubmit={iniciarSesion}>
          <label htmlFor="usuario-admin">Usuario</label>

          <input
            id="usuario-admin"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label htmlFor="password-admin">Contraseña</label>

          <input
            id="password-admin"
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "10px 0 20px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={mostrarPassword}
              onChange={(e) => setMostrarPassword(e.target.checked)}
            />
            Mostrar contraseña
          </label>

          {error && (
            <p
              role="alert"
              style={{
                color: "#d90429",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#006cf9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      )}

      <Link
        to="/"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "22px",
          color: "#006cf9",
          textDecoration: "none",
        }}
      >
        Volver a la tienda
      </Link>
    </section>
  );
}

export default AdminLogin;
