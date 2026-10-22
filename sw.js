const CACHE = 'iron40-v37';
const CORE = ['./', 'index.html', 'exercises.js', 'i18n.js', 'i18n-ui.js', 'i18n-data.js', 'manifest.json'];
const IMAGES = ['hero', 'onboard', 'icon-192', 'icon-512', 'apple-touch-icon',
  'db-bench', 'incline-db', 'bb-ohp', 'db-shoulder', 'db-row', 'bb-row', 'cs-row', 'db-pullover',
  'goblet-squat', 'back-squat', 'db-rdl', 'bb-rdl', 'split-squat', 'hip-thrust', 'db-curl', 'skull-crusher', 'farmer-carry',
  'push-up', 'incline-pushup', 'decline-pushup', 'diamond-pushup', 'pike-pushup', 'pull-up', 'chin-up', 'inverted-row', 'superman', 'y-raise',
  'shoulder-tap', 'bench-dip', 'bw-squat', 'reverse-lunge', 'glute-bridge', 'wall-sit', 'plank', 'dead-bug', 'knee-raise',
  'calf-raise', 'lateral-raise', 'side-plank',
  'leg-press', 'leg-extension', 'leg-curl', 'seated-calf', 'chest-press', 'pec-deck', 'machine-shoulder', 'lat-pulldown', 'cable-row',
  'face-pull', 'pushdown', 'cable-curl', 'smith-squat', 'hip-abduction', 'assisted-pullup', 'captains-chair', 'neutral-pullup', 'tower-dip',
  'childs-pose', 'cat-cow', 'knee-chest', 'supine-twist', 'hamstring-stretch', 'quad-stretch', 'hip-flexor', 'figure-four',
  'calf-stretch', 'cross-shoulder', 'triceps-stretch', 'doorway-chest', 'biceps-stretch', 'wrist-stretch',
].flatMap((n) => n.includes('icon') ? [`img/${n}.png`] : [`img/${n}.jpg`, `img/f/${n}.jpg`]); // men's and women's photos

// Images are optional, so add them one by one and ignore misses
self.addEventListener('install', (e) => e.waitUntil(
  caches.open(CACHE).then((c) => c.addAll(CORE).then(() => Promise.all(IMAGES.map((u) => c.add(u).catch(() => {})))))
));

self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
));

// Network first so updates show up; fall back to cache when offline
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
