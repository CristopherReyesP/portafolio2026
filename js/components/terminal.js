const commands = {
  help: () => `<span class="t-label">Available commands:</span><br>
    <span class="t-str">stack</span> <span class="t-response">— technologies I use daily</span><br>
    <span class="t-str">experience</span> <span class="t-response">— years & current role</span><br>
    <span class="t-str">contact</span> <span class="t-response">— how to reach me</span><br>
    <span class="t-str">projects</span> <span class="t-response">— what I've built</span><br>
    <span class="t-str">hire</span> <span class="t-response">— availability & rates</span><br>
    <span class="t-str">secret</span> <span class="t-response">— ???</span><br>
    <span class="t-str">clear</span> <span class="t-response">— clear terminal</span>`,
  stack: () => `<span class="t-label">Production stack:</span><br>
    <span class="t-str">Backend:</span> <span class="t-response">NestJS, .NET/C#, Node.js, TypeScript</span><br>
    <span class="t-str">Database:</span> <span class="t-response">Oracle, PL/SQL, PostgreSQL, SQL Server</span><br>
    <span class="t-str">Infra:</span> <span class="t-response">OpenShift, Docker, Keycloak, CI/CD</span><br>
    <span class="t-str">Frontend:</span> <span class="t-response">React, Vite, Socket.io, WebRTC</span><br>
    <span class="t-str">Gamedev:</span> <span class="t-response">Godot 4, GDScript, C#, Blender, Nakama</span>`,
  experience: () => `<span class="t-label">5+ years in production systems</span><br>
    <span class="t-str">Current:</span> <span class="t-response">Backend Engineer @ BANTRAB (bank)</span><br>
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
  hire: () => `<span class="t-label">Availability:</span> <span class="t-bool">true</span><br>
    <span class="t-str">Mode:</span> <span class="t-response">B2B, freelance, remote</span><br>
    <span class="t-str">Includes:</span> <span class="t-response">code + docs + runbooks + support</span><br>
    <span class="t-str">→</span> <a href="#contact" style="color:var(--accent)">Get in touch</a>`,
  secret: () => `<span class="t-response">while (alive) {</span><br>
    <span class="t-response">&nbsp;&nbsp;eat();</span><br>
    <span class="t-response">&nbsp;&nbsp;code();</span><br>
    <span class="t-response">&nbsp;&nbsp;sleep(maybe);</span><br>
    <span class="t-response">&nbsp;&nbsp;repeat();</span><br>
    <span class="t-response">}</span><br>
    <span class="t-comment">// Also building a game about alien planets 🛸</span>`,
  clear: () => 'CLEAR'
};

function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (!terminalInput) return;

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      if (!cmd) return;

      const cmdLine = document.createElement('div');
      cmdLine.innerHTML = `<span class="terminal-prompt">~$</span> <span class="t-str">${cmd}</span>`;
      terminalOutput.appendChild(cmdLine);

      const response = commands[cmd];
      if (response) {
        const result = response();
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

      const body = document.getElementById('terminalBody');
      body.scrollTop = body.scrollHeight;
    }
  });

  document.getElementById('terminalBody').addEventListener('click', () => {
    terminalInput.focus();
  });
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
