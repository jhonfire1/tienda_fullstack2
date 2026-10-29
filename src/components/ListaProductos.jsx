import TarjetaProducto from "./TarjetaProducto";

function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="text-secondary">No hay productos</p>;
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-sm-6 col-xl-4" key={producto.id}>
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;
