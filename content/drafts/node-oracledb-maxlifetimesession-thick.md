---
title: "node-oracledb: maxLifetimeSession no te salva de ORA-02399"
type: note
category: Oracle
categoryKey: [oracle, nestjs]
tags:
  - Oracle
  - node-oracledb
  - Connection pool
status: draft
created: 2026-09-26
updated: 2026-09-26
excerpt: "En Thick mode el pool no jubiló una sesión vencida. Contra CONNECT_TIME e IDLE_TIME, la defensa es reintentar en tu código."
learning:
  - distributed-systems
sources:
  - engram#2877
confidentiality: SAFE_AFTER_GENERALIZING
---

## Problema

El perfil de Oracle corta las sesiones con `CONNECT_TIME` (por ejemplo, 30 minutos) y la app empieza a fallar con `ORA-02399` o `ORA-01012`. La idea obvia es configurar el pool para que jubile las conexiones antes de ese límite:

```javascript
await oracledb.createPool({ /* ... */ maxLifetimeSession: 25 * 60 });
```

## Qué pasó en la prueba

Pool con `poolMin=1`, `poolMax=1`, `maxLifetimeSession=60`, en Thick mode (Instant Client 23.26):

1. Se pidió una conexión y se anotó su SID.
2. Se devolvió al pool y se esperaron 90 segundos, más que su vida máxima.
3. Se volvió a pedir: **llegó la misma sesión, con el mismo SID.**

La documentación dice que la vida de las conexiones se revisa al pedirlas o devolverlas, no con un proceso en segundo plano. En esta prueba ni siquiera eso ocurrió.

## Solución

- No confíes en la configuración del pool para respetar los límites del perfil.
- Reintenta en tu código cuando el error indique una sesión muerta (`ORA-02399`, `ORA-01012`, `NJS-500`), y solo si la operación es segura de repetir.
- Pruébalo con la misma versión de Instant Client que corre en producción.

> `poolPingInterval` tampoco ayuda: revisa la conexión al entregarla, pero no evita que se corte en medio de una operación.
