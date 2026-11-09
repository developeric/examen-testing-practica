export type Zona = 'local' | 'regional' | 'nacional';

/** Tarifa base (hasta 1 kg) según la zona de destino, en pesos. */
export const TARIFAS: Record<Zona, number> = {
  local: 500,
  regional: 1200,
  nacional: 2500,
};

export const PESO_MAXIMO_KG = 30;
export const COSTO_KG_ADICIONAL = 100;

/**
 * Calcula el costo de envío de un paquete.
 *
 * Regla: tarifa base de la zona + $100 por cada kg adicional al primero.
 * Los kg se cuentan redondeando hacia arriba (1,2 kg se cobra como 2 kg).
 */
export function calcularEnvio(pesoKg: number, zona: Zona): number {
  const base = TARIFAS[zona];
  const kgAdicionales = Math.floor(pesoKg) - 1;
  return base + kgAdicionales * COSTO_KG_ADICIONAL;
}
