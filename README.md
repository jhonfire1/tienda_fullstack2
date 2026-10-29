Tienda de Videojuegos

Proyecto de la Evaluación Parcial N°2 de DSY1104 Desarrollo Fullstack II (DuocUC). Una sola pantalla con catálogo de videojuegos, búsqueda en tiempo real y carrito de compras.

Tecnologías
React + Vite (JavaScript, archivos .jsx)
Bootstrap 5.3.3 (solo el CSS)
json-server como API local
Vitest para las pruebas unitarias
Qué hace
Muestra el catálogo de 20 productos, cargado con fetch desde la API.
Filtra los productos por nombre mientras se escribe en la barra de búsqueda.
Permite agregar productos al carrito, subir y bajar cantidades, y muestra el total.
Diseño responsivo con Bootstrap.
Requisitos
Node.js. Vite 8 pide Node ^20.19.0 o >=22.12.0, y Vitest 5 pide ^22.12.0, ^24.0.0 o >=26.0.0. Para que funcione todo, usar Node 22.12 o superior (comprobar con node -v).
Git.
Instalación y uso
npm install

Se necesitan dos terminales:

# Terminal 1: API (http://localhost:4000/productos)
npm run api

# Terminal 2: aplicación (Vite muestra la dirección, normalmente http://localhost:5173)
npm run dev

Pruebas unitarias:

npm test

Otros comandos: npm run build (versión final en dist/) y npm run lint.

Estructura
prototipo-html/          Plantilla HTML original (solo referencia)
db.json                  Datos de la API (20 productos)
src/
  main.jsx               Punto de entrada; importa el CSS de Bootstrap
  App.jsx                Estado principal y composición de componentes
  api/productosApi.js    fetch a la API
  utils/                 Funciones puras (filtrarProductos, calcularTotal) y sus pruebas
  components/            BarraBusqueda, ListaProductos, TarjetaProducto, Carrito, ItemCarrito
docs/
  GUIA_PRESENTACION.md   Guía para la presentación individual
  PRUEBAS.md             Documento de pruebas
Equipo y reparto
Paso	Qué	Responsable
1	Aislar el prototipo HTML	Persona 1
2	Setup React + Vite + Bootstrap	Persona 1
3	API: db.json y json-server	Persona 1
4	Catálogo: fetch, lista y tarjetas	Persona 1
5	Búsqueda en tiempo real	Persona 2
6	Carrito I: agregar y mostrar	Persona 2
7	Carrito II: cantidades y total	Persona 2
8	Pruebas unitarias (2)	Persona 1
9	Guía de presentación y README	Persona 2
10	Documento de pruebas	Persona 1

Forma de trabajo acordada: un paso = una rama + un commit + un Pull Request revisado por la otra persona.