import { useState } from "react";
import { eliminarProducto, guardarProducto } from "../api/productosApi";

const campos = [
  { nombre: "nombre", etiqueta: "Nombre", max: 150 },
  { nombre: "categoria", etiqueta: "Categoría", max: 100 },
  { nombre: "descripcion", etiqueta: "Descripción", max: 1000 },
  { nombre: "imagen", etiqueta: "URL de imagen", max: 2048, opcional: true },
  { nombre: "precio_nuevo", etiqueta: "Precio (CLP)", minimo: 1 },
  { nombre: "stock", etiqueta: "Stock", minimo: 0 },
];

export default function PanelProductos({ productos, conToken, recargar }) {
  const [seleccion, setSeleccion] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const producto = productos.find((item) => String(item.id) === seleccion);

  async function ejecutar(operacion, texto) {
    setOcupado(true);
    setMensaje(null);
    try {
      await conToken(operacion);
      setMensaje({ texto, clase: "success" });
      setSeleccion("");
      setConfirmar(false);
      await recargar();
    } catch (error) {
      setMensaje({ texto: error.message, clase: "danger" });
    } finally {
      setOcupado(false);
    }
  }

  function guardar(evento) {
    evento.preventDefault();
    const valores = new FormData(evento.currentTarget);
    const datos = Object.fromEntries(campos.map(({ nombre, minimo }) => [
      nombre,
      minimo == null ? valores.get(nombre).trim() : Number(valores.get(nombre)),
    ]));
    datos.historia = valores.get("historia").trim();
    ejecutar((token) => guardarProducto(producto?.id, datos, token), "Producto guardado.");
  }

  return (
    <details className="card card-body mb-4">
      <summary className="h5 mb-0">Administrar catálogo</summary>
      <label htmlFor="producto-editar" className="form-label mt-3">Producto</label>
      <select className="form-select mb-3" id="producto-editar" value={seleccion} disabled={ocupado} onChange={(evento) => {
        setSeleccion(evento.target.value);
        setConfirmar(false);
        setMensaje(null);
      }}>
        <option value="">Crear producto</option>
        {productos.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
      </select>
      <form key={producto?.id ?? "nuevo"} onSubmit={guardar}>
        <fieldset disabled={ocupado}>
          <div className="row g-2">
            {campos.map(({ nombre, etiqueta, max, minimo, opcional }) => (
              <div className="col-sm-6" key={nombre}>
                <label className="form-label" htmlFor={"admin-" + nombre}>{etiqueta}</label>
                <input className="form-control" id={"admin-" + nombre} name={nombre}
                  type={minimo == null ? "text" : "number"} required={!opcional}
                  maxLength={max} min={minimo} max={minimo == null ? undefined : 2147483647}
                  defaultValue={producto?.[nombre] ?? ""} />
              </div>
            ))}
            <div className="col-12">
              <label className="form-label" htmlFor="admin-historia">Historia del juego</label>
              <textarea className="form-control" id="admin-historia" name="historia"
                rows={4} maxLength={2000} defaultValue={producto?.historia ?? ""} />
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-primary" type="submit">Guardar producto</button>
            {producto && !confirmar && <button className="btn btn-outline-danger" type="button" onClick={() => setConfirmar(true)}>Eliminar producto</button>}
            {producto && confirmar && (
              <>
                <button className="btn btn-danger" type="button" onClick={() => ejecutar((token) => eliminarProducto(producto.id, token), "Producto eliminado.")}>Confirmar eliminación</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => setConfirmar(false)}>Cancelar</button>
              </>
            )}
          </div>
        </fieldset>
      </form>
      {mensaje && <p className={"alert mt-3 mb-0 alert-" + mensaje.clase} role="status">{mensaje.texto}</p>}
    </details>
  );
}
