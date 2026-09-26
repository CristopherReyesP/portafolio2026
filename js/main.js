// Initialize critical components first (visible immediately)
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) initStars();
initI18n();
if (document.getElementById('terminal')) {
  initTerminal();
  initTerminalTilt();
  initTerminalWindow();
  initTerminalFab();
}
initBlogList();
if (document.querySelector('[data-article]')) initArticle();
initCursor();
initScrollProgress();
//initKeyboardNav();
initRevealOnScroll();
initCounters();
initCardSpotlight();
// Blog pages keep a static active Blog link (no home sections to track).
if (!document.body.classList.contains('blog-page')) initActiveNav();
initSectionRail();
initMagneticButtons();
initGallery();

// Initialize particles AFTER first paint (non-blocking)
var initParticles = function() {
  var isMobile = window.innerWidth < 768;
  // Colors come from the design tokens in css/base.css
  var styles = getComputedStyle(document.documentElement);
  var token = function(name, fallback) { return styles.getPropertyValue(name).trim() || fallback; };
  var accent = token('--accent', '#1fe0b0');
  var cyan = token('--accent-secondary', '#3cc8e8');
  var purple = token('--purple', '#8f82ff');
  particlesJS('particles-js', {
    particles: {
      number: { value: isMobile ? 40 : 80, density: { enable: true, value_area: 800 } },
      color: { value: [accent, cyan, purple] },
      shape: { type: 'circle' },
      opacity: { value: 0.45, random: true, anim: { enable: !prefersReducedMotion, speed: 0.6, opacity_min: 0.12, sync: false } },
      size: { value: 2.6, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: isMobile ? 120 : 150, color: accent, opacity: 0.14, width: 1 },
      // particles.js 2.0 crashes when move is disabled and density removes particles on
      // init (it draws before the line color exists), so reduced motion keeps it on at speed 0
      move: { enable: true, speed: prefersReducedMotion ? 0 : 1.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: !isMobile, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.32 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
};

// Defer non-critical to idle time
if ('requestIdleCallback' in window) {
  requestIdleCallback(initMascot);
} else {
  setTimeout(initMascot, 300);
}

// Defer particles to idle time — hero paints first
if ('requestIdleCallback' in window) {
  requestIdleCallback(initParticles);
} else {
  setTimeout(initParticles, 200);
}
