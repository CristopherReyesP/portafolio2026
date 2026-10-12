---
title: "Migrar un legacy ruta por ruta: canary por agente en un API Gateway"
type: article
category: Arquitectura
categoryKey: [arquitectura, microservicios, nestjs]
tags:
  - Canary release
  - Strangler Fig
  - API Gateway
  - NestJS
status: published
created: 2026-10-12
updated: 2026-10-12
excerpt: "Un catálogo de rutas en base de datos decide, agente por agente, si cada petición va al legacy o al servicio nuevo. Habilitar o revertir no requiere un nuevo despliegue."
learning:
  - distributed-systems
relatedProject: case1-name
related:
  - migrar-monolito-microservicios
sources:
  - engram#2976
  - engram#2992
  - engram#3089
  - engram#3199
  - engram#3381
confidentiality: SAFE_AFTER_GENERALIZING
---

## Problema

Los agentes bancarios operan sobre un sistema legacy: una API en .NET Framework que concentra casi todas las operaciones. Lo nuevo se construye como microservicios en NestJS o como integraciones en MuleSoft, pero el legacy no se puede apagar: los agentes atienden clientes todos los días.

Antes, cada ruta del gateway apuntaba a su destino con una variable de entorno. Cambiar el destino de una operación era cambiar esa variable y volver a desplegar, y el cambio movía a todos los agentes al mismo tiempo. Si el servicio nuevo fallaba, fallaba para todos.

Hacía falta poder decir: "esta operación, para estos agentes, va al servicio nuevo; para el resto, sigue en el legacy". Y poder deshacerlo sin esperar un despliegue.

## La idea: Strangler Fig con canary por agente

La solución combina dos patrones conocidos:

- **[Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html):** el sistema nuevo le va quitando comportamiento al legacy de a poco, detrás de una fachada que los consumidores no ven cambiar. Acá la fachada es el API Gateway.
- **[Canary release](https://martinfowler.com/bliki/CanaryRelease.html):** la versión nueva se expone primero a un subconjunto de usuarios y recién después al resto. Ese subconjunto no tiene que ser aleatorio: puede elegirse por perfil o por región.

En este caso, el subconjunto son agentes concretos. No hay porcentajes: se elige a quién habilitar.

```
Canal del agente
  |
  v
API Gateway (catálogo en memoria)
  ¿ruta conmutable?
  ¿tiene destino nuevo?
  ¿agente asignado?
    |-- sí a las tres -> servicio nuevo
    |                    (canary)
    '-- algún "no"    -> legacy
```

## El catálogo de rutas

Cada ruta vive en una tabla con:

- el método y la ruta, a nivel de endpoint;
- el destino legacy, como URL completa;
- el destino nuevo, como URL completa y opcional;
- un interruptor de conmutación, apagado por defecto.

Una segunda tabla guarda qué agentes están asignados a cada ruta. El agente se identifica con el id de su sucursal, que ya viaja en el cuerpo de cada petición.

El catálogo arrancó con 38 rutas y un catch-all: una red de seguridad que captura cualquier ruta no registrada y la manda al legacy.

Las URLs se guardan completas por una razón concreta. En una de las rutas, el destino nuevo no solo cambiaba de servidor: también cambiaba de endpoint. Conmutar no es mover el mismo path a otro host, es elegir entre dos URLs.

Todo esto se administra desde un panel. Al guardar un destino nuevo, el panel prende el interruptor de esa ruta; apagarlo es el kill switch.

## La regla de decisión

La regla cabe en una frase: **si la conmutación no está habilitada, el destino es legacy. Siempre.**

Simplificada, la decisión del gateway es esta:

```typescript
const branchId = extractBranchId(body); // null if missing or not a positive integer
const assigned = branchId !== null && route.branches.has(branchId);
const canary = route.switchable && assigned && Boolean(route.newDestination);

return canary ? route.newDestination : route.legacyDestination;
```

Tres condiciones, y cualquier "no" termina en el legacy:

- una ruta no conmutable va al legacy;
- un agente sin asignación va al legacy;
- una petición sin id de sucursal, o con un id inválido, va al legacy.

Durante el diseño apareció la idea de agregar un "destino predeterminado nuevo" para las rutas que ya mandaban todo a otro servicio. La descarté: era una segunda regla escondida dentro de la primera. Con una sola regla, cualquiera puede predecir a dónde va una petición sin leer código.

## Cambios sin redeploy

El gateway nunca consulta la base de datos para decidir una petición. Trabaja con una copia del catálogo en memoria y la mantiene al día por dos caminos:

- **Polling cada 60 segundos.** Primero consulta la versión del catálogo, y solo recarga si cambió. En estado estable, el costo es una consulta liviana por minuto por réplica.
- **Webhook desde el panel.** Al guardar un cambio, el panel avisa al gateway con un secreto compartido. El gateway responde `202` y refresca en segundo plano.

El aviso del panel también va en segundo plano y con un timeout corto: guardar nunca espera al gateway. Si el aviso falla, el polling lo cubre en menos de un minuto.

Las fallas se manejan para que el gateway siga enrutando:

- la primera carga es asíncrona y no bloquea el arranque;
- si un refresco falla, el gateway conserva la última copia buena y reintenta con backoff;
- si la configuración de la base está incompleta, el catálogo se apaga solo y el gateway sigue con sus reglas estáticas, en lugar de no arrancar.

## Tres modos para encenderlo con cuidado

El catálogo tiene tres modos:

- **off:** el catálogo no existe; enrutan las reglas estáticas de siempre. Ni siquiera se conecta a la base.
- **shadow:** enrutan las reglas estáticas, pero el gateway calcula qué habría decidido el catálogo y lo registra cuando difiere.
- **on:** decide el catálogo.

El modo `shadow` sirve para comparar el catálogo contra la realidad antes de confiarle tráfico:

```
Route catalog shadow mismatch - Static: <url actual> | Catalog: <url del catálogo> | Route: CANARY
```

El modo es una variable de entorno, así que cambiarlo requiere un despliegue. Es deliberado: el interruptor global casi no se toca. Los que se usan a diario son el de cada ruta y la asignación de cada agente.

## Logs que explican la decisión

Cada llamada registra qué decidió el catálogo y por qué:

```
Route: CANARY | Source: catalog | Code: DEPOSITO | Switchable: yes | Branch: 120 | Whitelisted: yes
```

La primera propuesta fue etiquetar los logs por proveedor. Pero el proveedor es un detalle de infraestructura. Durante un incidente, la pregunta es otra: ¿esta petición fue por el camino nuevo o por el legacy, y por qué? `Branch` y `Whitelisted` responden por qué una petición se quedó en el legacy sin abrir la base de datos.

## Revertir

Hay dos niveles de vuelta atrás, y ninguno requiere un despliegue:

- **Un agente:** se le quita la asignación.
- **Una ruta completa:** se apaga su interruptor.

El cambio aplica en el siguiente refresco: en segundos si llega el aviso del panel, y en menos de un minuto en todas las réplicas por el polling.

Solo el nivel global, volver al modo `off`, necesita un despliegue.

## Cerrar la migración

Cuando el destino nuevo ya está validado para todos, la ruta se cierra con "Finalizar migración". En una sola transacción, el destino nuevo pasa a ser el destino por defecto, el interruptor se apaga, las asignaciones se borran y todo queda registrado en la bitácora.

La URL anterior queda en el historial. Por eso el historial se construyó junto con el botón: es el camino de vuelta.

La acción abre su propia confirmación, separada del formulario de edición de todos los días, y solo aparece en las rutas donde tiene sentido.

## Estado

Está en producción. El catálogo cubre 38 rutas más el catch-all, y la migración avanza ruta por ruta: cada operación se habilita primero para algunos agentes y después para el resto.

## Trade-offs

- **Por agente, no por porcentaje.** Se elige a quién exponer, por ejemplo agentes piloto a los que se puede contactar. A cambio, la muestra no es estadística y alguien tiene que decidir a quién habilitar.
- **Sin promoción automática.** No hay un análisis de métricas que amplíe o revierta solo, como hacen Argo Rollouts o Flagger. La decisión es humana y se apoya en los logs.
- **Depende del id en el cuerpo.** Una operación que no lo trae va siempre al legacy. Es seguro, pero esa ruta no puede migrarse por agente.
- **Consistencia eventual.** Cada réplica refresca su copia por su cuenta. Durante la ventana de refresco, dos réplicas pueden decidir distinto para el mismo agente.

## Conclusión

Una migración progresiva no necesita una plataforma de despliegue sofisticada. Necesita una regla que cualquiera pueda predecir, un lugar donde cambiarla sin desplegar y logs que expliquen cada decisión.

La regla "sin asignación explícita, legacy" hace que el error por defecto sea el seguro: si algo falta o falla, la petición va por el camino que ya funcionaba.
