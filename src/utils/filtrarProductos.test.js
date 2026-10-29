// Prueba unitaria de filtrarProductos (función pura, sin React ni API).
// Se ejecuta con: npm test
import { test, expect } from "vitest";
import { filtrarProductos } from "./filtrarProductos";

// Lista pequeña de ejemplo, solo con los campos que usa el filtro.
const productos = [
  { id: 1, nombre: "The Legend of Zelda" },
  { id: 2, nombre: "Super Mario Odyssey" },
  { id: 3, nombre: "Mario Kart" },
];

test("filtrarProductos filtra por nombre sin distinguir mayúsculas", () => {
  // 1) Texto vacío: devuelve todos los productos.
  expect(filtrarProductos(productos, "")).toEqual(productos);

  // 2) Mayúsculas y minúsculas no importan: "mario" y "MARIO" dan lo mismo.
  const resultadoMinuscula = filtrarProductos(productos, "mario");
  const resultadoMayuscula = filtrarProductos(productos, "MARIO");
  expect(resultadoMinuscula).toEqual([productos[1], productos[2]]);
  expect(resultadoMayuscula).toEqual(resultadoMinuscula);

  // 3) Texto sin coincidencias: devuelve una lista vacía.
  expect(filtrarProductos(productos, "zzz")).toEqual([]);
});
