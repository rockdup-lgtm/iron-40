import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright');
const SHOTS = process.argv[2]==='shots';
const b = await chromium.launch({args:['--force-device-scale-factor=2']});
const ctx = await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2, });
await ctx.addInitScript(()=>{addEventListener('DOMContentLoaded',()=>{const c=document.createElement('div');c.id='__cur';c.style.cssText='position:fixed;z-index:2147483647;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(20,20,30,.28);border:2px solid rgba(255,255,255,.95);box-shadow:0 2px 10px rgba(0,0,0,.35);pointer-events:none;transition:transform .12s;transform:translate(215px,700px)';document.body.appendChild(c);
 addEventListener('mousemove',e=>{c.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},true);
 addEventListener('mousedown',e=>{c.style.transform+=' scale(.75)'},true);addEventListener('mouseup',e=>{c.style.transform=c.style.transform.replace(' scale(.75)','')},true);})});
const p = await ctx.newPage(); p.setDefaultTimeout(6000);
const fs = require('fs'); const FR=[]; let cdp;
if(!SHOTS){ fs.mkdirSync('cast',{recursive:true}); cdp=await ctx.newCDPSession(p);
 cdp.on('Page.screencastFrame', async f=>{ const n=FR.length; fs.writeFileSync(`cast/c${String(n).padStart(5,'0')}.jpg`, Buffer.from(f.data,'base64')); FR.push([n,f.metadata.timestamp]); try{await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId});}catch{} });
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:2000,maxHeight:3000,everyNthFrame:1}); }
const castT0 = Date.now()/1000;
const T0=Date.now(); const marks=[]; const mark=(label)=>{marks.push([((Date.now()-T0)/1000).toFixed(2),label]); console.log('MARK',marks.at(-1).join(' '));};
let mx=215,my=700, n=0;
const W=(ms)=>p.waitForTimeout(ms);
const shot=async(tag)=>{ if(SHOTS) await p.screenshot({path:`s${String(n++).padStart(2,'0')}-${tag}.png`}); };
async function moveTo(x,y,steps=18){ for(let i=1;i<=steps;i++){const k=i/steps,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; await p.mouse.move(mx+(x-mx)*e,my+(y-my)*e); await W(16);} mx=x;my=y; }
async function tap(sel,{pause=350,nth=0}={}){ const el=p.locator(sel).nth(nth); await el.scrollIntoViewIfNeeded(); await W(200); const bb=await el.boundingBox(); await moveTo(bb.x+bb.width/2,bb.y+bb.height/2); await W(120); await p.mouse.down(); await W(90); await p.mouse.up(); await W(pause); }
async function scroll(dy,steps=20){ for(let i=0;i<steps;i++){ await p.mouse.wheel(0,dy/steps); await W(30);} await W(300); }

const vis=async()=>JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button,a,input')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<932&&getComputedStyle(e).visibility!='hidden'}).map(e=>(e.innerText||e.getAttribute('aria-label')||e.placeholder||'').replace(/\\s+/g,' ').slice(0,22)+JSON.stringify(e.dataset)+(e.id?'#'+e.id:''))));

const step=async(name,fn)=>{ try{ await fn(); }catch(e){ console.log('FAIL',name,e.message.slice(0,120)); } };
async function drag(sel,f0,f1){ const bb=await p.locator(sel).first().boundingBox(); const y=bb.y+bb.height/2; await moveTo(bb.x+bb.width*f0,y); await p.mouse.down(); for(let i=1;i<=40;i++){ await p.mouse.move(bb.x+bb.width*(f0+(f1-f0)*i/40),y); await W(35);} await p.mouse.up(); mx=bb.x+bb.width*f1; my=y; }
await p.goto('https://iron-40.pages.dev/', {waitUntil:'networkidle'}); await W(300);
mark('welcome'); await W(2800); await shot('welcome');
await step('knee',()=>tap('[data-multi="protect"][data-v="knee"]',{pause:1000}));
await step('ok',()=>tap('[data-m="ok"]',{pause:800}));
mark('body'); await W(2000); await shot('body');
await step('chest',()=>tap('[data-mus="chest"]',{pause:2000})); mark('chest'); await shot('chest');
await step('bench',()=>tap('[data-ex="db-bench"]',{pause:1200})); mark('demo'); await W(2500); await shot('demo');
await step('scrub',()=>drag('input[aria-label="Drag through the full range of motion"] >> visible=true',0.2,0.95)); await W(500);
await step('scrub2',()=>drag('input[aria-label="Drag through the full range of motion"] >> visible=true',0.95,0.1)); await W(800); await shot('scrub');
await scroll(900,30); mark('howto'); await W(2400); await shot('howto');
await scroll(600,25); await W(2600); await shot('tip');
await scroll(-1600,25);
await step('close',()=>tap('button[aria-label="Close"] >> visible=true',{pause:700}));
await step('today',()=>tap('[data-tab="today"]',{pause:500})); mark('today'); await W(2600); await shot('today');
await step('start',()=>tap('#startBtn',{pause:900})); mark('warmup'); await W(2000); await shot('warmup');
await step('lift',()=>tap('#wNext',{pause:900})); mark('lift'); await W(2800); await shot('lift');
await scroll(650,25); await W(700);
await step('w1',()=>tap('[data-k="w"]',{pause:700})); mark('picker');
await step('wheel',async()=>{ await moveTo(113,717); for(let i=0;i<38;i++){ await p.mouse.wheel(0,44); await W(40);} await W(900); }); await shot('picker');
await step('log',()=>tap('#wsLog',{pause:1300})); mark('rest'); await shot('rest');
await step('solid',()=>tap('[data-rir="2"] >> visible=true',{pause:1500}));
await step('skip',()=>tap('#restSkip',{pause:1200})); await shot('skip');
await step('wclose',()=>tap('#wClose',{pause:900}));
await step('discard',()=>tap('[data-m="discard"]',{pause:900}));
await scroll(450,20);
await step('lockB',()=>tap('[data-lock="B"]',{pause:800})); mark('unlock'); await W(5000); await shot('unlock');
await step('key',()=>tap('#licKey',{pause:1500}));
await step('notnow',()=>tap('[data-m="close"] >> visible=true',{pause:800}));
await step('lib',()=>tap('[data-tab="library"]',{pause:600})); mark('library'); await W(1500); await shot('library');
await scroll(1200,40); await W(1500); await shot('library2');
mark('end'); await W(500);
if(!SHOTS){ await W(400); await cdp.send('Page.stopScreencast'); fs.writeFileSync('cast/frames.json', JSON.stringify({frames:FR, T0:T0/1000, marks})); }
await ctx.close(); await b.close(); console.log(JSON.stringify(marks));
