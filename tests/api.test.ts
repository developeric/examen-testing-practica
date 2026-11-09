import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.ts";

describe("API", () => {
  it("responde al chequeo de salud", async () => {
    const respuesta = await request(app).get("/health");
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ estado: "ok" });
  });

  it("calcula un precio mediante HTTP", async () => {
    const respuesta = await request(app)
      .post("/api/precios/calcular")
      .send({ precio: 1000, descuento: 10 });
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ total: 900 });
  });

  it("calcula un envío mediante HTTP", async () => {
    const respuesta = await request(app)
      .post("/api/envios/calcular")
      .send({ pesoKg: 3, zona: "regional" });
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ costo: 1400 });
  });

  // EJERCICIO 4: reemplazá cada it.todo por una prueba de integración con Supertest.
  describe("POST /api/envios/calcular", () => {
    //
    it("a: 1,2 kg a zona local responde 200 con costo 600", async () => {
      const respuesta = await request(app)
        .post("/api/envios/calcular")
        .send({ pesoKg: 1.2, zona: "local" });
      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toEqual({ costo: 600 });
    });
    //
    it("b: peso 50 responde 400 con un campo error", async () => {
      const respuesta = await request(app).post("/api/envios/calcular").send({
        pesoKg: 50,
        zona: "local",
      });
      expect(respuesta.status).toBe(400);
      expect(respuesta.body).toHaveProperty("error");
    });
    //
    it('c: zona "marte" responde 400 con un campo error', async () => {
      const respuesta = await request(app).post("/api/envios/calcular").send({
        pesoKg: 50,
        zona: "marte",
      });
      expect(respuesta.status).toBe(400);
      expect(respuesta.body).toHaveProperty("error");
    });
    //
    it("d: cuerpo vacío {} responde 400", async () => {
      const respuesta = await request(app)
        .post("/api/envios/calcular")
        .send({});
      expect(respuesta.status).toBe(400);
      expect(respuesta.body).toHaveProperty("error");
    });
  });

  //
});

it("e: una ruta inexistente responde 404", async () => {
  const repuesta = await request(app).get("/ruta-asdasdasd");
  expect(repuesta.status).toBe(404);
});
