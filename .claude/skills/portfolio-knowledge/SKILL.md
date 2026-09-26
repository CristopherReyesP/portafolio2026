---
name: portfolio-knowledge
description: Turns useful Engram memories from real software engineering work into sanitized candidates for portfolio notes, articles, learning evidence and case studies. Use when the user asks to find portfolio/blog content in Engram ("busca en Engram notas para mi portafolio", "qué aprendí esta semana que pueda ser una nota", "ideas para artículos sobre Oracle", "revisar Engram para contenido"), or to capture something for the blog ("guarda esto para el blog", "esto puede ser una nota", "crea una nota con lo que resolvimos hoy").
---

# portfolio-knowledge

Complements Engram's official memory protocol. It **does not replace or change it**:
keep saving decisions, bugs, discoveries, conventions, configs and `mem_session_summary`
exactly as the Engram protocol says. This skill only *reads* those memories and adds
publication-oriented observations on top.

Pipeline: **Engram → draft → review → published**. This skill only ever reaches `draft`.

## Rules

- Search before drafting.
- Retrieve full observations (`mem_get_observation`) before writing anything from them; search results are truncated.
- Never publish automatically. Everything generated goes to `content/drafts/` with `status: draft`. Only the user moves a file to `content/notes/` or `content/articles/` and sets `status: published`.
- Never expose private company information (see Sanitization). If in doubt, leave it out.
- Prefer real experiences over generic tutorials.
- Do not invent metrics. Do not invent technical details. If the memory does not say it, the draft does not say it; mark gaps as `TODO(user): ...`.
- Generalize sensitive examples (real system → "un core bancario", real table → `transacciones`).
- Link notes to learning focuses when relevant (`learning:` ids from `js/learning/focuses.js`).
- Link articles to projects when relevant (`relatedProject:` case ids from `index.html`, e.g. `case2-name`).
- Prefer fewer high-quality notes. Maximum 5 proposals per review.
- Do not interrupt the user mid-task to propose content. Save a candidate quietly (see Session close) and mention it only when asked or at the end of the session.

## Engram tools used

| Tool | Use |
|------|-----|
| `mem_context` | Recent context first |
| `mem_search` | Several thematic searches (never a single generic one) |
| `mem_get_observation` | Full content of each promising hit |
| `engram timeline <id>` (CLI, via Bash) | Surrounding context of a hit when the observation alone is ambiguous; `mem_timeline` is not exposed by the `--tools=agent` MCP profile |
| `mem_suggest_topic_key` | Check the key before creating a new `portfolio-*` topic |
| `mem_save` (with `topic_key`) | Capture / upsert a publication candidate |
| `mem_update` | Refine an existing candidate by id |

If a tool name or parameter differs in the installed Engram version, follow the installed
Engram protocol and adapt; do not guess parameters.

## Classification

| Class | When |
|-------|------|
| `NOTE` | command, one-off solution, configuration, troubleshooting, snippet, gotcha, specific error |
| `ARTICLE` | complex problem, architecture decision, several trade-offs, pattern, generalizable lesson |
| `CASE_STUDY` | real project, impact, architecture, enterprise solution (goes to the home "Proyectos" section, not the blog) |
| `LEARNING` | technology studied, concept reinforced, experiment, research (evidence for a learning focus) |

In the repo: `NOTE` → `type: note`, `ARTICLE` → `type: article`. `CASE_STUDY` and `LEARNING`
produce a proposal only (no file) unless the user asks for one.

## Topic keys

One stable key per subject, lowercase kebab-case, no company names:

- `portfolio-note/<topic>` — e.g. `portfolio-note/oracle-locks`, `portfolio-note/curl-timing`
- `portfolio-article/<topic>` — e.g. `portfolio-article/saga`
- `portfolio-learning/<topic>` — e.g. `portfolio-learning/aws`
- `portfolio-case/<topic>` — e.g. `portfolio-case/agents-modernization`

Always save `portfolio-*` candidates with `scope: personal`. Engram upserts a `topic_key`
only within the same project + scope, so a mixed scope creates duplicates.

Before creating one: `mem_search` for `portfolio-<class>/<topic>` with `all_projects: true`
and check `content/index.json` (every draft/published slug lives there). If it exists,
**update it**: `mem_save` with the same `topic_key` and `scope: personal` upserts when the
project matches; if the existing candidate lives in another project, use `mem_update` by id.
Never create duplicates.

## Action 1 — Find content ("busca en Engram notas para mi portafolio", "ideas sobre Oracle", "qué aprendí esta semana")

1. `mem_context` for recent context.
2. `mem_search` with specific queries. Use the user's theme if given; otherwise run several of:
   - `Oracle locks timeout concurrency`
   - `Keycloak session authentication`
   - `NestJS API Gateway proxy timeout`
   - `Saga compensation idempotency`
   - `OpenShift logs deployment`
   - `Kubernetes CI/CD pipeline`
   - `MuleSoft RabbitMQ messaging`
   - `observability logs tracing`
   - `.NET` / `JWT troubleshooting`
   - `Claude Code workflow agent`, `local AI LLM tool calling`
   - `portfolio-` (existing candidates)
   For "this week", prefer recent results and session summaries.
3. `mem_get_observation` for every promising hit (full content).
4. Skip hits already covered in `content/index.json` (same subject), unless there is new information → propose an update instead.
5. Classify, sanitize, rank (see Review) and return **at most 5** proposals in the Proposal format.
6. Stop. Write files only for proposals the user approves (Action 3).

## Action 2 — Periodic review ("revisar Engram para contenido")

Same as Action 1, but always cover: recent observations, resolved bugs, decisions,
discoveries, and session summaries. Return **max 5** proposals ordered by:

1. usefulness (someone would search for this)
2. generalization (useful outside the original company)
3. technical depth
4. absence of sensitive information (UNSAFE items are dropped, not listed)

## Action 3 — Draft ("crea una nota con lo que resolvimos hoy", or an approved proposal)

1. Gather sources (current conversation and/or Engram observations, full content).
2. Sanitize.
3. Copy `content/drafts/_TEMPLATE.md` to `content/drafts/<slug>.md` and fill it:
   - `status: draft` (always), `created`/`updated` = today, `sources:` = Engram ids (private, never rendered), `confidentiality:`.
   - Notes: Problema → Solución → (Alternativa) → Cuándo usarlo → Relacionado. Short and reusable.
   - Articles: Problema → Contexto → Razonamiento → Solución → Trade-offs → Conclusiones.
   - Content in Spanish (the blog is in Spanish).
4. Run `node scripts/build-content.mjs` only to validate frontmatter (drafts are never published by it).
5. Show the user the proposal + the path of the draft. Do not commit or push unless asked.

## Action 4 — Capture ("guarda esto para el blog", "esto puede ser una nota")

1. If the underlying knowledge is not yet in Engram, save it the normal Engram way first
   (`mem_save` with the proper type: bugfix, decision, discovery, config, pattern...).
2. Choose the topic key (`portfolio-<class>/<topic>`), check it does not exist, and
   `mem_save` a publication-oriented observation with that `topic_key`:
   - title: proposed public title
   - content: the Proposal block below (already sanitized) + the ids of the source observations
3. If the topic key exists, update it instead of creating a new one.
4. Reply in one or two lines (key saved/updated). Offer a draft only if the user wants it now.

## Session close

Do **not** modify `mem_session_summary` or the Engram close protocol. After technically
interesting work (non-obvious fix, reusable command, decision with trade-offs), you may
additionally save one quiet candidate with Action 4 (step 2–3). No interruptions; at most
one mention at the end: "Guardé 1 candidato para el blog: <title>".

## Sanitization (mandatory before any proposal or draft)

Remove or generalize:

- IPs, hostnames, internal URLs, ports of internal services, server/cluster/namespace names
- usernames, emails, people's names (other than the user's), personal data
- tokens, secrets, API keys, passwords, certificates, connection strings, credentials
- company, client, bank, vendor-contract and product-internal names
- account numbers, amounts, financial data, customer data
- internal identifiers (ticket ids, table/schema names specific to the company, job names)
- sensitive infrastructure details (topology, versions tied to vulnerabilities, security controls)

If in doubt, do not include it: generalize the concept. Confidentiality levels:

- `SAFE` — nothing sensitive
- `SAFE_AFTER_GENERALIZING` — safe once the listed replacements are applied
- `UNSAFE` — cannot be made public without losing the point; do not propose, do not draft

## Proposal format

```
Título:            SELECT FOR UPDATE WAIT vs NOWAIT
Tipo:              NOTE | ARTICLE | CASE_STUDY | LEARNING
Categoría:         Oracle
Tags:              Oracle, Concurrency, Locks
Learning focus:    distributed-systems (optional)
Proyecto:          case2-name (optional)
Por qué vale:      Problema real y reutilizable.
Fuente:            Engram observations #123 #145
Confidencialidad:  SAFE después de generalizar nombres (list what was generalized)
Topic key:         portfolio-note/oracle-locks
Borrador:          3-10 lines (notes) or outline (articles)
```

## Repo reference

- `content/drafts/` — drafts (never published). `_TEMPLATE.md` has every frontmatter field.
- `content/notes/`, `content/articles/` — published Markdown (user moves files here).
- `content/index.json` — generated list of all posts/notes/drafts (dedupe here).
- `js/learning/focuses.js` — learning focus ids.
- `js/blog/posts.js` — hand-written HTML articles.
- `node scripts/build-content.mjs` — builds pages, search index, sitemap and RSS.
