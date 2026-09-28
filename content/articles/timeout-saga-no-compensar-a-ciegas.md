---
title: "Timeout en una Saga: por qué no compensar a ciegas"
type: article
category: Arquitectura
categoryKey: [arquitectura, nestjs]
tags:
  - Saga
  - Timeouts
  - Sistemas distribuidos
  - NestJS
status: published
created: 2026-09-28
updated: 2026-09-28
excerpt: "Si el crédito remoto da timeout y compensas de inmediato, puedes pagar dos veces. Antes de revertir, la Saga tiene que preguntar qué pasó realmente."
learning:
  - distributed-systems
relatedProject: case2-name
related:
  - timeout-no-significa-fallo
  - patron-saga-sistemas-pagos
  - idempotencia-transferencias-reintentos
confidentiality: SAFE
---

## Problema

Una transferencia ya debitó la cuenta de origen y le pide a otro banco que acredite la cuenta de destino. La llamada da timeout.

La reacción intuitiva es compensar: devolver el débito y marcar la transferencia como fallida.

Pero el timeout no dice que el crédito falló. Solo dice que no llegó la respuesta. Si el otro banco sí acreditó, compensar deja el dinero en dos lugares: en la cuenta de destino y de vuelta en la de origen. Acabamos de pagar dos veces.

En [Timeout no significa fallo](timeout-no-significa-fallo.html) expliqué la idea general. Acá la bajo a código.

## Contexto

Todo lo que sigue está implementado en [transfers-saga](https://github.com/CristopherReyesP/transfers-saga), un servicio NestJS de ejemplo que mueve dinero de una cuenta en Oracle a una cuenta de otro banco con una Saga orquestada: debitar localmente, acreditar en el otro banco y compensar si el crédito falla.

El banco destino del ejemplo es simulado. Ciertas cuentas de prueba provocan el timeout y después reportan un resultado fijo. No hay un deadline de red real: lo que importa es la decisión que viene después del timeout.

## Un rechazo no es un timeout

El primer paso es no mezclar dos errores distintos:

```typescript
} catch (error) {
  if (error instanceof CreditRejected) {
    return this.compensate(transfer, error.reason);
  }
  if (error instanceof CreditTimeout) return this.resolveTimeout(transfer);
  throw error;
}
```

Un rechazo es una respuesta: el otro banco dijo que no. Ahí compensar es correcto.

Un timeout es la ausencia de respuesta. Antes de hacer cualquier cosa, hay que averiguar qué pasó.

## Preguntar antes de actuar

Después del timeout, el servicio consulta el resultado real del crédito:

```typescript
private async resolveTimeout(transfer: Transfer): Promise<Transfer> {
  const status = await this.bank.getCreditStatus(transfer.id);
  if (status === 'CREDITED') return this.complete(transfer);
  if (status === 'REJECTED') {
    return this.compensate(transfer, 'Destination rejected the credit');
  }
  return transfer;
}
```

Hay tres respuestas posibles:

- **CREDITED:** el dinero llegó. La transferencia pasa a `COMPLETED`. Compensar acá habría sido pagar dos veces.
- **REJECTED:** el otro banco no acreditó. Ahora sí se compensa y la transferencia termina en `REVERSED`.
- **UNKNOWN:** el otro banco tampoco sabe, o no responde. La transferencia se queda en `DEBITED`: no se completa ni se compensa.

En los tres casos el cliente recibe un `201` con el estado real de la transferencia: `COMPLETED`, `REVERSED` o `DEBITED`.

## La referencia que hace posible la consulta

La consulta funciona porque el crédito y la pregunta usan la misma referencia: el id de la transferencia.

El puerto hacia el otro banco exige que los créditos sean idempotentes por referencia. El banco destino guarda el primer resultado de cada referencia, así que consultar el estado o repetir el crédito siempre habla de la misma operación, nunca de una nueva.

Sin esa referencia, después de un timeout no habría forma de preguntar "¿qué pasó con esto?".

## La compensación también puede fallar

Compensar no es un rollback. Es una operación de negocio nueva, y también puede fallar. Por eso se hace en dos transacciones:

```typescript
await this.uow.run(async ({ transfers }) => {
  transfer.startCompensation(reason);
  await transfers.save(transfer);
});
try {
  return await this.uow.run(async ({ accounts, transfers }) => {
    const account = await accounts.getForUpdate(transfer.sourceAccountId);
    account.credit(transfer.amount);
    transfer.markReversed();
    await accounts.save(account);
    await transfers.save(transfer);
    return transfer;
  });
} catch (error) {
  // The lock fails before any mutation, so the transfer still matches
  // the committed COMPENSATING state and can be retried later.
  if (error instanceof AccountLocked) return transfer;
  throw error;
}
```

Primero se confirma el estado `COMPENSATING` junto con el motivo. Después, en otra transacción, se bloquea la cuenta de origen, se devuelve el monto y la transferencia pasa a `REVERSED`.

Si la cuenta está bloqueada en ese momento, la devolución no ocurre y la transferencia queda en `COMPENSATING`, que ya está confirmado. Si el proceso se detiene entre las dos transacciones, pasa lo mismo: el estado guardado dice exactamente en qué punto quedó la operación.

## UNKNOWN tiene un costo

Quedarse en `DEBITED` no es gratis. La cuenta de origen ya fue debitada y nadie sabe todavía si el dinero llegó. Es dinero en tránsito.

Mientras tanto:

- `GET /transfers/:id` responde `200` con `status: DEBITED`;
- un reintento con la misma clave de idempotencia responde `409 TransferInProgress`.

Lo que cierra el ciclo es un reconciliador: un proceso en segundo plano que vuelve a consultar al otro banco y reintenta las devoluciones pendientes. En transfers-saga todavía no existe, y el README lo documenta como un límite conocido.

## Cómo se prueba

Los tres resultados tienen tests unitarios. Verifican el estado confirmado, el saldo final, que hubo un solo crédito y que la consulta de estado usó el id de la transferencia.

Otro test unitario cubre la devolución con la cuenta bloqueada: la transferencia queda en `COMPENSATING`.

El caso `CREDITED` después de un timeout se prueba además de punta a punta, contra un Oracle real en Testcontainers: la transferencia se completa con un solo débito.

## Trade-offs

La decisión de fondo es qué error preferir:

- **Compensar a ciegas** es simple, pero puede pagar dos veces. Recuperar ese dinero implica pedírselo a otro banco.
- **Consultar y esperar** evita el doble pago, pero deja dinero en tránsito cuando el resultado es `UNKNOWN`, y exige un proceso que lo resuelva.

El dinero en tránsito se resuelve consultando otra vez y reintentando. Un doble pago obliga a recuperar dinero que ya salió. Por eso la Saga prefiere esperar.

## Conclusión

Después de un timeout, la única acción segura es preguntar.

Compensar es una decisión que solo se toma cuando el otro lado confirmó que no acreditó. Mientras no lo sepamos, el estado correcto es "todavía no sé", y el sistema tiene que poder vivir con eso.

El código completo, con los tests, está en [transfers-saga](https://github.com/CristopherReyesP/transfers-saga).
