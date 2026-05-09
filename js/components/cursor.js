function initCursor() {
  const star = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  dot.style.display = 'none';

  const cv = document.createElement('canvas');
  Object.assign(cv.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9999',
  });
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');

  let w, h;
  function resize() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const trail = [];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const len = trail.length;
    if (len > 1) {
      for (let i = 1; i < len; i++) {
        const t = i / len;
        ctx.globalAlpha = t * 0.6;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5 + (i === len - 1 ? 0.5 : 0);
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (trail._fading && trail.length > 0) trail.shift();

    requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('mousemove', (e) => {
    star.style.left = e.clientX + 'px';
    star.style.top = e.clientY + 'px';
    star.classList.add('moving');
    clearTimeout(star._mt);
    star._mt = setTimeout(() => star.classList.remove('moving'), 120);

    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > 25) trail.shift();
    trail._fading = false;
    clearTimeout(trail._fadeTimer);
    trail._fadeTimer = setTimeout(() => { trail._fading = true; }, 250);
  });

  const targets = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .skill-tag, .project-card, .service-card, .why-card, .contact-link, .nav-cta, .lang-btn, .terminal-input, .pomo-adjust-btn, .pomo-close, #pomoMainBtn, #pomoResetBtn');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => star.classList.add('hover'));
    el.addEventListener('mouseleave', () => star.classList.remove('hover'));
  });
}
