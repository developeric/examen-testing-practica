import { describe, expect, it } from 'vitest';
import { calcularEnvio } from '../src/services/envios.ts';

describe('calcularEnvio', () => {
  it('cobra solo la tarifa base hasta 1 kg', () => {
    expect(calcularEnvio(1, 'local')).toBe(500);
  });

  it('suma $100 por cada kg adicional', () => {
    expect(calcularEnvio(3, 'regional')).toBe(1400);
  });

  it('redondea hacia arriba los kg adicionales', () => {
    expect(calcularEnvio(1.2, 'local')).toBe(600);
  });

  // EJERCICIO 3: reemplazá cada it.todo por una prueba real (ver tabla en el ENUNCIADO).
  it.todo('caso 1: un paquete de menos de 1 kg paga solo la tarifa base');
  it.todo('caso 2: peso máximo permitido en zona nacional');
  it.todo('caso 3: peso apenas por encima del máximo lanza RangeError');
  it.todo('caso 4: peso cero lanza RangeError');
  it.todo('caso 5: peso NaN lanza RangeError');
  it.todo('caso 6: zona desconocida lanza RangeError');
  it.todo('caso 7: peso que no es número lanza TypeError');
  it.todo('caso 8 (desafío): zona "constructor" lanza RangeError');
});
