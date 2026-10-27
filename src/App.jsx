
import { useEffect, useState } from "react";
import { obtenerProductos } from "./api/productosApi";
import ListaProductos from "./components/ListaProductos";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  if (cargando) {
    return (
      <div className="container py-5">
        <p>Cargando videojuegos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <p className="alert alert-danger">{error}</p>
      </div>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Tienda de Videojuegos</h1>
      <ListaProductos productos={productos} />
    </main>
  );
}

export default App;
