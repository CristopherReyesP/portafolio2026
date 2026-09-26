// Add a post: create blog/posts/<slug>.html and add one entry here.
// Reading time in minutes = Math.ceil(words / 200). Keep newest posts first.
// Optional `brain` teaches the blob (pet-brain.js) to answer questions about the post:
// { keys, es, en } or a list of them, one per topic. keys follow the pet-brain.js format
// (normalized, "a phrase" weighs 2, "stem*"); es/en are 2-4 sentences taken only from
// the article (en is a faithful translation, the post itself stays in Spanish).
window.BLOG_POSTS = [
  {
    "slug": "patron-saga-sistemas-pagos",
    "title": "Patrón Saga en sistemas de pagos: qué hacer cuando una transacción falla a mitad",
    "excerpt": "En sistemas distribuidos no podemos depender de una única transacción de base de datos. Saga permite coordinar operaciones y compensarlas cuando algo falla.",
    "category": "Arquitectura",
    "categoryKey": [
      "arquitectura"
    ],
    "tags": [
      "Saga",
      "Sistemas distribuidos",
      "Backend",
      "Transacciones",
      "Idempotencia"
    ],
    "date": "2026-09-25",
    "minutes": 3,
    "relatedCase": "case2-name",
    "brain": [
      {
        "keys": [
          "saga",
          "patron saga",
          "saga pattern",
          "compensacion*",
          "compensator*",
          "compensating",
          "compensation*",
          "reversa*",
          "rollback",
          "orquestador",
          "orchestrator",
          "reintent*",
          "retry",
          "retries",
          "transacciones distribuidas",
          "distributed transactions",
          "distributed transaction"
        ],
        "es": "Saga es un patrón para coordinar una operación de negocio compuesta por múltiples transacciones independientes: cada servicio ejecuta su propia operación. Si un paso falla, se ejecutan operaciones compensatorias, que no son un rollback tradicional sino nuevas operaciones de negocio que intentan revertir el efecto de otra ya confirmada. Por eso necesita estados explícitos, idempotencia y reintentos con un número máximo de intentos.",
        "en": "Saga is a pattern for coordinating a business operation made of multiple independent transactions: each service runs its own operation. If a step fails, compensating operations run; they are not a traditional rollback but new business operations that try to undo the effect of one already confirmed. That is why it needs explicit states, idempotency and retries with a maximum number of attempts."
      },
      {
        "keys": [
          "idempot*"
        ],
        "es": "Una operación idempotente permite ejecutar la misma solicitud varias veces sin producir efectos adicionales. Por ejemplo, un débito con operación=ABC123 no debería generarse dos veces si la petición llega dos veces: la segunda detecta que ABC123 ya fue procesada y devuelve el resultado correspondiente. Importa porque el cliente, el gateway o el orquestador pueden reintentar.",
        "en": "An idempotent operation lets the same request run several times without producing additional effects. For example, a debit with operation=ABC123 should not happen twice if the request arrives twice: the second one detects that ABC123 was already processed and returns the corresponding result. It matters because the client, the gateway or the orchestrator may retry."
      }
    ]
  },
  {
    "slug": "timeout-no-significa-fallo",
    "title": "Timeout no significa fallo: uno de los problemas más peligrosos en sistemas distribuidos",
    "excerpt": "Cuando una API responde con timeout es tentador asumir que la operación falló. En sistemas distribuidos, esa suposición puede producir inconsistencias.",
    "category": "Arquitectura",
    "categoryKey": [
      "arquitectura"
    ],
    "tags": [],
    "date": "2026-09-25",
    "minutes": 2,
    "relatedCase": null,
    "brain": {
      "keys": [
        "timeout*",
        "time out",
        "tiempo de espera",
        "pending",
        "pendiente",
        "incertidumbre",
        "uncertainty",
        "id de operacion",
        "operation id",
        "consultar estado",
        "status check"
      ],
      "es": "Un timeout no significa que la operación falló: significa «dejé de esperar la respuesta». El otro servicio pudo terminar correctamente segundos después, y si el cliente reintenta creyendo que falló puede duplicar un débito. Por eso conviene usar un identificador único de operación, consultar su estado (PENDING, SUCCESS o ERROR) y diseñar juntos los retries y la idempotencia.",
      "en": "A timeout does not mean the operation failed: it means \"I stopped waiting for the response\". The other service may finish successfully seconds later, and if the client retries thinking it failed, it can duplicate a debit. That is why it helps to use a unique operation ID, check its status (PENDING, SUCCESS or ERROR) and design retries and idempotency together."
    }
  },
  {
    "slug": "migrar-monolito-microservicios",
    "title": "Migrar un monolito a microservicios sin detener producción",
    "excerpt": "Una migración de arquitectura no necesita convertirse en una gran reescritura. Es posible evolucionar gradualmente un sistema mientras el negocio continúa operando.",
    "category": "Microservicios",
    "categoryKey": [
      "microservicios"
    ],
    "tags": [],
    "date": "2026-09-25",
    "minutes": 2,
    "relatedCase": "case1-name",
    "brain": {
      "keys": [
        "monolit*",
        "monolith*",
        "legacy",
        "reescri*",
        "rewrit*",
        "migrar",
        "migrate",
        "migrating",
        "migracion",
        "migration",
        "api gateway",
        "gateway",
        "microservicios",
        "microservices",
        "migrar por capacidad",
        "migracion gradual",
        "migracion progresiva",
        "gradual migration"
      ],
      "es": "En lugar de una gran reescritura, propone evolucionar gradualmente: el sistema nuevo y el legacy conviven, y un API Gateway oculta la transición a los consumidores. Se migra por capacidades (autenticación, consultas, transacciones, reportes), manteniendo contratos, formatos y códigos de error, con observabilidad de cada ruta. El legacy se retira solo cuando el nuevo flujo está validado y existen monitoreo y rollback.",
      "en": "Instead of a big rewrite, it proposes evolving gradually: the new system and the legacy one coexist, and an API Gateway hides the transition from consumers. You migrate by capability (authentication, queries, transactions, reports), keeping contracts, formats and error codes, with observability on every route. The legacy part is retired only once the new flow is validated and there is monitoring and rollback."
    }
  },
  {
    "slug": "oracle-jobs-automatizacion",
    "title": "Jobs de Oracle para automatizar procesos operativos",
    "excerpt": "Un proceso manual recurrente puede convertirse en una ejecución automática y dejar a las personas únicamente la revisión y validación del resultado.",
    "category": "Bases de datos",
    "categoryKey": [
      "bases-de-datos"
    ],
    "tags": [],
    "date": "2026-09-25",
    "minutes": 2,
    "relatedCase": "case4-name",
    "brain": {
      "keys": [
        "oracle",
        "jobs de oracle",
        "job de oracle",
        "oracle job",
        "oracle jobs",
        "automatiz*",
        "automat*",
        "procedimiento almacenado",
        "procedimientos almacenados",
        "stored procedure",
        "stored procedures",
        "proceso manual",
        "procesos manuales",
        "manual process",
        "manual processes",
        "tareas repetitivas"
      ],
      "es": "Sirven para que un proceso manual recurrente y determinista se ejecute solo: un Oracle Job lanza un procedimiento almacenado en el horario definido. Las personas dejan de ejecutar el proceso y pasan a revisar el resultado y detectar excepciones. Un buen job permite saber cuándo se ejecutó, si terminó bien, qué procesó y si es seguro repetirlo, y evita generar resultados duplicados.",
      "en": "They let a recurring, deterministic manual process run on its own: an Oracle Job runs a stored procedure on the defined schedule. People stop running the process and move to reviewing the result and spotting exceptions. A good job tells you when it ran, whether it finished correctly, what it processed and whether it is safe to repeat, and avoids producing duplicate results."
    }
  },
  {
    "slug": "claude-code-backend",
    "title": "Cómo estoy usando Claude Code en proyectos de desarrollo",
    "excerpt": "La IA para programación es mucho más útil cuando deja de ser un autocompletado y empieza a trabajar con contexto real del proyecto.",
    "category": "IA / Herramientas",
    "categoryKey": [
      "ia",
      "herramientas"
    ],
    "tags": [],
    "date": "2026-09-25",
    "minutes": 2,
    "relatedCase": null,
    "brain": {
      "keys": [
        "claude",
        "claude code",
        "ia para programar",
        "ia para programacion",
        "programar con ia",
        "ai for coding",
        "coding with ai",
        "ai coding",
        "asistente de codigo",
        "coding assistant"
      ],
      "es": "Lo usa sobre todo para trabajar sobre código existente con contexto real del proyecto: entender módulos, localizar comportamientos, hacer refactors, crear tests y revisar cambios. Prefiere instrucciones pequeñas por etapas, en una rama separada con commits pequeños y diff frecuente. Y sigue revisando arquitectura, seguridad y manejo de errores: la herramienta propone, pero la responsabilidad del código sigue siendo del desarrollador.",
      "en": "He mostly uses it to work on existing code with real project context: understanding modules, locating behavior, refactoring, writing tests and reviewing changes. He prefers small, step-by-step instructions, on a separate branch with small commits and frequent diffs. And he still reviews architecture, security and error handling: the tool proposes, but the code remains the developer's responsibility."
    }
  },
  {
    "slug": "agentes-ia-local",
    "title": "Agentes de IA locales: dónde tienen sentido realmente",
    "excerpt": "Ejecutar modelos localmente es atractivo por privacidad y control, pero no siempre es la solución más práctica. Estas son las situaciones donde empieza a tener sentido.",
    "category": "IA",
    "categoryKey": [
      "ia"
    ],
    "tags": [],
    "date": "2026-09-25",
    "minutes": 2,
    "relatedCase": null,
    "brain": {
      "keys": [
        "ia local",
        "ias locales",
        "local ai",
        "ia en local",
        "modelo local",
        "modelos locales",
        "local model",
        "local models",
        "agentes de ia",
        "agente de ia",
        "ai agent",
        "ai agents",
        "agentes locales",
        "local agents",
        "modelo hibrido",
        "modelos hibridos",
        "hybrid model",
        "hybrid models"
      ],
      "es": "Tiene sentido en repositorios privados, análisis de documentos internos, automatización repetitiva, procesamiento offline y tareas donde la privacidad importa. No usaría IA local solo porque «es local»: si una API externa da resultados mucho mejores, cuesta poco y los datos no son sensibles, probablemente sea más práctica. Un enfoque interesante es el híbrido: modelo local para tareas sencillas y modelo remoto para razonamiento complejo.",
      "en": "It makes sense for private repositories, analysis of internal documents, repetitive automation, offline processing and tasks where privacy matters. He would not use local AI just because \"it is local\": if an external API gives much better results, costs little and the data is not sensitive, it is probably more practical. An interesting approach is hybrid: a local model for simple tasks and a remote model for complex reasoning."
    }
  }
];
