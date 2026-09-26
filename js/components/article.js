// Blog post enhancements: generated table of contents with the active section,
// copy-link/LinkedIn share and the related case card from the blog manifests.
// Posts only need their <h2>s and the article markup; without JavaScript the
// content still reads top to bottom (no TOC, no copy button).
// Depends on blog.js (escapeBlogText), posts.js and the i18n globals.

const ARTICLE_TOC_MOBILE = '(max-width: 1024px)';

function slugifyHeading(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
}

function initArticleToc(article) {
  const layout = article.querySelector('.article-layout');
  const content = article.querySelector('.article-content');
  const headings = content ? [...content.querySelectorAll('h2')] : [];
  if (!layout || headings.length < 2) return;

  const used = new Set();
  const items = headings.map(heading => {
    if (!heading.id) {
      const base = slugifyHeading(heading.textContent);
      let id = base;
      for (let n = 2; used.has(id) || document.getElementById(id); n++) id = `${base}-${n}`;
      heading.id = id;
    }
    used.add(heading.id);
    return `<li><a href="#${heading.id}">${escapeBlogText(heading.textContent)}</a></li>`;
  });

  const aside = document.createElement('aside');
  aside.className = 'article-toc';
  aside.setAttribute('aria-labelledby', 'articleTocTitle');
  aside.innerHTML = `<details class="article-toc-box">
  <summary id="articleTocTitle" data-i18n="article_toc">${escapeBlogText(translations[currentLang].article_toc)}</summary>
  <nav aria-labelledby="articleTocTitle"><ol lang="es">${items.join('')}</ol></nav>
</details>`;
  layout.insertBefore(aside, layout.firstChild);
  layout.classList.add('has-toc');

  // Desktop keeps the list open as a sticky sidebar; mobile collapses it above the content.
  const details = aside.querySelector('details');
  const mobile = window.matchMedia(ARTICLE_TOC_MOBILE);
  const syncOpen = () => { details.open = !mobile.matches; };
  syncOpen();
  mobile.addEventListener('change', syncOpen);
  details.querySelector('summary').addEventListener('click', event => {
    if (!mobile.matches) event.preventDefault();
  });

  const links = new Map(headings.map(heading => [heading, aside.querySelector(`a[href="#${heading.id}"]`)]));
  links.forEach(link => link.addEventListener('click', () => {
    if (mobile.matches) details.open = false;
  }));

  const setActive = active => links.forEach((link, heading) => {
    if (heading === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  // Active = last heading above the top third of the viewport (first one before that).
  const updateActive = () => {
    const limit = window.innerHeight * 0.3;
    let active = headings[0];
    headings.forEach(heading => { if (heading.getBoundingClientRect().top <= limit) active = heading; });
    setActive(active);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(updateActive, { rootMargin: '0px 0px -70% 0px' });
    headings.forEach(heading => observer.observe(heading));
  }
  updateActive();
}

function initArticleShare(article) {
  const canonical = document.querySelector('link[rel="canonical"]');
  const url = canonical ? canonical.href : location.href.split('#')[0];
  const linkedin = article.querySelector('[data-article-linkedin]');
  if (linkedin) linkedin.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);

  const button = article.querySelector('[data-article-copy]');
  const status = article.querySelector('[data-article-status]');
  if (!button || !status) return;
  let timer;

  // The message keeps a data-i18n key so a language switch re-translates it.
  const announce = key => {
    status.dataset.i18n = key;
    status.lang = currentLang;
    status.textContent = translations[currentLang][key];
    status.classList.toggle('is-error', key === 'article_copy_error');
    clearTimeout(timer);
    timer = setTimeout(() => {
      delete status.dataset.i18n;
      status.textContent = '';
    }, 4000);
  };

  const legacyCopy = () => {
    const field = document.createElement('textarea');
    field.value = url;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    field.remove();
    return copied;
  };

  button.hidden = false;
  button.addEventListener('click', async () => {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url); copied = true; } catch (error) { copied = false; }
    }
    if (!copied) copied = legacyCopy();
    announce(copied ? 'article_copied' : 'article_copy_error');
  });
}

// relatedProject (relatedCase in posts.js) is the id of the case title on the home page
// (e.g. case2-name); its translation key is the same id with an underscore (case2_name).
function initArticleRelated(article) {
  const card = article.querySelector('[data-article-related]');
  const post = getBlogEntries().find(item => item.slug === article.dataset.article);
  if (!card || !post || !post.relatedProject) return;
  const nameKey = post.relatedProject.replace(/-/g, '_');
  const copy = translations[currentLang];
  card.href = '../../#' + encodeURIComponent(post.relatedProject);
  card.innerHTML = `<span class="article-related-label" data-i18n="article_related">${escapeBlogText(copy.article_related)}</span>
  <span class="article-related-name" data-i18n="${nameKey}">${escapeBlogText(copy[nameKey] || '')}</span>
  <span class="article-related-cta" data-i18n="article_related_cta">${escapeBlogText(copy.article_related_cta)}</span>`;
  card.hidden = false;
}

// UI strings inside <article lang="es"> follow the interface language.
function syncArticleUiLang(article) {
  article.querySelectorAll('[data-i18n]').forEach(el => { el.lang = currentLang; });
}

// Scroll containers (code, tables) get a tab stop only when they actually overflow.
function syncArticleScrollers(article) {
  article.querySelectorAll('.article-code, .article-table').forEach(el => {
    if (el.scrollWidth > el.clientWidth) el.tabIndex = 0;
    else el.removeAttribute('tabindex');
  });
}

function initArticle() {
  const article = document.querySelector('[data-article]');
  if (!article) return;
  initArticleToc(article);
  initArticleShare(article);
  initArticleRelated(article);
  syncArticleUiLang(article);
  syncArticleScrollers(article);
  document.addEventListener('languagechange', () => syncArticleUiLang(article));
  let frame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => syncArticleScrollers(article));
  });
}
