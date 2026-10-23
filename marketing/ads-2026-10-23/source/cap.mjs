import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';
const FPS = 30, DUR = 15, only = process.argv[2];
mkdirSync('frames', { recursive: true });
const b = await chromium.launch(); const errs = [];
const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, colorScheme: 'dark' }); p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:8766/index.html'); await p.waitForTimeout(1200);
await p.addScriptTag({ path: 'stage.js' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const ts = only ? only.split(',').map(Number) : [...Array(FPS * DUR).keys()].map((i) => i / FPS);
for (const [i, t] of ts.entries()) {
  await p.evaluate((t) => new Promise((r) => { render(t); requestAnimationFrame(() => requestAnimationFrame(r)); }), t);
  await p.screenshot({ path: only ? `prev-${t}.png` : `frames/f${String(i).padStart(4, '0')}.png` });
}
console.log('errors', errs); await b.close();
