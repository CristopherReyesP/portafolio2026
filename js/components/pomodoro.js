const Pomodoro = {
  modal: null,
  state: 'idle',
  phase: 'work',
  timeLeft: 25 * 60,
  maxTime: 25 * 60,
  workTime: 25,
  breakTime: 5,
  sessions: 0,
  interval: null,

  open() {
    if (!this.modal) this._build();
    this.modal.classList.remove('hidden');
    this._syncUI();
  },

  close() {
    if (this.modal) this.modal.classList.add('hidden');
  },

  _build() {
    this.modal = document.createElement('div');
    this.modal.className = 'pomo-overlay';
    this.modal.innerHTML = `
<div class="pomo-win">
  <div class="pomo-header">
    <span>🍅 Pomodoro</span>
    <button class="pomo-close">✕</button>
  </div>
  <div class="pomo-body">
    <div class="pomo-phase" id="pomoPhase">FOCUS</div>
    <div class="pomo-timer" id="pomoTimer">25:00</div>
    <div class="pomo-adjust">
      <div class="pomo-adjust-group">
        <button class="pomo-adjust-btn" data-target="work" data-dir="-1">−</button>
        <span class="pomo-adjust-label" id="pomoWorkLabel">25m</span>
        <button class="pomo-adjust-btn" data-target="work" data-dir="1">+</button>
        <span class="pomo-adjust-name">Focus</span>
      </div>
      <div class="pomo-adjust-group">
        <button class="pomo-adjust-btn" data-target="break" data-dir="-1">−</button>
        <span class="pomo-adjust-label" id="pomoBreakLabel">5m</span>
        <button class="pomo-adjust-btn" data-target="break" data-dir="1">+</button>
        <span class="pomo-adjust-name">Break</span>
      </div>
    </div>
    <div class="pomo-controls">
      <button class="pomo-btn primary" id="pomoMainBtn">Start</button>
      <button class="pomo-btn secondary" id="pomoResetBtn">Reset</button>
    </div>
    <div class="pomo-sessions" id="pomoSessions"></div>
  </div>
</div>`;
    document.body.appendChild(this.modal);

    this.modal.querySelector('.pomo-close').addEventListener('click', () => this.close());
    this.modal.querySelector('#pomoMainBtn').addEventListener('click', () => this._toggle());
    this.modal.querySelector('#pomoResetBtn').addEventListener('click', () => this._reset());
    this.modal.querySelectorAll('.pomo-adjust-btn').forEach(btn => {
      btn.addEventListener('click', () => this._adjust(btn.dataset.target, parseInt(btn.dataset.dir)));
    });
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  },

  _adjust(target, dir) {
    if (this.state === 'running') return;
    if (target === 'work') {
      this.workTime = Math.max(1, Math.min(120, this.workTime + dir));
      if (this.phase === 'work') {
        this.timeLeft = this.workTime * 60;
        this.maxTime = this.workTime * 60;
      }
    } else {
      this.breakTime = Math.max(1, Math.min(30, this.breakTime + dir));
      if (this.phase === 'break') {
        this.timeLeft = this.breakTime * 60;
        this.maxTime = this.breakTime * 60;
      }
    }
    this._syncUI();
  },

  _toggle() {
    if (this.state === 'running') this._pause();
    else this._start();
  },

  _start() {
    if (this.state === 'idle' && this.timeLeft <= 0) this._reset();
    this.state = 'running';
    document.querySelector('#pomoMainBtn').textContent = 'Pause';
    this.modal.querySelectorAll('.pomo-adjust-btn').forEach(b => b.disabled = true);
    this.interval = setInterval(() => this._tick(), 1000);
  },

  _pause() {
    this.state = 'paused';
    document.querySelector('#pomoMainBtn').textContent = 'Resume';
    clearInterval(this.interval);
  },

  _reset() {
    clearInterval(this.interval);
    this.state = 'idle';
    this.phase = 'work';
    this.timeLeft = this.workTime * 60;
    this.maxTime = this.workTime * 60;
    document.querySelector('#pomoMainBtn').textContent = 'Start';
    this.modal.querySelectorAll('.pomo-adjust-btn').forEach(b => b.disabled = false);
    this._syncUI();
  },

  _tick() {
    this.timeLeft--;
    this._updateDisplay();
    if (this.timeLeft <= 0) this._complete();
  },

  _complete() {
    clearInterval(this.interval);
    this.state = 'idle';
    document.querySelector('#pomoMainBtn').textContent = 'Start';
    this.modal.querySelectorAll('.pomo-adjust-btn').forEach(b => b.disabled = false);

    if (this.phase === 'work') {
      this.sessions++;
      this.phase = 'break';
      this.timeLeft = this.breakTime * 60;
      this.maxTime = this.breakTime * 60;
      document.querySelector('#pomoPhase').textContent = 'BREAK ☕';
      this._updateSessions();
    } else {
      this.phase = 'work';
      this.timeLeft = this.workTime * 60;
      this.maxTime = this.workTime * 60;
      document.querySelector('#pomoPhase').textContent = 'FOCUS';
    }
    this._syncUI();
    this._flash();
  },

  _flash() {
    const win = this.modal.querySelector('.pomo-win');
    win.style.boxShadow = '0 0 60px var(--accent), 0 0 120px rgba(0,229,160,0.15)';
    setTimeout(() => win.style.boxShadow = '', 2500);
  },

  _syncUI() {
    this._updateDisplay();
    document.querySelector('#pomoWorkLabel').textContent = this.workTime + 'm';
    document.querySelector('#pomoBreakLabel').textContent = this.breakTime + 'm';
  },

  _updateDisplay() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    document.querySelector('#pomoTimer').textContent =
      String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },

  _updateSessions() {
    const el = document.querySelector('#pomoSessions');
    el.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('span');
      d.className = 'pomo-s-dot' + (i < this.sessions ? ' done' : '');
      el.appendChild(d);
    }
  },
};
