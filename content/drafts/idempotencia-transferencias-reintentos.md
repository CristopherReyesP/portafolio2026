---
title: "Idempotencia en transferencias: cómo un reintento no debita dos veces"
type: article
category: Arquitectura
categoryKey: [arquitectura, nestjs, oracle]
tags:
  - Idempotencia
  - Sistemas distribuidos
  - NestJS
  - Oracle
status: draft
created: 2026-09-27
updated: 2026-09-27
excerpt: "Un cliente que no recibe respuesta va a reintentar. Guardar la clave de idempotencia en la misma transacción que el débito, con una restricción UNIQUE, hace que ese reintento nunca cobre dos veces."
learning:
  - distributed-systems
relatedProject: case2-name
related:
  - patron-saga-sistemas-pagos
  - timeout-no-significa-fallo
  - oracle-ora-00054-a-http-409
confidentiality: SAFE
---

## Problema

Un cliente envía una transferencia y la conexión se corta antes de que llegue la respuesta. No sabe si el débito se hizo, así que hace lo razonable: reintenta.

Si el servidor trata ese reintento como una solicitud nueva, la cuenta se debita dos veces. En un sistema de pagos, ese es el peor resultado posible.

La solución conocida es una clave de idempotencia: el cliente genera una clave por operación y la manda en cada intento. El servidor la usa para reconocer que ya vio esa operación.

La idea es simple. Lo difícil está en los detalles: dónde se guarda la clave, qué se responde en cada caso y qué pasa cuando dos intentos llegan al mismo tiempo.

## Contexto

Todo lo que sigue está implementado en [transfers-saga](https://github.com/CristopherReyesP/transfers-saga), un servicio NestJS de ejemplo que mueve dinero de una cuenta en Oracle a una cuenta de otro banco.

`POST /transfers` exige el header `Idempotency-Key`: de 1 a 255 caracteres ASCII visibles. Sin la clave, o con una clave inválida, la respuesta es `400 InvalidIdempotencyKey` y no se guarda nada.

## La clave vive en la transferencia

La primera decisión fue no crear un almacén aparte para las claves, ni otra tabla ni una caché. La clave es una columna de la propia transferencia:

```sql
idempotency_key VARCHAR2(255 CHAR) NOT NULL,
CONSTRAINT transfers_idempotency_key_uk UNIQUE (idempotency_key)
```

La transferencia se inserta en la misma transacción local que el débito. Así, la clave, el débito y la transferencia se confirman o se revierten juntos.

Con un almacén separado habría que mantenerlo consistente con el débito: ¿qué pasa si se guarda la clave pero el débito falla, o al revés? Al ponerla en la misma fila, ese problema desaparece.

## Qué se responde en un reintento

Antes de debitar, el servicio busca una transferencia con esa clave. Si existe, decide sin tocar la cuenta:

```typescript
if (
  transfer.sourceAccountId !== command.sourceAccountId ||
  transfer.destinationAccount !== command.destinationAccount ||
  transfer.amount.minorUnits !== command.amount.minorUnits ||
  transfer.amount.currency !== command.amount.currency
) {
  throw new IdempotencyKeyReused(command.idempotencyKey);
}
if (!transfer.isTerminal()) {
  throw new TransferInProgress(command.idempotencyKey);
}
return transfer;
```

Son tres casos:

- **Misma clave, datos distintos:** `422 IdempotencyKeyReused`. Una clave identifica una sola operación; reutilizarla con otro monto o con otra cuenta es un error del cliente.
- **Misma clave, operación todavía en curso** (`DEBITED` o `COMPENSATING`): `409 TransferInProgress`. Todavía no hay un resultado final para devolver.
- **Misma clave, operación terminada** (`COMPLETED`, `REVERSED` o `FAILED`): `201` con la transferencia guardada. No se debita nada otra vez.

Un detalle que vale la pena notar: `FAILED` también es un estado final. Si el primer intento falló por fondos insuficientes, reintentar con la misma clave devuelve ese mismo `FAILED`, aunque la cuenta ya tenga saldo. Para un intento nuevo hace falta una clave nueva.

## Dos intentos al mismo tiempo

La búsqueda previa no alcanza. Dos solicitudes con la misma clave pueden llegar juntas, buscar al mismo tiempo, no encontrar nada y avanzar las dos hacia el débito.

Ahí entran dos protecciones de la base de datos:

1. La cuenta de origen se bloquea con `SELECT ... FOR UPDATE NOWAIT`. Si el otro intento todavía tiene la fila, la respuesta es `409 AccountLocked` con `Retry-After`.
2. Si el perdedor llega a debitar después de que el ganador confirmó, su `INSERT` choca con la restricción `UNIQUE` (`ORA-00001`). La transacción completa se revierte, débito incluido.

El adaptador de Oracle solo trata ese error como una carrera de idempotencia si la restricción violada es justamente la de la clave. Otra restricción `UNIQUE` no se confunde con un reintento:

```typescript
if (
  error.errorNum === ORA_UNIQUE_CONSTRAINT &&
  error.message.includes(IDEMPOTENCY_KEY_CONSTRAINT)
) {
  throw new DuplicateIdempotencyKey(subject);
}
```

El caso de uso traduce ese error a `409 TransferInProgress`. El resultado: de dos intentos simultáneos, exactamente uno debita.

> La búsqueda previa es una optimización para responder rápido. La garantía real es la restricción `UNIQUE` dentro de la misma transacción que el débito.

## Cómo se prueba

Estas reglas tienen tests, y los end-to-end corren contra un Oracle real en Testcontainers, no contra dobles en memoria:

- un test end-to-end que repite la misma clave y el mismo payload, y verifica que la respuesta es idéntica y que hubo un solo débito;
- un test end-to-end que manda dos solicitudes concurrentes con la misma clave y verifica que la cuenta se debita una sola vez;
- un test unitario que simula que otro `INSERT` gana la carrera y verifica que el débito propio se revierte.

## Trade-offs

Guardar la clave en la transferencia tiene costos, y conviene decirlos:

- **Las claves no expiran.** Cada clave queda atada a su transferencia para siempre. Muchas APIs de pago las expiran después de un tiempo; acá no.
- **La respuesta se reconstruye, no se cachea.** Un reintento arma la respuesta a partir de la transferencia guardada. Si el formato de la respuesta cambiara entre versiones, un reintento podría verse distinto que la respuesta original.
- **Sin reconciliador, `409` puede durar.** Una transferencia que quedó en `DEBITED` porque el otro banco no confirmó el resultado responde `409` hasta que un proceso la resuelva, y ese proceso todavía no existe.

A cambio, no hay infraestructura extra y la consistencia entre la clave y el débito la da la base de datos, no el código.

## Conclusión

La idempotencia no es un header. Es una decisión sobre dónde vive la clave y en qué transacción se escribe.

Si la clave se guarda en la misma transacción que el efecto que protege, y una restricción `UNIQUE` resuelve las carreras, un reintento deja de ser un riesgo y se vuelve una consulta.

El código completo, con los tests, está en [transfers-saga](https://github.com/CristopherReyesP/transfers-saga).
