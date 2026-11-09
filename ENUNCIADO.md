# Examen práctico: pruebas automatizadas en Express + TypeScript

**Taller de Lenguajes de Programación IV · Unidad 4 · Simulacro de examen**

| | |
| --- | --- |
| **Duración** | 90 minutos |
| **Puntaje** | 100 puntos (+5 de bonus) |
| **Modalidad** | Práctica en computadora |
| **Material permitido** | Tu repo del laboratorio, tus apuntes y la documentación oficial de [Vitest](https://vitest.dev/guide/), [Supertest](https://github.com/ladjs/supertest) y [Node.js](https://nodejs.org/api/typescript.html). Para que sirva de simulacro, **no uses IA**. |

> Poné un cronómetro de 90 minutos y no pares hasta terminar. Si te trabás en un ejercicio, pasá al siguiente: los ejercicios 3, 4 y 5 son bastante independientes.

---

## Contexto

Recibís el código de una API de comercio electrónico con tres reglas de negocio:

- `src/services/precios.ts`: aplica descuentos (ya está correcto).
- `src/services/envios.ts`: calcula el costo de envío (**tiene defectos**).
- `src/services/pedidos.ts`: calcula el total de un pedido (**sin implementar**).

Rutas HTTP en `src/app.ts`:

| Método | Ruta | Cuerpo | Respuesta OK |
| --- | --- | --- | --- |
| `GET` | `/health` | – | `200 {"estado":"ok"}` |
| `POST` | `/api/precios/calcular` | `{precio, descuento}` | `200 {"total": n}` |
| `POST` | `/api/envios/calcular` | `{pesoKg, zona}` | `200 {"costo": n}` |

Ante un `RangeError` o `TypeError` del servicio, la ruta responde `400` con `{"error": "..."}`. Ante cualquier otro error, `500`.

### Regla de negocio del envío

- **Zonas y tarifa base** (hasta 1 kg): `local` = $500, `regional` = $1.200, `nacional` = $2.500.
- Se suman **$100 por cada kg adicional al primero**. Los kg se cuentan **redondeando hacia arriba** (1,2 kg se cobra como 2 kg).
- Peso válido: número **mayor que 0 y hasta 30 kg inclusive**.

### Reglas de validación del envío

| Situación | Error que debe lanzar |
| --- | --- |
| `pesoKg` no es de tipo `number` | `TypeError` |
| `pesoKg` es `NaN`, infinito, `<= 0` o `> 30` | `RangeError` |
| `zona` no es una de las tres válidas | `RangeError` |

### Reglas del total de un pedido

`calcularTotalPedido({ items, descuento, pesoKg, zona })` devuelve `{ subtotal, totalConDescuento, envio, total }`:

1. `items` vacío → `RangeError`.
2. Cada ítem debe tener `cantidad` entera mayor o igual a 1 y `precio` finito mayor o igual a 0; si no → `RangeError`.
3. `subtotal` = suma de `precio × cantidad`.
4. `totalConDescuento` = `calcularPrecioFinal(subtotal, descuento)` (reutilizá la función existente).
5. `envio` = `0` si `totalConDescuento >= 50000` (`UMBRAL_ENVIO_GRATIS`); en caso contrario, `calcularEnvio(pesoKg, zona)`.
6. `total` = `totalConDescuento + envio`.

---

## Preparación (no cuenta en el tiempo, 5 min máx.)

```bash
node --version   # 22.18+ o 24+
npm install
```

Respondés los puntos teóricos y registrás tus resultados en **`RESPUESTAS.md`**.

**Reglas generales**

- No modifiques `package.json`, `tsconfig.json` ni los tests que se indican como "no modificar".
- No borres ni comentes pruebas existentes para hacerlas pasar.
- Al final deben cumplirse `npm test` y `npm run typecheck` sin errores.

---

## Ejercicio 1: Diagnóstico (10 min · 10 pts)

1. Ejecutá `npm test` **sin modificar nada** y completá en `RESPUESTAS.md` la tabla con la cantidad de pruebas que pasan, fallan y quedan pendientes, por archivo. (2 pts)
2. Hay **dos clases distintas de falla**. Identificá en qué archivos ocurren y explicá, para cada una, **por qué** falla. Todavía no corrijas nada. (6 pts)
3. ¿Qué significa que una prueba figure como `todo` y por qué no cuenta como fallo? (2 pts)

## Ejercicio 2: Corregir `calcularEnvio` (15 min · 20 pts)

Modificá **solo** `src/services/envios.ts`:

1. Corregí el defecto de cálculo que revela la prueba fallida de `tests/envios.test.ts`. (6 pts)
2. Agregá todas las validaciones de la tabla "Reglas de validación del envío". (10 pts)
3. Conservá la fórmula para las entradas válidas, sin romper las pruebas que ya pasaban. (4 pts)

> Pistas: `Math.ceil`, `typeof`, `Number.isFinite`. Pensá qué pasa con `TARIFAS['constructor']`: el operador `in` y el acceso por corchetes también encuentran propiedades heredadas. Investigá `Object.hasOwn`.

## Ejercicio 3: Pruebas unitarias (15 min · 20 pts)

En `tests/envios.test.ts` reemplazá cada `it.todo` por una prueba real (2,5 pts cada una):

| Caso | `pesoKg` | `zona` | Resultado esperado |
| --- | --- | --- | --- |
| 1 | `0.5` | `'local'` | `500` |
| 2 | `30` | `'nacional'` | `5400` |
| 3 | `30.01` | `'local'` | lanza `RangeError` |
| 4 | `0` | `'regional'` | lanza `RangeError` |
| 5 | `NaN` | `'local'` | lanza `RangeError` |
| 6 | `5` | `'internacional'` | lanza `RangeError` |
| 7 | `'5'` (texto) | `'local'` | lanza `TypeError` |
| 8 (desafío) | `5` | `'constructor'` | lanza `RangeError` |

> Los casos 6, 7 y 8 pasan valores que el tipado ya prohíbe. Tenés que escribirlos **sin romper `npm run typecheck`** (ver Ejercicio 6).

## Ejercicio 4: Pruebas de integración con Supertest (15 min · 20 pts)

En `tests/api.test.ts` reemplazá cada `it.todo` por una prueba con `request(app)` (4 pts cada una):

- **a.** `POST /api/envios/calcular` con `{ pesoKg: 1.2, zona: 'local' }` → status `200` y cuerpo `{ costo: 600 }`.
- **b.** Con `pesoKg: 50` → status `400` y el cuerpo tiene la propiedad `error`.
- **c.** Con `zona: 'marte'` → status `400` y el cuerpo tiene la propiedad `error`.
- **d.** Con cuerpo vacío `{}` → status `400`.
- **e.** `GET /ruta-inexistente` → status `404`.

## Ejercicio 5: Desarrollo guiado por pruebas, TDD (15 min · 15 pts)

Las pruebas de `tests/pedidos.test.ts` **ya están escritas y no se modifican**. Implementá `calcularTotalPedido` en `src/services/pedidos.ts` según las reglas del pedido hasta que todas pasen.

Puntaje proporcional a la cantidad de pruebas en verde (9 pruebas). Reutilizá `calcularPrecioFinal` y `calcularEnvio`; no dupliques sus reglas.

## Ejercicio 6: Verificación de tipos (5 min · 5 pts)

1. Ejecutá `npm run typecheck` **al comenzar el examen** y copiá el error en `RESPUESTAS.md`. (1 pt)
2. Explicá por qué ese error aparece aunque `npm test` pase esa prueba. (2 pts)
3. Corregilo **sin borrar la prueba ni cambiar lo que verifica**. Al final de todo el examen, `npm run typecheck` debe terminar con cero errores, incluidas las pruebas que escribiste en los ejercicios 3 y 4. (2 pts)

## Ejercicio 7: Preguntas teóricas (10 min · 10 pts)

Respondé en `RESPUESTAS.md` (2 pts cada una, máximo 4 líneas por respuesta):

1. ¿Qué diferencia hay entre una prueba unitaria y una de integración? Ubicá `tests/envios.test.ts` y `tests/api.test.ts` en esa clasificación y explicá por qué `request(app)` no necesita abrir el puerto 3000.
2. ¿Por qué se escribe `expect(() => calcularEnvio(0, 'local')).toThrow(RangeError)` con una función flecha y no `expect(calcularEnvio(0, 'local')).toThrow(RangeError)`?
3. ¿Qué es un caso límite (valor frontera)? Dá dos ejemplos de este examen y explicá qué defecto podrían descubrir.
4. Después de corregir un defecto, ¿por qué se vuelven a ejecutar **todas** las pruebas y no solo la que falló? ¿Qué diferencia hay entre `npm test` y `npm run typecheck`?
5. En `src/app.ts` los errores `RangeError`/`TypeError` devuelven `400` y los demás `500`. ¿Por qué se distinguen? ¿Qué le pasaría al cliente si todo devolviera `500`?

## Bonus: Cobertura (5 min · +5 pts)

Ejecutá `npm run test:coverage`. **Objetivo: `src/services/envios.ts` y `src/services/pedidos.ts` con 100 % de líneas cubiertas** (columna `% Lines`). La columna `Uncovered Line #s` te dice qué líneas faltan. Como `tests/pedidos.test.ts` no se modifica, las pruebas que falten escribilas en un archivo nuevo (`tests/pedidos.cobertura.test.ts`).

Pegá en `RESPUESTAS.md` los porcentajes finales y explicá en una línea qué te dice (y qué **no** te dice) un 100 % de cobertura.

---

## Entrega

1. `npm test` en verde, `npm run typecheck` sin errores.
2. `RESPUESTAS.md` completo.
3. Comprimí la carpeta **sin `node_modules`** (ni `coverage`).

## Autoevaluación

| Ejercicio | Puntos | Tus puntos |
| --- | --- | --- |
| 1. Diagnóstico | 10 | |
| 2. Corregir `calcularEnvio` | 20 | |
| 3. Pruebas unitarias | 20 | |
| 4. Integración con Supertest | 20 | |
| 5. TDD de `calcularTotalPedido` | 15 | |
| 6. Verificación de tipos | 5 | |
| 7. Teoría | 10 | |
| **Total** | **100** | |
| Bonus: cobertura | +5 | |

Aprobación sugerida: 60 puntos. Cuando termines, compará con el `solucionario` (que se entrega por separado).
