# Guía de presentación

Guía para que cada integrante pueda exponer el proyecto de forma individual (15 minutos + 5 de preguntas). Todas las rutas son reales y están en el repositorio. Antes de exponer, abran cada archivo mencionado y léanlo completo.

Para mostrar la app: terminal 1 `npm run api`, terminal 2 `npm run dev`, y abrir la dirección que muestra Vite (normalmente http://localhost:5173).

---

## 1. Cómo se estructuró el proyecto con React y Vite

- **Vite** crea y levanta el proyecto: `npm run dev` abre el servidor de desarrollo y `npm run build` genera la versión final. Configuración en `vite.config.js` (solo activa el plugin de React).
- **Punto de entrada:** `index.html` tiene un `<div id="root">` y carga `src/main.jsx`. Ese archivo monta el componente `App` en ese div e importa el CSS de Bootstrap (`bootstrap/dist/css/bootstrap.min.css`).
- **`src/App.jsx`:** componente principal. Guarda el estado y arma la pantalla con los demás componentes.
- **`src/components/`:** un componente por responsabilidad: `BarraBusqueda`, `ListaProductos`, `TarjetaProducto`, `Carrito`, `ItemCarrito`.
- **`src/api/productosApi.js`:** la función que hace el `fetch` a la API.
- **`src/utils/`:** funciones puras de lógica (`filtrarProductos.js`, `calcularTotal.js`) y sus pruebas (`*.test.js`).
- **`db.json`:** la "base de datos" de la API (20 productos); `json-server` la expone.
- **`prototipo-html/`:** la plantilla HTML original, solo como referencia (no se usa en la app).

## 2. Un componente de ejemplo con sus props y su estado

**Estado** (en `src/App.jsx`, con `useState`):

| Estado | Para qué sirve |
|---|---|
| `productos` | Lista que llega de la API |
| `cargando` | `true` mientras se espera la respuesta |
| `error` | Mensaje si falla la API |
| `busqueda` | Texto escrito en la barra de búsqueda |
| `carrito` | Productos agregados, cada uno con su `cantidad` |
| `mensajeCompra` | Mensaje que se muestra al pulsar "Pagar" |

**Props** (los datos bajan de `App` a los hijos; los eventos suben con funciones):

- `App` → `BarraBusqueda`: `texto` y `onCambiarTexto`. Cuando el usuario escribe, el input llama a `onCambiarTexto`, que actualiza `busqueda` en `App`.
- `App` → `ListaProductos`: `productos` (ya filtrados) y `onAgregar`. `ListaProductos` recorre la lista con `map` y crea una `TarjetaProducto` por producto.
- `ListaProductos` → `TarjetaProducto`: `producto` y `onAgregar`. El botón "Agregar" llama a `onAgregar(producto)`.
- `App` → `Carrito`: `carrito`, `mensajeCompra`, `onCambiarCantidad` y `onPagar`. `Carrito` calcula el total con `calcularTotal`.
- `Carrito` → `ItemCarrito`: `item` y `onCambiarCantidad`. Los botones "−" y "+" llaman a `onCambiarCantidad(item.id, -1)` o `(item.id, 1)`.

**Ejemplo para explicar: `TarjetaProducto`** (`src/components/TarjetaProducto.jsx`). No tiene estado propio: recibe todo por props y muestra imagen, nombre, categoría, descripción, precio y stock. Al pulsar "Agregar", avisa al padre con `onAgregar`; quien cambia el carrito es `App`, no la tarjeta.

**Funciones de `App.jsx` para saber explicar:**
- `agregarAlCarrito`: si el producto ya está en el carrito, suma 1 a su cantidad; si no, lo agrega con cantidad 1.
- `cambiarCantidad`: suma o resta 1; luego `filter` quita los ítems con cantidad 0 o menos.
- `pagar`: calcula el total con `calcularTotal`, muestra un mensaje de compra realizada y vacía el carrito (no hay pantalla de pago real).

## 3. Dónde y cómo se aplicó Bootstrap responsivo

Bootstrap 5.3.3 se instaló por npm y solo se importa el CSS en `src/main.jsx` (no se usa su JavaScript).

- **`src/App.jsx`:** `navbar navbar-dark bg-dark` para la barra superior; `container` para centrar; en `<main>` una `row g-4` con dos columnas: catálogo `col-12 col-lg-8` y carrito `col-12 col-lg-4`. Resultado: **desde 992 px (lg) catálogo y carrito van lado a lado; en pantallas menores, uno debajo del otro**.
- **`src/components/ListaProductos.jsx`:** grilla de tarjetas con `row g-4` y `col-12 col-sm-6 col-xl-4`: **1 tarjeta por fila en móvil (menos de 576 px), 2 desde 576 px y 3 desde 1200 px**.
- **`src/components/TarjetaProducto.jsx`:** `card`, `card-img-top`, `card-body`, `btn btn-primary`.
- **`src/components/Carrito.jsx` e `ItemCarrito.jsx`:** `card`, `list-group`, `d-flex`, `alert alert-success`, `btn btn-success`.
- **`src/components/BarraBusqueda.jsx`:** `form-control`.

**Capturas a tomar** (en el navegador: F12 → modo dispositivo / "Toggle device toolbar"):
1. **Móvil** (por ejemplo 375 px de ancho): 1 tarjeta por fila y el carrito debajo del catálogo.
2. **Tablet** (por ejemplo 768 px): 2 tarjetas por fila y el carrito debajo.
3. **Escritorio** (1200 px o más): 3 tarjetas por fila y el carrito a la derecha.
4. Una captura con productos en el carrito y el total visible.
5. Una captura con una búsqueda que no encuentra nada ("No hay productos").

## 4. Cómo se consume la API con `fetch`

- La API es **json-server**, que sirve `db.json`. Se levanta con `npm run api` (script en `package.json`: `json-server db.json --port 4000`). Los productos quedan en `http://localhost:4000/productos`.
- `src/api/productosApi.js`: la función `obtenerProductos` hace `fetch` a esa dirección. Si la respuesta no es correcta (`!respuesta.ok`) lanza un error; si lo es, devuelve el JSON con la lista.
- `src/App.jsx`: un `useEffect` con arreglo de dependencias vacío (`[]`) llama a `obtenerProductos` **solo una vez al cargar la página**, dentro de una función `async` con `try / catch / finally`: guarda los productos en `productos`, un error en `error`, y al terminar pone `cargando` en `false`.
- La pantalla muestra "Cargando videojuegos..." mientras `cargando` es `true`, un mensaje rojo si hay error, o el catálogo si todo salió bien.
- Para demostrar el manejo de error: apagar `npm run api` y recargar la página.

## 5. Qué prueban las 2 pruebas y cómo ejecutarlas

Se ejecutan con `npm test` (Vitest). Detalle en `docs/PRUEBAS.md`.

1. `src/utils/filtrarProductos.test.js`: texto vacío devuelve todos los productos; mayúsculas y minúsculas no importan; un texto sin coincidencias devuelve lista vacía.
2. `src/utils/calcularTotal.test.js`: carrito vacío da 0; un carrito con varios productos y cantidades da el total esperado (17500).

Son pruebas de funciones puras (sin React ni API), por eso no necesitan mocks.

---

## Preguntas que pueden hacerles (para practicar)

- ¿Qué diferencia hay entre props y estado?
- ¿Por qué `App` guarda el estado y no cada componente?
- ¿Para qué sirve el arreglo vacío `[]` del `useEffect`?
- ¿Qué pasa si la API está apagada? ¿Dónde se maneja?
- ¿Por qué `filtrarProductos` y `calcularTotal` están en archivos aparte?
- ¿Qué clase de Bootstrap hace que el carrito pase al lado del catálogo en pantallas grandes?
- ¿Qué cambios hizo cada uno en GitHub? (revisar sus PR y commits)
