import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
await p.goto('https://iron-40.pages.dev/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
await p.screenshot({path:'shots/m0.png'});
console.log((await p.evaluate(()=>document.body.innerText)).slice(0,2500));
await b.close();
