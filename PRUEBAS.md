# Documento de pruebas

Proyecto: Tienda de Videojuegos (DSY1104, Evaluación Parcial N°2).
Alcance de las pruebas acordado con el profesor: **2 pruebas unitarias** de lógica pura de JavaScript (sin Karma ni Jasmine).

## 1. Entorno de pruebas

| Elemento | Detalle |
|---|---|
| Herramienta | Vitest 5.0.5 (se integra con Vite sin configuración extra) |
| Lenguaje | JavaScript estándar (módulos ES) |
| Comando | `npm test` (ejecuta `vitest run`, corre una vez y termina) |
| Ubicación | `src/utils/filtrarProductos.test.js` y `src/utils/calcularTotal.test.js` |
| Requisito de Node | Vitest 5.0.5 declara `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |

No se usan mocks: las dos funciones probadas son puras (reciben datos y devuelven un resultado, sin `fetch`, sin React y sin estado), por lo que se prueban con datos de ejemplo escritos dentro de cada archivo.

## 2. Pruebas y qué verifican

**Prueba 1 — `filtrarProductos` (`src/utils/filtrarProductos.test.js`)**

Usa una lista de 3 productos de ejemplo y verifica:
1. Con texto vacío devuelve todos los productos.
2. Las mayúsculas y minúsculas no importan: `"mario"` y `"MARIO"` devuelven los mismos 2 productos.
3. Un texto sin coincidencias (`"zzz"`) devuelve una lista vacía.

**Prueba 2 — `calcularTotal` (`src/utils/calcularTotal.test.js`)**

Verifica:
1. Un carrito vacío da total 0.
2. Un carrito con 3 productos y distintas cantidades da el total esperado: 5000 × 2 + 3000 × 1 + 1500 × 3 = **17500**.

## 3. Resultado de `npm test`

Salida copiada tal como la entregó el comando (Node v22.22.2, Linux):

```
> tienda@0.0.0 test
> vitest run

 RUN  v5.0.5

 ✓ src/utils/filtrarProductos.test.js (1 test) 4ms
 ✓ src/utils/calcularTotal.test.js (1 test) 3ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Duration  321ms
```

Análisis: las 2 pruebas pasan (2 de 2). Los tiempos (ms) varían en cada ejecución.

> [COMPLETAR POR EL EQUIPO: repetir `npm test` en su computador y reemplazar la salida de arriba si difiere (versión de Node, tiempos).]

## 4. Cómo ejecutarlas

```
npm install
npm test
```
