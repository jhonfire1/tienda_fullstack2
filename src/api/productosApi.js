const API_URL = "http://localhost:4000/productos";

export async function obtenerProductos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  return await respuesta.json();
}