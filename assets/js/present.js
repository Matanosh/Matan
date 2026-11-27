/* MS Group Global — project presentation app (present/<project>/).
   One screen per section. Works for a presenter (keyboard, remote, full screen) and for a client alone (scroll, swipe, menu).
   Never hijacks scrolling: screens change only on keys, the arrows and the menu. */
(() => {
  const root = document.documentElement;
  const slides = [...document.querySelectorAll('.pslide')];
  if (!slides.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const RTL = getComputedStyle(root).direction === 'rtl';
  const n = slides.length;
  const links = [...document.querySelectorAll('.pnav__item, .psheet .pnav__item')];
  const count = document.querySelector('[data-pcount]');
  const progs = [...document.querySelectorAll('.pprog')];
  const bar = document.querySelector('.pbar');
  const prev = bar?.querySelector('.pbar__arrow--prev'), next = bar?.querySelector('.pbar__arrow--next');
  const cur = bar?.querySelector('.pbar__current');
  const sheet = document.querySelector('.psheet');
  let index = 0;

  const pad = (i) => String(i + 1).padStart(2, '0');
  // The phone bar names a screen exactly as the menu does
  const label = (i) => links.find((a) => a.hash === `#${slides[i].id}`)?.querySelector('span:not(.pnav__num):not(.pnav__soon)')?.textContent.trim() || '';

  const setCurrent = (i) => {
    if (i === index && root.dataset.pready) return;
    index = i; root.dataset.pready = '1';
    links.forEach((a) => { if (a.hash === `#${slides[i].id}`) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
    progs.forEach((p) => p.style.setProperty('--p', ((i + 1) / n).toFixed(3)));
    if (count) count.textContent = count.dataset.pcount.replace('{i}', i + 1).replace('{n}', n);
    if (cur) { cur.querySelector('.pnav__num').textContent = pad(i); cur.querySelector('[data-plabel]').textContent = label(i); }
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === n - 1;
    // A film never keeps playing on a screen nobody is looking at
    slides.forEach((s, k) => { if (k !== i) s.querySelectorAll('video').forEach((v) => { if (!v.paused) v.pause(); }); });
  };

  // The current screen is the one crossing the middle of the window
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setCurrent(slides.indexOf(e.target)); });
  }, { rootMargin: '-50% 0px -50% 0px' });
  slides.forEach((s) => { s.tabIndex = -1; io.observe(s); });
  setCurrent(0);

  const go = (i) => {
    i = Math.max(0, Math.min(n - 1, i));
    slides[i].scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    slides[i].focus({ preventScroll: true });
    history.replaceState(null, '', `#${slides[i].id}`);
  };

  // In-app links (rail, sheet, "next", "start") move to their screen
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const i = slides.findIndex((s) => `#${s.id}` === a.hash);
    if (i < 0) return;
    e.preventDefault();
    if (sheet && !sheet.hidden) closeSheet(false);
    go(i);
  });
  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));

  // Keyboard and presentation remotes (they send PageUp/PageDown or arrows). Never while typing or using a control.
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest('input, select, textarea, video, [contenteditable], dialog[open]')) return;
    if (sheet && !sheet.hidden) return;
    const fwd = RTL ? 'ArrowLeft' : 'ArrowRight', back = RTL ? 'ArrowRight' : 'ArrowLeft';
    const map = { PageDown: 1, ArrowDown: 1, [fwd]: 1, PageUp: -1, ArrowUp: -1, [back]: -1, Home: -n, End: n };
    if (!(e.key in map)) return;
    // Up/Down still scroll normally inside a screen that is taller than the window
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && slides[index].scrollHeight > innerHeight + 4) {
      const r = slides[index].getBoundingClientRect();
      if ((e.key === 'ArrowDown' && r.bottom > innerHeight + 4) || (e.key === 'ArrowUp' && r.top < -4)) return;
    }
    e.preventDefault();
    go(e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : index + map[e.key]);
  });

  // Phone: the section sheet
  const openSheet = () => {
    sheet.hidden = false; cur.setAttribute('aria-expanded', 'true'); root.style.overflow = 'hidden';
    (sheet.querySelector('[aria-current="step"]') || sheet.querySelector('.pnav__item'))?.focus();
  };
  function closeSheet(restore = true) {
    sheet.hidden = true; cur.setAttribute('aria-expanded', 'false'); root.style.overflow = '';
    if (restore) cur.focus();
  }
  cur?.addEventListener('click', openSheet);
  sheet?.querySelector('.psheet__close')?.addEventListener('click', () => closeSheet());
  sheet?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (e.key !== 'Tab') return; // keep focus inside the open sheet
    const f = [...sheet.querySelectorAll('a, button')]; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Presentation mode: full screen. The label never swaps (no layout shift); aria-pressed carries the state.
  const pres = document.querySelector('[data-present]');
  if (pres && root.requestFullscreen) {
    const sync = () => pres.setAttribute('aria-pressed', String(!!document.fullscreenElement));
    pres.addEventListener('click', (e) => { e.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen().catch(() => {}); });
    document.addEventListener('fullscreenchange', sync); sync();
  } else if (pres) pres.hidden = true;

  // "Send me …" links on screens whose details are still on the way: the request travels with the lead
  const project = document.querySelector('form [name="project"]');
  const base = project?.value;
  document.querySelectorAll('[data-request]').forEach((a) => a.addEventListener('click', () => {
    if (project) project.value = `${base} · ${a.dataset.request}`;
  }));

  // Arriving on a deep link (#s5) lands on that screen
  const start = slides.findIndex((s) => `#${s.id}` === location.hash);
  if (start > 0) requestAnimationFrame(() => go(start));
})();
