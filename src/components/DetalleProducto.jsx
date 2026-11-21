import { useEffect, useRef } from "react";
import "./DetalleProducto.css";

function DetalleProducto({ producto, unidadesDisponibles, comprando, onAgregar, onCerrar }) {
  const dialogo = useRef(null);

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento.open) elemento.showModal();
  }, []);

  function confirmar() {
    onAgregar(producto);
    dialogo.current.close();
  }

  return (
    <dialog className="detalle-producto" ref={dialogo} aria-labelledby="detalle-nombre" onClose={onCerrar}>
      <div className="detalle-producto__contenido">
        <button className="btn-close detalle-producto__cerrar" type="button"
          aria-label="Cerrar ficha" onClick={() => dialogo.current.close()} />
        {producto.imagen && (
          <div className="detalle-producto__portada">
            <img src={producto.imagen} alt={"Portada de " + producto.nombre} />
          </div>
        )}
        <div className="detalle-producto__texto">
          <h2 className="h3 mb-3" id="detalle-nombre">{producto.nombre}</h2>
          <dl className="d-flex flex-wrap gap-4 mb-4">
            <div>
              <dt className="small text-secondary">Tipo de juego</dt>
              <dd className="mb-0">{producto.categoria}</dd>
            </div>
            <div>
              <dt className="small text-secondary">Precio</dt>
              <dd className="fw-bold mb-0">${producto.precio_nuevo.toLocaleString("es-CL")}</dd>
            </div>
          </dl>
          <h3 className="h6">Descripción</h3>
          <p>{producto.descripcion}</p>
          {producto.historia && (
            <section className="detalle-producto__historia">
              <h3 className="h6">Historia del juego</h3>
              <p className="mb-0">{producto.historia}</p>
            </section>
          )}
          <button className="btn btn-primary mt-3" type="button"
            disabled={comprando || unidadesDisponibles <= 0} onClick={confirmar}>
            Agregar al carrito
          </button>
          {unidadesDisponibles <= 0 && (
            <p className="small text-secondary mt-2 mb-0">No hay más unidades disponibles para agregar.</p>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default DetalleProducto;
