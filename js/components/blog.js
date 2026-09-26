// Blog cards rendered from window.BLOG_POSTS (js/blog/posts.js, hand-written articles) and
// window.BLOG_NOTES (js/blog/notes.js, generated from content/ by scripts/build-content.mjs).
// Post content stays in Spanish; dates and UI labels follow the active language through setLang().

const BLOG_DATE_FORMAT = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeZone: 'UTC' });

// Category key → filter label key in translations.js; the listing only shows keys with content.
const BLOG_CATEGORIES = {
  arquitectura: 'blog_filter_architecture', microservicios: 'blog_filter_microservices',
  oracle: 'blog_filter_oracle', 'bases-de-datos': 'blog_filter_databases', nestjs: 'blog_filter_nestjs',
  openshift: 'blog_filter_openshift', keycloak: 'blog_filter_keycloak', devops: 'blog_filter_devops',
  ia: 'blog_filter_ai', herramientas: 'blog_filter_tools'
};

function escapeBlogText(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

// Articles and notes in one list, newest first (articles first on the same day).
function getBlogEntries() {
  const posts = (window.BLOG_POSTS || []).map(post => ({ ...post, type: post.type || 'article',
    path: `blog/posts/${post.slug}.html`, relatedProject: post.relatedProject || post.relatedCase || null }));
  const notes = window.BLOG_NOTES || [];
  return [...posts, ...notes].sort((a, b) => b.date.localeCompare(a.date)
    || (a.type === b.type ? 0 : a.type === 'article' ? -1 : 1));
}

// base: relative path from the current page to the site root ('' on the home page)
function renderBlogCard(post, base, withArt = false) {
  const date = BLOG_DATE_FORMAT.format(new Date(post.date + 'T00:00:00Z'));
  const isNote = post.type === 'note';
  const typeKey = isNote ? 'kb_type_note' : 'kb_type_article';
  return `<article class="blog-card panel${isNote ? ' blog-card--note' : ''}${withArt ? '' : ' reveal'}">
  ${withArt && !isNote ? renderBlogArt(post.categoryKey[0]) : ''}
  <div class="blog-card-kicker"><span class="blog-type" data-i18n="${typeKey}">${isNote ? 'NOTA' : 'ARTÍCULO'}</span><span class="blog-category" lang="es">${escapeBlogText(post.category)}</span></div>
  <h3 class="blog-card-title" lang="es"><a href="${base}${post.path}">${escapeBlogText(post.title)}</a></h3>
  <p class="blog-excerpt" lang="es">${escapeBlogText(post.excerpt)}</p>
  <div class="blog-meta"><time datetime="${post.date}" data-blog-date>${date}</time><span>${post.minutes} <span data-i18n="blog_read_time">min de lectura</span></span></div>
</article>`;
}

function initBlogLatest() {
  const grid = document.querySelector('[data-blog-latest]');
  if (!grid || !window.BLOG_POSTS) return;
  const count = Number(grid.dataset.blogLatest) || 4;
  grid.innerHTML = getBlogEntries().slice(0, count).map(post => renderBlogCard(post, '')).join('');
}

initBlogLatest();

// Decorative diagrams use the primary category; article metadata stays in Spanish.
function renderBlogArt(category) {
  const shapes = {
    arquitectura: '<path d="M50 28 110 60 50 92M110 60l60-32M110 60l60 32"/><circle cx="50" cy="28" r="10"/><circle cx="50" cy="92" r="10"/><circle cx="110" cy="60" r="14"/><circle cx="170" cy="28" r="10"/><circle cx="170" cy="92" r="10"/>',
    microservicios: '<rect x="25" y="43" width="45" height="34" rx="5"/><path d="M70 60h40M110 25v70M110 25h30M110 60h30M110 95h30"/><rect x="140" y="14" width="50" height="22" rx="4"/><rect x="140" y="49" width="50" height="22" rx="4"/><rect x="140" y="84" width="50" height="22" rx="4"/>',
    'bases-de-datos': '<ellipse cx="110" cy="30" rx="48" ry="15"/><path d="M62 30v60c0 20 96 20 96 0V30M62 60c0 20 96 20 96 0"/>',
    ia: '<rect x="80" y="30" width="60" height="60" rx="8"/><path d="M95 45h30v30H95zM95 15v15M125 15v15M95 90v15M125 90v15M65 45h15M65 75h15M140 45h15M140 75h15"/><circle cx="50" cy="45" r="8"/><circle cx="50" cy="75" r="8"/><circle cx="170" cy="45" r="8"/><circle cx="170" cy="75" r="8"/>',
    herramientas: '<rect x="35" y="20" width="150" height="80" rx="6"/><path d="M35 38h150M55 52l15 14-15 14M85 80h35"/>',
    devops: '<path d="M55 60h35M130 60h35"/><circle cx="40" cy="60" r="15"/><rect x="90" y="40" width="40" height="40" rx="5"/><circle cx="180" cy="60" r="15"/><path d="m173 60 5 5 9-10"/>'
  };
  shapes.oracle = shapes['bases-de-datos'];
  return `<div class="blog-art"><svg viewBox="0 0 220 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[category] || shapes.arquitectura}</svg></div>`;
}

// /blog/: type (all/article/note) × category × learning focus × text search.
// State lives in the URL (?type=note&cat=oracle&learning=distributed-systems&q=lock).
function initBlogList() {
  const grid = document.querySelector('[data-blog-list]');
  if (!grid || !window.BLOG_POSTS) return;
  const entries = getBlogEntries();
  const search = document.getElementById('blogSearch');
  const typeFilters = document.querySelectorAll('[data-blog-type]');
  const categoryGroup = document.querySelector('[data-blog-categories]');
  const learningBox = document.getElementById('blogLearning');
  const count = document.getElementById('blogCount');
  const empty = document.getElementById('blogEmpty');
  const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fullText = window.BLOG_SEARCH || {};

  // Category buttons: only keys used by at least one entry, in BLOG_CATEGORIES order.
  const used = new Set(entries.flatMap(entry => entry.categoryKey));
  const categories = Object.keys(BLOG_CATEGORIES).filter(key => used.has(key));
  categoryGroup.innerHTML = ['all', ...categories].map(key => {
    const label = key === 'all' ? 'blog_filter_all_categories' : BLOG_CATEGORIES[key];
    return `<button type="button" data-blog-filter="${key}" data-i18n="${label}" aria-pressed="false" aria-controls="blogGrid">${escapeBlogText(translations.es[label])}</button>`;
  }).join('');
  const filters = categoryGroup.querySelectorAll('[data-blog-filter]');

  const params = new URLSearchParams(window.location.search);
  let category = categories.includes(params.get('cat')) ? params.get('cat') : 'all';
  let type = ['article', 'note'].includes(params.get('type')) ? params.get('type') : 'all';
  const focuses = window.LEARNING_FOCUSES || [];
  let learning = focuses.some(focus => focus.id === params.get('learning')) ? params.get('learning') : null;
  search.value = params.get('q') || '';
  let resultCount = 0;

  function syncPressed() {
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.blogFilter === category)));
    typeFilters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.blogType === type)));
  }

  function renderLearning() {
    if (!learningBox) return;
    const focus = focuses.find(item => item.id === learning);
    learningBox.hidden = !focus;
    if (!focus) return;
    learningBox.innerHTML = `<span data-i18n="blog_learning_filter">${escapeBlogText(translations[currentLang].blog_learning_filter)}</span>
  <strong>${escapeBlogText(focus.title[currentLang] || focus.title.es)}</strong>
  <button type="button" data-blog-learning-clear data-i18n="blog_learning_clear">${escapeBlogText(translations[currentLang].blog_learning_clear)}</button>`;
    learningBox.querySelector('[data-blog-learning-clear]').addEventListener('click', () => {
      learning = null;
      renderResults();
      search.focus();
    });
  }

  function updateCount() {
    const copy = translations[currentLang];
    count.textContent = copy[resultCount === 1 ? 'blog_result_one' : 'blog_result_many'].replace('{count}', resultCount);
    renderLearning();
  }

  function renderResults() {
    const url = new URL(window.location.href);
    const setParam = (key, value) => (value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
    setParam('type', type === 'all' ? '' : type);
    setParam('cat', category === 'all' ? '' : category);
    setParam('learning', learning);
    setParam('q', search.value.trim() ? search.value : '');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    const query = normalize(search.value.trim());
    const posts = entries.filter(post => {
      const text = normalize([post.title, post.excerpt, post.category, ...post.categoryKey, ...post.tags, fullText[post.slug] || ''].join(' '));
      return (type === 'all' || post.type === type)
        && (category === 'all' || post.categoryKey.includes(category))
        && (!learning || (post.learning || []).includes(learning))
        && text.includes(query);
    });
    resultCount = posts.length;
    grid.innerHTML = posts.map(post => renderBlogCard(post, '../', true)).join('');
    empty.hidden = resultCount !== 0;
    syncPressed();
    // Apply the active language to the new cards, labels and the result count.
    setLang(currentLang);
  }

  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.blogFilter;
    renderResults();
  }));
  typeFilters.forEach(button => button.addEventListener('click', () => {
    type = button.dataset.blogType;
    renderResults();
  }));
  search.addEventListener('input', renderResults);
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      search.value = '';
      renderResults();
    }
  });
  document.addEventListener('languagechange', updateCount);
  renderResults();
}
