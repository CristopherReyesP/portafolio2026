function initCursor() {
  const star = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  dot.style.display = 'none';
  let mx = 0, my = 0, cx = 0, cy = 0;
  const trail = [];
  const MAX = 25;

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

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    star.classList.add('moving');
    clearTimeout(star._mt);
    star._mt = setTimeout(() => star.classList.remove('moving'), 120);
  });

  function draw() {
    cx += (mx - cx) * 0.2;
    cy += (my - cy) * 0.2;
    star.style.left = cx + 'px';
    star.style.top = cy + 'px';

    trail.push({ x: cx, y: cy });
    if (trail.length > MAX) trail.shift();

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
    requestAnimationFrame(draw);
  }
  draw();

  const targets = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .skill-tag, .project-card, .service-card, .why-card, .contact-link, .nav-cta, .lang-btn, .terminal-input');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => star.classList.add('hover'));
    el.addEventListener('mouseleave', () => star.classList.remove('hover'));
  });
}
