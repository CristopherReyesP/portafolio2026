// Home "Learning" section: up to 3 focuses from window.LEARNING_FOCUSES, each with the
// evidence that links to it — articles/notes whose `learning` includes the focus id and
// the home-page cases listed in its `projects`. "See evidence" expands the list in place.
// Depends on blog.js (escapeBlogText, getBlogEntries) and the i18n globals.

const LEARNING_MAX = 3;

// Decorative, animated illustrations (aria-hidden) keyed by focus id. Motion is CSS-only
// and stops with prefers-reduced-motion.
const LEARNING_ART = {
  // Saga: an orchestrator talks to four services; one compensation flows back.
  'distributed-systems': `<path class="la-link" d="M120 60 44 28M120 60 44 92M120 60l76-32M120 60l76 32"/>
    <path class="la-flow" d="M120 60 44 28M120 60l76-32M120 60l76 32M120 60 44 92"/>
    <path class="la-comp" d="M190 98C160 116 80 116 50 98"/><path class="la-comp-head" d="m56 92-7 6 9 3"/>
    <circle class="la-node la-core" cx="120" cy="60" r="15"/><circle class="la-node" cx="44" cy="28" r="9"/>
    <circle class="la-node" cx="44" cy="92" r="9"/><circle class="la-node" cx="196" cy="28" r="9"/>
    <circle class="la-node la-node--warn" cx="196" cy="92" r="9"/><path class="la-glyph" d="M114 60h12M120 54v12"/>`,
  // Platform: a pipeline delivers into a cluster of pods.
  'cloud-platform': `<rect class="la-link" x="78" y="12" width="148" height="96" rx="10"/>
    <path class="la-link" d="M14 60h52"/><path class="la-flow" d="M14 60h52"/><path class="la-glyph" d="m60 54 7 6-7 6"/>
    <circle class="la-node" cx="22" cy="60" r="7"/>
    ${[0, 1, 2].map(col => [0, 1].map(row => `<rect class="la-pod" style="--d:${(col * 2 + row) * 0.35}s" x="${94 + col * 42}" y="${26 + row * 38}" width="32" height="28" rx="5"/>`).join('')).join('')}`,
  // Agent loop: a model orbited by the tools it calls.
  'ai-engineering': `<circle class="la-link la-dash" cx="120" cy="60" r="44"/>
    <g class="la-orbit"><circle class="la-dot" cx="120" cy="16" r="4"/></g>
    <rect class="la-node la-core" x="102" y="42" width="36" height="36" rx="8"/><path class="la-glyph" d="M112 56h16M112 64h10"/>
    <rect class="la-node" x="112" y="8" width="16" height="16" rx="3"/><rect class="la-node" x="152" y="72" width="16" height="16" rx="3"/>
    <rect class="la-node" x="72" y="72" width="16" height="16" rx="3"/>
    <path class="la-link" d="M40 30h24M40 42h16M176 30h24M184 42h16"/>`
};

function renderLearningCard(focus, index) {
  const copy = translations[currentLang];
  const lang = currentLang;
  const entries = getBlogEntries().filter(entry => (entry.learning || []).includes(focus.id));
  const articles = entries.filter(entry => entry.type === 'article');
  const notes = entries.filter(entry => entry.type === 'note');
  const cases = (focus.projects || []).filter(id => copy[id.replace(/-/g, '_')]);
  const status = focus.status.map(key => copy[`learning_status_${key}`]).join(' · ');
  const topics = (focus.topics[lang] || focus.topics.es).map(topic => `<li class="chip">${escapeBlogText(topic)}</li>`).join('');

  // Knowledge cycle: a stage lights up only when there is real evidence for it.
  const stages = [['learn', true], ['practice', true], ['note', notes.length > 0],
    ['article', articles.length > 0], ['project', cases.length > 0]];
  const cycle = stages.map(([key, on]) => `<li class="${on ? 'is-on' : ''}"><span>${escapeBlogText(copy[`learning_cycle_${key}`])}</span></li>`).join('');
  const stat = (key, value) => `<div class="learning-stat${value ? '' : ' is-empty'}"><dt>${escapeBlogText(copy[key])}</dt><dd>${value}</dd></div>`;

  const group = (key, items) => items.length ? `<div class="learning-group">
      <h4 class="learning-group-title">${escapeBlogText(copy[key])}</h4>
      <ul>${items.join('')}</ul>
    </div>` : '';
  const entryLink = entry => `<li><a href="${entry.path}" lang="es">${escapeBlogText(entry.title)}</a></li>`;
  const caseLink = id => `<li><a href="#${encodeURIComponent(id)}">${escapeBlogText(copy[id.replace(/-/g, '_')])}</a></li>`;
  const hasEvidence = entries.length || cases.length;
  const panelId = `learningEvidence${index}`;

  return `<article class="learning-card panel learning-card--${focus.tone || 'accent'}" aria-labelledby="learning-${focus.id}">
  <header class="learning-bar">
    <span class="learning-index">${escapeBlogText(copy.learning_focus)} 0${index + 1}</span>
    <span class="learning-status learning-status--${focus.status[0]}"><span class="learning-pulse" aria-hidden="true"></span>${escapeBlogText(status)}</span>
  </header>
  <div class="learning-art" aria-hidden="true"><svg viewBox="0 0 240 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">${LEARNING_ART[focus.id] || ''}</svg></div>
  <h3 class="learning-name" id="learning-${focus.id}">${escapeBlogText(focus.title[lang] || focus.title.es)}</h3>
  <ul class="learning-topics" aria-label="${escapeBlogText(copy.learning_topics)}">${topics}</ul>
  <ol class="learning-cycle" aria-label="${escapeBlogText(copy.learning_cycle)}">${cycle}</ol>
  <dl class="learning-stats">${stat('learning_stat_articles', articles.length)}${stat('learning_stat_notes', notes.length)}${stat('learning_stat_cases', cases.length)}</dl>
  ${hasEvidence ? `<button type="button" class="learning-toggle" aria-expanded="false" aria-controls="${panelId}">${escapeBlogText(copy.learning_show)}</button>
  <div class="learning-evidence" id="${panelId}" hidden>
    ${group('learning_group_article', articles.map(entryLink))}
    ${group('learning_group_note', notes.map(entryLink))}
    ${group('learning_group_case', cases.map(caseLink))}
    ${entries.length ? `<a class="learning-all" href="blog/?learning=${encodeURIComponent(focus.id)}">${escapeBlogText(copy.learning_all)}</a>` : ''}
  </div>` : `<p class="learning-empty">${escapeBlogText(copy.learning_no_evidence)}</p>`}
</article>`;
}

function initLearning() {
  const grid = document.querySelector('[data-learning]');
  if (!grid || !window.LEARNING_FOCUSES) return;
  const focuses = window.LEARNING_FOCUSES.slice(0, LEARNING_MAX);
  // Re-rendered on language change; open panels stay open.
  const render = () => {
    const open = new Set([...grid.querySelectorAll('.learning-toggle[aria-expanded="true"]')].map(b => b.getAttribute('aria-controls')));
    grid.innerHTML = focuses.map(renderLearningCard).join('');
    grid.querySelectorAll('.learning-toggle').forEach(button => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const setOpen = isOpen => {
        button.setAttribute('aria-expanded', String(isOpen));
        button.textContent = translations[currentLang][isOpen ? 'learning_hide' : 'learning_show'];
        panel.hidden = !isOpen;
      };
      setOpen(open.has(panel.id));
      button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    });
    grid.querySelectorAll('.learning-card').forEach(card => card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    }));
  };
  render();
  document.addEventListener('languagechange', render);
}
