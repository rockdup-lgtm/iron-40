// Iron 40 — trial reminder emails
// Daily cron: "2 days left" email before a 7-day trial ends, and a "trial ended" email after.
// Each email is sent once (reminded_soon / reminded_end flags) and never to unsubscribed people.
// GET /?key=ADMIN_KEY&dry=1 previews who would get what without sending.

const DAY = 864e5;

const COPY = {
  en: {
    soonSubject: 'Your Iron 40 trial ends in 2 days',
    soonHead: (n) => `${n ? n + ', your' : 'Your'} free trial ends in 2 days`,
    soonBody: 'You still have full access to every workout, stretch, demo and video. Keep your streak going, and when you’re ready, unlock Iron 40 for good.',
    endSubject: 'Your Iron 40 trial has ended',
    endHead: (n) => `${n ? 'Thanks for training with us, ' + n : 'Thanks for training with us'}`,
    endBody: 'Your 7-day trial is over, but your workout log is still saved on your phone. Unlock everything for a one-time $19.99. No subscription, ever.',
    cta: 'Unlock Iron 40 for $19.99', open: 'Open Iron 40',
    how: 'After you buy, open Iron 40, tap any lock, and paste the license key from your receipt email.',
    foot: 'You’re getting this because you started a free Iron 40 trial.', unsub: 'Unsubscribe',
  },
  es: {
    soonSubject: 'Tu prueba de Iron 40 termina en 2 días',
    soonHead: (n) => `${n ? n + ', tu' : 'Tu'} prueba gratis termina en 2 días`,
    soonBody: 'Todavía tienes acceso completo a cada rutina, estiramiento, demo y video. Mantén tu racha y, cuando quieras, desbloquea Iron 40 para siempre.',
    endSubject: 'Tu prueba de Iron 40 terminó',
    endHead: (n) => `${n ? 'Gracias por entrenar con nosotros, ' + n : 'Gracias por entrenar con nosotros'}`,
    endBody: 'Tu prueba de 7 días terminó, pero tu registro de entrenamientos sigue guardado en tu teléfono. Desbloquea todo con un pago único de $19.99. Sin suscripción.',
    cta: 'Desbloquear Iron 40 por $19.99', open: 'Abrir Iron 40',
    how: 'Después de comprar, abre Iron 40, toca cualquier candado y pega la clave de licencia de tu correo de compra.',
    foot: 'Recibes este correo porque empezaste una prueba gratis de Iron 40.', unsub: 'Darse de baja',
  },
  pt: {
    soonSubject: 'Seu teste do Iron 40 termina em 2 dias',
    soonHead: (n) => `${n ? n + ', seu' : 'Seu'} teste grátis termina em 2 dias`,
    soonBody: 'Você ainda tem acesso total a todos os treinos, alongamentos, demonstrações e vídeos. Mantenha sua sequência e, quando quiser, desbloqueie o Iron 40 de vez.',
    endSubject: 'Seu teste do Iron 40 terminou',
    endHead: (n) => `${n ? 'Obrigado por treinar com a gente, ' + n : 'Obrigado por treinar com a gente'}`,
    endBody: 'Seu teste de 7 dias acabou, mas seu histórico de treinos continua salvo no celular. Desbloqueie tudo com um pagamento único de $19.99. Sem assinatura.',
    cta: 'Desbloquear o Iron 40 por $19.99', open: 'Abrir o Iron 40',
    how: 'Depois de comprar, abra o Iron 40, toque em qualquer cadeado e cole a chave de licença do e-mail da compra.',
    foot: 'Você recebeu este e-mail porque começou um teste grátis do Iron 40.', unsub: 'Cancelar inscrição',
  },
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function build(kind, row, env) {
  const c = COPY[row.lang] || COPY.en;
  const name = (row.name || '').split(' ')[0];
  const head = kind === 'soon' ? c.soonHead(name) : c.endHead(name);
  const body = kind === 'soon' ? c.soonBody : c.endBody;
  const subject = kind === 'soon' ? c.soonSubject : c.endSubject;
  const unsubUrl = `${env.APP_URL}/api/unsubscribe?t=${row.token}`;
  const buy = env.CHECKOUT_URL, app = `${env.APP_URL}/?lang=${row.lang}`;
  const btn = (href, label, primary) => `<a href="${href}" style="display:inline-block;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:600;${primary ? 'background:#ff3d6b;color:#ffffff' : 'background:#1d1a26;color:#f6f3fa;border:1px solid #2e2939'}">${esc(label)}</a>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;background:#09080d;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#f6f3fa">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <div style="font-size:26px;font-weight:700;letter-spacing:-.5px">Iron <span style="color:#ff3d6b">40</span></div>
  <h1 style="font-size:24px;line-height:1.25;margin:28px 0 12px">${esc(head)}</h1>
  <p style="font-size:16px;line-height:1.55;color:#cfc8dc;margin:0 0 24px">${esc(body)}</p>
  <p style="margin:0 0 12px">${btn(buy, c.cta, true)}</p>
  <p style="margin:0 0 24px">${btn(app, c.open, false)}</p>
  <p style="font-size:14px;line-height:1.5;color:#8f879f;margin:0 0 32px">${esc(c.how)}</p>
  <p style="font-size:12px;color:#5d566c;margin:0">${esc(c.foot)} <a href="${unsubUrl}" style="color:#8f879f">${esc(c.unsub)}</a></p>
</div></body></html>`;
  const text = `${head}\n\n${body}\n\n${c.cta}: ${buy}\n${c.open}: ${app}\n\n${c.how}\n\n${c.foot}\n${c.unsub}: ${unsubUrl}\n`;
  return { subject, html, text, unsubUrl };
}

async function run(env, { dry = false } = {}) {
  const now = Date.now();
  const send = env.SEND_ENABLED === 'true' && !dry;
  const soon = await env.DB.prepare(
    'SELECT * FROM trials WHERE unsubscribed = 0 AND reminded_soon = 0 AND expires_at > ? AND expires_at <= ?'
  ).bind(now, now + 2.5 * DAY).all();
  const ended = await env.DB.prepare(
    'SELECT * FROM trials WHERE unsubscribed = 0 AND reminded_end = 0 AND expires_at <= ? AND expires_at > ?'
  ).bind(now, now - 7 * DAY).all();

  const report = { sending: send, soon: [], ended: [], errors: [] };
  for (const [kind, rows, flag] of [['soon', soon.results, 'reminded_soon'], ['ended', ended.results, 'reminded_end']]) {
    for (const row of rows) {
      report[kind].push(row.email);
      if (!send) continue;
      const m = build(kind === 'soon' ? 'soon' : 'end', row, env);
      try {
        await env.EMAIL.send({
          to: row.email,
          from: { email: env.FROM_EMAIL, name: env.FROM_NAME },
          subject: m.subject, html: m.html, text: m.text,
          headers: { 'List-Unsubscribe': `<${m.unsubUrl}>` },
        });
        // An ended email also covers the "soon" one if the cron skipped a day
        await env.DB.prepare(`UPDATE trials SET ${flag} = 1${flag === 'reminded_end' ? ', reminded_soon = 1' : ''} WHERE email = ?`).bind(row.email).run();
      } catch (e) {
        report.errors.push({ email: row.email, code: e.code, message: e.message });
      }
    }
  }
  console.log(JSON.stringify(report));
  return report;
}

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(run(env)); },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.ADMIN_KEY || url.searchParams.get('key') !== env.ADMIN_KEY) return new Response('Not found', { status: 404 });
    // Preview an email in the browser: ?key=…&preview=soon|end&lang=es
    const pv = url.searchParams.get('preview');
    if (pv) {
      const m = build(pv === 'soon' ? 'soon' : 'end', { lang: url.searchParams.get('lang') || 'en', name: 'Alex', token: '00000000-0000-0000-0000-000000000000' }, env);
      return new Response(m.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    const report = await run(env, { dry: url.searchParams.get('dry') !== '0' });
    return Response.json(report);
  },
};
