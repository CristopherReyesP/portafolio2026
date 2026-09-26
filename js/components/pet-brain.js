// Pet brain: lets the mascot answer plain-language questions about Cristopher "like an AI".
// It is a local keyword matcher (no model, no network): the best-scoring intent picks a
// canned answer from translations.js (pet_answers / pet_bubbles / pet_asides, per language).

// Keywords are written already normalized (lowercase, no accents or punctuation).
// A key with spaces is a phrase and weighs 2; "stem*" matches any word starting with stem.
// Ties go to the intent declared first, so the more specific intents come first.
const petIntents = [
  { id: 'ai', keys: ['ia', 'ai', 'chatgpt', 'gpt', 'openai', 'llm', 'bot', 'robot', 'artificial', 'machine learning',
    'inteligencia artificial', 'red neuronal', 'neural network', 'eres real', 'are you real', 'eres humano', 'are you human'] },
  { id: 'petWho', keys: ['quien eres', 'que eres', 'who are you', 'what are you', 'como te llamas', 'tu nombre',
    'your name', 'blob', 'mascota', 'mascot'] },
  { id: 'salary', keys: ['salar*', 'sueldo', 'pay', 'paga', 'pretension*', 'compensa*', 'tarifa', 'rate', 'dinero',
    'money', 'dolares', 'dollars', 'usd', 'cuanto cobra', 'cuanto gana', 'how much'] },
  { id: 'cv', keys: ['cv', 'resume', 'curriculum', 'hoja de vida', 'pdf'] },
  { id: 'contact', keys: ['contact*', 'email', 'correo', 'mail', 'linkedin', 'github', 'calendly', 'llamada', 'call',
    'reunion', 'meeting', 'agendar', 'schedule', 'reach', 'escribirle', 'telefono', 'phone', 'whatsapp',
    'get in touch', 'hablar con el', 'talk to him'] },
  { id: 'education', keys: ['estudi*', 'universi*', 'college', 'degree', 'carrera', 'ingenieria', 'engineering degree',
    'educa*', 'gradua*', 'tesis', 'thesis', 'school', 'study', 'studied', 'umg', 'mariano galvez', 'titulo'] },
  { id: 'languages', keys: ['idioma*', 'ingles', 'english', 'espanol', 'spanish', 'bilingue', 'bilingual',
    'languages does he speak', 'speak', 'habla'] },
  { id: 'location', keys: ['ubicacion', 'location', 'located', 'pais', 'country', 'guatemala', 'ciudad', 'city',
    'zona horaria', 'timezone', 'time zone', 'horario', 'gmt', 'vive', 'live', 'lives', 'based', 'de donde es',
    'where is he', 'is he from'] },
  { id: 'availability', keys: ['disponib*', 'availab*', 'contrat*', 'hire', 'hiring', 'remot*', 'tiempo completo',
    'full time', 'fulltime', 'freelance', 'open to work', 'busca trabajo', 'looking for', 'oportunidad*',
    'opportunit*', 'vacante', 'oferta', 'job offer'] },
  { id: 'experience', keys: ['experienc*', 'anos', 'years', 'cuantos anos', 'how many years', 'senior', 'seniority',
    'trayectoria', 'background', 'career', 'work experience', 'experiencia laboral'] },
  { id: 'job', keys: ['trabaj*', 'work', 'works', 'working', 'empresa', 'company', 'empleo', 'employer', 'banco',
    'bank', 'bantrab', 'actual', 'current', 'currently', 'cargo', 'job', 'onesolutions', 'donde trabaja',
    'where does he work'] },
  { id: 'stack', keys: ['stack', 'tecnolog*', 'technolog*', 'tech', 'herramientas', 'tools', 'lenguaje*', 'programming',
    'programming languages', 'lenguajes de programacion', 'framework*', 'nestjs', 'nest', 'node', 'nodejs', 'net',
    'dotnet', 'csharp', 'oracle', 'sql', 'plsql', 'postgresql', 'react', 'typescript', 'javascript', 'docker',
    'kubernetes', 'openshift', 'keycloak', 'mulesoft', 'backend', 'frontend', 'base de datos', 'database',
    'habilidades', 'skills', 'sabe', 'knows', 'usa', 'uses'] },
  { id: 'projects', keys: ['proyecto*', 'project*', 'portfolio', 'portafolio', 'construido', 'built', 'build',
    'logros', 'achievements', 'saga', 'migracion', 'migration', 'microservicios', 'microservices', 'hormigas',
    'ants', 'cobros', 'juego', 'game', 'qr', 'canary', 'side project'] },
  { id: 'who', keys: ['quien es', 'who is', 'about him', 'sobre el', 'cuentame', 'hablame', 'tell me about',
    'a que se dedica', 'what does he do', 'que hace', 'perfil', 'profile', 'rol', 'role', 'resumen', 'summary',
    'presentacion', 'introduce'] },
  { id: 'greeting', keys: ['hola', 'holi', 'hi', 'hello', 'hey', 'buenas', 'buenos dias', 'buenas tardes',
    'buenas noches', 'good morning', 'good afternoon', 'good evening', 'saludos', 'que tal', 'sup'],
    action: 'mascotWave' },
  { id: 'howAreYou', keys: ['como estas', 'como te va', 'que tal estas', 'how are you', 'how is it going',
    'how are you doing', 'todo bien'] },
  { id: 'thanks', keys: ['gracias', 'thanks', 'thank you', 'thx', 'ty', 'genial', 'great', 'cool', 'perfecto',
    'awesome', 'excelente'], action: 'mascotLove' },
  { id: 'joke', keys: ['chiste', 'joke', 'broma', 'hazme reir', 'make me laugh', 'funny', 'gracioso'] },
  { id: 'goodbye', keys: ['adios', 'bye', 'chao', 'chau', 'hasta luego', 'nos vemos', 'see you', 'goodbye'],
    action: 'mascotWave' },
  // Action intents: the blob has to be on screen, otherwise it asks to be summoned first
  { id: 'dance', keys: ['bail*', 'danc*', 'boogie'], action: 'mascotDance', needsBlob: true },
  { id: 'love', keys: ['te quiero', 'te amo', 'love you', 'amor', 'love', 'corazon', 'heart', 'lindo', 'cute',
    'adorable', 'tierno'], action: 'mascotLove', needsBlob: true },
  { id: 'wave', keys: ['saluda', 'saludame', 'wave', 'wave at me', 'say hi', 'di hola'], action: 'mascotWave', needsBlob: true },
  { id: 'rainbow', keys: ['arcoiris', 'rainbow', 'colores', 'colors', 'colorful'], action: 'mascotRainbow', needsBlob: true }
];

// Roughly 1 in 4 answers adds an aside hinting that there is no real AI behind it
const PET_ASIDE_CHANCE = 0.25;
const petNoAside = ['ai', 'away', 'fallback', 'hacker'];

function isHack(raw) {
  return /(?:\bor\s+1\s*=\s*1|['"]\s*--|;\s*--|['"]\s*or\s+['"]|\bdrop\s+(?:table|database)\b|\btruncate\s+table\b|\bunion\s+select|\bselect\s+\*\s+from|\bdelete\s+from|\binsert\s+into|\bxp_cmdshell\b|\bsleep\s*\(|<script|javascript:|onerror\s*=|\balert\s*\(|document\.cookie|\brm\s+-rf|\bsudo\b|\bchmod\s+777|\/etc\/passwd|\.\.\/|\$\(|\bnmap\b|\bwget\b|\|\s*(?:sh|bash)\b|\bhack\w*|\bexploit\w*|\binyecci[oó]n\b|\binjection\b|\bbypass\b|\bddos\b|\bbrute\s+force\b|\bfuerza\s+bruta\b|\bphishing\b|\bmalware\b|\bkeylogger\b|\bpassword\b|\bcontrase[nñ]a\b)/i.test(String(raw));
}

function normalizePetText(text) {
  return String(text).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function scorePetIntent(intent, words, padded) {
  return intent.keys.reduce((total, key) => {
    if (key.includes(' ')) return total + (padded.includes(` ${key} `) ? 2 : 0);
    if (key.endsWith('*')) {
      const stem = key.slice(0, -1);
      return total + (words.some((word) => word.startsWith(stem)) ? 1 : 0);
    }
    return total + (words.includes(key) ? 1 : 0);
  }, 0);
}

// Random variant that avoids repeating the last one picked for the same intent
const lastPetPick = {};
function pickPetVariant(key, variants) {
  if (!variants || !variants.length) return '';
  let index = Math.floor(Math.random() * variants.length);
  if (variants.length > 1 && index === lastPetPick[key]) index = (index + 1) % variants.length;
  lastPetPick[key] = index;
  return variants[index];
}

function petOnScreen() {
  const mascot = document.getElementById('mascot');
  return !!mascot && !mascot.classList.contains('hidden');
}

// Returns { intent, text, bubble, action, aside } in the active language. `action` names a
// window.mascot* function to run (hacker can summon the blob); `aside` may be ''.
function answerPet(text) {
  const normalized = normalizePetText(text);
  const words = normalized.split(' ');
  const padded = ` ${normalized} `;

  let best = null;
  let bestScore = 0;
  petIntents.forEach((intent) => {
    const score = scorePetIntent(intent, words, padded);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  });

  if (isHack(text)) best = { id: 'hacker', action: 'mascotPolice' };

  let intent = best ? best.id : 'fallback';
  const action = best && best.action && (best.id === 'hacker' || petOnScreen()) ? best.action : null;
  if (best && best.needsBlob && !action) intent = 'away';

  const copy = translations[currentLang];
  const aside = !petNoAside.includes(intent) && Math.random() < PET_ASIDE_CHANCE
    ? pickPetVariant('aside', copy.pet_asides)
    : '';
  return {
    intent,
    text: pickPetVariant(intent, copy.pet_answers[intent]),
    bubble: copy.pet_bubbles[intent] || '',
    action,
    aside
  };
}

window.petBrain = { answer: answerPet, normalize: normalizePetText, isHack };
