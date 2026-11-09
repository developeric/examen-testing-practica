import { describe, expect, it } from "vitest";
import { calcularEnvio } from "../src/services/envios.ts";

describe("calcularEnvio", () => {
  it("cobra solo la tarifa base hasta 1 kg", () => {
    expect(calcularEnvio(1, "local")).toBe(500);
  });

  it("suma $100 por cada kg adicional", () => {
    expect(calcularEnvio(3, "regional")).toBe(1400);
  });

  it("redondea hacia arriba los kg adicionales", () => {
    expect(calcularEnvio(1.2, "local")).toBe(600);
  });

  // EJERCICIO 3: reemplazá cada it.todo por una prueba real (ver tabla en el ENUNCIADO).
  it("caso 1: un paquete de menos de 1 kg paga solo la tarifa base", () => {
    expect(calcularEnvio(0.5, "local")).toBe(500);
  });
  it("caso 2: peso máximo permitido en zona nacional", () => {
    expect(calcularEnvio(30, "nacional")).toBe(5400);
  });
  it("caso 3: peso apenas por encima del máximo lanza RangeError", () => {
    expect(() => calcularEnvio(30.01, "local")).toThrow(RangeError);
  });
  it("caso 4: peso cero lanza RangeError", () => {
    expect(() => calcularEnvio(0, "regional")).toThrow(RangeError);
  });
  it("caso 5: peso NaN lanza RangeError", () => {
    expect(() => calcularEnvio(NaN, "local")).toThrow(RangeError);
  });
  it("caso 6: zona desconocida lanza RangeError", () => {
    expect(() => calcularEnvio(5, "internacional")).toThrow(RangeError);
  });
  it("caso 7: peso que no es número lanza TypeError", () => {
    expect(() => calcularEnvio("5", "local")).toThrow(TypeError);
  });
  it('caso 8 (desafío): zona "constructor" lanza RangeError', () => {
    expect(() => calcularEnvio(1, "contructor")).toThrow(RangeError);
  });
});
