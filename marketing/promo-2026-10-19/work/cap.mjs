import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,colorScheme:'light'});
const p = await ctx.newPage();
await p.goto('https://iron-40.pages.dev/?lang=en',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
await p.getByText("I understand").first().click().catch(e=>console.log('no consent btn'));
await p.waitForTimeout(1000);
await p.screenshot({path:'shots/s-body.png'});
const tabs = await p.evaluate(()=>[...document.querySelectorAll('nav button, nav a, [role=tab]')].map(e=>e.innerText.trim()).filter(Boolean));
console.log('tabs',tabs);
for (const t of ['Workout','Log','Exercises','Recovery']) {
  await p.getByRole('button',{name:t,exact:true}).last().click().catch(()=>p.getByText(t,{exact:true}).last().click().catch(()=>console.log('miss',t)));
  await p.waitForTimeout(900); await p.screenshot({path:`shots/s-${t.toLowerCase()}.png`});
  console.log('---',t, (await p.evaluate(()=>document.querySelector('main, #app, body').innerText)).slice(0,700).replace(/\n+/g,' | '));
}
await b.close();
