function initStars() {
  const canvas = document.createElement('canvas');
  canvas.id = 'stars-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '1',
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, shootingStars = [], scrollTimeout = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnShootingStar() {
    const x = Math.random() * w;
    const y = Math.random() * h * 0.4;
    const angle = Math.PI / 3 + Math.random() * Math.PI / 4;
    const speed = 6 + Math.random() * 4;
    shootingStars.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      trail: [],
    });
  }

  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - scrollTimeout < 200) return;
    scrollTimeout = now;
    spawnShootingStar();
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.012;
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 25) ss.trail.shift();

      if (ss.life <= 0 || ss.x < -100 || ss.x > w + 100 || ss.y > h + 100) {
        shootingStars.splice(i, 1);
        continue;
      }

      for (let j = 1; j < ss.trail.length; j++) {
        const t = j / ss.trail.length;
        ctx.globalAlpha = t * ss.life * 0.6;
        ctx.strokeStyle = j === ss.trail.length - 1 ? '#7cc8ff' : '#fff';
        ctx.lineWidth = j === ss.trail.length - 1 ? 2.5 : 1;
        ctx.beginPath();
        ctx.moveTo(ss.trail[j - 1].x, ss.trail[j - 1].y);
        ctx.lineTo(ss.trail[j].x, ss.trail[j].y);
        ctx.stroke();
      }

      if (ss.life > 0.3) {
        ctx.globalAlpha = ss.life * 0.2;
        ctx.fillStyle = '#7c6fff';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = Math.min(1, ss.life * 1.5);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
}
