function ItemCarrito({ item }) {
  const subtotal = item.precio_nuevo * item.cantidad;

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between">
        <strong>{item.nombre}</strong>
        <span>${subtotal.toLocaleString("es-CL")}</span>
      </div>

      <div className="d-flex justify-content-between mt-2">
        <small className="text-secondary">
          ${item.precio_nuevo.toLocaleString("es-CL")} c/u
        </small>
        <span>Cantidad: {item.cantidad}</span>
      </div>
    </li>
  );
}

export default ItemCarrito;
