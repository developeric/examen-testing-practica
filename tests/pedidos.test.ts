// EJERCICIO 5 (TDD): estas pruebas ya están escritas. NO las modifiques.
// Implementá src/services/pedidos.ts hasta que todas pasen.
import { describe, expect, it } from "vitest";
import { calcularTotalPedido } from "../src/services/pedidos.ts";

describe("calcularTotalPedido", () => {
  it("calcula un pedido de un ítem sin descuento", () => {
    const resumen = calcularTotalPedido({
      items: [{ precio: 1000, cantidad: 2 }],
      descuento: 0,
      pesoKg: 1,
      zona: "local",
    });
    expect(resumen).toEqual({
      subtotal: 2000,
      totalConDescuento: 2000,
      envio: 500,
      total: 2500,
    });
  });

  it("suma varios ítems, aplica descuento y cobra envío regional", () => {
    const resumen = calcularTotalPedido({
      items: [
        { precio: 1000, cantidad: 2 },
        { precio: 500, cantidad: 3 },
      ],
      descuento: 10,
      pesoKg: 2,
      zona: "regional",
    });
    expect(resumen).toEqual({
      subtotal: 3500,
      totalConDescuento: 3150,
      envio: 1300,
      total: 4450,
    });
  });

  it("el envío es gratis cuando el total con descuento llega exactamente a $50.000", () => {
    const resumen = calcularTotalPedido({
      items: [{ precio: 25000, cantidad: 2 }],
      descuento: 0,
      pesoKg: 10,
      zona: "nacional",
    });
    expect(resumen.envio).toBe(0);
    expect(resumen.total).toBe(50000);
  });

  it("el envío se cobra si el total con descuento queda apenas debajo de $50.000", () => {
    const resumen = calcularTotalPedido({
      items: [{ precio: 49999, cantidad: 1 }],
      descuento: 0,
      pesoKg: 1,
      zona: "local",
    });
    expect(resumen.envio).toBe(500);
    expect(resumen.total).toBe(50499);
  });

  it("el descuento puede hacer perder el envío gratis", () => {
    const resumen = calcularTotalPedido({
      items: [{ precio: 52000, cantidad: 1 }],
      descuento: 10,
      pesoKg: 1,
      zona: "nacional",
    });
    expect(resumen).toEqual({
      subtotal: 52000,
      totalConDescuento: 46800,
      envio: 2500,
      total: 49300,
    });
  });

  it("rechaza un pedido sin ítems", () => {
    expect(() =>
      calcularTotalPedido({
        items: [],
        descuento: 0,
        pesoKg: 1,
        zona: "local",
      }),
    ).toThrow(RangeError);
  });

  it("rechaza cantidades que no son enteros mayores o iguales a 1", () => {
    const base = { descuento: 0, pesoKg: 1, zona: "local" } as const;
    expect(() =>
      calcularTotalPedido({ ...base, items: [{ precio: 100, cantidad: 0 }] }),
    ).toThrow(RangeError);
    expect(() =>
      calcularTotalPedido({ ...base, items: [{ precio: 100, cantidad: 1.5 }] }),
    ).toThrow(RangeError);
  });

  it("propaga el RangeError de un descuento inválido", () => {
    expect(() =>
      calcularTotalPedido({
        items: [{ precio: 1000, cantidad: 1 }],
        descuento: 150,
        pesoKg: 1,
        zona: "local",
      }),
    ).toThrow(RangeError);
  });

  it("propaga el RangeError de un peso inválido cuando hay que cobrar envío", () => {
    expect(() =>
      calcularTotalPedido({
        items: [{ precio: 1000, cantidad: 1 }],
        descuento: 0,
        pesoKg: 0,
        zona: "local",
      }),
    ).toThrow(RangeError);
  });
});
