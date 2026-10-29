function ItemCarrito({ item, onCambiarCantidad }) {
  const subtotal = item.precio_nuevo * item.cantidad;

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between">
        <strong>{item.nombre}</strong>
        <span>${subtotal.toLocaleString("es-CL")}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-secondary">
          ${item.precio_nuevo.toLocaleString("es-CL")} c/u
        </small>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => onCambiarCantidad(item.id, -1)}
          >
            −
          </button>
          <span>{item.cantidad}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => onCambiarCantidad(item.id, 1)}
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}

export default ItemCarrito;
