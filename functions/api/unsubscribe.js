// GET /api/unsubscribe?t=TOKEN — one-click opt-out from trial reminder emails
export async function onRequest({ request, env }) {
  const t = new URL(request.url).searchParams.get('t') || '';
  let ok = false;
  if (env.DB && /^[0-9a-f-]{36}$/.test(t)) {
    const r = await env.DB.prepare('UPDATE trials SET unsubscribed = 1 WHERE token = ?').bind(t).run();
    ok = r.meta && r.meta.changes > 0;
  }
  const msg = ok ? 'You’re unsubscribed. You won’t get any more Iron 40 trial emails.' : 'That unsubscribe link isn’t valid or was already used.';
  return new Response(`<!doctype html><meta name="viewport" content="width=device-width"><title>Iron 40</title>
<body style="font:17px/1.5 -apple-system,system-ui,sans-serif;background:#09080d;color:#f6f3fa;display:grid;place-items:center;min-height:90vh;margin:0;padding:24px;text-align:center">
<div><h1 style="font-size:28px">Iron <span style="color:#ff3d6b">40</span></h1><p>${msg}</p><p><a style="color:#ff8a5c" href="/">Open Iron 40</a></p></div>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
