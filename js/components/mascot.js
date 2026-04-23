function initMascot() {
  var el = document.getElementById('mascot');
  if (!el || window.innerWidth < 768) return;

  // Measure dimensions (element starts with display:none)
  el.style.visibility = 'hidden';
  el.style.display = 'block';
  var ew = el.offsetWidth || 48;
  var eh = el.offsetHeight || 50;
  el.style.display = '';
  el.style.visibility = '';

  var m = 5;
  var summoned = false;
  var currentSurface = 'bottom';
  var currentRot = 0;
  var lastSurface = 'bottom';
  var mouseMoveCount = 0;

  // --- Perimeter system ---
  // The mascot walks along the viewport edges: bottom → right → top → left
  // pos = distance along the perimeter (0 = bottom-left corner)
  function getPerimeter() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var nav = document.querySelector('nav');
    var navH = nav ? nav.offsetHeight : 0;
    var leftCX = m + ew / 2;
    var rightCX = vw - m - ew / 2;
    var topCY = navH + 0;
    var bottomCY = vh - m - eh / 2;
    var hRange = Math.max(rightCX - leftCX, 1);
    var vRange = Math.max(bottomCY - topCY, 1);
    return {
      vw: vw, vh: vh,
      leftCX: leftCX, rightCX: rightCX,
      topCY: topCY, bottomCY: bottomCY,
      hRange: hRange, vRange: vRange,
      total: 2 * (hRange + vRange)
    };
  }

  function posToScreen(pos) {
    var p = getPerimeter();
    pos = ((pos % p.total) + p.total) % p.total;

    var rot = 0, surface = 'bottom', cx, cy;
    
    if (pos < p.hRange) {
      cx = p.leftCX + pos; cy = p.bottomCY; rot = 0; surface = 'bottom';
    } else {
      pos -= p.hRange;
      if (pos < p.vRange) {
        cx = p.rightCX; cy = p.bottomCY - pos; rot = -90; surface = 'right';
      } else {
        pos -= p.vRange;
        if (pos < p.hRange) {
          cx = p.rightCX - pos; cy = p.topCY; rot = 180; surface = 'top';
        } else {
          pos -= p.hRange;
          cx = p.leftCX; cy = p.topCY + pos; rot = 90; surface = 'left';
        }
      }
    }
    
    var diff = rot - currentRot;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    var isSurfaceChange = (surface !== currentSurface && surface === 'top');
    if (isSurfaceChange) {
      diff = rot - currentRot;
    }
    currentRot += diff;
    
    return { cx: cx, cy: cy, rot: currentRot, surface: surface };
  }

  function applyPos(screen) {
    var tx = screen.cx - ew / 2;
    var ty = screen.cy - eh / 2;
    
    // Adjust position so feet touch the surface, not center
    if (screen.surface === 'right') {
      tx += ew / 2;
    } else if (screen.surface === 'left') {
      tx -= ew / 2;
    }
    // top: no adjustment needed
    
    el.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + screen.rot + 'deg)';
    if (screen.surface !== currentSurface) {
      el.classList.remove('on-' + currentSurface);
      el.classList.add('on-' + screen.surface);
      lastSurface = currentSurface;
      currentSurface = screen.surface;
      if (screen.surface === 'top') currentRot = 180;
      else if (screen.surface === 'left') currentRot = 90;
      else if (screen.surface === 'right') currentRot = -90;
      else currentRot = 0;
    }
  }

  // --- State ---
  var per = getPerimeter();
  var state = {
    pos: per.hRange - 40,
    targetPos: 0,
    idle: true,
    sleeping: true,
    idleTimer: 0,
    lastBlink: 0,
    lastAction: 0,
    paused: false,
    scaredTimer: 0,
    runningTimer: 0
  };

  applyPos(posToScreen(state.pos));
  el.classList.add('hidden', 'on-bottom');

  // Expose wake function for terminal command
  window.mascotWake = function () {
    summoned = true;
    state.sleeping = false;
    state.lastAction = Date.now();
    state.idleTimer = Date.now();
  };
  
  // Expose dance function for terminal command
  window.mascotDance = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'scared', 'dizzy');
    el.classList.add('dance');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('dance');
      state.idleTimer = Date.now();
    }, 3000);
  };
  
  // Expose scare function for terminal command
  window.mascotScare = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    el.classList.remove('hidden', 'sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'dizzy');
    el.classList.add('scare');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('scare');
      state.idleTimer = Date.now();
    }, 2000);
  };
  
  // Expose love function for terminal command
  var loveInterval = null;
  window.mascotLove = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'scare', 'dizzy');
    el.classList.add('love');
    state.lastAction = Date.now();
    loveInterval = setInterval(createHeart, 200);
    setTimeout(function () {
      el.classList.remove('love');
      clearInterval(loveInterval);
      loveInterval = null;
      state.idleTimer = Date.now();
    }, 2500);
  };
  
  // Expose puff function for terminal command
  window.mascotPuff = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'scare', 'dizzy', 'love');
    el.classList.add('puff');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('puff');
      state.idleTimer = Date.now();
    }, 3000);
  };
  
  // Expose wave function for terminal command
  window.mascotWave = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'scare', 'dizzy', 'love', 'puff');
    el.classList.add('wave');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('wave');
      state.idleTimer = Date.now();
    }, 2500);
  };
  
  // Expose angry function for terminal command
  window.mascotAngry = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'scare', 'dizzy', 'love', 'puff', 'wave');
    el.classList.add('angry');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('angry');
      state.idleTimer = Date.now();
    }, 2000);
  };
  
  // Expose pushhead function for terminal command
  window.mascotPushHead = function () {
    summoned = true;
    state.sleeping = false;
    state.idle = true;
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
    el.classList.remove('sleeping', 'walking');
    el.classList.remove('climbing', 'climbing-wall', 'jump', 'dance', 'scare', 'dizzy', 'love', 'puff', 'wave', 'angry');
    el.classList.add('pushhead');
    state.lastAction = Date.now();
    setTimeout(function () {
      el.classList.remove('pushhead');
      state.idleTimer = Date.now();
    }, 2000);
  };
  
  // Create floating hearts
  function createHeart() {
    var heart = document.createElement('div');
    heart.innerHTML = '♥';
    heart.className = 'mascot-heart';
    var rect = el.getBoundingClientRect();
    heart.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 30) + 'px';
    heart.style.top = (rect.top - 10) + 'px';
    document.body.appendChild(heart);
    setTimeout(function () { heart.remove(); }, 1500);
  }

  // --- Eye tracking ---
  var pupils = el.querySelectorAll('.mascot-pupil');
  document.addEventListener('mousemove', function (e) {
    var rect = el.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = e.clientX - cx;
    var dy = e.clientY - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var px = (dx / Math.max(dist, 1)) * 2.5;
    var py = (dy / Math.max(dist, 1)) * 2.5;
    pupils.forEach(function (p) { p.style.transform = 'translate(' + px + 'px,' + py + 'px)'; });
    
    mouseMoveCount++;
    
    // Wake up if mouse is near (only after 2+ moves to avoid first-time trigger)
    if (state.sleeping && dist < 150 && mouseMoveCount > 2) {
      state.sleeping = false;
      el.classList.remove('sleeping');
      state.lastAction = Date.now();
    }
    
    // Scared when mouse is ON the mascot
    if (summoned && dist < 20 && !state.scaredTimer) {
      el.classList.add('scared');
      state.scaredTimer = Date.now();
    } else if (state.scaredTimer && Date.now() - state.scaredTimer > 600) {
      el.classList.remove('scared');
      state.scaredTimer = 0;
    }
  });

  // --- Drag & drop ---
  var drag = { active: false, offsetX: 0, offsetY: 0, moved: false, lastX: 0, lastY: 0, prevX: 0, prevY: 0, prevTime: 0, speed: 0, dizzyStart: 0 };

  el.addEventListener('mousedown', function (e) {
    e.preventDefault();
    if (state.sleeping) {
      state.sleeping = false;
      el.classList.remove('sleeping');
    }
    drag.active = true;
    drag.moved = false;
    var rect = el.getBoundingClientRect();
    drag.offsetX = e.clientX - rect.left;
    drag.offsetY = e.clientY - rect.top;
    drag.prevTime = Date.now();
    drag.prevX = rect.left;
    drag.prevY = rect.top;
    drag.lastX = rect.left;
    drag.lastY = rect.top;
    drag.dizzyStart = 0;
    state.paused = true;
    state.idle = true;
    el.classList.remove('walking', 'jump');
    el.classList.remove('dizzy');
    el.classList.add('dragging');
    state.lastAction = Date.now();
  });

  document.addEventListener('mousemove', function (e) {
    if (!drag.active) return;
    drag.moved = true;
    var nx = e.clientX - drag.offsetX;
    var ny = e.clientY - drag.offsetY;
    nx = Math.max(0, Math.min(nx, window.innerWidth - ew));
    ny = Math.max(0, Math.min(ny, window.innerHeight - eh));
    
    var now = Date.now();
    var dt = now - drag.prevTime;
    
    if (dt > 30) {
      var dx = nx - drag.prevX;
      var dy = ny - drag.prevY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      drag.speed = dist / dt * 1000;
      drag.prevX = nx;
      drag.prevY = ny;
      drag.prevTime = now;
    } else {
      drag.speed = 0;
    }
    
    if (drag.speed > 2200 && !drag.dizzyStart) {
      el.classList.add('dizzy');
      drag.dizzyStart = now;
    }
    
    if (drag.dizzyStart && now - drag.dizzyStart > 1000) {
      el.classList.remove('dizzy');
      drag.dizzyStart = 0;
      drag.speed = 0;
    }
    
    drag.lastX = nx;
    drag.lastY = ny;
    el.style.transform = 'translate(' + nx + 'px,' + ny + 'px) rotate(0deg)';
  });

  document.addEventListener('mouseup', function () {
    if (!drag.active) return;
    drag.active = false;
    drag.speed = 0;
    drag.dizzyStart = 0;
    el.classList.remove('dragging');
    el.classList.remove('dizzy');

    // Fall back to floor at dropped X position
    var p = getPerimeter();
    var dropCX = drag.lastX + ew / 2;
    dropCX = Math.max(p.leftCX, Math.min(dropCX, p.rightCX));
    state.pos = dropCX - p.leftCX;

    el.classList.add('dropping');
    el.classList.remove('on-right', 'on-top', 'on-left');
    if (!el.classList.contains('on-bottom')) el.classList.add('on-bottom');
    currentSurface = 'bottom';
    applyPos(posToScreen(state.pos));

    setTimeout(function () {
      el.classList.remove('dropping');
      state.paused = false;
      state.idleTimer = Date.now();
      state.lastAction = Date.now();
    }, 400);
  });

  // --- Click to jump (or double click) ---
  var clickCount = 0;
  el.addEventListener('click', function () {
    clickCount++;
    if (clickCount === 1) {
      setTimeout(function () {
        if (clickCount === 1) {
          // Single click - jump
          if (!drag.moved || drag.lastX === drag.prevX && drag.lastY === drag.prevY) {
            el.classList.remove('jump');
            void el.offsetWidth;
            el.classList.add('jump');
            state.lastAction = Date.now();
            setTimeout(function () { el.classList.remove('jump'); }, 500);
          }
        } else if (clickCount === 2) {
          // Double click - spin
          el.classList.remove('spin');
          void el.offsetWidth;
          el.classList.add('spin');
          state.lastAction = Date.now();
          setTimeout(function () { el.classList.remove('spin'); }, 600);
        }
        clickCount = 0;
      }, 250);
    }
  });
  
  function createTrail() {
    var trail = document.createElement('div');
    trail.className = 'mascot-trail';
    var rect = el.getBoundingClientRect();
    trail.style.left = (rect.left + rect.width / 2) + 'px';
    trail.style.top = (rect.top + rect.height / 2) + 'px';
    el.parentNode.appendChild(trail);
    setTimeout(function () { trail.remove(); }, 300);
  }

  // --- Movement AI ---
  function pickTarget() {
    var p = getPerimeter();
    state.targetPos = Math.random() * p.total;
    state.idle = false;
    state.lastAction = Date.now();
  }

  // --- Main loop ---
  function tick() {
    var now = Date.now();
    
    // Skip movement updates while dancing
    if (el.classList.contains('dance') || el.classList.contains('scare')) {
      requestAnimationFrame(tick);
      return;
    }

    // Blink every 3-5s
    if (now - state.lastBlink > 3000 + Math.random() * 2000) {
      if (!state.sleeping) {
        el.classList.add('blink');
        setTimeout(function () { el.classList.remove('blink'); }, 150);
      }
      state.lastBlink = now;
    }

    // Sleep after 15s of no interaction
    if (!state.sleeping && now - state.lastAction > 15000 && state.idle) {
      state.sleeping = true;
      el.classList.add('sleeping');
    }

    if (state.sleeping || state.paused) {
      requestAnimationFrame(tick);
      return;
    }

    // Walking along perimeter
    if (!state.idle) {
      var p = getPerimeter();
      var diff = state.targetPos - state.pos;
      // Take shortest path around the perimeter
      if (diff > p.total / 2) diff -= p.total;
      if (diff < -p.total / 2) diff += p.total;

      if (Math.abs(diff) < 2) {
        // Arrived
        state.idle = true;
        el.classList.remove('walking');
        state.idleTimer = now;
      } else {
        var dir = diff > 0 ? 1 : -1;
        var speed = 1.2;
        if (currentSurface === 'right' || currentSurface === 'left') {
          speed = 0.6;
          el.classList.remove('climbing');
          el.classList.add('climbing-wall');
        } else if (currentSurface === 'top') {
          speed = 0.6;
          el.classList.remove('climbing-wall');
          el.classList.add('climbing');
        } else {
          el.classList.remove('climbing', 'climbing-wall');
        }
        
        // Remove scared when slows down
        if (speed < 1.0 && state.scaredTimer) {
          el.classList.remove('scared');
          state.scaredTimer = 0;
        }
        
        state.pos = ((state.pos + dir * speed) % p.total + p.total) % p.total;

        applyPos(posToScreen(state.pos));
        el.classList.add('walking');

        // CW = facing right (no flip), CCW = facing left (flip)
        if (dir < 0) el.classList.add('face-left');
        else el.classList.remove('face-left');
      }
    }

    // Pick new target after 3-7s idle
    if (state.idle && now - state.idleTimer > 3000 + Math.random() * 4000) {
      pickTarget();
    }

    requestAnimationFrame(tick);
  }

  state.idleTimer = Date.now();
  requestAnimationFrame(tick);

  // --- Resize ---
  window.addEventListener('resize', function () {
    if (!summoned) return;
    if (window.innerWidth < 768) {
      el.classList.add('hidden');
    } else {
      el.classList.remove('hidden');
      var p = getPerimeter();
      state.pos = state.pos % p.total;
      applyPos(posToScreen(state.pos));
    }
  });
}
