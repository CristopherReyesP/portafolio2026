const commands = {
  help: () => `<span class="t-label">Available commands:</span><br>
    <span class="t-str">whoami</span> <span class="t-response">— a quick introduction</span><br>
    <span class="t-str">stack</span> <span class="t-response">— technologies I use daily</span><br>
    <span class="t-str">experience</span> <span class="t-response">— years & current role</span><br>
    <span class="t-str">contact</span> <span class="t-response">— how to reach me</span><br>
    <span class="t-str">projects</span> <span class="t-response">— what I've built</span><br>
    <span class="t-str">hire</span> <span class="t-response">— remote role availability</span><br>
    <span class="t-str">resume</span> <span class="t-response">— download my CV</span><br>
    <span class="t-str">github</span> <span class="t-response">— open GitHub profile</span><br>
    <span class="t-str">linkedin</span> <span class="t-response">— open LinkedIn profile</span><br>
    <span class="t-str">email</span> <span class="t-response">— open email client</span><br>
    <span class="t-str">matrix</span> <span class="t-response">— ???</span><br>
    <span class="t-str">pet</span> <span class="t-response">— summon the blob</span><br>
    <span class="t-str">dance</span> <span class="t-response">— make the blob dance</span><br>
    <span class="t-str">scare</span> <span class="t-response">— scare the blob</span><br>
    <span class="t-str">love</span> <span class="t-response">— blob falls in love</span><br>
    <span class="t-str">puff</span> <span class="t-response">— inflate like a balloon</span><br>
    <span class="t-str">wave</span> <span class="t-response">— says hello</span><br>
    <span class="t-str">extasis</span> <span class="t-response">— TURBO MODE</span><br>
    <span class="t-str">angry</span> <span class="t-response">— makes the blob angry</span><br>
    <span class="t-str">pushhead</span> <span class="t-response">— nope nope nope</span><br>
    <span class="t-str">melt</span> <span class="t-response">— melts into a puddle</span><br>
    <span class="t-str">rainbow</span> <span class="t-response">— taste the rainbow</span><br>
    <span class="t-str">clone</span> <span class="t-response">— mitosis!</span><br>
    <span class="t-str">secret</span> <span class="t-response">— ???</span><br>
    <span class="t-str">pomodoro</span> <span class="t-response">— open a Pomodoro timer</span><br>
    <span class="t-str">clear</span> <span class="t-response">— clear terminal</span>`,
  whoami: () => `<span class="t-label">Backend Engineer</span> <span class="t-response">building banking production systems.</span><br>
    <span class="t-str">Experience:</span> <span class="t-response">5+ years in production systems.</span><br>
    <span class="t-str">Availability:</span> <span class="t-response">Open to remote international roles · GMT-6.</span>`,
  stack: () => `<span class="t-label">Production stack:</span><br>
    <span class="t-str">Backend:</span> <span class="t-response">NestJS, .NET/C#, Node.js, TypeScript</span><br>
    <span class="t-str">Database:</span> <span class="t-response">Oracle, PL/SQL, PostgreSQL, SQL Server</span><br>
    <span class="t-str">Infra:</span> <span class="t-response">OpenShift, Docker, Keycloak, CI/CD</span><br>
    <span class="t-str">Frontend:</span> <span class="t-response">React, Vite, Socket.io, WebRTC</span><br>
    <span class="t-str">Personal projects:</span> <span class="t-response">Godot 4, game dev</span>`,
  experience: () => `<span class="t-label">5+ years in production systems</span><br>
    <span class="t-str">Current:</span> <span class="t-response">Backend Software Engineer (Technical Analyst I) @ BANTRAB</span><br>
    <span class="t-str">Focus:</span> <span class="t-response">Banking transactions, 18+ microservices</span><br>
    <span class="t-str">Highlight:</span> <span class="t-response">Keycloak migration, 0 downtime</span>`,
  contact: () => `<span class="t-label">Let's talk:</span><br>
    <span class="t-str">Email:</span> <span class="t-response">reyescristop@gmail.com</span><br>
    <span class="t-str">LinkedIn:</span> <span class="t-response">linkedin.com/in/cristopherrp</span><br>
    <span class="t-str">GitHub:</span> <span class="t-response">github.com/CristopherReyesP</span><br>
    <span class="t-str">Timezone:</span> <span class="t-response">CST (GMT-6)</span>`,
  projects: () => `<span class="t-label">Production & personal:</span><br>
    <span class="t-str">→</span> <span class="t-response">Keycloak v11→v19 migration (0 downtime)</span><br>
    <span class="t-str">→</span> <span class="t-response">Saga Pattern — banking double reversal fix</span><br>
    <span class="t-str">→</span> <span class="t-response">PL/SQL monolith → 18+ microservices</span><br>
    <span class="t-str">→</span> <span class="t-response">XYRA — Survival MMO (Godot 4 + Nakama)</span><br>
    <span class="t-str">→</span> <span class="t-response">Línea Muerta — multiplayer mini-games</span>`,
  hire: () => `<span class="t-label">Open to international remote backend roles</span><br>
    <span class="t-str">Role:</span> <span class="t-response">Full-time Backend Engineer</span><br>
    <span class="t-str">Timezone:</span> <span class="t-response">GMT-6</span><br>
    <span class="t-str">→</span> <a href="#contact" style="color:var(--accent)">Get in touch</a>`,
  resume: () => `<span class="t-label">Downloading CV...</span><br><span class="t-comment">// ${window.location.origin}/resume/CV_Cristopher_Reyes.pdf</span><br><span class="t-str">→</span> <a href="resume/CV_Cristopher_Reyes.pdf" download style="color:var(--accent)">Click here if download didn't start</a>`,
  github: () => {
    window.open('https://github.com/CristopherReyesP', '_blank');
    return `<span class="t-label">Opening GitHub...</span><br><span class="t-comment">// github.com/CristopherReyesP</span>`;
  },
  linkedin: () => {
    window.open('https://www.linkedin.com/in/cristopherrp', '_blank');
    return `<span class="t-label">Opening LinkedIn...</span><br><span class="t-comment">// linkedin.com/in/cristopherrp</span>`;
  },
  email: () => {
    window.open('mailto:reyescristop@gmail.com', '_blank');
    return `<span class="t-label">Opening email client...</span><br><span class="t-comment">// reyescristop@gmail.com</span>`;
  },
  matrix: () => {
    runMatrix();
    return `<span class="t-label">Wake up, Neo...</span><br><span class="t-comment">// follow the white rabbit</span>`;
  },
  secret: () => `<span class="t-response">while (alive) {</span><br>
    <span class="t-response">&nbsp;&nbsp;eat();</span><br>
    <span class="t-response">&nbsp;&nbsp;code();</span><br>
    <span class="t-response">&nbsp;&nbsp;sleep(maybe);</span><br>
    <span class="t-response">&nbsp;&nbsp;repeat();</span><br>
    <span class="t-response">}</span><br>
    <span class="t-comment">// Also building a game about alien planets 🛸</span><br>
    <span class="t-comment">// psst... try typing "pet"</span>`,
  pet: (args) => {
    var mascot = document.getElementById('mascot');
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    var colors = { red: '#ff5f57', blue: '#5f9fff', green: '' };

    // Color change
    if (args && colors.hasOwnProperty(args)) {
      if (mascot.classList.contains('hidden')) {
        return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
      }
      var body = mascot.querySelector('.mascot-body');
      body.style.background = colors[args] || '';
      body.style.boxShadow = colors[args]
        ? '0 4px 20px ' + colors[args] + '80, inset 0 -6px 12px rgba(0,0,0,0.15)'
        : '';
      mascot.classList.add('jump');
      setTimeout(function() { mascot.classList.remove('jump'); }, 500);
      return '<span class="t-response">Blob color changed to <span style="color:' + (colors[args] || 'var(--accent)') + '">' + (args || 'green') + '</span>!</span>';
    }

    if (args) {
      return '<span class="t-response">Unknown color. Try: <span style="color:#ff5f57">red</span>, <span style="color:#5f9fff">blue</span>, <span style="color:var(--accent)">green</span></span>';
    }

    // First summon
    if (!mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob is already here! Click it for actions, or try <span style="color:var(--accent)">pet red</span> or <span style="color:var(--accent)">pet blue</span> to change its color.</span>';
    }
    mascot.classList.remove('hidden');
    mascot.dataset.summoned = 'true';
    mascot.classList.remove('sleeping');
    mascot.classList.add('jump');
    setTimeout(function() { mascot.classList.remove('jump'); }, 500);
    if (window.mascotWake) window.mascotWake();
    return '<span class="t-label">*a small blob appears*</span><br><span class="t-response">You found the pet! It now lives on your screen.</span><br><span class="t-comment">// click it, drag it, or type "pet red" / "pet blue"</span>';
  },
  dance: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotDance) window.mascotDance();
    return '<span class="t-label">*the blob starts dancing!*</span><br><span class="t-comment">// boogie woogie</span>';
  },
  scare: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotScare) window.mascotScare();
    return '<span class="t-label">*BOO!*</span><br><span class="t-comment">// got scared</span>';
  },
  love: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotLove) window.mascotLove();
    return '<span class="t-label">*the blob is in love!*</span><br><span class="t-comment">// hearts everywhere</span>';
  },
  puff: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotPuff) window.mascotPuff();
    return '<span class="t-label">*pfffffff!*</span><br><span class="t-comment">// inflating</span>';
  },
  wave: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotWave) window.mascotWave();
    return '<span class="t-label">*hello!*</span><br><span class="t-comment">// waves hello</span>';
  },
  extasis: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotExtasis) {
      var result = window.mascotExtasis();
      if (result === 'on') {
        return '<span class="t-label">*THE BLOB IS IN THE ZONE*</span><br><span class="t-comment">// turbo mode engaged</span>';
      } else {
        return '<span class="t-label">*back to normal*</span><br><span class="t-comment">// turbo mode off</span>';
      }
    }
    return '<span class="t-response">Extasis not available.</span>';
  },
  angry: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotAngry) window.mascotAngry();
    return '<span class="t-label">*GRRRR!*</span><br><span class="t-comment">// angry blob</span>';
  },
  pushhead: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotPushHead) window.mascotPushHead();
    return '<span class="t-label">*nope, nope, nope...*</span><br><span class="t-comment">// pushin\' head</span>';
  },
  rainbow: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    var result = window.mascotRainbow ? window.mascotRainbow() : null;
    if (result === 'off') return '<span class="t-label">*rainbow fades...*</span><br><span class="t-comment">// back to normal</span>';
    return '<span class="t-label">*✨ R A I N B O W ✨*</span><br><span class="t-comment">// type rainbow again to turn off</span>';
  },
  melt: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotMelt) window.mascotMelt();
    return '<span class="t-label">*the blob melts into a puddle...*</span><br><span class="t-comment">// splooosh... *reforms*</span>';
  },
  clone: () => {
    if (!mascot) return '<span class="t-response">No mascot found.</span>';
    if (mascot.classList.contains('hidden')) {
      return '<span class="t-response">The blob isn\'t here yet. Type <span style="color:var(--accent)">pet</span> first.</span>';
    }
    if (window.mascotClone) window.mascotClone();
    return '<span class="t-label">*the blob splits in two!*</span><br><span class="t-comment">// mitosis in progress...</span>';
  },
  clear: () => 'CLEAR',
  pomodoro: () => {
    Pomodoro.open();
    return '<span class="t-label">Opening Pomodoro...</span><br><span class="t-comment">// focus time 🍅</span>';
  }
};

function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');
  const terminal = document.getElementById('terminal');

  if (!terminalInput) return;

  let typingTimer;
  let isTyping = false;
  let typedValue = '';

  function cancelTyping(clearInput) {
    if (!isTyping) return;
    clearTimeout(typingTimer);
    isTyping = false;
    if (clearInput && terminalInput.value === typedValue) terminalInput.value = '';
  }

  function runCommand() {
    const input = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    if (!input) return;

    const parts = input.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1).join(' ');

    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `<span class="terminal-prompt">~$</span> <span class="t-str">${input}</span>`;
    terminalOutput.appendChild(cmdLine);

    const response = commands[cmd];
    if (response) {
      const result = response(args);
      if (result === 'CLEAR') {
        terminalOutput.innerHTML = '';
        return;
      }
      const respDiv = document.createElement('div');
      respDiv.className = 'terminal-output';
      respDiv.innerHTML = result;
      terminalOutput.appendChild(respDiv);
    } else {
      const errDiv = document.createElement('div');
      errDiv.className = 'terminal-output';
      errDiv.innerHTML = `<span class="t-response">Command not found: <span style="color:var(--accent3)">${cmd}</span>. Type <span style="color:var(--accent)">help</span> for available commands.</span>`;
      terminalOutput.appendChild(errDiv);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function typeCommand(command, delay = 0) {
    if (isTyping) return;
    isTyping = true;
    typedValue = '';
    terminalInput.value = '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      terminalInput.value = command;
      isTyping = false;
      runCommand();
      return;
    }

    let index = 0;
    function typeNextCharacter() {
      typedValue += command[index++];
      terminalInput.value = typedValue;
      if (index === command.length) {
        isTyping = false;
        runCommand();
      } else {
        typingTimer = setTimeout(typeNextCharacter, 50);
      }
    }
    typingTimer = setTimeout(typeNextCharacter, delay || 50);
  }

  terminalInput.addEventListener('focus', () => cancelTyping(true));
  terminalInput.addEventListener('input', () => cancelTyping(false));
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      cancelTyping(false);
      runCommand();
    }
  });

  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  terminal.querySelectorAll('.terminal-chip').forEach(chip => {
    chip.addEventListener('click', () => typeCommand(chip.dataset.command));
  });

  // Start the intro once the terminal is mostly visible, so on mobile (below the fold)
  // the late-rendered output does not become the LCP element
  if ('IntersectionObserver' in window) {
    const introObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      introObserver.disconnect();
      typeCommand('whoami', 650);
    }, { threshold: 0.6 });
    introObserver.observe(terminal);
  } else {
    typeCommand('whoami', 650);
  }
}

function initTerminalTilt() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  terminal.addEventListener('mousemove', (e) => {
    const rect = terminal.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    terminal.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  terminal.addEventListener('mouseleave', () => {
    terminal.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
  });
}

function initTerminalFab() {
  const fab = document.getElementById('terminalFab');
  const floatTerminal = document.getElementById('terminalFloat');
  if (!fab || !floatTerminal) return;

  function closeTerminal() {
    floatTerminal.classList.remove('open');
    fab.classList.remove('active');
  }

  fab.addEventListener('click', () => {
    floatTerminal.classList.toggle('open');
    fab.classList.toggle('active');
  });

  floatTerminal.querySelector('.t-dot.r').addEventListener('click', closeTerminal);

  floatTerminal.querySelector('.t-dot.g').addEventListener('click', () => {
    floatTerminal.classList.toggle('maximized');
  });

  floatTerminal.querySelector('.t-dot.y').addEventListener('click', () => {
    if (floatTerminal.classList.contains('maximized')) {
      floatTerminal.classList.remove('maximized');
    }
  });

  const floatInput = document.getElementById('terminalFloatInput');
  const floatOutput = document.getElementById('terminalFloatOutput');

  if (floatInput) {
    floatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = floatInput.value.trim().toLowerCase();
        floatInput.value = '';
        if (!input) return;

        const parts = input.split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1).join(' ');

        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="terminal-prompt">~$</span> <span class="t-str">${input}</span>`;
        floatOutput.appendChild(cmdLine);

        const response = commands[cmd];
        if (response) {
          const result = response(args);
          if (result === 'CLEAR') {
            floatOutput.innerHTML = '';
            return;
          }
          const respDiv = document.createElement('div');
          respDiv.className = 'terminal-output';
          respDiv.innerHTML = result;
          floatOutput.appendChild(respDiv);
        } else {
          const errDiv = document.createElement('div');
          errDiv.className = 'terminal-output';
          errDiv.innerHTML = `<span class="t-response">Command not found. Type <span style="color:var(--accent)">help</span></span>`;
          floatOutput.appendChild(errDiv);
        }

        const body = document.getElementById('terminalFloatBody');
        body.scrollTop = body.scrollHeight;
      }
    });

    document.getElementById('terminalFloatBody').addEventListener('click', () => {
      floatInput.focus();
    });
  }
}

function runMatrix() {
  var canvas = document.createElement('canvas');
  canvas.className = 'matrix-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  var fontSize = 14;
  var columns = Math.floor(canvas.width / fontSize);
  var drops = Array(columns).fill(1);

  var interval = setInterval(function() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00e5a0';
    ctx.font = fontSize + 'px monospace';
    for (var i = 0; i < drops.length; i++) {
      var text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 33);

  setTimeout(function() {
    clearInterval(interval);
    canvas.classList.add('fade');
    setTimeout(function() { canvas.remove(); }, 1000);
  }, 2500);
}
