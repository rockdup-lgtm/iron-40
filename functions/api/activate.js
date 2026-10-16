// POST /api/activate  { key }  →  { ok: true, id } | { ok: false, error }
// Activates a Lemon Squeezy license key for one device. Runs on Cloudflare Pages
// so the browser never talks to Lemon Squeezy directly.
// Settings (Cloudflare Pages → Settings → Variables): LS_STORE_ID, LS_PRODUCT_ID and OWNER_KEY,
// so keys from any other Lemon Squeezy product are rejected.

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  let key = '';
  try { key = String((await request.json()).key || '').trim(); } catch {}
  if (!/^[A-Za-z0-9-]{8,80}$/.test(key)) return json({ ok: false, error: 'That doesn’t look like a license key.' }, 400);

  // Private owner link: OWNER_KEY is a Pages secret, never shipped in the app
  if (env.OWNER_KEY && key === env.OWNER_KEY) return json({ ok: true, id: 'owner' });

  const form = new URLSearchParams({ license_key: key, instance_name: `Iron 40 · ${new Date().toISOString().slice(0, 10)}` });
  let data;
  try {
    const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: form,
    });
    data = await res.json();
  } catch {
    return json({ ok: false, error: 'Couldn’t reach the license server. Try again in a minute.' }, 502);
  }

  const meta = data.meta || {};
  // Unknown keys come back with no meta; only compare when Lemon Squeezy says which product a key belongs to
  const wrongStore = env.LS_STORE_ID && meta.store_id && String(meta.store_id) !== String(env.LS_STORE_ID);
  const wrongProduct = env.LS_PRODUCT_ID && meta.product_id && String(meta.product_id) !== String(env.LS_PRODUCT_ID);
  if (wrongStore || wrongProduct) return json({ ok: false, error: 'That key is for a different product.' }, 403);

  if (!data.activated) {
    const limit = /limit/i.test(data.error || '');
    return json({ ok: false, error: limit ? 'This key is already active on the maximum number of devices.' : 'That key didn’t work. Check it matches your purchase email.' }, 403);
  }
  if (data.license_key && data.license_key.status !== 'active') return json({ ok: false, error: 'This key is no longer active.' }, 403);
  return json({ ok: true, id: data.instance && data.instance.id });
}

export const onRequest = () => json({ ok: false, error: 'Use POST.' }, 405);
