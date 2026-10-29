import ItemCarrito from "./ItemCarrito";
import { calcularTotal } from "../utils/calcularTotal";

function Carrito({ carrito, mensajeCompra, onCambiarCantidad, onPagar }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="h5 mb-0">Carrito de compras</h2>
      </div>

      {mensajeCompra !== "" && (
        <div className="alert alert-success m-3 mb-0" role="alert">
          {mensajeCompra}
        </div>
      )}

      {carrito.length === 0 ? (
        <div className="card-body">
          <p className="mb-0 text-secondary">El carrito está vacío</p>
        </div>
      ) : (
        <>
          <ul className="list-group list-group-flush">
            {carrito.map((item) => (
              <ItemCarrito
                key={item.id}
                item={item}
                onCambiarCantidad={onCambiarCantidad}
              />
            ))}
          </ul>

          <div className="card-footer">
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>${calcularTotal(carrito).toLocaleString("es-CL")}</span>
            </div>
            <button
              className="btn btn-success w-100"
              type="button"
              onClick={onPagar}
            >
              Pagar
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Carrito;
