import { useEffect, useState } from "react";
import { obtenerProductos } from "./api/productosApi";
import { filtrarProductos } from "./utils/filtrarProductos";
import { calcularTotal } from "./utils/calcularTotal";
import BarraBusqueda from "./components/BarraBusqueda";
import ListaProductos from "./components/ListaProductos";
import Carrito from "./components/Carrito";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mensajeCompra, setMensajeCompra] = useState("");

  useEffect(() => {
    async function cargarProductos() {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  function agregarAlCarrito(producto) {
    setMensajeCompra("");
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      const nuevoCarrito = carrito.map((item) => {
        if (item.id === producto.id) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  }

  function cambiarCantidad(id, cambio) {
    const nuevoCarrito = carrito
      .map((item) => {
        if (item.id === id) {
          return { ...item, cantidad: item.cantidad + cambio };
        }
        return item;
      })
      .filter((item) => item.cantidad > 0);

    setCarrito(nuevoCarrito);
  }

  function pagar() {
    const total = calcularTotal(carrito);
    setMensajeCompra(
      "¡Compra realizada con éxito! Total pagado: $" + total.toLocaleString("es-CL")
    );
    setCarrito([]);
  }

  const productosFiltrados = filtrarProductos(productos, busqueda);

  let contenidoCatalogo;
  if (cargando) {
    contenidoCatalogo = <p>Cargando videojuegos...</p>;
  } else if (error) {
    contenidoCatalogo = <p className="alert alert-danger">{error}</p>;
  } else {
    contenidoCatalogo = (
      <ListaProductos
        productos={productosFiltrados}
        onAgregar={agregarAlCarrito}
      />
    );
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
        <div className="row g-4">
          <div className="col-12 col-lg-8">{contenidoCatalogo}</div>
          <div className="col-12 col-lg-4">
            <Carrito
              carrito={carrito}
              mensajeCompra={mensajeCompra}
              onCambiarCantidad={cambiarCantidad}
              onPagar={pagar}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
