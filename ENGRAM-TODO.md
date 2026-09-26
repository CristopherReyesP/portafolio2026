# TODO local — Engram → Portfolio knowledge workflow

La parte web y el skill ya están en el repo. Esto **solo se puede hacer en tu máquina**
(Engram corre local; la sesión cloud no tiene acceso a tu memoria).

## 1. Verificar la instalación actual (no inventar rutas)

- [x] `engram version` y `engram doctor` (o la tool `mem_doctor`) → Engram funcionando.
      2026-09-26: engram 2.2.1; guardado y búsqueda locales funcionan. `engram doctor` reporta
      `blocked` solo por la sincronización en la nube (`sync_mutation_required_fields`, 43 mutaciones sin `title`).
- [x] Ver dónde están tus skills actuales:
      `ls ~/.claude/skills/ ~/.claude/plugins/ 2>/dev/null` y `cat ~/.claude/CLAUDE.md | grep -i engram`.
      2026-09-26: `portfolio-knowledge` solo existe en `.claude/skills/` de este repo (opción A; sin enlace global).
- [x] Confirmar que Engram/Gentle AI **no** usa ya un skill llamado `portfolio-knowledge`.
- [x] Confirmar nombres de tools en tu versión: en Claude Code, `/mcp` → engram → lista de tools.
      El skill usa: `mem_context`, `mem_search`, `mem_get_observation`, `mem_timeline`,
      `mem_suggest_topic_key`, `mem_save` (con `topic_key`), `mem_update`.
      Si algún nombre/parámetro difiere, ajustar la tabla "Engram tools used" del SKILL.md.
      Ajustado en 001c621: `mem_timeline` no está expuesta; se usa `engram timeline <id>` por CLI.
- [x] Confirmar que `mem_save` con el mismo `topic_key` hace upsert (no duplica) en tu versión.
      2026-09-26: confirmado; hace upsert solo dentro del mismo proyecto y `scope` (el skill usa `scope: personal`).

## 2. Instalar el skill (sin tocar el protocolo oficial)

El skill vive en este repo: `.claude/skills/portfolio-knowledge/SKILL.md`.

- Opción A (solo dentro de este repo): ya funciona; Claude Code carga skills de proyecto desde `.claude/skills/`.
- Opción B (en cualquier proyecto de trabajo, recomendado para capturar aprendizajes del día a día):
  ```bash
  mkdir -p ~/.claude/skills
  ln -s "$PWD/.claude/skills/portfolio-knowledge" ~/.claude/skills/portfolio-knowledge
  ```
  Si Gentle AI instala skills en otra ruta, usar esa ruta y respetar su estructura.
- [x] **No** editar el protocolo de Engram en `CLAUDE.md` ni sus skills. Este skill es aditivo.
      El ajuste 001c621 solo tocó `.claude/skills/portfolio-knowledge/SKILL.md`.
- [ ] Probar: en una sesión nueva, `/skills` (o pedir "busca en Engram notas para mi portafolio") y ver que se activa.

## 3. Primera búsqueda de contenido (Parte 5 del pedido)

En una sesión local con Engram, pedir:

> revisar Engram para contenido — busca Oracle, Saga, timeouts, locks, Keycloak, OpenShift,
> NestJS, API Gateway, MuleSoft, RabbitMQ, CI/CD, Claude Code, AI agents.
> Devuélveme una tabla: Título propuesto | Tipo | Tema | Fuente Engram | Por qué sirve. No publiques nada.

- [x] Revisar la tabla (máx. 5 por ronda). 2026-09-26: 12 candidatos, 6 aprobados.
- [x] Aprobar las que valgan → el skill crea `content/drafts/<slug>.md` (status: draft). Borradores en 0be1a25.
- [x] Revisar sanitizado de cada draft (IPs, hosts, nombres de cliente/banco, tablas internas, montos).
      Cada nota tiene `confidentiality` (SAFE o SAFE_AFTER_GENERALIZING); publicadas en 32b5425.

## 4. Publicar un draft

```bash
git mv content/drafts/<slug>.md content/notes/<slug>.md   # o content/articles/
# editar: status: published, updated: <hoy>
node scripts/build-content.mjs
python3 -m http.server 8000   # revisar /blog/ y la nota
git add -A && git commit -m "content: add note <slug>"
```

## 5. Hábito diario (opcional)

- Al terminar algo interesante: "guarda esto para el blog" → candidato `portfolio-note/<tema>` en Engram.
- Una vez por semana: "revisar Engram para contenido" → máx. 5 propuestas.
- Revisar `js/learning/focuses.js` cada trimestre (máx. 3 focos, estado real).
