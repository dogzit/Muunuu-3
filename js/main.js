// The whole site: view switching, heart bursts, the photo lightbox, each view's little toys,
// and the shared data (hearts, our start date, the note wall) kept in Neon behind /api.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d = '') { try { return localStorage.getItem(k) ?? d } catch (e) { return d } },
  set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
};
const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] };
const isStudio = () => document.body.classList.contains('studio');

/* Shared data. On Vercel the /api routes answer; opened as plain files (or before a database is
   connected) they fail, and every feature falls back to this browser's own storage. */
let token = store.get('noteToken');
if (!token) {
  token = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, '')
    + Math.random().toString(36).slice(2);
  store.set('noteToken', token);
}
async function api(path, { method = 'GET', data } = {}) {
  const res = await fetch('/api/' + path, {
    method, cache: 'no-store',
    headers: { 'content-type': 'application/json', 'x-note-token': token },
    body: data === undefined ? undefined : JSON.stringify(data)
  });
  const out = await res.json().catch(() => null);
  if (!res.ok || !out) throw Object.assign(new Error(out?.error || 'Request failed'), { status: res.status });
  return out;
}
// refresh shared bits every 20 s while the page is visible
const refreshers = [];
setInterval(() => { if (!document.hidden) refreshers.forEach(f => f()) }, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshers.forEach(f => f()) });

/* Views: #home, #scrapbook, #photoshoot, #notes */
const views = $$('[data-view]');
function route() {
  const name = location.hash.slice(1);
  const view = views.find(v => v.dataset.view === name) || views[0];
  views.forEach(v => { v.hidden = v !== view });
  document.body.classList.toggle('studio', view.dataset.view === 'photoshoot');
  $$('[data-nav]').forEach(a => {
    if (a.dataset.nav === view.dataset.view) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
addEventListener('hashchange', route);
route();

/* Hearts */
const heart = c => `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path fill="${c}" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.4 2.5.8-1.3 2.3-2.5 4.4-2.5 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>`;
function burst(x, y, n = 8) {
  if (reduce) return;
  const colors = isStudio() ? ['#ff4d6d', '#ece4dc', '#e7893a', '#ff8fa3'] : ['#f497b6', '#9fd7ee', '#f7b5c9', '#7cc6e6'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    h.className = 'float';
    h.innerHTML = heart(colors[i % colors.length]);
    h.style.left = (x - 13) + 'px'; h.style.top = (y - 13) + 'px';
    h.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    h.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
    h.style.animationDelay = (i * 40) + 'ms';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1700);
  }
}
$$('.amp').forEach(a => a.addEventListener('click', e => burst(e.clientX, e.clientY, 10)));

/* Camera flash (photoshoot view) */
const flash = $('#flash');
function pop() { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go') }

/* Lightbox: anything with data-zoom opens its <img> big */
const lb = $('#lb'), lbimg = $('#lbimg'), lbcap = $('#lbcap'), lbno = $('#lbno');
let opener = null;
function view(el, e) {
  const img = el.querySelector('img'), studio = isStudio();
  opener = el;
  if (studio) pop();
  else burst(...(e && e.clientX ? [e.clientX, e.clientY] : centerOf(el)), 6);
  setTimeout(() => {
    lbimg.src = img.src; lbimg.alt = img.alt;
    lbcap.textContent = el.dataset.cap || '';
    lbno.textContent = el.dataset.no || '';
    lb.hidden = false;
  }, studio ? 120 : 250);
}
function closeLb() { if (lb.hidden) return; lb.hidden = true; opener?.focus({ preventScroll: true }) }
document.addEventListener('click', e => { const el = e.target.closest('[data-zoom]'); if (el) view(el, e) });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return closeLb();
  const el = e.target.closest?.('[data-zoom]');
  if (el && el.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); view(el) }
});
lb.addEventListener('click', closeLb);

/* Home: shuffle the polaroid stack */
const stack = $('.stack');
let shuffling = false;
stack.addEventListener('click', e => {
  if (shuffling) return;
  shuffling = true;
  const top = stack.lastElementChild;
  top.classList.add('fly');
  burst(...(e.clientX ? [e.clientX, e.clientY] : centerOf(stack)), 5);
  setTimeout(() => { top.classList.remove('fly'); stack.prepend(top); shuffling = false }, reduce ? 0 : 380);
});

/* Scrapbook: send a heart. Shared: one total in Neon; taps are batched and added atomically.
   `mine` counts the hearts sent from this browser. */
{
  const love = $('#love'), out = $('#count'), note = $('#tallyNote');
  let mine = parseInt(store.get('hearts', '0'), 10) || 0;
  let total = null, pending = 0, sending = false, timer = 0;
  const paint = () => {
    out.textContent = (total ?? mine).toLocaleString();
    note.textContent = total !== null && mine && total > mine ? `(${mine.toLocaleString()} from you)` : '';
  };
  const flush = async () => {
    if (sending || !pending) return;
    sending = true;
    const add = Math.min(pending, 50);
    pending -= add;
    try { total = (await api('hearts', { method: 'POST', data: { add } })).total + pending; paint() }
    catch (err) {}
    sending = false;
    if (pending) flush();
  };
  const sync = async () => {
    if (sending || pending) return;
    try { total = (await api('hearts')).total; paint() } catch (err) {}
  };
  paint();
  love.addEventListener('click', e => {
    mine++; store.set('hearts', mine);
    if (total !== null) { total++; pending++; clearTimeout(timer); timer = setTimeout(flush, 400) }
    paint();
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 10);
  });
  sync();
  refreshers.push(sync);
}

/* Photoshoot: take another round in the booth */
{
  let shots = parseInt(store.get('shots', '0'), 10) || 0;
  const out = $('#shots'); out.textContent = '· ' + shots;
  const strip = $$('.booth-strip img');
  $('#shutter').addEventListener('click', () => {
    shots++; out.textContent = '· ' + shots;
    store.set('shots', shots);
    // four quick flashes, shuffling the strip like a fresh round
    const data = strip.map(i => ({ src: i.src, alt: i.alt, cap: i.parentElement.dataset.cap }));
    for (let k = 0; k < 4; k++) setTimeout(() => {
      pop();
      const d = data[(k + 1) % data.length];
      strip[k].src = d.src; strip[k].alt = d.alt; strip[k].parentElement.dataset.cap = d.cap;
    }, k * 420);
  });
}

/* Notes: days-together counter. Shared: settings 'since' in Neon; data-since is the fallback. */
{
  const counter = $('.counter'), input = $('#since'), days = $('#days');
  const isDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  let since = store.get('since') || counter.dataset.since, shared = false;
  const render = () => {
    counter.classList.toggle('unset', !isDate(since));
    if (!isDate(since)) { days.textContent = '?'; return }
    input.value = since;
    const n = Math.floor((Date.now() - new Date(since + 'T00:00').getTime()) / 864e5);
    days.textContent = Math.max(0, n).toLocaleString();
  };
  const sync = async () => {
    try {
      const r = await api('since');
      shared = true;
      if (isDate(r.since) && r.since !== since) { since = r.since; render() }
    } catch (err) {}
  };
  input.max = new Date().toISOString().slice(0, 10);
  input.addEventListener('change', async () => {
    if (!isDate(input.value)) return;
    since = input.value; render(); burst(...centerOf(days), 12);
    store.set('since', since);
    if (shared) api('since', { method: 'PUT', data: { since } }).catch(() => {});
  });
  render();
  sync();
  refreshers.push(sync);
}

/* Notes: flip the reason cards */
$$('.flip').forEach(b => b.addEventListener('click', () => {
  b.setAttribute('aria-pressed', b.classList.toggle('on'));
}));

/* Notes: open-when envelopes */
{
  const letter = $('#letter'), body = $('#letterBody');
  $$('.env').forEach(b => b.addEventListener('click', () => {
    b.classList.add('open');
    setTimeout(() => {
      body.replaceChildren(b.nextElementSibling.content.cloneNode(true));
      letter.showModal();
      burst(...centerOf(b), 8);
    }, reduce ? 0 : 420);
  }));
  $('#letterClose').addEventListener('click', () => letter.close());
  letter.addEventListener('click', e => { if (e.target === letter) letter.close() });
  letter.addEventListener('close', () => $$('.env.open').forEach(b => b.classList.remove('open')));
}

/* Notes: the note wall, kept in Neon's notes table */
{
  const wall = $('#wall'), form = $('#wallForm'), text = $('#wallText'), chars = $('#wallChars');
  const who = $('#wallName'), post = $('#wallPost'), status = $('#wallStatus');
  const say = msg => { status.textContent = msg; status.hidden = !msg };
  const tint = n => [...String(n)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  let live = false;

  function sticky(n) {
    const li = document.createElement('li'), h = tint(n.id);
    li.className = 'sticky t' + (h % 4);
    li.style.setProperty('--r', ((h % 7) - 3) + 'deg');
    const p = document.createElement('p');
    p.className = 'sticky-text'; p.textContent = n.text;
    const meta = document.createElement('p');
    meta.className = 'sticky-meta';
    const when = n.at ? new Date(n.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    meta.textContent = '— ' + (n.author || 'someone') + (n.mine ? ' (you)' : '') + (when ? ' · ' + when : '');
    li.append(p, meta);
    if (n.mine) {
      const del = document.createElement('button');
      del.type = 'button'; del.className = 'sticky-del'; del.dataset.id = n.id;
      del.setAttribute('aria-label', 'Remove this note'); del.textContent = '×';
      li.append(del);
    }
    return li;
  }

  const load = async () => {
    try {
      const { notes } = await api('notes');
      live = true; form.hidden = false;
      wall.replaceChildren(...notes.map(sticky));
      say(notes.length ? '' : 'no notes yet. be the first ♡');
    } catch (err) {
      if (!live) say(err.status === 503
        ? 'the note wall is waiting for its database. connect Neon in Vercel and it wakes up.'
        : 'the note wall works once the site is online with its database.');
    }
  };

  who.value = store.get('noteName');
  who.addEventListener('change', () => store.set('noteName', who.value.trim()));
  text.addEventListener('input', () => { chars.textContent = text.value.length });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const t = text.value.trim();
    if (!t) return;
    post.disabled = true;
    try {
      await api('notes', { method: 'POST', data: { text: t, author: who.value.trim() } });
      text.value = ''; chars.textContent = '0';
      burst(...centerOf(post), 10);
      await load();
    } catch (err) {
      say(err.status === 400 ? err.message : "that note didn't stick. try again in a moment.");
    }
    post.disabled = false;
  });

  // removing your own note takes two taps: × then "remove?"
  wall.addEventListener('click', async e => {
    const del = e.target.closest('.sticky-del');
    if (!del) return;
    if (!del.classList.contains('sure')) {
      del.classList.add('sure'); del.textContent = 'remove?';
      setTimeout(() => { del.classList.remove('sure'); del.textContent = '×' }, 3000);
      return;
    }
    del.disabled = true;
    try { await api('notes', { method: 'DELETE', data: { id: Number(del.dataset.id) } }); await load() }
    catch (err) { del.disabled = false }
  });

  load();
  refreshers.push(load);
}
