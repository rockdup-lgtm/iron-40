import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const scheme of ['light','dark']) {
const ctx = await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,colorScheme:scheme});
const p = await ctx.newPage();
await p.goto('https://iron-40.pages.dev/?lang=en',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
await p.getByText("I understand").first().click();
await p.waitForTimeout(800);
if (scheme==='dark'){ await p.screenshot({path:'shots/d-body.png'}); }
await p.getByRole('button',{name:'Workout',exact:true}).last().click(); await p.waitForTimeout(900);
await p.screenshot({path:`shots/${scheme[0]}-workout.png`});
// scroll to workout list
await p.getByText('SWITCH FOCUS',{exact:false}).first().scrollIntoViewIfNeeded().catch(()=>{});
await p.evaluate(()=>scrollBy(0,-120)); await p.waitForTimeout(700);
await p.screenshot({path:`shots/${scheme[0]}-list.png`});
if (scheme==='light'){
  await p.getByRole('button',{name:'Body',exact:true}).last().click(); await p.waitForTimeout(700);
  await p.getByRole('button',{name:'Chest',exact:true}).first().click(); await p.waitForTimeout(1500);
  await p.screenshot({path:'shots/l-chest.png'});
  await p.getByRole('button',{name:'Workout',exact:true}).last().click(); await p.waitForTimeout(700);
  await p.getByText('Push-ups',{exact:true}).first().click(); await p.waitForTimeout(1500);
  await p.screenshot({path:'shots/l-push.png'});
  console.log((await p.evaluate(()=>document.body.innerText)).slice(0,1500).replace(/\n+/g,' | '));
}
await ctx.close();
}
await b.close();
