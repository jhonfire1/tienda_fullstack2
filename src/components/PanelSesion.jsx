import { useState } from "react";

export default function PanelSesion({ sesion, cargandoSesion, errorSesion, login, logout, compraEnCurso }) {
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");

  async function enviar(evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    setOcupado(true);
    setError("");
    try {
      if (sesion) await logout();
      else await login(datos);
    } catch (falla) {
      setError(falla.message);
    } finally {
      setOcupado(false);
    }
  }

  if (cargandoSesion) return <p role="status">Recuperando sesión…</p>;

  return (
    <form className="card card-body mb-4" onSubmit={enviar}>
      {sesion ? (
        <>
          <p className="mb-2">Sesión de <strong>{sesion.usuario}</strong> · {sesion.rol}</p>
          <button className="btn btn-outline-secondary align-self-start" disabled={ocupado || compraEnCurso}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <h2 className="h5">Iniciar sesión</h2>
          <label className="form-label" htmlFor="usuario">Usuario</label>
          <input className="form-control mb-2" id="usuario" name="usuario" autoComplete="username" required />
          <label className="form-label" htmlFor="password">Contraseña</label>
          <input className="form-control mb-3" id="password" name="password" type="password" autoComplete="current-password" required />
          <button className="btn btn-outline-primary align-self-start" disabled={ocupado}>Ingresar</button>
        </>
      )}
      {(error || errorSesion) && <p className="text-danger mt-2 mb-0" role="alert">{error || errorSesion}</p>}
    </form>
  );
}
