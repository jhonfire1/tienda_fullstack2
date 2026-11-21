import { useEffect, useRef, useState } from "react";
import { cerrarSesion, ErrorApi, iniciarSesion, renovarSesion } from "./api/productosApi";

export function useSesion() {
  const [sesion, setSesion] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [errorSesion, setErrorSesion] = useState("");
  const renovacion = useRef(null);

  useEffect(() => {
    let activo = true;
    renovarSesion()
      .then((datos) => { if (activo) setSesion(datos); })
      .catch((error) => {
        if (activo && error.estado !== 401) setErrorSesion("No se pudo recuperar la sesión.");
      })
      .finally(() => { if (activo) setCargandoSesion(false); });
    return () => { activo = false; };
  }, []);

  async function login(datos) {
    setSesion(await iniciarSesion(datos));
    setErrorSesion("");
  }

  async function logout() {
    if (renovacion.current) await renovacion.current.catch(() => {});
    await cerrarSesion();
    setSesion(null);
  }

  async function conToken(operacion) {
    if (!sesion) throw new ErrorApi("Inicia sesión para continuar.", 401);
    try {
      return await operacion(sesion.token);
    } catch (error) {
      if (error.estado !== 401) throw error;
    }

    renovacion.current ??= renovarSesion()
      .then((datos) => {
        setSesion(datos);
        return datos;
      })
      .catch((error) => {
        if (error.estado === 401) setSesion(null);
        throw error;
      })
      .finally(() => { renovacion.current = null; });

    const datos = await renovacion.current;
    return operacion(datos.token);
  }

  return { sesion, cargandoSesion, errorSesion, login, logout, conToken };
}
