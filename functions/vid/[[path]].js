// GET /vid/<id>.mp4 — serves demo clips with byte-range support.
// Pages static assets ignore Range headers, and iPhone Safari won't play video
// from a server that can't answer them, so this slices the file and returns 206.

const headersFor = (res, extra = {}) => {
  const h = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
    ...extra,
  });
  const etag = res.headers.get('ETag');
  if (etag) h.set('ETag', etag);
  return h;
};

async function serve(request, env, head) {
  const url = new URL(request.url);
  const res = await env.ASSETS.fetch(new Request(url.toString(), { method: 'GET' }));
  // unknown paths come back as the app's index page; a missing clip should be a plain 404
  if (!res.ok || !(res.headers.get('Content-Type') || '').startsWith('video/')) return new Response('Not found', { status: 404 });
  const body = await res.arrayBuffer();
  const size = body.byteLength;
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');
  if (!range) return new Response(head ? null : body, { status: 200, headers: headersFor(res, { 'Content-Length': String(size) }) });

  let start = range[1] === '' ? size - Number(range[2]) : Number(range[1]);
  let end = range[1] !== '' && range[2] !== '' ? Number(range[2]) : size - 1;
  start = Math.max(0, start); end = Math.min(end, size - 1);
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: headersFor(res, { 'Content-Range': `bytes */${size}` }) });
  }
  return new Response(head ? null : body.slice(start, end + 1), {
    status: 206,
    headers: headersFor(res, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) }),
  });
}

export const onRequestGet = ({ request, env }) => serve(request, env, false);
export const onRequestHead = ({ request, env }) => serve(request, env, true);
