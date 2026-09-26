# content/ — knowledge base (notas y artículos en Markdown)

```
content/
├── notes/      notas publicadas (type: note, status: published)
├── articles/   artículos publicados en Markdown (type: article)
├── drafts/     borradores; NUNCA se publican (Engram siempre empieza aquí)
│   └── _TEMPLATE.md
└── index.json  generado: todo el contenido (posts HTML + notas + drafts) con su status
```

Flujo: **Engram → draft → review → published**

1. Un borrador nace en `content/drafts/<slug>.md` con `status: draft` (manual o con el skill `portfolio-knowledge`).
2. Revisión humana: sanitizado, datos verificados, sin métricas inventadas.
3. Publicar: mover a `content/notes/` o `content/articles/`, poner `status: published`, actualizar `updated`.
4. `node scripts/build-content.mjs` → genera `blog/notes/<slug>.html` (o `blog/posts/<slug>.html`),
   `js/blog/notes.js`, `js/blog/search-index.js`, `content/index.json`, `sitemap.xml`, `blog/rss.xml`.

El build publica solo `status: published` fuera de `drafts/`. Un archivo con otro status no genera página.

## Metadata (frontmatter)

| Campo | Obligatorio | Notas |
|-------|-------------|-------|
| `title` | sí | |
| `slug` | no | por defecto, el nombre del archivo |
| `type` | sí | `note` \| `article` |
| `category` | sí | etiqueta visible (`Oracle`) |
| `categoryKey` | no | filtros del blog: `arquitectura, microservicios, oracle, bases-de-datos, nestjs, openshift, keycloak, devops, ia, herramientas` |
| `tags` | no | lista |
| `status` | sí | `draft` \| `review` \| `published` |
| `created` / `updated` | sí / no | `YYYY-MM-DD`; `updated` = última revisión |
| `excerpt` | no | si falta, se toma del contenido |
| `learning` | no | ids de `js/learning/focuses.js` |
| `relatedProject` | no | id de un caso del home (`case2-name`) |
| `related` | no | slugs de posts/notas publicados |
| `sources`, `confidentiality` | no | privados (Engram ids); nunca se renderizan |

Tiempo de lectura: calculado (palabras / 200).

Markdown soportado: `##`/`###`, párrafos, listas `-`/`1.`, bloques ```` ``` ````, `> nota`, `**negrita**`, `` `código` ``, `[links](url)`.

Artículos largos con diagramas siguen como HTML en `blog/posts/` + entrada en `js/blog/posts.js`
(con `type`, `updated`, `learning`, `relatedCase`). Después de editarlos, correr el build (índice de búsqueda).
