// Pet brain: lets the mascot answer plain-language questions about Cristopher "like an AI".
// It is a local keyword matcher (no model, no network): the best-scoring intent picks a
// canned answer from translations.js (pet_answers / pet_bubbles / pet_asides, per language).

// Keywords are written already normalized (lowercase, no accents or punctuation).
// A key with spaces is a phrase and weighs 2; "stem*" matches any word starting with stem.
// Ties go to the intent declared first, so the more specific intents come first.
const petIntents = [
  { id: 'ai', keys: ['ia', 'ai', 'chatgpt', 'gpt', 'openai', 'llm', 'bot', 'robot', 'artificial', 'machine learning',
    'inteligencia artificial', 'red neuronal', 'neural network', 'eres real', 'are you real', 'eres humano', 'are you human',
    'eres claude', 'are you claude'] },
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

// --- Blog: answers built from window.BLOG_POSTS (js/blog/posts.js) and each post's `brain` ---
// Some article keys overlap the intents above ('saga', 'migracion', 'oracle'...). Rule: a
// conceptual question ("qué es", "cómo", "por qué", "what is", "how", "why"...) or one about
// his writing goes to the article; one about his projects or work ("proyecto saga", "qué hizo
// en...") stays with those intents. The article has to tie the best intent (conceptual or
// writing questions) or beat it (anything else), so "¿cómo usa Oracle?" is still stack.
const petBlogCues = ['que es', 'que son', 'que significa', 'como', 'por que', 'para que', 'explica*', 'what is',
  'what are', 'what does', 'whats', 'how', 'why', 'explain*', 'meaning'];
const petBlogWrite = ['blog', 'articulo*', 'article*', 'post', 'posts', 'escribe', 'escribio', 'escrito', 'escribir',
  'write', 'writes', 'wrote', 'written', 'writing'];
const petWorkCues = ['proyecto*', 'project*', 'hizo', 'did he', 'built', 'construyo'];
// Category slug (posts.js categoryKey) → blog filter label in translations.js
const petBlogFilters = { arquitectura: 'blog_filter_architecture', microservicios: 'blog_filter_microservices',
  'bases-de-datos': 'blog_filter_databases', ia: 'blog_filter_ai', herramientas: 'blog_filter_tools',
  devops: 'blog_filter_devops' };
// Links come only from manifest slugs, resolved from the site root (this file is in js/components/)
const PET_SITE_ROOT = typeof document !== 'undefined' && document.currentScript && document.currentScript.src
  ? new URL('../../', document.currentScript.src).href : '';

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

function petPostHref(post) {
  return `${PET_SITE_ROOT}blog/posts/${encodeURIComponent(post.slug)}.html`;
}

function petBlogItems(posts, copy) {
  return posts.map((post) => ({
    title: post.title,
    category: post.categoryKey.map((key) => copy[petBlogFilters[key]]).filter(Boolean).join(' / ') || post.category,
    href: petPostHref(post)
  }));
}

// Category and tag names a question can use, in both languages, already normalized
function petBlogTerms(post) {
  const terms = post.categoryKey.map((key) => key.replace(/-/g, ' '));
  post.categoryKey.forEach((key) => {
    ['es', 'en'].forEach((lang) => {
      if (translations[lang][petBlogFilters[key]]) terms.push(normalizePetText(translations[lang][petBlogFilters[key]]));
    });
  });
  post.category.split('/').concat(post.tags || []).forEach((name) => terms.push(normalizePetText(name)));
  return terms.filter(Boolean);
}

// Returns a blog reply, or null so the regular intents answer
function answerBlog(words, padded, best, bestScore, copy) {
  const posts = window.BLOG_POSTS;
  if (!Array.isArray(posts) || !posts.length) return null;
  const has = (keys) => scorePetIntent({ keys }, words, padded);
  const writeScore = has(petBlogWrite);
  const conceptual = has(petBlogCues) > 0;
  const reply = { action: null, aside: '' };

  // "¿Qué escribió sobre X?" with X a category or tag
  if (writeScore) {
    const matches = posts.filter((post) => petBlogTerms(post).some((term) => padded.includes(` ${term} `)));
    if (matches.length) {
      return Object.assign(reply, {
        intent: 'blogTopic',
        text: pickPetVariant('blogTopic', copy.pet_answers.blogTopic),
        bubble: copy.pet_bubbles.blogTopic,
        items: petBlogItems(matches, copy),
        links: [{ href: `${PET_SITE_ROOT}blog/`, label: copy.pet_blog_all }]
      });
    }
  }

  // Best topic across every post; ties go to the newest post
  let article = null;
  let articleScore = 0;
  posts.forEach((post) => {
    if (!post.brain) return;
    [].concat(post.brain).forEach((topic) => {
      const score = has(topic.keys);
      if (score > articleScore) {
        article = { post, topic };
        articleScore = score;
      }
    });
  });
  const aboutWork = !writeScore && best && has(petWorkCues) > 0;
  const wins = writeScore || conceptual ? articleScore >= bestScore : articleScore > bestScore;
  if (article && !aboutWork && wins) {
    return Object.assign(reply, {
      intent: 'blogPost',
      slug: article.post.slug,
      text: article.topic[currentLang] || article.topic.es,
      bubble: copy.pet_bubbles.blogPost,
      links: [{ href: petPostHref(article.post), label: copy.pet_blog_read }]
    });
  }

  if (writeScore && writeScore >= bestScore) {
    const count = String(posts.length);
    return Object.assign(reply, {
      intent: 'blogList',
      text: pickPetVariant('blogList', copy.pet_answers.blogList).replace('{count}', count),
      bubble: copy.pet_bubbles.blogList.replace('{count}', count),
      items: petBlogItems(posts, copy),
      links: [{ href: `${PET_SITE_ROOT}blog/`, label: copy.pet_blog_all }]
    });
  }
  return null;
}

function petOnScreen() {
  const mascot = document.getElementById('mascot');
  return !!mascot && !mascot.classList.contains('hidden');
}

// Returns { intent, text, bubble, action, aside } in the active language. `action` names a
// window.mascot* function to run (hacker can summon the blob); `aside` may be ''.
// Blog replies add `links` ({ href, label }) and, for lists, `items` ({ title, category, href }).
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

  const copy = translations[currentLang];
  if (isHack(text)) {
    best = { id: 'hacker', action: 'mascotPolice' };
  } else {
    const blog = answerBlog(words, padded, best, bestScore, copy);
    if (blog) return blog;
  }

  let intent = best ? best.id : 'fallback';
  const action = best && best.action && (best.id === 'hacker' || petOnScreen()) ? best.action : null;
  if (best && best.needsBlob && !action) intent = 'away';

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
