// Every output follows the ES/EN switch: translated fragments carry data-i18n-html (or
// data-i18n / data-i18n-href), so setLang() re-renders output that is already printed
const t = (key) => translations[currentLang][key];
const i18nLine = (key) => `<div data-i18n-html="${key}">${t(key)}</div>`;
const i18nLines = (keys) => keys.map(i18nLine).join('');
const i18nSpan = (key, attrs = '') => `<span${attrs} data-i18n-html="${key}">${t(key)}</span>`;
// Language-neutral lines (tech names, URLs, code) are printed as they are
const plainLine = (html) => `<div>${html}</div>`;
const arrowLine = (html) => plainLine(`<span class="t-str">→</span> ${html}`);

// Lets the mascot skip hints for commands the visitor already tried
const announceCommand = (cmd) => window.dispatchEvent(new CustomEvent('terminal:command', { detail: cmd }));

const whoamiKeys = ['terminal_whoami1', 'terminal_whoami2', 'terminal_whoami3'];

const helpEntries = [
  ['whoami', 'terminal_help_whoami'], ['stack', 'terminal_help_stack'],
  ['experience', 'terminal_help_experience'], ['contact', 'terminal_help_contact'],
  ['projects', 'terminal_help_projects'], ['hire', 'terminal_help_hire'],
  ['resume', 'terminal_help_resume'], ['github', 'terminal_help_github'],
  ['linkedin', 'terminal_help_linkedin'], ['email', 'terminal_help_email'],
  ['matrix', 'terminal_help_mystery'], ['pet', 'terminal_help_pet'],
  ['dance', 'terminal_help_dance'], ['scare', 'terminal_help_scare'],
  ['love', 'terminal_help_love'], ['puff', 'terminal_help_puff'],
  ['wave', 'terminal_help_wave'], ['extasis', 'terminal_help_extasis'],
  ['angry', 'terminal_help_angry'], ['pushhead', 'terminal_help_pushhead'],
  ['melt', 'terminal_help_melt'], ['rainbow', 'terminal_help_rainbow'],
  ['clone', 'terminal_help_clone'], ['secret', 'terminal_help_mystery'],
  ['pomodoro', 'terminal_help_pomodoro'], ['clear', 'terminal_help_clear']
];

// Production project names are the page's own proj*_name keys; in-progress ones get a tag
const productionProjects = [
  ['proj1_name', false], ['proj2_name', false], ['proj3_name', false],
  ['proj4_name', true], ['proj5_name', true]
];
// Personal project titles are not translated on the page either
const personalProjects = ['Hormigas — Simulador de colonia', 'Cobros — Sistema de Gestión'];

const petColors = { red: '#ff5f57', blue: '#5f9fff', green: '' };

function escapeHtml(text) {
  const span = document.createElement('span');
  span.textContent = text;
  return span.innerHTML;
}

function notFoundMessage(cmd) {
  return `<span class="t-response">${i18nSpan('terminal_not_found_before')} <span style="color:var(--accent3)">${escapeHtml(cmd)}</span>${i18nSpan('terminal_not_found_after')}</span>`;
}

function openExternal(url, titleKey, comment) {
  window.open(url, '_blank');
  return i18nLine(titleKey) + plainLine(`<span class="t-comment">// ${comment}</span>`);
}

// Mascot commands need the blob on screen; returns why it cannot act, or null
function blobUnavailable() {
  const mascot = document.getElementById('mascot');
  if (!mascot) return i18nLine('terminal_no_mascot');
  if (mascot.classList.contains('hidden')) return i18nLine('terminal_pet_first');
  return null;
}

function blobAction(action, keys) {
  return () => {
    const unavailable = blobUnavailable();
    if (unavailable) return unavailable;
    if (window[action]) window[action]();
    return i18nLines(keys);
  };
}

const commands = {
  help: () => i18nLine('terminal_help_title') + helpEntries.map(([cmd, key]) =>
    plainLine(`<span class="t-str">${cmd}</span> ${i18nSpan(key, ' class="t-response"')}`)
  ).join('') + i18nLine('terminal_help_ask') + i18nLine('terminal_help_tab'),
  whoami: () => i18nLines(whoamiKeys),
  stack: () => i18nLine('terminal_stack_title') +
    plainLine('<span class="t-str">Backend:</span> <span class="t-response">NestJS, Node.js, C# / .NET, TypeScript, REST APIs, GraphQL</span>') +
    i18nLine('terminal_stack_db') +
    plainLine('<span class="t-str">DevOps &amp; Infra:</span> <span class="t-response">OpenShift, Kubernetes, Docker, Keycloak, CI/CD</span>') +
    i18nLine('terminal_stack_integrations') +
    i18nLine('terminal_stack_architecture') +
    plainLine('<span class="t-str">Frontend:</span> <span class="t-response">React, Vite, Socket.io, WebRTC</span>'),
  experience: () => i18nLines([
    'terminal_exp_title', 'terminal_exp_current', 'terminal_exp_focus',
    'terminal_exp_highlight', 'terminal_exp_freelance', 'terminal_exp_onesolutions'
  ]),
  contact: () => i18nLine('terminal_contact_title') +
    i18nLine('terminal_contact_email') +
    plainLine('<span class="t-str">LinkedIn:</span> <span class="t-response">linkedin.com/in/cristopherrp</span>') +
    plainLine('<span class="t-str">GitHub:</span> <span class="t-response">github.com/CristopherReyesP</span>') +
    i18nLine('terminal_contact_calendly') +
    i18nLine('terminal_contact_location'),
  projects: () => i18nLine('terminal_projects_production') +
    productionProjects.map(([key, inProgress]) => arrowLine(
      i18nSpan(key, ' class="t-response"') + (inProgress ? ' ' + i18nSpan('terminal_in_progress', ' class="t-comment"') : '')
    )).join('') +
    i18nLine('terminal_projects_personal') +
    personalProjects.map(name => arrowLine(`<span class="t-response">${name}</span>`)).join(''),
  hire: () => i18nLines(['terminal_hire_title', 'terminal_hire_role', 'terminal_hire_location', 'terminal_hire_freelance']) +
    arrowLine(`<a href="#contact" style="color:var(--accent)" data-i18n-html="terminal_hire_cta">${t('terminal_hire_cta')}</a>`),
  // The CV follows the active language; the printed path and link update with setLang()
  resume: () => {
    const cv = t('cv_href');
    const download = document.createElement('a');
    download.href = cv;
    download.download = '';
    download.click();
    return i18nLine('terminal_resume_title') +
      plainLine(`<span class="t-comment">// <span data-i18n="cv_href">${cv}</span></span>`) +
      arrowLine(`<a href="${cv}" download data-i18n-href="cv_href" data-i18n-html="terminal_resume_link" style="color:var(--accent)">${t('terminal_resume_link')}</a>`);
  },
  github: () => openExternal('https://github.com/CristopherReyesP', 'terminal_github_title', 'github.com/CristopherReyesP'),
  linkedin: () => openExternal('https://www.linkedin.com/in/cristopherrp', 'terminal_linkedin_title', 'linkedin.com/in/cristopherrp'),
  email: () => openExternal('mailto:reyescristop@gmail.com', 'terminal_email_title', 'reyescristop@gmail.com'),
  matrix: () => {
    runMatrix();
    return i18nLines(['terminal_matrix1', 'terminal_matrix2']);
  },
  secret: () => ['while (alive) {', '&nbsp;&nbsp;eat();', '&nbsp;&nbsp;code();', '&nbsp;&nbsp;sleep(maybe);', '&nbsp;&nbsp;repeat();', '}']
    .map(code => plainLine(`<span class="t-response">${code}</span>`)).join('') +
    i18nLines(['terminal_secret1', 'terminal_secret2']),
  pet: (args) => {
    const mascot = document.getElementById('mascot');
    if (!mascot) return i18nLine('terminal_no_mascot');

    // Color change: the color name is translated, the command argument is not
    if (args && petColors.hasOwnProperty(args)) {
      if (mascot.classList.contains('hidden')) return i18nLine('terminal_pet_first');
      const color = petColors[args];
      const body = mascot.querySelector('.mascot-body');
      body.style.background = color || '';
      body.style.boxShadow = color
        ? '0 4px 20px ' + color + '80, inset 0 -6px 12px rgba(0,0,0,0.15)'
        : '';
      mascot.classList.add('jump');
      setTimeout(function() { mascot.classList.remove('jump'); }, 500);
      return plainLine(`<span class="t-response">${i18nSpan('terminal_pet_color_before')} ${i18nSpan('terminal_color_' + args, ` style="color:${color || 'var(--accent)'}"`)}${i18nSpan('terminal_pet_color_after')}</span>`);
    }

    if (args) return i18nLine('terminal_pet_unknown_color');

    // First summon
    if (!mascot.classList.contains('hidden')) return i18nLine('terminal_pet_already_here');
    mascot.classList.remove('hidden');
    mascot.dataset.summoned = 'true';
    mascot.classList.remove('sleeping');
    mascot.classList.add('jump');
    setTimeout(function() { mascot.classList.remove('jump'); }, 500);
    if (window.mascotWake) window.mascotWake();
    return i18nLines(['terminal_pet_summon1', 'terminal_pet_summon2', 'terminal_pet_summon3']);
  },
  dance: blobAction('mascotDance', ['terminal_dance1', 'terminal_dance2']),
  scare: blobAction('mascotScare', ['terminal_scare1', 'terminal_scare2']),
  love: blobAction('mascotLove', ['terminal_love1', 'terminal_love2']),
  puff: blobAction('mascotPuff', ['terminal_puff1', 'terminal_puff2']),
  wave: blobAction('mascotWave', ['terminal_wave1', 'terminal_wave2']),
  extasis: () => {
    const unavailable = blobUnavailable();
    if (unavailable) return unavailable;
    if (!window.mascotExtasis) return i18nLine('terminal_extasis_unavailable');
    return window.mascotExtasis() === 'on'
      ? i18nLines(['terminal_extasis_on1', 'terminal_extasis_on2'])
      : i18nLines(['terminal_extasis_off1', 'terminal_extasis_off2']);
  },
  angry: blobAction('mascotAngry', ['terminal_angry1', 'terminal_angry2']),
  pushhead: blobAction('mascotPushHead', ['terminal_pushhead1', 'terminal_pushhead2']),
  rainbow: () => {
    const unavailable = blobUnavailable();
    if (unavailable) return unavailable;
    const result = window.mascotRainbow ? window.mascotRainbow() : null;
    return result === 'off'
      ? i18nLines(['terminal_rainbow_off1', 'terminal_rainbow_off2'])
      : i18nLines(['terminal_rainbow_on1', 'terminal_rainbow_on2']);
  },
  melt: blobAction('mascotMelt', ['terminal_melt1', 'terminal_melt2']),
  clone: blobAction('mascotClone', ['terminal_clone1', 'terminal_clone2']),
  clear: () => 'CLEAR',
  pomodoro: () => {
    Pomodoro.open();
    return i18nLines(['terminal_pomodoro1', 'terminal_pomodoro2']);
  }
};


// --- Tab autocomplete over the documented commands, like a shell ---
const commandNames = [...new Set(helpEntries.map(([cmd]) => cmd))];

function commonPrefix(words) {
  let prefix = words[0];
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

function printCompletions(output, body, typed, matches) {
  const cmdLine = document.createElement('div');
  cmdLine.innerHTML = `<span class="terminal-prompt">~$</span> <span class="t-str">${escapeHtml(typed)}</span>`;
  const list = document.createElement('div');
  list.className = 'terminal-output';
  list.innerHTML = plainLine(matches.map((name) => `<span class="t-str">${name}</span>`).join('&nbsp;&nbsp;'));
  output.append(cmdLine, list);
  body.scrollTop = body.scrollHeight;
}

// A single match completes the command; several complete their common prefix, and once
// there is nothing left to complete they are listed. Tab on an empty input keeps its
// native behavior, so keyboard users can still move past the terminal.
function handleTab(e, input, output, body) {
  if (e.key !== 'Tab' || e.shiftKey || input.value.trim() === '') return;
  e.preventDefault();
  announceCommand('tab');

  const typed = input.value.trimStart().toLowerCase();
  if (/\s/.test(typed)) return;
  const matches = commandNames.filter((name) => name.startsWith(typed));
  if (!matches.length) return;

  const prefix = commonPrefix(matches);
  if (prefix.length > typed.length) input.value = prefix;
  else if (matches.length > 1) printCompletions(output, body, typed, matches);
}

function echoLine(output, text) {
  const cmdLine = document.createElement('div');
  cmdLine.innerHTML = `<span class="terminal-prompt">~$</span> <span class="t-str">${escapeHtml(text)}</span>`;
  output.appendChild(cmdLine);
}

function appendOutput(output, html) {
  const respDiv = document.createElement('div');
  respDiv.className = 'terminal-output';
  respDiv.innerHTML = html;
  output.appendChild(respDiv);
}

// --- The pet answers plain-language questions (pet-brain.js) ---
// The answer "thinks" for a moment, then types itself out; the mascot says the short
// version in its bubble. Answers are our own strings, always set as text, never as HTML.
const PET_PREFIX = '<span class="t-str" aria-hidden="true">●</span> <span class="t-label">blob:</span> ';
// Output element → finish() of the answer it is typing, so a new message completes it first
const petTyping = new Map();

function setPetBusy() {
  if (window.mascotBusy) window.mascotBusy(petTyping.size > 0);
}

const COPY_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const COPIED_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

// Code-editor style copy button for a pet answer; turns into a check for a moment once copied.
// Without clipboard access (e.g. plain http) it selects the answer so the visitor can copy it.
function addCopyButton(line, answer, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 't-copy';
  button.innerHTML = COPY_ICON;
  button.dataset.i18nAriaLabel = 'pet_copy';
  button.setAttribute('aria-label', t('pet_copy'));
  let resetTimer = 0;
  button.addEventListener('click', (e) => {
    // The terminal body focuses the input on click, which would drop a fallback selection
    e.stopPropagation();
    const copy = navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
    copy.then(() => {
      clearTimeout(resetTimer);
      button.innerHTML = COPIED_ICON;
      button.classList.add('copied');
      button.setAttribute('aria-label', t('pet_copied'));
      resetTimer = setTimeout(() => {
        button.innerHTML = COPY_ICON;
        button.classList.remove('copied');
        button.setAttribute('aria-label', t('pet_copy'));
      }, 1500);
    }).catch(() => {
      const range = document.createRange();
      range.selectNodeContents(answer);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
  line.appendChild(button);
}

function printPetReply(reply, output, body) {
  const line = document.createElement('div');
  line.className = 'terminal-output pet-reply';
  line.innerHTML = PET_PREFIX;
  const thinking = document.createElement('span');
  thinking.className = 't-comment';
  const answer = document.createElement('span');
  answer.className = 't-response';
  line.append(thinking, answer);
  const segments = [[answer, reply.text]];
  if (reply.aside) {
    const aside = document.createElement('div');
    aside.className = 't-comment';
    line.appendChild(aside);
    segments.push([aside, reply.aside]);
  }
  output.appendChild(line);

  let reacted = false;
  let timer = 0;
  let thinkingTimer = 0;
  // The blob acts and speaks when the answer starts
  function react() {
    if (reacted) return;
    reacted = true;
    if (reply.action && window[reply.action]) window[reply.action]();
    if (reply.bubble && window.mascotSay) window.mascotSay(reply.bubble);
  }

  function finish() {
    clearTimeout(timer);
    clearInterval(thinkingTimer);
    thinking.remove();
    react();
    segments.forEach(([el, text]) => { el.textContent = text; });
    addCopyButton(line, answer, reply.text);
    line.removeAttribute('aria-busy');
    petTyping.delete(output);
    setPetBusy();
    body.scrollTop = body.scrollHeight;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  // Screen readers wait for the full answer instead of reading it letter by letter
  line.setAttribute('aria-busy', 'true');
  petTyping.set(output, finish);
  setPetBusy();

  const label = t('pet_thinking');
  let dots = 1;
  thinking.textContent = label + '.';
  thinkingTimer = setInterval(() => {
    dots = dots % 3 + 1;
    thinking.textContent = label + '.'.repeat(dots);
  }, 200);

  const cursor = document.createElement('span');
  cursor.className = 't-cursor';
  let segment = 0;
  let chars = [];
  let index = 0;
  function typeNext() {
    const el = segments[segment][0];
    if (index === 0) {
      chars = Array.from(segments[segment][1]);
      el.append(document.createTextNode(''), cursor);
    }
    el.firstChild.data += chars[index++];
    body.scrollTop = body.scrollHeight;
    if (index < chars.length) {
      timer = setTimeout(typeNext, 15 + Math.random() * 10);
    } else if (++segment < segments.length) {
      index = 0;
      timer = setTimeout(typeNext, 150);
    } else {
      finish();
    }
  }

  timer = setTimeout(() => {
    clearInterval(thinkingTimer);
    thinking.remove();
    react();
    typeNext();
  }, 500 + Math.random() * 400);
  body.scrollTop = body.scrollHeight;
}

// Shared by the hero and the floating terminal. A known first word runs the command as
// always; anything else goes to the pet, except a single unknown word that matches no
// intent, which keeps the "command not found" message.
function handleInput(value, output, body) {
  const typing = petTyping.get(output);
  if (typing) typing();

  const raw = value.trim();
  if (!raw) return;
  if (window.petBrain && window.petBrain.isHack(raw)) {
    echoLine(output, raw);
    announceCommand('ask');
    printPetReply(window.petBrain.answer(raw), output, body);
    return;
  }
  const input = raw.toLowerCase();
  const parts = input.split(/\s+/);
  const cmd = parts[0];

  const response = commands[cmd];
  if (response) {
    echoLine(output, input);
    announceCommand(cmd);
    const result = response(parts.slice(1).join(' '));
    if (result === 'CLEAR') {
      output.innerHTML = '';
      return;
    }
    appendOutput(output, result);
  } else {
    const reply = window.petBrain ? window.petBrain.answer(raw) : null;
    const isQuestion = parts.length > 1 || raw.includes('?') || (reply && reply.intent !== 'fallback');
    if (reply && isQuestion) {
      echoLine(output, raw);
      announceCommand('ask');
      printPetReply(reply, output, body);
      return;
    }
    echoLine(output, input);
    appendOutput(output, notFoundMessage(cmd));
  }

  body.scrollTop = body.scrollHeight;
}

function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');
  const terminal = document.getElementById('terminal');

  if (!terminalInput) return;

  function runCommand() {
    const value = terminalInput.value;
    terminalInput.value = '';
    handleInput(value, terminalOutput, terminalBody);
  }

  // --- Auto intro: runs `whoami` like a real session ---
  // The typed text lives in its own span (with a block cursor) instead of the input,
  // so the input stays empty and usable; output lines are separate blocks revealed one
  // by one, so none of them outgrows the hero h1 as the LCP element.
  const INTRO_COMMAND = 'whoami';
  const intro = { state: 'idle', timer: 0, typed: null, lines: [], output: null, echoed: false };
  const placeholder = terminalInput.getAttribute('placeholder');

  function introStep(fn, delay) {
    intro.timer = setTimeout(fn, delay);
  }

  function removeTypedCommand() {
    if (intro.typed) intro.typed.remove();
    intro.typed = null;
    if (placeholder !== null) terminalInput.setAttribute('placeholder', placeholder);
  }

  function echoIntroCommand() {
    removeTypedCommand();
    echoLine(terminalOutput, INTRO_COMMAND);
    intro.echoed = true;
    intro.output = document.createElement('div');
    intro.output.className = 'terminal-output';
    terminalOutput.appendChild(intro.output);
    const template = document.createElement('div');
    template.innerHTML = commands[INTRO_COMMAND]();
    intro.lines = Array.from(template.children);
  }

  function revealNextLine() {
    const line = intro.lines.shift();
    if (!line) {
      intro.state = 'done';
      return;
    }
    line.classList.add('terminal-line');
    intro.output.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    introStep(revealNextLine, 180);
  }

  // Skip to the end: full output at once, nothing left half-typed
  function finishIntro() {
    if (intro.state === 'done') return;
    clearTimeout(intro.timer);
    if (!intro.echoed) echoIntroCommand();
    intro.lines.forEach(line => intro.output.appendChild(line));
    intro.lines = [];
    intro.state = 'done';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function startIntro() {
    if (intro.state !== 'idle') return;
    const userIsTyping = document.activeElement === terminalInput || terminalInput.value !== '';
    if (userIsTyping || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro();
      return;
    }
    intro.state = 'running';
    terminalInput.setAttribute('placeholder', '');
    intro.typed = document.createElement('span');
    intro.typed.className = 'terminal-typed';
    intro.typed.setAttribute('aria-hidden', 'true');
    intro.typed.innerHTML = '<span class="t-str"></span><span class="t-cursor"></span>';
    terminalInput.before(intro.typed);

    const typedText = intro.typed.firstChild;
    let index = 0;
    function typeNextCharacter() {
      typedText.textContent += INTRO_COMMAND[index++];
      if (index < INTRO_COMMAND.length) {
        introStep(typeNextCharacter, 110);
      } else {
        // Short beat before "Enter", then the output streams in
        introStep(() => {
          echoIntroCommand();
          introStep(revealNextLine, 180);
        }, 400);
      }
    }
    introStep(typeNextCharacter, 1000);
  }

  terminalInput.addEventListener('focus', finishIntro);
  terminalInput.addEventListener('input', finishIntro);
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishIntro();
      runCommand();
    }
    handleTab(e, terminalInput, terminalOutput, terminalBody);
  });

  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Start the intro once the terminal is almost fully visible, so on mobile (below the fold)
  // the late-rendered output does not become the LCP element
  if ('IntersectionObserver' in window) {
    const introObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      introObserver.disconnect();
      startIntro();
    }, { threshold: 0.9 });
    introObserver.observe(terminal);
  } else {
    startIntro();
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
    const floatBody = document.getElementById('terminalFloatBody');
    floatInput.addEventListener('keydown', (e) => {
      handleTab(e, floatInput, floatOutput, floatBody);
      if (e.key === 'Enter') {
        const value = floatInput.value;
        floatInput.value = '';
        handleInput(value, floatOutput, floatBody);
      }
    });

    floatBody.addEventListener('click', () => {
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
