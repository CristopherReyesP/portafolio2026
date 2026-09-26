// Pet brain tests, no dependencies: node --test tests/pet-brain.test.mjs (or just node --test)
// Loads the blog manifest, translations.js and pet-brain.js in a simulated browser context.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const ctx = { document: { getElementById: () => null } };
ctx.window = ctx;
vm.createContext(ctx);
for (const file of ['js/blog/posts.js', 'js/i18n/translations.js', 'js/components/pet-brain.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), ctx, { filename: file });
}

function ask(lang, question) {
  vm.runInContext(`currentLang = ${JSON.stringify(lang)}`, ctx);
  return ctx.petBrain.answer(question);
}

const posts = ctx.BLOG_POSTS;

// At least one question per article and language. A new post has to be added here.
const articleQuestions = {
  'patron-saga-sistemas-pagos': [['es', '¿Qué es el patrón saga?'], ['es', '¿Qué es idempotencia?'],
    ['en', 'What is the saga pattern?'], ['en', 'What is idempotency?']],
  'timeout-no-significa-fallo': [['es', '¿Timeout es un fallo?'], ['en', 'Does a timeout mean failure?']],
  'migrar-monolito-microservicios': [['es', '¿Cómo migrar un monolito?'], ['en', 'How do you migrate a monolith?']],
  'oracle-jobs-automatizacion': [['es', '¿Para qué sirven los jobs de Oracle?'], ['en', 'What are Oracle jobs for?']],
  'claude-code-backend': [['es', '¿Cómo usa Claude Code?'], ['en', 'How does he use Claude Code?']],
  'agentes-ia-local': [['es', '¿IA local?'], ['en', 'When does local AI make sense?']]
};

// Intents returned by master before the blog brain existed (regressions)
const baseline = [
  ['es', '¿Cuál es su stack?', 'stack'], ['es', '¿Qué tecnologías usa?', 'stack'], ['es', '¿Sabe Oracle?', 'stack'],
  ['en', 'What is his tech stack?', 'stack'], ['en', 'Does he know NestJS?', 'stack'],
  ['es', '¿Dónde está su CV?', 'cv'], ['es', 'quiero su curriculum', 'cv'], ['en', 'Can I get his resume?', 'cv'],
  ['es', '¿Cómo lo contacto?', 'contact'], ['es', '¿Cuál es su correo?', 'contact'],
  ['en', 'How can I contact him?', 'contact'], ['en', 'What is his LinkedIn?', 'contact'],
  ['es', '¿Qué proyectos tiene?', 'projects'], ['es', 'háblame del proyecto saga', 'projects'],
  ['es', '¿qué hizo en la migración?', 'projects'], ['es', 'proyectos de microservicios', 'projects'],
  ['es', '¿qué es hormigas?', 'projects'], ['en', 'What projects has he built?', 'projects'],
  ['en', 'tell me about the saga project', 'projects'], ['en', 'what did he do in the migration project', 'projects'],
  ['es', 'hola', 'greeting'], ['es', 'buenos días', 'greeting'], ['en', 'hello', 'greeting'], ['en', 'hey there', 'greeting'],
  ['es', '¿cuál es la capital de Francia?', 'fallback'], ['es', 'receta de pizza', 'fallback'],
  ['en', 'what is the weather like', 'fallback'], ['en', 'who won the world cup', 'fallback'],
  ['es', '¿quién es Cristopher?', 'who'], ['es', '¿dónde trabaja?', 'job'],
  ['es', '¿cuántos años de experiencia tiene?', 'experience'], ['es', '¿está disponible?', 'availability'],
  ['en', 'where is he located?', 'location'], ['en', 'are you an AI?', 'ai'], ['es', 'cuéntame un chiste', 'who'],
  ['en', 'thanks', 'thanks'], ['es', '¿qué estudió?', 'education']
];

test('the manifest has posts', () => {
  assert.ok(Array.isArray(posts) && posts.length > 0);
});

test('every article answers at least one question in ES and one in EN', () => {
  for (const post of posts) {
    const questions = articleQuestions[post.slug];
    assert.ok(questions, `no test questions for ${post.slug}`);
    for (const lang of ['es', 'en']) assert.ok(questions.some(([l]) => l === lang), `${post.slug}: no ${lang} question`);
    for (const [lang, question] of questions) {
      const reply = ask(lang, question);
      assert.equal(reply.intent, 'blogPost', `${lang} "${question}"`);
      assert.equal(reply.slug, post.slug, `${lang} "${question}"`);
      assert.ok(reply.text.length > 40, `${lang} "${question}": empty answer`);
      assert.equal(reply.links.length, 1);
      assert.ok(reply.links[0].href.endsWith(`blog/posts/${post.slug}.html`));
      assert.ok(reply.bubble);
    }
  }
});

test('the EN answer is not the ES one and says the article is in Spanish', () => {
  for (const post of posts) {
    const [, esQuestion] = articleQuestions[post.slug].find(([l]) => l === 'es');
    const [, enQuestion] = articleQuestions[post.slug].find(([l]) => l === 'en');
    const es = ask('es', esQuestion);
    const en = ask('en', enQuestion);
    assert.notEqual(es.text, en.text);
    assert.match(en.links[0].label, /spanish/i);
  }
});

test('"qué artículos hay" lists every article', () => {
  for (const [lang, question] of [['es', '¿Qué artículos hay?'], ['es', '¿Tiene blog?'], ['es', '¿De qué escribe?'],
    ['en', 'What articles are there?'], ['en', 'Does he have a blog?']]) {
    const reply = ask(lang, question);
    assert.equal(reply.intent, 'blogList', `${lang} "${question}"`);
    assert.deepEqual(reply.items.map((item) => item.href.split('/').pop()), posts.map((post) => `${post.slug}.html`));
    reply.items.forEach((item, i) => {
      assert.equal(item.title, posts[i].title);
      assert.ok(item.category);
    });
    assert.ok(reply.links[0].href.endsWith('blog/'));
  }
});

test('"qué escribió sobre X" filters by category or tag', () => {
  const cases = [
    ['es', '¿Qué escribió sobre arquitectura?', (post) => post.categoryKey.includes('arquitectura')],
    ['en', 'What did he write about architecture?', (post) => post.categoryKey.includes('arquitectura')],
    ['es', '¿Qué escribió sobre IA?', (post) => post.categoryKey.includes('ia')],
    ['es', '¿Qué escribió sobre bases de datos?', (post) => post.categoryKey.includes('bases-de-datos')],
    ['en', 'What has he written about microservices?', (post) => post.categoryKey.includes('microservicios')],
    ['es', '¿Qué escribió sobre sistemas distribuidos?', (post) => post.tags.includes('Sistemas distribuidos')]
  ];
  for (const [lang, question, match] of cases) {
    const reply = ask(lang, question);
    assert.equal(reply.intent, 'blogTopic', `${lang} "${question}"`);
    assert.deepEqual(reply.items.map((item) => item.title), posts.filter(match).map((post) => post.title));
  }
});

test('regressions: existing questions keep their intent', () => {
  for (const [lang, question, intent] of baseline) {
    assert.equal(ask(lang, question).intent, intent, `${lang} "${question}"`);
  }
});

test('links only come from the manifest', () => {
  const reply = ask('es', '¿qué es saga? <a href="javascript:alert(1)">x</a> https://evil.example');
  for (const link of [...(reply.links || []), ...(reply.items || [])]) {
    assert.match(link.href, /^(?:[a-z]+:\/\/[^/]+\/)?(?:[\w-]+\/)*blog\/(?:posts\/[\w-]+\.html)?$/);
  }
});
