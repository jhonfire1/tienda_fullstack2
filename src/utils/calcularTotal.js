export function calcularTotal(carrito) {
  let total = 0;

  carrito.forEach((item) => {
    total = total + item.precio_nuevo * item.cantidad;
  });

  return total;
}
