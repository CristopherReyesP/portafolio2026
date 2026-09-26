// Learning focuses shown on the home page (js/components/learning.js). Keep at most 3.
// Evidence is not listed here: posts (js/blog/posts.js) and notes (content/ → js/blog/notes.js)
// link themselves to a focus with `learning: [id]`. `projects` are ids of case titles on
// the home page (translation key = id with "_" instead of "-").
// status: reinforcing | active | exploring (labels in translations.js: learning_status_*).
window.LEARNING_FOCUSES = [
  {
    "id": "distributed-systems",
    "title": { "es": "Sistemas distribuidos", "en": "Distributed systems" },
    "status": ["reinforcing"],
    "topics": {
      "es": ["Saga", "Idempotencia", "Retries", "Timeouts", "Consistencia distribuida", "Mensajería", "Compensaciones"],
      "en": ["Saga", "Idempotency", "Retries", "Timeouts", "Distributed consistency", "Messaging", "Compensations"]
    },
    "projects": ["case2-name"]
  },
  {
    "id": "cloud-platform",
    "title": { "es": "Cloud & Platform", "en": "Cloud & Platform" },
    "status": ["active", "reinforcing"],
    "topics": {
      "es": ["AWS", "Kubernetes", "OpenShift", "CI/CD", "Observabilidad"],
      "en": ["AWS", "Kubernetes", "OpenShift", "CI/CD", "Observability"]
    },
    "projects": ["case5-name", "case1-name"]
  },
  {
    "id": "ai-engineering",
    "title": { "es": "AI Engineering", "en": "AI Engineering" },
    "status": ["exploring"],
    "topics": {
      "es": ["Claude Code", "Coding agents", "Engram", "LLMs locales", "Tool calling", "Agent workflows"],
      "en": ["Claude Code", "Coding agents", "Engram", "Local LLMs", "Tool calling", "Agent workflows"]
    },
    "projects": []
  }
];
