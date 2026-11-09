import { calcularEnvio, type Zona } from "./envios.ts";
import { calcularPrecioFinal } from "./precios.ts";

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
export function calcularTotalPedido(pedido: Pedido): ResumenPedido {
  //1
  if (pedido.items.length === 0) {
    throw new RangeError("Tiene que haber minimo 1 item");
  }
  let subtotal = 0;
  //2
  for (const item of pedido.items) {
    if (
      //tiene que ser entero la cantidad
      !Number.isInteger(item.cantidad) ||
      //tiene que ser mayor a 1
      item.cantidad < 1 ||
      //el precio tiene que ser finito
      !Number.isFinite(item.precio) ||
      //tiene que ser mayor a 0
      item.precio <= 0
    ) {
      throw new RangeError();
    }
    //3
    subtotal += item.precio * item.cantidad;
  }
  //4
  const totalConDescuento = calcularPrecioFinal(subtotal, pedido.descuento);
  //5
  let envio;
  if (totalConDescuento >= 50000) {
    envio = 0;
  } else {
    envio = calcularEnvio(pedido.pesoKg, pedido.zona);
  }
  let total = totalConDescuento + envio;
  return { subtotal, totalConDescuento, envio, total };
}

// calcularTotalPedido({items:[{precio:15,cantidad:5}],descuento:30,pesoKg:20,zona:"local"})
