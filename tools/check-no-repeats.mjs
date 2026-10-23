// Fails if any weekly plan or the calisthenics set repeats an exercise.
// Builds every plan for every place (home/machines/full/bodyweight) × 2–5 days × each protected joint.
// Run from the repo root: node tools/check-no-repeats.mjs   (needs: npm i -g playwright)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try { const f = join(process.cwd(), decodeURIComponent(new URL(req.url, 'http://x').pathname)), body = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:${server.address().port}/index.html`);
await page.waitForFunction(() => typeof buildPlans === 'function');
const problems = await page.evaluate(() => {
  const out = [];
  const dupes = (lists) => { const seen = {}; lists.forEach(([k, ids]) => new Set(ids).forEach((id) => (seen[id] = [...(seen[id] || []), k]))); return Object.entries(seen).filter(([, ks]) => ks.length > 1); };
  for (const loc of Object.keys(LOCATIONS)) for (const days of [2, 3, 4, 5]) for (const protect of [[], ...Object.keys(JOINTS).map((j) => [j])]) {
    profile = { sex: 'm', age: '40', loc, days, gear: LOCATIONS[loc].gear, protect };
    buildPlans();
    const lists = planKeys().map((k) => [k, PROGRAM[k].items.map((i) => i.id)]);
    const tag = `${loc} ${days}d ${protect[0] || 'no joint'}`;
    lists.forEach(([k, ids]) => { if (new Set(ids).size !== ids.length) out.push(`${tag}: ${k} repeats a move within the day`); if (ids.length < 3) out.push(`${tag}: ${k} has only ${ids.length} moves`); });
    dupes(lists).forEach(([id, ks]) => out.push(`${tag}: ${id} in ${ks.join(', ')}`));
  }
  const cali = Object.entries(PROGRAM).filter(([, p]) => p.cali).map(([k, p]) => [k, p.items.map((i) => i.id)]);
  dupes(cali).forEach(([id, ks]) => out.push(`calisthenics: ${id} in ${ks.join(', ')}`));
  return out;
});
await browser.close(); server.close();
const all = [...errors.map((e) => `page error: ${e}`), ...problems];
console.log(all.length ? all.join('\n') : 'OK: no repeated exercises in any plan');
process.exit(all.length ? 1 : 0);
