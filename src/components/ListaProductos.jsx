import TarjetaProducto from "./TarjetaProducto";

function ListaProductos({ productos }) {
  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-sm-6 col-lg-4" key={producto.id}>
          <TarjetaProducto producto={producto} />
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;