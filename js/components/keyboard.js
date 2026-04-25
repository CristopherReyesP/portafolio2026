function initKeyboardNav() {
  var sections = document.querySelectorAll('section[id]');
  var currentSection = 0;
  var sectionProgress = document.getElementById('sectionProgress');

  // Create dots for each section
  if (sectionProgress) {
    sections.forEach(function (section, index) {
      var dot = document.createElement('div');
      dot.className = 'section-progress-dot';
      dot.title = section.id || 'section ' + (index + 1);
      dot.dataset.index = index;
      dot.addEventListener('click', function () {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      sectionProgress.appendChild(dot);
    });
  }

  function updateDots() {
    if (!sectionProgress) return;
    var dots = sectionProgress.querySelectorAll('.section-progress-dot');
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === currentSection);
    });
  }

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentSection = index;
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateDots();
  }

  document.addEventListener('keydown', function (e) {
    var tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    switch (e.key) {
      case 'j':
      case 'ArrowDown':
        e.preventDefault();
        scrollToSection(currentSection + 1);
        break;
      case 'k':
      case 'ArrowUp':
        e.preventDefault();
        scrollToSection(currentSection - 1);
        break;
      case 'g':
        if (e.shiftKey) {
          e.preventDefault();
          scrollToSection(sections.length - 1);
        } else if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          scrollToSection(0);
        }
        break;
      case 'G':
        e.preventDefault();
        scrollToSection(sections.length - 1);
        break;
      case '?':
        e.preventDefault();
        showKeyboardHelp();
        break;
    }
  });

  function showKeyboardHelp() {
    var existing = document.getElementById('keyboardHelp');
    if (existing) {
      existing.remove();
      return;
    }
    var help = document.createElement('div');
    help.id = 'keyboardHelp';
    help.innerHTML = '<div class="kh-title">Keyboard Shortcuts</div><div class="kh-row"><span class="kh-key">j</span> / <span class="kh-key">↓</span> <span>next section</span></div><div class="kh-row"><span class="kh-key">k</span> / <span class="kh-key">↑</span> <span>prev section</span></div><div class="kh-row"><span class="kh-key">gg</span> <span>first section</span></div><div class="kh-row"><span class="kh-key">G</span> <span>last section</span></div><div class="kh-row"><span class="kh-key">?</span> <span>toggle this help</span></div><div class="kh-close">press ? to close</div>';
    document.body.appendChild(help);
    setTimeout(function () { help.classList.add('visible'); }, 10);
  }

  window.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop;
    var prevSection = currentSection;
    for (var i = sections.length - 1; i >= 0; i--) {
      if (scrollTop >= sections[i].offsetTop - 100) {
        currentSection = i;
        break;
      }
    }
    if (prevSection !== currentSection) {
      updateDots();
    }
  });

  updateDots();
}