// GET /api/admin/trials?key=OWNER_KEY  →  CSV of every trial sign-up (owner only)
export async function onRequest({ request, env }) {
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!env.OWNER_KEY || key !== env.OWNER_KEY) return new Response('Not found', { status: 404 });
  const { results } = await env.DB.prepare('SELECT email, name, lang, code, started_at, expires_at, unsubscribed, reminded_soon, reminded_end, source FROM trials ORDER BY started_at DESC').all();
  const iso = (ms) => new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['email', 'name', 'language', 'code', 'started (UTC)', 'ends (UTC)', 'unsubscribed', '2-day reminder sent', 'ended email sent', 'source']]
    .concat(results.map((r) => [r.email, r.name, r.lang, r.code, iso(r.started_at), iso(r.expires_at), r.unsubscribed ? 'yes' : 'no', r.reminded_soon ? 'yes' : 'no', r.reminded_end ? 'yes' : 'no', r.source]));
  return new Response(rows.map((r) => r.map(q).join(',')).join('\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="iron40-trials.csv"', 'Cache-Control': 'no-store' },
  });
}
