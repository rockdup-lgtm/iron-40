import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:430,height:932}}); p.setDefaultTimeout(5000);
const vis=async()=>JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button,a,input')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>932)return false;const el=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return el&&(el===e||e.contains(el))}).map(e=>(e.innerText||e.getAttribute('aria-label')||e.placeholder||'').replace(/\s+/g,' ').slice(0,22)+(e.id?'#'+e.id:'')+JSON.stringify(e.dataset))));
await p.goto('https://iron-40.pages.dev/', {waitUntil:'networkidle'}); await p.click('[data-m="ok"]');
await p.click('[data-tab="today"]'); await p.waitForTimeout(400);
await p.click('[data-lock="B"]'); await p.waitForTimeout(1000); await p.screenshot({path:'u1.png'}); console.log('U',await vis());
for (const t of ['recovery','library','history']) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); try{await p.click(`[data-tab="${t}"]`);}catch(e){console.log('fail',t)} await p.waitForTimeout(900); await p.screenshot({path:`u_${t}.png`}); }
await b.close();
