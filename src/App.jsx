import { useEffect, useState } from "react";
import { obtenerProductos, registrarCompra } from "./api/productosApi";
import { filtrarProductos } from "./utils/filtrarProductos";
import { useSesion } from "./useSesion";
import BarraBusqueda from "./components/BarraBusqueda";
import ListaProductos from "./components/ListaProductos";
import Carrito from "./components/Carrito";
import PanelSesion from "./components/PanelSesion";
import PanelProductos from "./components/PanelProductos";
import DetalleProducto from "./components/DetalleProducto";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mensajeCompra, setMensajeCompra] = useState("");
  const [errorCompra, setErrorCompra] = useState("");
  const [comprando, setComprando] = useState(false);
  const [productoElegido, setProductoElegido] = useState(null);
  const cuenta = useSesion();
  const productoActual = productos.find((producto) => producto.id === productoElegido?.id);
  const cantidadEnCarrito = carrito.find((item) => item.id === productoElegido?.id)?.cantidad ?? 0;

  async function cargarProductos() {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);
      setError("");
    } catch {
      setError("No se pudo cargar el catálogo. Comprueba que Spring Boot esté iniciado y vuelve a intentar.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let activo = true;
    obtenerProductos()
      .then((datos) => { if (activo) setProductos(datos); })
      .catch(() => {
        if (activo) setError("No se pudo cargar el catálogo. Comprueba que Spring Boot esté iniciado y vuelve a intentar.");
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  function agregarAlCarrito(producto) {
    setMensajeCompra("");
    setErrorCompra("");
    if (producto.stock === 0) return;

    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      if (!existente) return [...actual, { ...producto, cantidad: 1 }];

      return actual.map((item) => item.id === producto.id
        ? { ...producto, cantidad: Math.min(item.cantidad + 1, producto.stock, 999) }
        : item);
    });
  }

  function cambiarCantidad(id, cambio) {
    setErrorCompra("");
    setCarrito((actual) => actual.map((item) => {
      if (item.id !== id) return item;
      const stock = productos.find((producto) => producto.id === id)?.stock ?? 0;
      const cantidad = cambio > 0 ? Math.max(item.cantidad, Math.min(stock, 999, item.cantidad + cambio)) : item.cantidad + cambio;
      return { ...item, cantidad };
    }).filter((item) => item.cantidad > 0));
  }

  async function pagar() {
    if (comprando || !cuenta.sesion) return;
    setComprando(true);
    setErrorCompra("");
    setMensajeCompra("");

    try {
      const items = carrito.map(({ id, cantidad }) => ({ id, cantidad }));
      const compra = await cuenta.conToken((token) => registrarCompra(items, token));
      setMensajeCompra("Compra #" + compra.id + " registrada. Total: $" + compra.total.toLocaleString("es-CL"));
      setCarrito([]);
      await cargarProductos();
    } catch (falla) {
      setErrorCompra(falla.message);
      if (falla.estado === 409 || falla.estado === 404) await cargarProductos();
    } finally {
      setComprando(false);
    }
  }

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Tienda de Videojuegos</span>
          <div className="flex-grow-1 flex-md-grow-0 ms-md-auto">
            <BarraBusqueda texto={busqueda} onCambiarTexto={setBusqueda} />
          </div>
        </div>
      </nav>

      <main className="container py-4">
        {cuenta.sesion?.rol === "ADMIN" && (
          <PanelProductos productos={productos} conToken={cuenta.conToken} recargar={cargarProductos} />
        )}
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {cargando && <p role="status">Cargando videojuegos...</p>}
            {error && (
              <div className="alert alert-danger" role="alert">
                <p>{error}</p>
                <button className="btn btn-outline-danger" type="button" onClick={cargarProductos}>Reintentar</button>
              </div>
            )}
            {!cargando && !error && (
              <ListaProductos productos={filtrarProductos(productos, busqueda)} onVerDetalle={setProductoElegido} />
            )}
          </div>
          <div className="col-12 col-lg-4">
            <PanelSesion {...cuenta} compraEnCurso={comprando} />
            <Carrito carrito={carrito} mensajeCompra={mensajeCompra} onCambiarCantidad={cambiarCantidad}
              onPagar={pagar} errorCompra={errorCompra} sesion={cuenta.sesion} comprando={comprando}
              onVerDetalle={setProductoElegido} />
          </div>
        </div>
      </main>
      {productoElegido && (
        <DetalleProducto producto={productoActual ?? productoElegido}
          unidadesDisponibles={Math.min(productoActual?.stock ?? 0, 999) - cantidadEnCarrito}
          comprando={comprando} onAgregar={agregarAlCarrito}
          onCerrar={() => setProductoElegido(null)} />
      )}
    </>
  );
}

export default App;
