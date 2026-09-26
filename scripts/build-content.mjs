// Builds the knowledge base from content/ (Markdown + frontmatter), no dependencies:
//   node scripts/build-content.mjs
// - content/notes/*.md and content/articles/*.md with `status: published` become pages
//   (blog/notes/<slug>.html or blog/posts/<slug>.html) and entries in js/blog/notes.js.
// - Anything else (status: draft/review, or files in content/drafts/) is never published;
//   it is only listed in content/index.json so tools (the portfolio-knowledge skill) can dedupe.
// - js/blog/search-index.js gets the plain text of every published page, so the blog
//   search covers the content and not only the title.
// - sitemap.xml and blog/rss.xml are regenerated from js/blog/posts.js + published entries.
// Hand-written HTML articles keep living in blog/posts/ with their entry in js/blog/posts.js.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://cristopherreyesp.github.io/portafolio2026/';
const CONTENT = path.join(ROOT, 'content');
const TYPES = ['note', 'article'];
const STATUSES = ['draft', 'review', 'published'];

// --- Frontmatter: `key: value`, `key:` followed by `  - item` lists. Nothing more. ---
function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  const data = {};
  let listKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { data[listKey].push(unquote(item[1])); continue; }
    const pair = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!pair) throw new Error(`${file}: cannot parse frontmatter line "${line}"`);
    const [, key] = pair;
    // Trailing "# comment": after the closing quote, or anywhere in an unquoted value.
    const quoted = pair[2].match(/^(['"]).*?\1/);
    const value = quoted ? quoted[0] : pair[2].replace(/\s+#.*$/, '').trim();
    if (value === '') { data[key] = []; listKey = key; }
    else if (/^\[.*\]$/.test(value)) { data[key] = value.slice(1, -1).split(',').map(v => unquote(v.trim())).filter(Boolean); listKey = null; }
    else { data[key] = unquote(value); listKey = null; }
  }
  return { data, body: match[2] };
}
const unquote = v => v.replace(/^(['"])(.*)\1$/, '$2');

const escapeHtml = text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const slugify = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// --- Markdown subset: ## / ### headings, paragraphs, fenced code, - / 1. lists,
// > blockquotes (rendered as .article-note), **bold**, `code`, [links](url). ---
function inline(text) {
  const parts = text.split(/(`[^`]+`)/);
  return parts.map(part => {
    if (/^`[^`]+`$/.test(part)) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
    return escapeHtml(part)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`);
  }).join('');
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^```\s*([\w-]*)/);
    if (fence) {
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
      i++;
      const lang = fence[1] ? ` data-lang="${escapeHtml(fence[1])}"` : '';
      out.push(`<pre class="article-code"${lang}><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) { out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); i++; continue; }
    if (/^\s*(-|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      for (; i < lines.length && /^\s*(-|\d+\.)\s+/.test(lines[i]); i++) items.push(`<li>${inline(lines[i].replace(/^\s*(-|\d+\.)\s+/, ''))}</li>`);
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    if (line.startsWith('>')) {
      const quote = [];
      for (; i < lines.length && lines[i].startsWith('>'); i++) quote.push(lines[i].replace(/^>\s?/, ''));
      out.push(`<div class="article-note">${quote.filter(Boolean).map(q => `<p>${inline(q)}</p>`).join('')}</div>`);
      continue;
    }
    const para = [];
    for (; i < lines.length && lines[i].trim() && !/^(```|#{2,3}\s|>|\s*(-|\d+\.)\s)/.test(lines[i]); i++) para.push(lines[i].trim());
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.map(block => '      ' + block).join('\n');
}

const plainText = html => html.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// --- Load sources ---
function loadManifest(file, name) {
  const ctx = {}; ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, { filename: file });
  return ctx[name] || [];
}
const posts = loadManifest('js/blog/posts.js', 'BLOG_POSTS');
const focuses = loadManifest('js/learning/focuses.js', 'LEARNING_FOCUSES');
const focusIds = new Set(focuses.map(f => f.id));

function readEntries(dir, forceDraft) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter(f => f.endsWith('.md') && !f.startsWith('_')).map(f => {
    const rel = `content/${dir}/${f}`;
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(full, f), 'utf8'), rel);
    const entry = {
      source: rel,
      slug: data.slug || f.replace(/\.md$/, ''),
      title: data.title,
      type: data.type,
      category: data.category,
      categoryKey: data.categoryKey ? [].concat(data.categoryKey) : [slugify(data.category || '')],
      tags: data.tags || [],
      status: forceDraft ? 'draft' : data.status,
      created: data.created,
      updated: data.updated || data.created,
      excerpt: data.excerpt || '',
      learning: data.learning || [],
      relatedProject: data.relatedProject || null,
      related: data.related || [],
      source_refs: data.sources || [],
      body
    };
    for (const key of ['title', 'type', 'category', 'status', 'created']) {
      if (!entry[key]) throw new Error(`${rel}: missing "${key}"`);
    }
    if (!TYPES.includes(entry.type)) throw new Error(`${rel}: type must be one of ${TYPES.join(', ')}`);
    if (!STATUSES.includes(entry.status)) throw new Error(`${rel}: status must be one of ${STATUSES.join(', ')}`);
    for (const date of [entry.created, entry.updated]) if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${rel}: dates are YYYY-MM-DD`);
    for (const id of entry.learning) if (!focusIds.has(id)) throw new Error(`${rel}: unknown learning focus "${id}"`);
    return entry;
  });
}

const entries = [...readEntries('notes'), ...readEntries('articles'), ...readEntries('drafts', true)];
const slugs = new Set(posts.map(p => p.slug));
for (const entry of entries) {
  if (slugs.has(entry.slug)) throw new Error(`${entry.source}: slug "${entry.slug}" already exists`);
  slugs.add(entry.slug);
}
const published = entries.filter(e => e.status === 'published')
  .sort((a, b) => b.created.localeCompare(a.created) || a.title.localeCompare(b.title));

// --- Pages ---
const dirFor = type => (type === 'note' ? 'notes' : 'posts');
const urlFor = entry => `blog/${dirFor(entry.type || 'article')}/${entry.slug}.html`;
const bySlug = new Map([...posts.map(p => [p.slug, { ...p, type: p.type || 'article' }]), ...published.map(e => [e.slug, e])]);
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const longDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][m - 1]} de ${y}`; };

function renderPage(entry, contentHtml) {
  const url = SITE + urlFor(entry);
  const title = escapeHtml(entry.title);
  const desc = escapeHtml(entry.excerpt);
  const isNote = entry.type === 'note';
  const chips = entry.categoryKey.map(key => `      <li><a class="chip" href="../?cat=${encodeURIComponent(key)}">${escapeHtml(entry.category)}</a></li>`).slice(0, 1)
    .concat(entry.tags.filter(tag => tag.toLowerCase() !== entry.category.toLowerCase()).map(tag => `      <li><span class="chip purple">${escapeHtml(tag)}</span></li>`)).join('\n');
  const related = entry.related.map(slug => {
    const target = bySlug.get(slug);
    if (!target) throw new Error(`${entry.source}: related "${slug}" is not a published post or note`);
    const kind = (target.type || 'article') === 'note' ? 'kb_type_note' : 'kb_type_article';
    return `<li><a href="../../${urlFor(target)}"><span class="note-related-kind" data-i18n="${kind}">${kind === 'kb_type_note' ? 'NOTA' : 'ARTÍCULO'}</span> ${escapeHtml(target.title)}</a></li>`;
  });
  const learning = entry.learning.map(id => {
    const focus = focuses.find(f => f.id === id);
    return `<li><a href="../../#learning"><span class="note-related-kind" data-i18n="learning_tag">APRENDIZAJE</span> ${escapeHtml(focus.title.es)}</a></li>`;
  });
  const relatedBlock = related.length || learning.length ? `
      <h2 data-i18n="note_related">Relacionado</h2>
      <ul class="note-related">${[...related, ...learning].join('')}</ul>` : '';
  const ld = JSON.stringify({
    '@context': 'https://schema.org', '@type': isNote ? 'TechArticle' : 'BlogPosting',
    headline: entry.title, description: entry.excerpt, datePublished: entry.created, dateModified: entry.updated,
    author: { '@type': 'Person', name: 'Cristopher Reyes', url: SITE },
    mainEntityOfPage: url, url, inLanguage: 'es', keywords: entry.tags, image: SITE + 'og-image.png'
  }, null, 2).replace(/</g, '\\u003c');
  const template = fs.readFileSync(path.join(ROOT, 'scripts/templates/entry.html'), 'utf8');
  const values = {
    TITLE: title, DESCRIPTION: desc, URL: url, LD_JSON: ld, CREATED: entry.created, UPDATED: entry.updated,
    CREATED_LONG: longDate(entry.created), UPDATED_LONG: longDate(entry.updated), SLUG: escapeHtml(entry.slug),
    TYPE: entry.type, TYPE_KEY: isNote ? 'kb_type_note' : 'kb_type_article', TYPE_LABEL: isNote ? 'NOTA TÉCNICA' : 'ARTÍCULO',
    CHIPS: chips, MINUTES: String(entry.minutes), CONTENT: contentHtml + relatedBlock,
    LINKEDIN: encodeURIComponent(url)
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`template: unknown placeholder ${key}`);
    return values[key];
  });
}

// Remove pages generated earlier for entries that are no longer published.
const generatedMarker = '<!-- generated by scripts/build-content.mjs -->';
for (const dir of ['blog/notes', 'blog/posts']) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full)) {
    const file = path.join(full, f);
    if (f.endsWith('.html') && fs.readFileSync(file, 'utf8').includes(generatedMarker)
      && !published.some(e => urlFor(e) === `${dir}/${f}`)) fs.rmSync(file);
  }
}

const searchIndex = {};
for (const entry of published) {
  const html = renderMarkdown(entry.body);
  const text = plainText(html);
  entry.minutes = Math.max(1, Math.ceil(text.split(' ').length / 200));
  if (!entry.excerpt) entry.excerpt = text.slice(0, 180).replace(/\s\S*$/, '') + '…';
  const file = path.join(ROOT, urlFor(entry));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPage(entry, html));
  searchIndex[entry.slug] = text;
}
for (const post of posts) {
  const html = fs.readFileSync(path.join(ROOT, `blog/posts/${post.slug}.html`), 'utf8');
  const body = html.match(/<div class="article-content">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="article-end">/);
  searchIndex[post.slug] = body ? plainText(body[1]) : '';
}

// --- Data files ---
const header = '// Generated by scripts/build-content.mjs from content/ — do not edit.\n';
const noteData = published.map(e => ({
  slug: e.slug, type: e.type, title: e.title, excerpt: e.excerpt, category: e.category, categoryKey: e.categoryKey,
  tags: e.tags, date: e.created, updated: e.updated, minutes: e.minutes, learning: e.learning,
  relatedProject: e.relatedProject, path: urlFor(e)
}));
fs.writeFileSync(path.join(ROOT, 'js/blog/notes.js'), `${header}window.BLOG_NOTES = ${JSON.stringify(noteData, null, 2)};\n`);
fs.writeFileSync(path.join(ROOT, 'js/blog/search-index.js'), `${header}window.BLOG_SEARCH = ${JSON.stringify(searchIndex)};\n`);
fs.writeFileSync(path.join(CONTENT, 'index.json'), JSON.stringify({
  generated: 'scripts/build-content.mjs',
  entries: [
    ...posts.map(p => ({ slug: p.slug, type: p.type || 'article', title: p.title, category: p.category, tags: p.tags,
      status: 'published', created: p.date, updated: p.updated || p.date, learning: p.learning || [], source: `blog/posts/${p.slug}.html` })),
    ...entries.map(e => ({ slug: e.slug, type: e.type, title: e.title, category: e.category, tags: e.tags,
      status: e.status, created: e.created, updated: e.updated, learning: e.learning, source: e.source }))
  ]
}, null, 2) + '\n');

// --- Sitemap + RSS ---
const all = [
  ...posts.map(p => ({ url: SITE + `blog/posts/${p.slug}.html`, title: p.title, excerpt: p.excerpt, date: p.date, updated: p.updated || p.date, category: p.category })),
  ...published.map(e => ({ url: SITE + urlFor(e), title: e.title, excerpt: e.excerpt, date: e.created, updated: e.updated, category: e.category }))
].sort((a, b) => b.date.localeCompare(a.date));
const latest = all.reduce((max, item) => (item.updated > max ? item.updated : max), '0000-00-00');
const xml = escapeHtml;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version='1.0' encoding='utf-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[{ url: SITE, updated: latest }, { url: SITE + 'blog/', updated: latest }, ...all].map(item => `  <url>
    <loc>${xml(item.url)}</loc>
    <lastmod>${item.updated}</lastmod>
  </url>`).join('\n')}
</urlset>`);
const rfc822 = iso => new Date(iso + 'T00:00:00Z').toUTCString().replace('GMT', '+0000');
fs.writeFileSync(path.join(ROOT, 'blog/rss.xml'), `<?xml version='1.0' encoding='utf-8'?>
<rss version="2.0">
  <channel>
    <title>Notas de ingeniería · Cristopher Reyes</title>
    <link>${SITE}blog/</link>
    <description>Notas de ingeniería: arquitectura, microservicios, bases de datos e IA. Lo que aprendo construyendo sistemas reales.</description>
    <language>es</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${all.map(item => `    <item>
      <title>${xml(item.title)}</title>
      <link>${xml(item.url)}</link>
      <description>${xml(item.excerpt)}</description>
      <pubDate>${rfc822(item.date)}</pubDate>
      <guid isPermaLink="true">${xml(item.url)}</guid>
${item.category.split(' / ').map(c => `      <category>${xml(c)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>`);

const drafts = entries.filter(e => e.status !== 'published');
console.log(`published: ${published.length} (${published.map(e => e.slug).join(', ') || '-'}) · drafts/review: ${drafts.length} · articles in posts.js: ${posts.length}`);
