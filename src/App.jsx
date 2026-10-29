import { useEffect, useState } from "react";
import { obtenerProductos } from "./api/productosApi";
import { filtrarProductos } from "./utils/filtrarProductos";
import BarraBusqueda from "./components/BarraBusqueda";
import ListaProductos from "./components/ListaProductos";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

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

  const productosFiltrados = filtrarProductos(productos, busqueda);

  let contenidoCatalogo;
  if (cargando) {
    contenidoCatalogo = <p>Cargando videojuegos...</p>;
  } else if (error) {
    contenidoCatalogo = <p className="alert alert-danger">{error}</p>;
  } else {
    contenidoCatalogo = <ListaProductos productos={productosFiltrados} />;
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

      <main className="container py-4">{contenidoCatalogo}</main>
    </>
  );
}

export default App;
