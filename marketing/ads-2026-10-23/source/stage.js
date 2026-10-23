// Iron 40 video ad: deterministic timeline, render(t) draws the frame at t seconds
(() => {
  const W = 1080, H = 1350;
  document.documentElement.setAttribute('data-theme', 'dark');
  const defs = document.getElementById('g-body')?.closest('svg');
  document.body.innerHTML = '';
  if (defs) document.body.appendChild(defs);
  document.body.style.cssText = 'margin:0;background:#0c0912;overflow:hidden';
  const css = document.createElement('style');
  css.textContent = `
  #S{position:fixed;left:0;top:0;width:${W}px;height:${H}px;background:#0c0912;overflow:hidden;font-family:Inter,sans-serif;color:#f4f1fa}
  .sc{position:absolute;inset:0;opacity:0}
  .glow{position:absolute;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(255,61,107,.32),transparent 62%)}
  .g{background:linear-gradient(90deg,#ff3d6b,#ff7a59);-webkit-background-clip:text;color:transparent}
  .big{font:700 230px/0.9 Sora;letter-spacing:-.06em;position:absolute;left:0;right:0;text-align:center}
  .h{font:700 104px/1.0 Sora;letter-spacing:-.05em}
  .eb{font:700 26px Inter;letter-spacing:.24em;text-transform:uppercase;color:#ff7a59}
  .rigwrap{position:absolute;left:0;right:0;top:230px;height:860px}
  .rigwrap svg{width:100%;height:100%}.rigwrap .rig .near .m.on{filter:url(#f-glow)}
  .lab{position:absolute;left:0;right:0;bottom:120px;text-align:center}
  .lab .n{font:700 76px Sora;letter-spacing:-.04em}
  .lab .m{margin-top:14px;font:600 30px Inter;color:#b9b1c9}
  .chip{display:inline-block;margin:0 8px;padding:10px 22px;border-radius:999px;background:rgba(255,61,107,.14);color:#ff8aa5;font:600 26px Inter}
  .phone{position:absolute;width:470px;height:1010px;border-radius:70px;padding:15px;background:#1c1726;border:2px solid rgba(255,255,255,.12);box-shadow:0 40px 120px rgba(0,0,0,.7),0 0 90px rgba(255,61,107,.22)}
  .phone img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:56px}
  .brand{position:absolute;top:60px;left:0;right:0;text-align:center;font:600 44px Sora;letter-spacing:-.03em}
  .cta{position:absolute;left:90px;right:90px;padding:40px;border-radius:40px;background:linear-gradient(90deg,#ff3d6b,#ff7a59);text-align:center;box-shadow:0 30px 90px rgba(255,61,107,.45)}
  .bar{position:absolute;left:0;bottom:0;height:8px;background:linear-gradient(90deg,#ff3d6b,#ff7a59)}`;
  document.head.appendChild(css);
  const S = document.createElement('div'); S.id = 'S'; document.body.appendChild(S);
  S.innerHTML = `
  <div class="glow" id="glow"></div>
  <div class="sc" id="s1"><div class="big" id="w1" style="top:360px">40<span class="g">+</span></div>
    <div class="h" id="w2" style="position:absolute;top:640px;left:0;right:0;text-align:center">Still lifting.</div>
    <div class="h g" id="w3" style="position:absolute;top:770px;left:0;right:0;text-align:center">Smarter.</div></div>
  <div class="sc" id="s2"><div class="eb" style="position:absolute;top:150px;left:0;right:0;text-align:center">Every rep. Demoed.</div>
    ${[0,1,2,3].map(i => `<div class="rigwrap" id="r${i}" style="opacity:0"></div>`).join('')}
    <div class="lab"><div class="n" id="ln"></div><div class="m" id="lm"></div></div></div>
  <div class="sc" id="s3"><div class="phone" id="ph" style="top:170px;left:530px"><img src="_adshot.png"></div>
    <div style="position:absolute;left:80px;top:420px;width:460px"><div class="eb">Body map</div><div class="h" style="margin-top:22px;font-size:96px">Tap a muscle.<br><span class="g">Get the moves.</span></div></div></div>
  <div class="sc" id="s4">${['Home.','Gym.','No gym.'].map((w,i)=>`<div class="h" id="p${i}" style="position:absolute;left:0;right:0;text-align:center;top:${330+i*170}px;font-size:150px">${i==2?`<span class="g">${w}</span>`:w}</div>`).join('')}
    <div id="p3" style="position:absolute;left:0;right:0;top:900px;text-align:center;font:600 44px Inter;color:#d8d1e6">It knows when to add weight.</div></div>
  <div class="sc" id="s5"><div class="brand">Iron <span class="g">40</span></div>
    <div class="h" id="c1" style="position:absolute;top:300px;left:0;right:0;text-align:center;font-size:120px">Try it<br><span class="g">free for 7 days.</span></div>
    <div class="cta" id="c2" style="top:720px"><div style="font:600 30px Inter;opacity:.9">Use code</div><div style="font:700 96px Sora;letter-spacing:-.02em">IRON7DAYS</div></div>
    <div id="c3" style="position:absolute;top:1010px;left:0;right:0;text-align:center"><div style="font:600 44px Inter">iron-40.pages.dev</div><div style="margin-top:16px;font:500 32px Inter;color:#b9b1c9">$7.99 once · No subscription · Works offline</div></div></div>
  <div class="bar" id="bar"></div>`;
  const MOVES = [['goblet-squat','Goblet Squat',['Quads','Glutes']],['push-up','Push-Up',['Chest','Triceps']],['pull-up','Pull-Up',['Back','Biceps']],['db-rdl','Romanian Deadlift',['Hamstrings','Glutes']]];
  const anims = MOVES.map(([id], i) => { const a = IronRig.create(document.getElementById('r'+i), EX_BY_ID[id], {}); a.pause(); return a; });
  const $ = (id) => document.getElementById(id);
  const cl = (x) => Math.max(0, Math.min(1, x));
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3);            // ease out
  const back = (x) => { x = cl(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const win = (t, a, b, f = .25) => cl((t - a) / f) * cl((b - t) / f); // scene opacity
  const slam = (el, t, t0) => { const u = cl((t - t0) / .22); el.style.opacity = u > 0 ? 1 : 0; el.style.transform = `scale(${1.6 - .6 * back(u)})`; };
  const rise = (el, t, t0, d = 40) => { const u = eo((t - t0) / .45); el.style.opacity = u; el.style.transform = `translateY(${(1 - u) * d}px)`; };
  window.render = (t) => {
    $('glow').style.left = (-200 + 260 * Math.sin(t * .5)) + 'px'; $('glow').style.top = (-300 + 500 * cl(t / 15)) + 'px';
    $('bar').style.width = (100 * cl(t / 15)) + '%';
    // 1 hook 0–2.3
    $('s1').style.opacity = win(t, -1, 2.3, .2); slam($('w1'), t, .05); rise($('w2'), t, .7); rise($('w3'), t, 1.25);
    // 2 moves 2.3–8.3
    $('s2').style.opacity = win(t, 2.3, 8.3, .2);
    const k = Math.min(3, Math.max(0, Math.floor((t - 2.3) / 1.5)));
    MOVES.forEach((m, i) => { const a = 2.3 + i * 1.5, el = $('r' + i); const o = cl((t - a) / .15) * cl((a + 1.5 - t) / .15 + (i === 3 ? 9 : 0));
      el.style.opacity = o; el.style.transform = `translateX(${(1 - eo((t - a) / .3)) * 80}px)`; anims[i].seek(Math.max(0, t - a) * 1.25 + .2); });
    $('ln').textContent = MOVES[k][1]; $('lm').innerHTML = MOVES[k][2].map((x) => `<span class="chip">${x}</span>`).join('');
    const lu = eo((t - 2.3 - k * 1.5) / .3); $('ln').style.opacity = lu; $('ln').style.transform = `translateY(${(1 - lu) * 30}px)`;
    // 3 phone 8.3–10.7
    $('s3').style.opacity = win(t, 8.3, 10.7, .2); const pu = eo((t - 8.3) / .6); $('ph').style.transform = `translateY(${(1 - pu) * 420}px) rotate(${(1 - pu) * 6}deg)`;
    // 4 punches 10.7–12.7
    $('s4').style.opacity = win(t, 10.7, 12.7, .15); [0, 1, 2].forEach((i) => slam($('p' + i), t, 10.75 + i * .33)); rise($('p3'), t, 11.85);
    // 5 CTA 12.7–15
    $('s5').style.opacity = win(t, 12.7, 99, .2); rise($('c1'), t, 12.75); const cu = cl((t - 13.2) / .35); $('c2').style.opacity = cu; $('c2').style.transform = `scale(${.7 + .3 * back(cu)})`; rise($('c3'), t, 13.6);
  };
  window.render(0);
})();
