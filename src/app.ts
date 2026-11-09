import express, { type Response } from 'express';
import { calcularEnvio } from './services/envios.ts';
import { calcularPrecioFinal } from './services/precios.ts';

export const app = express();
app.use(express.json());

function responderError(error: unknown, res: Response): void {
  if (error instanceof RangeError || error instanceof TypeError) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: 'Error interno' });
}

app.get('/health', (_req, res) => {
  res.json({ estado: 'ok' });
});

app.post('/api/precios/calcular', (req, res) => {
  const { precio, descuento } = req.body ?? {};
  try {
    const total = calcularPrecioFinal(precio, descuento);
    res.status(200).json({ total });
  } catch (error) {
    responderError(error, res);
  }
});

app.post('/api/envios/calcular', (req, res) => {
  const { pesoKg, zona } = req.body ?? {};
  try {
    const costo = calcularEnvio(pesoKg, zona);
    res.status(200).json({ costo });
  } catch (error) {
    responderError(error, res);
  }
});
