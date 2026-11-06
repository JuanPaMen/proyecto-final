import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { API_URL } from "../config.js";

function AdminLogin() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
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

      // Guardar la sesión mientras la pestaña esté abierta
      sessionStorage.setItem("adminToken", datos.token);
      sessionStorage.setItem("adminUsuario", datos.usuario);

      setPassword("");
      navigate("/admin", { replace: true });
    } catch (error) {
      setError(
        error instanceof TypeError
          ? "No pudimos conectar con el servidor. Intenta de nuevo."
          : error.message,
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="tarjeta-formulario tarjeta-login">
      <h2 className="login-titulo">IT'S PEAK</h2>
      <p className="login-subtitulo">Panel de administración</p>

      <form onSubmit={iniciarSesion}>
        <div className="campo">
          <label htmlFor="usuario-admin">Usuario</label>
          <input
            id="usuario-admin"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password-admin">Contraseña</label>
          <input
            id="password-admin"
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        <label className="casilla">
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={(e) => setMostrarPassword(e.target.checked)}
          />
          Mostrar contraseña
        </label>

        {error && (
          <p role="alert" className="aviso-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn-azul" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <Link to="/" className="enlace-centrado">
        Volver a la tienda
      </Link>
    </section>
  );
}

export default AdminLogin;
