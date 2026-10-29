// Prueba unitaria de calcularTotal (función pura, sin React ni API).
// Se ejecuta con: npm test
import { test, expect } from "vitest";
import { calcularTotal } from "./calcularTotal";

test("calcularTotal suma precio_nuevo por cantidad de cada ítem", () => {
  // 1) Carrito vacío: el total es 0.
  expect(calcularTotal([])).toBe(0);

  // 2) Carrito con varios productos y cantidades:
  //    5000 x 2 = 10000, 3000 x 1 = 3000, 1500 x 3 = 4500 -> total 17500.
  const carrito = [
    { id: 1, nombre: "Juego A", precio_nuevo: 5000, cantidad: 2 },
    { id: 2, nombre: "Juego B", precio_nuevo: 3000, cantidad: 1 },
    { id: 3, nombre: "Juego C", precio_nuevo: 1500, cantidad: 3 },
  ];
  expect(calcularTotal(carrito)).toBe(17500);
});
