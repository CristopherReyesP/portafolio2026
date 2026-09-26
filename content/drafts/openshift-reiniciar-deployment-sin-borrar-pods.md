---
title: "OpenShift: reiniciar un deployment sin borrar pods a mano"
type: note
category: OpenShift
categoryKey: [openshift, devops]
tags:
  - OpenShift
  - Kubernetes
  - oc
status: draft
created: 2026-09-26
updated: 2026-09-26
excerpt: "Un solo comando para que OpenShift levante pods nuevos y baje los viejos, sin hacer oc delete pod."
learning:
  - cloud-platform
sources:
  - oc 4.18 (oc rollout restart --help)
confidentiality: SAFE
---

## Problema

Necesitas que un servicio vuelva a arrancar (tomar un ConfigMap o un Secret nuevo, soltar conexiones colgadas) y la costumbre es borrar el pod con `oc delete pod`. Funciona, pero lo haces pod por pod y, si hay una sola réplica, el servicio queda caído hasta que arranca el nuevo.

## Solución

```bash
oc rollout restart deployment/<nombre> -n <namespace>
oc rollout status  deployment/<nombre> -n <namespace>   # ver el avance
```

`rollout restart` cambia una anotación del template del deployment. Eso dispara un rollout normal: se crean pods nuevos y los viejos se bajan cuando los nuevos están listos.

## Cuándo usarlo

- Después de cambiar un ConfigMap o un Secret que la app solo lee al arrancar.
- Para reiniciar todas las réplicas con la misma estrategia del deployment, sin tocarlas una por una.

> Si el deployment usa la estrategia `Recreate` en vez de `RollingUpdate`, primero se bajan todos los pods: ahí sí hay corte. Revísalo con `oc get deployment/<nombre> -o jsonpath='{.spec.strategy.type}'`.
