import { createRequire } from 'module';
const require = createRequire('/Users/kennethbussey/Desktop/CLAUDE PROJECTS/service-tracker/');
const { chromium } = require('playwright'); const fs=require('fs');
for (const [name,opts,ctxo] of [['a',{args:['--force-device-scale-factor=2']},{viewport:{width:430,height:932},deviceScaleFactor:2}],['b',{args:['--force-device-scale-factor=2']},{viewport:{width:430,height:932}}]]){
const b = await chromium.launch(opts); const ctx=await b.newContext(ctxo);
const p=await ctx.newPage(); await p.goto('https://iron-40.pages.dev/',{waitUntil:'networkidle'});
const cdp=await ctx.newCDPSession(p); let got=0;
cdp.on('Page.screencastFrame',async f=>{ if(!got++) fs.writeFileSync(`zt_${name}.jpg`,Buffer.from(f.data,'base64')); await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}); });
await cdp.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:2000,maxHeight:3000}); await p.waitForTimeout(800);
await b.close(); }
