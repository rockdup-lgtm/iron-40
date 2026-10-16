// =====================================================
// IRON 40 — language support (English, Español, Português do Brasil)
// =====================================================
// The user picks a language in Profile; it's stored in iron40_lang and applied on load.
// All text ships with the app: UI strings live in i18n-ui.js, exercise/program data in i18n-data.js.
// Load order: exercises.js → i18n.js → i18n-ui.js → i18n-data.js → app script.

const LANGS = { en: 'English', es: 'Español', pt: 'Português (Brasil)' };
const LOCALES = { en: 'en-US', es: 'es', pt: 'pt-BR' };
let LANG = 'en';
try { LANG = JSON.parse(localStorage.getItem('iron40_lang')) || 'en'; } catch {}
if (!LANGS[LANG]) LANG = 'en';
const LOCALE = LOCALES[LANG];
document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : LANG;

// UI strings keyed by the exact English text: I18N.es['Start workout'] = 'Empezar entrenamiento'
const I18N = { es: {}, pt: {} };
// Data overlays keyed by id (see applyDataLang)
const I18N_DATA = { es: {}, pt: {} };

// t('Rest {n}s', { n: 90 }) → translated text with {placeholders} filled in
function t(s, vars) {
  let out = (LANG !== 'en' && I18N[LANG] && I18N[LANG][s]) || s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return out;
}

function setLang(l) {
  if (!LANGS[l]) return;
  try { localStorage.setItem('iron40_lang', JSON.stringify(l)); } catch {}
  location.reload();
}

// Static HTML: <span data-i18n>Text</span> and <input data-i18n-ph placeholder="Text">
function translateStatic(root = document) {
  if (LANG === 'en') return;
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.textContent.trim()); });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.placeholder); });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.getAttribute('aria-label'))); });
}

// Overlay translated display fields onto the data from exercises.js.
// Ids and keys (exercise ids, equip names, muscle keys, AREAS keys) never change — only display text.
function applyDataLang() {
  const D = I18N_DATA[LANG];
  if (LANG === 'en' || !D) return;
  const FIELDS = ['name', 'muscles', 'cues', 'mistake', 'tip40', 'easier', 'harder', 'note'];
  [...EXERCISES, ...WARMUPS].forEach((ex) => {
    const tr = D.exercises && D.exercises[ex.id];
    if (!tr) return;
    FIELDS.forEach((f) => { if (tr[f] != null) ex[f] = tr[f]; });
    if (tr.tempo && ex.tempo) ex.tempo.forEach((step, i) => { if (tr.tempo[i]) step.label = tr.tempo[i]; });
  });
  Object.entries(D.programs || {}).forEach(([k, p]) => {
    if (!PROGRAM[k]) return;
    ['name', 'focus', 'chip'].forEach((f) => { if (p[f] != null) PROGRAM[k][f] = p[f]; });
  });
  Object.assign(MUSCLES, D.muscles || {});
  Object.assign(TIP30, D.tip30 || {});
  Object.assign(JOINTS, D.joints || {});
  Object.assign(GEAR, D.gear || {});
}
