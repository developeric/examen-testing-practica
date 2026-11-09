import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.ts';

describe('API', () => {
  it('responde al chequeo de salud', async () => {
    const respuesta = await request(app).get('/health');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ estado: 'ok' });
  });

  it('calcula un precio mediante HTTP', async () => {
    const respuesta = await request(app)
      .post('/api/precios/calcular')
      .send({ precio: 1000, descuento: 10 });
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ total: 900 });
  });

  it('calcula un envío mediante HTTP', async () => {
    const respuesta = await request(app)
      .post('/api/envios/calcular')
      .send({ pesoKg: 3, zona: 'regional' });
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ costo: 1400 });
  });

  // EJERCICIO 4: reemplazá cada it.todo por una prueba de integración con Supertest.
  describe('POST /api/envios/calcular', () => {
    it.todo('a: 1,2 kg a zona local responde 200 con costo 600');
    it.todo('b: peso 50 responde 400 con un campo error');
    it.todo('c: zona "marte" responde 400 con un campo error');
    it.todo('d: cuerpo vacío {} responde 400');
  });

  it.todo('e: una ruta inexistente responde 404');
});
