export function filtrarProductos(productos, texto) {
  const textoLimpio = texto.trim().toLowerCase();
  if (textoLimpio === "") {
    return productos;
  }

  return productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoLimpio)
  );
}
