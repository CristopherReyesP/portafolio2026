// Blog cards rendered from window.BLOG_POSTS (js/blog/posts.js), so adding a post
// only needs its HTML file and one manifest entry. Post content stays in Spanish;
// dates and the reading-time label follow the active language through setLang().

const BLOG_DATE_FORMAT = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeZone: 'UTC' });

function escapeBlogText(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

// base: relative path from the current page to the site root ('' on the home page)
function renderBlogCard(post, base) {
  const date = BLOG_DATE_FORMAT.format(new Date(post.date + 'T00:00:00Z'));
  return `<article class="blog-card panel reveal">
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
