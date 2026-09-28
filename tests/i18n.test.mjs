import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const index = read('index.html');

function load(document = {}, { href = 'https://portfolio.example/', savedLang, storageThrows = false } = {}) {
  const location = new URL(href);
  const storage = new Map(savedLang === undefined ? [] : [['lang', savedLang]]);
  const replacements = [];
  const localStorage = {
    getItem(key) {
      if (storageThrows) throw new Error('Storage unavailable');
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageThrows) throw new Error('Storage unavailable');
      storage.set(key, value);
    }
  };
  const history = {
    replaceState(state, title, url) {
      replacements.push(String(url));
      location.href = new URL(url, location.href).href;
    }
  };
  const ctx = { document, Event, location, localStorage, history, URL, URLSearchParams };
  vm.createContext(ctx);
  for (const file of ['js/i18n/translations.js', 'js/i18n/i18n.js', 'js/components/animations.js']) {
    vm.runInContext(read(file), ctx, { filename: file });
  }
  return { ctx, storage, replacements, translations: vm.runInContext('translations', ctx) };
}

function element(markup) {
  const attributes = Object.fromEntries(Array.from(markup.matchAll(/([\w-]+)="([^"]*)"/g), match => [match[1], match[2]]));
  const dataset = Object.fromEntries(Object.entries(attributes)
    .filter(([key]) => key.startsWith('data-'))
    .map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), value]));
  const classes = new Set((attributes.class || '').split(' '));
  return {
    ...attributes, dataset,
    setAttribute(key, value) { this[key] = value; },
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
    addEventListener(type, callback) { this[type] = callback; }
  };
}

test('ES and EN dictionaries have identical keys and no empty values', () => {
  const { translations } = load();
  assert.deepEqual(Object.keys(translations.es).sort(), Object.keys(translations.en).sort());
  function nonempty(value, path) {
    if (typeof value === 'string') assert.ok(value.trim(), `${path} is empty`);
    else {
      assert.ok(value && typeof value === 'object', `${path} is not a translation`);
      assert.ok(Object.keys(value).length, `${path} is empty`);
      for (const [key, child] of Object.entries(value)) nonempty(child, `${path}.${key}`);
    }
  }
  nonempty(translations, 'translations');
});

test('every index aria label has a valid translation binding', () => {
  const labels = Array.from(index.matchAll(/<[^>]+\saria-label="[^"]*"[^>]*>/g), match => element(match[0]));
  const document = {
    documentElement: {}, dispatchEvent() {},
    querySelectorAll: selector => selector === '[data-i18n-aria-label]' ? labels : []
  };
  const { ctx, translations } = load(document);
  assert.ok(labels.length);
  for (const label of labels) {
    assert.ok(label.dataset.i18nAriaLabel, label['aria-label']);
    assert.equal(label['aria-label'], translations.es[label.dataset.i18nAriaLabel]);
  }
  for (const lang of ['en', 'es']) {
    ctx.setLang(lang);
    for (const label of labels) assert.equal(label['aria-label'], translations[lang][label.dataset.i18nAriaLabel]);
  }
});

test('gallery clicks and language switches keep the selected image alt translated', () => {
  const galleries = Array.from(index.matchAll(/<div class="project-gallery">([\s\S]*?)<\/div>\s*<\/div>/g), match => {
    const markup = match[1];
    const main = element(markup.match(/<img class="gallery-main"[^>]*>/)[0]);
    const thumbs = Array.from(markup.matchAll(/<button class="gallery-thumb[^>]*>[\s\S]*?<\/button>/g), button => {
      const thumb = element(button[0].match(/<button[^>]*>/)[0]);
      const image = element(button[0].match(/<img[^>]*>/)[0]);
      thumb.querySelector = () => image;
      return thumb;
    });
    return { main, thumbs, querySelector: () => main, querySelectorAll: () => thumbs };
  });
  assert.equal(galleries.length, 2);
  assert.deepEqual(galleries.map(gallery => gallery.thumbs.length), [3, 4]);
  const images = galleries.flatMap(({ main, thumbs }) => [main, ...thumbs.map(thumb => thumb.querySelector('img'))]);
  const document = {
    documentElement: {}, dispatchEvent() {},
    querySelectorAll: selector => selector === '.project-gallery' ? galleries : selector === '[data-i18n-alt]' ? images : []
  };
  const { ctx, translations } = load(document);
  for (const image of images) {
    assert.ok(image.dataset.i18nAlt, image.src);
    assert.equal(image.alt, translations.es[image.dataset.i18nAlt]);
  }
  for (const { main, thumbs } of galleries) {
    const active = thumbs.find(thumb => thumb.classList.contains('active'));
    assert.equal(main.dataset.i18nAlt, active.querySelector('img').dataset.i18nAlt);
  }
  ctx.initGallery();
  for (const lang of ['es', 'en']) {
    ctx.setLang(lang);
    for (const { main, thumbs } of galleries) {
      for (const thumb of thumbs) {
        const image = thumb.querySelector('img');
        thumb.click();
        assert.equal(main.src, thumb.dataset.src);
        assert.equal(main.dataset.i18nAlt, image.dataset.i18nAlt);
        assert.equal(main.alt, image.alt);
        for (const candidate of thumbs) assert.equal(candidate.classList.contains('active'), candidate === thumb);
        for (const nextLang of ['en', 'es', lang]) {
          ctx.setLang(nextLang);
          assert.equal(main.src, thumb.dataset.src);
          assert.equal(main.alt, translations[nextLang][image.dataset.i18nAlt]);
          assert.equal(image.alt, main.alt);
        }
      }
    }
  }
});

function languagePage(options) {
  const buttons = ['es', 'en'].map(lang => ({
    dataset: { lang },
    classList: { toggle() {} },
    addEventListener(type, callback) { this[type] = callback; }
  }));
  const text = { dataset: { i18n: 'nav_projects' }, textContent: 'Proyectos' };
  const document = {
    documentElement: { lang: 'es' },
    dispatchEvent() {},
    querySelectorAll(selector) {
      if (selector === '.lang-btn') return buttons;
      if (selector === '[data-i18n]') return [text];
      return [];
    }
  };
  return { ...load(document, options), document, buttons, text };
}

test('English query resolves before init, translates the DOM, and persists the shareable URL', () => {
  const { ctx, storage, replacements, document, text, translations } = languagePage({
    href: 'https://portfolio.example/blog/?topic=js&lang=en#entry', savedLang: 'es'
  });
  assert.equal(vm.runInContext('currentLang', ctx), 'en');
  assert.equal(replacements.length, 0);
  ctx.initI18n();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(text.textContent, translations.en.nav_projects);
  assert.equal(storage.get('lang'), 'en');
  assert.deepEqual(replacements, ['https://portfolio.example/blog/?topic=js&lang=en#entry']);
});

test('saved English resolves before init and adds the English query', () => {
  const { ctx, storage, replacements, document } = languagePage({ savedLang: 'en' });
  assert.equal(vm.runInContext('currentLang', ctx), 'en');
  ctx.initI18n();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(storage.get('lang'), 'en');
  assert.deepEqual(replacements, ['https://portfolio.example/?lang=en']);
});

test('unknown query falls back to Spanish and removes the language parameter', () => {
  const { ctx, storage, replacements } = languagePage({
    href: 'https://portfolio.example/?lang=fr&topic=js#entry'
  });
  assert.equal(vm.runInContext('currentLang', ctx), 'es');
  ctx.initI18n();
  assert.equal(storage.get('lang'), 'es');
  assert.deepEqual(replacements, ['https://portfolio.example/?topic=js#entry']);
});

test('Spanish query overrides saved English', () => {
  const { ctx, storage, replacements } = languagePage({
    href: 'https://portfolio.example/?lang=es', savedLang: 'en'
  });
  assert.equal(vm.runInContext('currentLang', ctx), 'es');
  ctx.initI18n();
  assert.equal(storage.get('lang'), 'es');
  assert.deepEqual(replacements, ['https://portfolio.example/']);
});

test('invalid saved language defaults to Spanish and invalid query allows valid storage', () => {
  const invalid = languagePage({ savedLang: 'fr' });
  assert.equal(vm.runInContext('currentLang', invalid.ctx), 'es');
  invalid.ctx.initI18n();
  assert.equal(invalid.storage.get('lang'), 'es');
  const saved = languagePage({ href: 'https://portfolio.example/?lang=fr', savedLang: 'en' });
  assert.equal(vm.runInContext('currentLang', saved.ctx), 'en');
});

test('language buttons persist and rewrite the URL in both directions', () => {
  const { ctx, storage, replacements, buttons, document } = languagePage({
    href: 'https://portfolio.example/blog/?topic=js#entry'
  });
  ctx.initI18n();
  buttons[1].click();
  assert.equal(vm.runInContext('currentLang', ctx), 'en');
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(storage.get('lang'), 'en');
  assert.equal(replacements.at(-1), 'https://portfolio.example/blog/?topic=js&lang=en#entry');
  buttons[0].click();
  assert.equal(vm.runInContext('currentLang', ctx), 'es');
  assert.equal(document.documentElement.lang, 'es');
  assert.equal(storage.get('lang'), 'es');
  assert.equal(replacements.at(-1), 'https://portfolio.example/blog/?topic=js#entry');
});

test('unavailable storage does not break initialization or language switching', () => {
  for (const query of ['', '?lang=en']) {
    const { ctx, replacements, buttons } = languagePage({
      href: `https://portfolio.example/${query}`, storageThrows: true
    });
    assert.equal(vm.runInContext('currentLang', ctx), query ? 'en' : 'es');
    assert.doesNotThrow(() => ctx.initI18n());
    assert.equal(replacements.length, 1);
    assert.doesNotThrow(() => buttons[1].click());
    assert.equal(replacements.at(-1), 'https://portfolio.example/?lang=en');
  }
});

test('setLang does not persist or rewrite the URL', () => {
  const { ctx, storage, replacements } = languagePage({ savedLang: 'es' });
  ctx.setLang('en');
  assert.equal(vm.runInContext('currentLang', ctx), 'en');
  assert.equal(storage.get('lang'), 'es');
  assert.deepEqual(replacements, []);
});
