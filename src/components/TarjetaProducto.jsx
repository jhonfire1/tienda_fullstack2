function TarjetaProducto({ producto, onAgregar }) {
  return (
    <article className="card h-100">
      <img
        src={producto.imagen}
        className="card-img-top"
        alt={producto.nombre}
      />

      <div className="card-body">
        <h2 className="card-title h5">{producto.nombre}</h2>
        <p className="text-secondary">{producto.categoria}</p>
        <p>{producto.descripcion}</p>

        <p className="fw-bold">
          Precio: ${producto.precio_nuevo.toLocaleString("es-CL")}
        </p>

        <p>Stock: {producto.stock}</p>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => onAgregar(producto)}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}

export default TarjetaProducto;
