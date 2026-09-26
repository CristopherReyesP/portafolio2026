# Cristopher Reyes — Backend Engineer

Personal portfolio of a backend engineer working on production banking systems (NestJS, .NET, Oracle, OpenShift, Keycloak). Open to remote roles, GMT-6.

**Live site:** https://cristopherreyesp.github.io/portafolio2026/

## Stack

Plain HTML, CSS and vanilla JavaScript — no framework, no dependencies.

- `index.html` — single-page layout and SEO metadata
- `css/components/` — one stylesheet per section, bundled into `css/bundle.css`
- `css/build.sh` — regenerates `css/bundle.css`; run it after editing any CSS file
- `js/components/` — interactive pieces (terminal, keyboard, pomodoro, animations)
- `js/i18n/` — Spanish / English translations
- `resume/` — downloadable CVs (ES/EN); `resume/build.sh` regenerates them from `resume/src/`
- `js/learning/focuses.js` — the (max 3) learning focuses shown on the home page; evidence links itself via `learning: [id]`
- `content/` — Markdown notes/articles and drafts; `node scripts/build-content.mjs` builds note pages, the blog search index, `sitemap.xml` and `blog/rss.xml` (see `content/README.md`)
- `.claude/skills/portfolio-knowledge/` — Claude Code skill that turns Engram memories into sanitized drafts (never publishes); local setup in `ENGRAM-TODO.md`

## Tests

```bash
node --test tests/pet-brain.test.mjs tests/content.test.mjs
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Contact

- Email: reyescristop@gmail.com
- LinkedIn: https://www.linkedin.com/in/cristopherrp
