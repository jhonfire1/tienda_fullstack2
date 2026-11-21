export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

async function solicitar(ruta, { metodo = "GET", datos, token, sesion = false } = {}) {
  const respuesta = await fetch("/api" + ruta, {
    method: metodo,
    headers: {
      ...(datos && { "Content-Type": "application/json" }),
      ...(token && { Authorization: "Bearer " + token }),
      ...(sesion && { "X-Tienda-Cliente": "tienda" }),
    },
    body: datos && JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const problema = await respuesta.json().catch(() => null);
    const mensajes = {
      401: "Credenciales incorrectas o sesión vencida.",
      403: "Tu cuenta no tiene permiso para esta acción.",
      409: "No hay stock suficiente.",
    };
    throw new ErrorApi(problema?.detail || mensajes[respuesta.status] || "La API no pudo completar la solicitud.", respuesta.status);
  }

  if (respuesta.status !== 204) return respuesta.json();
}

export const obtenerProductos = () => solicitar("/productos");
export const iniciarSesion = (datos) => solicitar("/auth/login", { metodo: "POST", datos, sesion: true });
export const renovarSesion = () => solicitar("/auth/renovar", { metodo: "POST", sesion: true });
export const cerrarSesion = () => solicitar("/auth/logout", { metodo: "POST", sesion: true });
export const registrarCompra = (items, token) => solicitar("/compras", { metodo: "POST", datos: { items }, token });

export function guardarProducto(id, datos, token) {
  return id == null
    ? solicitar("/productos", { metodo: "POST", datos, token })
    : solicitar("/productos/" + id, { metodo: "PUT", datos, token });
}

export const eliminarProducto = (id, token) => solicitar("/productos/" + id, { metodo: "DELETE", token });
