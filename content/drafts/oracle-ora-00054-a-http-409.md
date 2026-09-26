---
title: "Oracle: convertir ORA-00054 en un HTTP 409"
type: note
category: Oracle
categoryKey: [oracle, nestjs]
tags:
  - Oracle
  - NestJS
  - Locks
status: draft
created: 2026-09-26
updated: 2026-09-26
excerpt: "Con FOR UPDATE NOWAIT, una fila ocupada falla en milisegundos. Traduce ese error a 409 Conflict en vez de dejar que salga como 500."
learning:
  - distributed-systems
related:
  - oracle-select-for-update-wait-nowait
  - timeout-no-significa-fallo
sources:
  - engram#2420
confidentiality: SAFE_AFTER_GENERALIZING
---

## Problema

Usas `FOR UPDATE NOWAIT` para no quedarte esperando un lock. Cuando la fila está ocupada, Oracle devuelve `ORA-00054`, y si nadie lo captura, el cliente recibe un `500 Internal Server Error`. Eso parece un fallo del servidor, cuando en realidad es "ocupado, intenta después".

## Solución

Captura el código y tradúcelo a `409 Conflict`:

```typescript
import { ConflictException } from '@nestjs/common';

try {
  await queryRunner.query(
    'SELECT id FROM estados WHERE id = :1 FOR UPDATE NOWAIT',
    [id],
  );
  // ... actualizar y hacer commit
} catch (error) {
  if (error?.errorNum === 54) {
    throw new ConflictException('El registro está siendo modificado. Intenta de nuevo.');
  }
  throw error;
}
```

En una prueba contra Oracle real, con la fila bloqueada, el error llegó en unos 80 ms. No hay espera.

## Cuándo usarlo

- APIs con un timeout corto, donde esperar un lock pone en riesgo el tiempo de respuesta.
- Orquestadores que ya saben reintentar o consultar el estado ante un 409.

> `NOWAIT` solo protege filas que ya existen. Dos inserciones simultáneas de una fila nueva no tienen nada que bloquear: ahí te protege una restricción `UNIQUE`.
