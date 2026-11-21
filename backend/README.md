# Tienda de videojuegos · Backend

API REST Spring Boot para la Parcial 3 de DSY1104. Guarda productos, usuarios y compras en H2. La base local se crea en `data/` y el catálogo inicial proviene de la Parcial 2.

## Ejecutar con Java 21 o superior y Maven 3.9

En PowerShell, desde la carpeta del backend, sustituye los ejemplos por dos contraseñas locales distintas y de hasta 72 bytes:

```powershell
$env:TIENDA_ADMIN_PASSWORD = '<contraseña-elegida-para-admin>'
$env:TIENDA_CLIENTE_PASSWORD = '<contraseña-elegida-para-cliente>'
mvn spring-boot:run
```

Los usuarios son `admin` y `cliente`. Las variables se usan al crear cuentas que aún no existen. Las contraseñas se guardan con BCrypt. Excluye `data/` y las credenciales al compartir el proyecto.

El servidor escucha localmente en el puerto 8080. La [interfaz Swagger](http://localhost:8080/swagger-ui/index.html) lista los endpoints. Para probar una operación protegida, ejecuta `POST /api/auth/login` con el encabezado `X-Tienda-Cliente: tienda`, copia el campo `token` de la respuesta y pégalo en **Authorize**. Usa la cuenta administradora para las escrituras del catálogo.

## Comprobaciones

Ejecuta `mvn test` o `mvn package`. Las pruebas usan H2 en memoria y cubren CRUD, roles, sesión, stock y Swagger. El frontend usa `npm run dev` y el proxy de Vite.

## Decisiones de implementación

- Las compras se ejecutan en una transacción. Se consulta el precio real y se bloquea cada fila de producto hasta registrar la compra y descontar stock. Se toman los bloqueos por ID en orden.
- El JWT expira en cinco minutos y la sesión de renovación expira tras 30 minutos de inactividad. Spring administra la cookie HttpOnly y SameSite=Strict. Las operaciones de sesión exigen un encabezado propio y CORS queda deshabilitado.
- El cierre invalida la sesión de renovación. Un JWT emitido previamente puede seguir siendo válido hasta que expire. La clave de firma se genera al iniciar la aplicación local.
- Para publicar detrás de un proxy HTTPS en el mismo origen, configura `TIENDA_COOKIE_SECURE=true`.
