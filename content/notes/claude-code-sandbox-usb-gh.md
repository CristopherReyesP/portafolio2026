---
title: "Claude Code: cuando el sandbox no te deja ver algo"
type: note
category: IA
categoryKey: [ia, herramientas]
tags:
  - Claude Code
  - Sandbox
  - macOS
status: published
created: 2026-09-26
updated: 2026-09-26
excerpt: "Si adb no ve el teléfono o gh auth login no conecta, el problema puede ser el sandbox y no la red ni el cable."
learning:
  - ai-engineering
related:
  - claude-code-backend
sources:
  - engram#3102
  - engram#2766
confidentiality: SAFE
---

## Problema

Desde el Bash de Claude Code:

- `adb devices` sale vacío, aunque el teléfono esté conectado y autorizado.
- `gh auth login` muestra el código de dispositivo pero después falla con `i/o timeout`, aunque `curl` sí llega a github.com.

Es fácil perder tiempo pensando que es el cable o la red. Es el sandbox: aísla los procesos del agente y algunas cosas no le llegan.

## Detectarlo

```bash
system_profiler SPUSBDataType | wc -l
```

Si devuelve `0` con dispositivos conectados, el sandbox no está viendo el USB.

## Solución

- **USB, serial, Bluetooth:** ejecuta tú el comando con el prefijo `!` en el prompt de Claude Code, o desde tu propia terminal.
- **`gh auth login`:** hazlo desde tu terminal, fuera de Claude Code. Después, `gh` funciona normal desde el agente.

> Regla práctica: si la red o un dispositivo "no existen" solo para el agente, prueba el mismo comando fuera del sandbox antes de diagnosticar más.
