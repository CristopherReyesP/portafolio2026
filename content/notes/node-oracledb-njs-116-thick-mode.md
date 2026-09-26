---
title: "node-oracledb: NJS-116 y el verificador de contraseña 0x939"
type: note
category: Oracle
categoryKey: [oracle, nestjs]
tags:
  - Oracle
  - Node.js
  - node-oracledb
status: published
created: 2026-09-26
updated: 2026-09-26
excerpt: "Si Thin mode no puede autenticar por el verificador de contraseña, cambia a Thick mode con Instant Client."
sources:
  - engram#2630
  - engram#2437
  - node-oracledb docs (Appendix A, Password Verifier Support)
confidentiality: SAFE_AFTER_GENERALIZING
---

## Problema

La conexión falla al autenticar con:

```text
NJS-116: password verifier type 0x939 is not supported by node-oracledb in Thin mode
```

El usuario de base de datos solo tiene un verificador de contraseña 10G. El modo Thin (el predeterminado, sin librerías de Oracle) solo soporta verificadores 11G o posteriores.

## Solución

Instala Oracle Instant Client y activa Thick mode **antes** de crear cualquier pool o conexión:

```javascript
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_23_26' });
```

En macOS hay que pasar `libDir` de forma explícita.

## Alternativa

Pedir al DBA que regenere la contraseña del usuario con un verificador 11G o 12C. Así sigues en Thin mode, sin librerías nativas en la imagen.

## Cuándo usarlo

- Bases antiguas o usuarios creados hace años que nunca cambiaron de verificador.
- Si producción ya corre en Thick mode, conviene probar en local también en Thick: los dos modos no se comportan igual.
