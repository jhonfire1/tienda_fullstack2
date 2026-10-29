import ItemCarrito from "./ItemCarrito";

function Carrito({ carrito }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="h5 mb-0">Carrito de compras</h2>
      </div>

      {carrito.length === 0 ? (
        <div className="card-body">
          <p className="mb-0 text-secondary">El carrito está vacío</p>
        </div>
      ) : (
        <ul className="list-group list-group-flush">
          {carrito.map((item) => (
            <ItemCarrito key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Carrito;
