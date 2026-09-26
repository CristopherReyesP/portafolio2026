// Add a post: create blog/posts/<slug>.html and add one entry here.
// Reading time in minutes = Math.ceil(words / 200). Keep newest posts first.
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
    "relatedCase": "case2-name"
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
    "relatedCase": null
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
    "relatedCase": "case1-name"
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
    "relatedCase": "case4-name"
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
    "relatedCase": null
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
    "relatedCase": null
  }
];
