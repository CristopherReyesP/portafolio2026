---
title: "Oracle: SELECT FOR UPDATE WAIT vs NOWAIT"
type: note
category: Oracle
categoryKey: [oracle, bases-de-datos]
tags:
  - Oracle
  - Concurrencia
  - Locks
status: published
created: 2026-09-26
updated: 2026-09-26
excerpt: "Cómo bloquear una fila como máximo unos segundos (o fallar al instante) cuando otra transacción ya la tiene bloqueada."
learning:
  - distributed-systems
related:
  - patron-saga-sistemas-pagos
  - timeout-no-significa-fallo
---

## Problema

Un proceso intenta modificar una fila que ya está bloqueada por otra transacción. Con un `SELECT ... FOR UPDATE` normal, la sesión espera indefinidamente hasta que la otra transacción haga `COMMIT` o `ROLLBACK`.

## Solución: esperar como máximo N segundos

```sql
SELECT ...
  FROM ...
 WHERE ...
   FOR UPDATE WAIT 4;
```

`WAIT 4` espera hasta cuatro segundos a que la fila se libere. Si sigue bloqueada, Oracle devuelve `ORA-30006`.

## Alternativa inmediata

```sql
SELECT ...
  FROM ...
 WHERE ...
   FOR UPDATE NOWAIT;
```

`NOWAIT` falla inmediatamente con `ORA-00054` si la fila está bloqueada.

## Cuándo usar cada uno

- **WAIT n:** cuando un bloqueo breve es aceptable y prefieres esperar un poco antes de fallar.
- **NOWAIT:** cuando la operación debe responder de inmediato (por ejemplo, una API con timeout corto) y es mejor devolver "ocupado" que quedarse esperando.

> El tiempo de espera del bloqueo debe ser menor que el timeout de quien llama. Si no, el cliente deja de esperar mientras la base de datos sigue esperando el lock.
