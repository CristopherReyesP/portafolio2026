import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const index = read('index.html');

function load(document = {}) {
  const ctx = { document, Event };
  vm.createContext(ctx);
  for (const file of ['js/i18n/translations.js', 'js/i18n/i18n.js', 'js/components/animations.js']) {
    vm.runInContext(read(file), ctx, { filename: file });
  }
  return { ctx, translations: vm.runInContext('translations', ctx) };
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
