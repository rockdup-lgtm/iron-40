// POST /api/trial-signup  { code, email, name?, lang? }  →  { ok, id:'trial', days, expires } | { ok:false, error }
// Starts an email trial (e.g. the 7-day Facebook trial) and stores the sign-up in D1 for reminder emails.
import { trialCode } from './activate.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const MSG = {
  en: { email: 'Please enter a valid email.', code: 'That trial code isn’t valid.', used: 'This email has already used its free trial.' },
  es: { email: 'Escribe un correo válido.', code: 'Ese código de prueba no es válido.', used: 'Este correo ya usó su prueba gratis.' },
  pt: { email: 'Digite um e-mail válido.', code: 'Esse código de teste não é válido.', used: 'Este e-mail já usou o teste grátis.' },
};

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch {}
  const lang = ['en', 'es', 'pt'].includes(body.lang) ? body.lang : 'en';
  const m = MSG[lang];
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim().slice(0, 60);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return json({ ok: false, error: m.email }, 400);
  const trial = trialCode(env, String(body.code || ''));
  if (!trial || !trial.email) return json({ ok: false, error: m.code }, 400);
  if (!env.DB) return json({ ok: false, error: 'Sign-ups are not configured.' }, 500);

  const now = Date.now();
  const existing = await env.DB.prepare('SELECT started_at, expires_at FROM trials WHERE email = ?').bind(email).first();
  if (existing) {
    // Same person re-opening the link on another phone keeps their original dates; an ended trial can't restart
    if (existing.expires_at < now) return json({ ok: false, error: m.used }, 403);
    return json({ ok: true, id: 'trial', days: trial.days, expires: existing.expires_at });
  }
  const expires = now + trial.days * 864e5;
  const token = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO trials (email, name, lang, code, started_at, expires_at, token, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(email, name || null, lang, trial.code, now, expires, token, String(body.source || '').slice(0, 40) || null).run();
  return json({ ok: true, id: 'trial', days: trial.days, expires });
}

export const onRequest = () => json({ ok: false, error: 'Use POST.' }, 405);
