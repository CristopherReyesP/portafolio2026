// Home "Learning" section: up to 3 focuses from window.LEARNING_FOCUSES, each with the
// evidence that links to it — articles/notes whose `learning` includes the focus id and
// the home-page cases listed in its `projects`. "See evidence" expands the list in place.
// Depends on blog.js (escapeBlogText, getBlogEntries) and the i18n globals.

const LEARNING_MAX = 3;

function learningCount(copy, kind, count) {
  return copy[`learning_${kind}_${count === 1 ? 'one' : 'many'}`].replace('{count}', count);
}

function renderLearningCard(focus, index) {
  const copy = translations[currentLang];
  const lang = currentLang;
  const entries = getBlogEntries().filter(entry => (entry.learning || []).includes(focus.id));
  const articles = entries.filter(entry => entry.type === 'article');
  const notes = entries.filter(entry => entry.type === 'note');
  const cases = (focus.projects || []).filter(id => copy[id.replace(/-/g, '_')]);
  const summary = [
    articles.length && learningCount(copy, 'articles', articles.length),
    notes.length && learningCount(copy, 'notes', notes.length),
    cases.length && learningCount(copy, 'cases', cases.length)
  ].filter(Boolean).join(' · ') || copy.learning_no_evidence;
  const status = focus.status.map(key => copy[`learning_status_${key}`]).join(' · ');
  const topics = (focus.topics[lang] || focus.topics.es).map(topic => `<li>${escapeBlogText(topic)}</li>`).join('');

  const group = (key, items) => items.length ? `<div class="learning-group">
      <h4 class="learning-group-title">${escapeBlogText(copy[key])}</h4>
      <ul>${items.join('')}</ul>
    </div>` : '';
  const entryLink = entry => `<li><a href="${entry.path}" lang="es">${escapeBlogText(entry.title)}</a></li>`;
  const caseLink = id => `<li><a href="#${encodeURIComponent(id)}">${escapeBlogText(copy[id.replace(/-/g, '_')])}</a></li>`;
  const hasEvidence = entries.length || cases.length;
  const panelId = `learningEvidence${index}`;

  return `<article class="learning-card panel" aria-labelledby="learning-${focus.id}">
  <header class="learning-head">
    <span class="learning-index" aria-hidden="true">0${index + 1}</span>
    <h3 class="learning-name" id="learning-${focus.id}">${escapeBlogText(focus.title[lang] || focus.title.es)}</h3>
  </header>
  <ul class="learning-topics" aria-label="${escapeBlogText(copy.learning_topics)}">${topics}</ul>
  <p class="learning-status"><span>${escapeBlogText(copy.learning_status_label)}</span> <strong class="learning-status-${focus.status[0]}">${escapeBlogText(status)}</strong></p>
  <p class="learning-summary">${escapeBlogText(summary)}</p>
  ${hasEvidence ? `<button type="button" class="learning-toggle" aria-expanded="false" aria-controls="${panelId}">${escapeBlogText(copy.learning_show)}</button>
  <div class="learning-evidence" id="${panelId}" hidden>
    ${group('learning_group_article', articles.map(entryLink))}
    ${group('learning_group_note', notes.map(entryLink))}
    ${group('learning_group_case', cases.map(caseLink))}
    ${entries.length ? `<a class="learning-all" href="blog/?learning=${encodeURIComponent(focus.id)}">${escapeBlogText(copy.learning_all)}</a>` : ''}
  </div>` : ''}
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
  };
  render();
  document.addEventListener('languagechange', render);
}
