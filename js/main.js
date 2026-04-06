// Initialize particles
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ['#7c6fff', '#00e5a0'] },
    shape: { type: 'circle' },
    opacity: { value: 0.55, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.15, sync: false } },
    size: { value: 3, random: true, anim: { enable: false } },
    line_linked: { enable: true, distance: 150, color: '#7c6fff', opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1.5, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
    modes: { grab: { distance: 180, line_linked: { opacity: 0.3 } }, push: { particles_nb: 3 } }
  },
  retina_detect: true
});

// Initialize all components
initI18n();
initTerminal();
initTerminalTilt();
initCursor();
initScrollProgress();
initRevealOnScroll();
initCounters();
initCardSpotlight();
initActiveNav();
initMagneticButtons();
