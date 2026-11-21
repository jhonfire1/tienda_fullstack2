# Tienda de videojuegos · Parcial 3

El frontend React consume la API de **tienda-backend** desde `/api`. El proxy de Vite reenvía las peticiones a Spring Boot en el puerto 8080.

1. Inicia **tienda-backend** según su README. Configura las contraseñas locales de los usuarios `admin` y `cliente` antes del primer inicio.
2. En la carpeta del frontend, ejecuta `npm ci` y `npm run dev`. Abre la dirección indicada por Vite.
3. Busca un videojuego y agrega una unidad al carrito. Inicia sesión como `cliente` y registra la compra. Como `admin`, abre **Administrar catálogo** para crear, modificar y eliminar productos.

Usa Node 24 LTS para reproducir el entorno verificado. Ejecuta `npm test`, `npm run lint` y `npm run build`. Usa `npm run preview` para revisar la compilación con Spring activo. Para publicar en un servidor web, configura el proxy de `/api` en ese mismo origen y habilita HTTPS.

React conserva el JWT en memoria. Spring conserva la sesión de renovación mediante una cookie HttpOnly y SameSite=Strict. Al recargar, React solicita un JWT nuevo. El backend comprueba los permisos y React oculta las acciones administrativas a clientes y visitantes.

`db.json`, `prototipo-html/`, `GUIA_PRESENTACION.md` y `PRUEBAS.md` conservan el trabajo de la Parcial 2 como referencia.
