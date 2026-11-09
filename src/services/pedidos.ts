import type { Zona } from './envios.ts';

export interface ItemPedido {
  precio: number;
  cantidad: number;
}

export interface Pedido {
  items: ItemPedido[];
  /** Porcentaje de descuento sobre el subtotal (0 a 100). */
  descuento: number;
  pesoKg: number;
  zona: Zona;
}

export interface ResumenPedido {
  subtotal: number;
  totalConDescuento: number;
  envio: number;
  total: number;
}

/** Monto (con descuento aplicado) desde el cual el envío es gratis. */
export const UMBRAL_ENVIO_GRATIS = 50000;

/**
 * EJERCICIO 5: implementá esta función siguiendo las reglas del ENUNCIADO.
 * Las pruebas de tests/pedidos.test.ts ya están escritas: no las modifiques.
 */
export function calcularTotalPedido(_pedido: Pedido): ResumenPedido {
  throw new Error('No implementado');
}
