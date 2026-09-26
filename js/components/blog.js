// Blog cards rendered from window.BLOG_POSTS (js/blog/posts.js), so adding a post
// only needs its HTML file and one manifest entry. Post content stays in Spanish;
// dates and the reading-time label follow the active language through setLang().

const BLOG_DATE_FORMAT = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeZone: 'UTC' });

function escapeBlogText(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

// base: relative path from the current page to the site root ('' on the home page)
function renderBlogCard(post, base, withArt = false) {
  const date = BLOG_DATE_FORMAT.format(new Date(post.date + 'T00:00:00Z'));
  return `<article class="blog-card panel${withArt ? '' : ' reveal'}">
  ${withArt ? renderBlogArt(post.categoryKey[0]) : ''}
  <span class="blog-category" lang="es">${escapeBlogText(post.category)}</span>
  <h3 class="blog-card-title" lang="es"><a href="${base}blog/posts/${encodeURIComponent(post.slug)}.html">${escapeBlogText(post.title)}</a></h3>
  <p class="blog-excerpt" lang="es">${escapeBlogText(post.excerpt)}</p>
  <div class="blog-meta"><time datetime="${post.date}" data-blog-date>${date}</time><span>${post.minutes} <span data-i18n="blog_read_time">min de lectura</span></span></div>
</article>`;
}

function initBlogLatest() {
  const grid = document.querySelector('[data-blog-latest]');
  if (!grid || !window.BLOG_POSTS) return;
  const count = Number(grid.dataset.blogLatest) || 4;
  grid.innerHTML = window.BLOG_POSTS.slice(0, count).map(post => renderBlogCard(post, '')).join('');
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
  return `<div class="blog-art"><svg viewBox="0 0 220 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[category] || shapes.arquitectura}</svg></div>`;
}

function initBlogList() {
  const grid = document.querySelector('[data-blog-list]');
  if (!grid || !window.BLOG_POSTS) return;
  const search = document.getElementById('blogSearch');
  const filters = document.querySelectorAll('[data-blog-filter]');
  const count = document.getElementById('blogCount');
  const empty = document.getElementById('blogEmpty');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('cat');
  let category = [...filters].some(button => button.dataset.blogFilter === requestedCategory) ? requestedCategory : 'all';
  search.value = params.get('q') || '';
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.blogFilter === category)));
  let resultCount = 0;

  function updateCount() {
    const copy = translations[currentLang];
    count.textContent = copy[resultCount === 1 ? 'blog_result_one' : 'blog_result_many'].replace('{count}', resultCount);
  }

  function renderResults() {
    const url = new URL(window.location.href);
    if (category === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', category);
    if (search.value.trim()) url.searchParams.set('q', search.value);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    const query = normalize(search.value.trim());
    const posts = window.BLOG_POSTS.filter(post => {
      const text = normalize([post.title, post.excerpt, post.category, ...post.tags].join(' '));
      return (category === 'all' || post.categoryKey.includes(category)) && text.includes(query);
    });
    resultCount = posts.length;
    grid.innerHTML = posts.map(post => renderBlogCard(post, '../', true)).join('');
    empty.hidden = resultCount !== 0;
    // Apply the active language to the newly rendered dates and reading-time labels.
    setLang(currentLang);
  }

  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.blogFilter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
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
