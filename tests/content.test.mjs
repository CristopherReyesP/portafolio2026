// Knowledge base tests, no dependencies: node --test tests/content.test.mjs
// Checks the manifests' metadata, the learning focuses and that drafts are never published.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const build = () => execFileSync(process.execPath, [new URL('scripts/build-content.mjs', root).pathname], { encoding: 'utf8' });
function load() {
  const ctx = {}; ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of ['js/blog/posts.js', 'js/blog/notes.js', 'js/blog/search-index.js', 'js/learning/focuses.js']) {
    vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), ctx, { filename: file });
  }
  return ctx;
}

test('generated files are up to date with content/', () => {
  const files = ['js/blog/notes.js', 'js/blog/search-index.js', 'content/index.json', 'sitemap.xml', 'blog/rss.xml'];
  const before = files.map(f => fs.readFileSync(new URL(f, root), 'utf8'));
  build();
  files.forEach((f, i) => assert.equal(fs.readFileSync(new URL(f, root), 'utf8'), before[i], `${f} is stale: run node scripts/build-content.mjs`));
});

test('at most 3 learning focuses, each with status, topics in ES/EN and valid evidence links', () => {
  const { LEARNING_FOCUSES: focuses, BLOG_POSTS: posts, BLOG_NOTES: notes } = load();
  assert.ok(focuses.length >= 1 && focuses.length <= 3);
  const ids = new Set(focuses.map(f => f.id));
  const index = fs.readFileSync(new URL('index.html', root), 'utf8');
  for (const focus of focuses) {
    assert.ok(focus.title.es && focus.title.en && focus.topics.es.length && focus.topics.en.length);
    focus.status.forEach(s => assert.ok(['reinforcing', 'active', 'exploring'].includes(s)));
    focus.projects.forEach(id => assert.ok(index.includes(`id="${id}"`), `unknown project ${id}`));
  }
  for (const entry of [...posts, ...notes]) (entry.learning || []).forEach(id => assert.ok(ids.has(id), `${entry.slug}: ${id}`));
});

test('every article and note has the knowledge-base metadata', () => {
  const { BLOG_POSTS: posts, BLOG_NOTES: notes, BLOG_SEARCH: search } = load();
  for (const entry of [...posts, ...notes]) {
    assert.ok(['article', 'note'].includes(entry.type), entry.slug);
    for (const key of ['slug', 'title', 'category', 'date', 'updated', 'minutes']) assert.ok(entry[key], `${entry.slug}: ${key}`);
    assert.ok(Array.isArray(entry.tags) && Array.isArray(entry.categoryKey) && Array.isArray(entry.learning), entry.slug);
    assert.ok(search[entry.slug] && search[entry.slug].length > 100, `${entry.slug}: missing search text`);
  }
  for (const note of notes) assert.ok(fs.existsSync(new URL(note.path, root)), note.path);
});

test('drafts are never published, even with status: published', () => {
  const draft = new URL('content/drafts/test-never-published.md', root);
  const review = new URL('content/notes/test-in-review.md', root);
  fs.writeFileSync(draft, '---\ntitle: Draft\ntype: note\ncategory: Oracle\nstatus: published\ncreated: 2026-01-01\n---\n\nSecret draft body.\n');
  fs.writeFileSync(review, '---\ntitle: Review\ntype: note\ncategory: Oracle\nstatus: review\ncreated: 2026-01-01\n---\n\nIn review.\n');
  try {
    build();
    const { BLOG_NOTES: notes } = load();
    assert.ok(!notes.some(n => n.slug === 'test-never-published' || n.slug === 'test-in-review'));
    assert.ok(!fs.existsSync(new URL('blog/notes/test-never-published.html', root)));
    assert.ok(!fs.existsSync(new URL('blog/notes/test-in-review.html', root)));
    const index = JSON.parse(fs.readFileSync(new URL('content/index.json', root), 'utf8'));
    assert.equal(index.entries.find(e => e.slug === 'test-never-published').status, 'draft');
    assert.equal(index.entries.find(e => e.slug === 'test-in-review').status, 'review');
  } finally {
    fs.rmSync(draft);
    fs.rmSync(review);
    build();
  }
});
