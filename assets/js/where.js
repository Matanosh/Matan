/* MS Group Global — interactive "where we work" globe (d3-geo on canvas) */
(() => {
  const canvas = document.querySelector('[data-where-globe]');
  if (!canvas || !window.d3 || !window.topojson || !window.WORLD_LAND) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ctx = canvas.getContext('2d');
  const land = topojson.feature(WORLD_LAND, WORLD_LAND.objects.land);
  const graticule = d3.geoGraticule10();
  const LANG = (document.documentElement.lang || 'he').slice(0, 2);
  const I = {
    he: { home: 'תל אביב', uae: ['האמירויות', 'לפרויקטים באמירויות'], georgia: ['גאורגיה', 'לפרויקטים בגאורגיה'], cyprus: ['קפריסין', 'לפרויקט בקפריסין'], portugal: ['פורטוגל', 'לפרויקט בפורטוגל'], romania: ['רומניה', 'לפרויקט ברומניה'], ukraine: ['אוקראינה', 'לפרויקט באוקראינה'], usa: ['ארה״ב', 'לפרויקטים במיאמי'] },
    en: { home: 'Tel Aviv', uae: ['UAE', 'See the UAE projects'], georgia: ['Georgia', 'See the Georgia projects'], cyprus: ['Cyprus', 'See the Cyprus project'], portugal: ['Portugal', 'See the Portugal project'], romania: ['Romania', 'See the Romania project'], ukraine: ['Ukraine', 'See the Ukraine project'], usa: ['USA', 'See the Miami projects'] },
    fr: { home: 'Tel-Aviv', uae: ['Émirats', 'Voir les projets aux Émirats'], georgia: ['Géorgie', 'Voir les projets en Géorgie'], cyprus: ['Chypre', 'Voir le projet à Chypre'], portugal: ['Portugal', 'Voir le projet au Portugal'], romania: ['Roumanie', 'Voir le projet en Roumanie'], ukraine: ['Ukraine', 'Voir le projet en Ukraine'], usa: ['États-Unis', 'Voir les projets à Miami'] },
  }[LANG] || null;
  const HOME = { name: I.home, at: [34.78, 32.08] };
  const P = (k, at, href) => ({ name: I[k][0], cta: I[k][1], at, href });
  const PLACES = {
    uae: P('uae', [55.6, 25.5], '#project'),
    georgia: P('georgia', [41.64, 41.64], '#project'),
    cyprus: P('cyprus', [33.04, 34.68], '#project'),
    portugal: P('portugal', [-9.14, 38.72], '#project'),
    romania: P('romania', [26.1, 44.43], '#project'),
    ukraine: P('ukraine', [30.72, 46.48], '#project'),
    usa: P('usa', [-80.19, 25.76], '#project'),
  };
  const order = Object.keys(PLACES);
  let selected = 'uae';

  const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  const path = d3.geoPath(projection, ctx);
  let W = 0, dpr = 1;
  const size = () => {
    const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = canvas.height = Math.round(r.width * dpr);
    projection.translate([W / 2, W / 2]).scale(W * 0.46);
    draw();
  };

  // rotation state: [lambda, phi]; start centred between Israel and the destinations
  let rot = [-30, -35], target = null, anim = 0;
  const centreOn = (lonlat) => [-lonlat[0], -Math.max(-60, Math.min(60, lonlat[1])) + 5];

  let t0 = performance.now();
  function draw(now = performance.now()) {
    projection.rotate(rot);
    ctx.clearRect(0, 0, W, W);
    // sphere
    const g = ctx.createRadialGradient(W * 0.38, W * 0.34, W * 0.05, W / 2, W / 2, W * 0.48);
    g.addColorStop(0, '#1d3566'); g.addColorStop(1, '#0a1836');
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); path(graticule); ctx.strokeStyle = 'rgba(251,248,241,0.06)'; ctx.lineWidth = 1 * dpr; ctx.stroke();
    ctx.beginPath(); path(land); ctx.fillStyle = 'rgba(210,162,73,0.16)'; ctx.fill(); ctx.strokeStyle = 'rgba(233,203,140,0.55)'; ctx.lineWidth = 0.8 * dpr; ctx.stroke();
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.strokeStyle = 'rgba(210,162,73,0.55)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();

    // flight arcs from Tel Aviv (great circles, clipped to the visible side)
    const prog = reduced.matches ? 1 : Math.min(1, (now - t0) / 1200);
    for (const k of order) {
      const p = PLACES[k]; const interp = d3.geoInterpolate(HOME.at, p.at);
      const pts = d3.range(0, prog + 1e-9, 0.02).map(interp);
      ctx.beginPath(); path({ type: 'LineString', coordinates: pts });
      ctx.strokeStyle = k === selected ? 'rgba(233,203,140,0.95)' : 'rgba(210,162,73,0.45)';
      ctx.lineWidth = (k === selected ? 2 : 1.2) * dpr; ctx.stroke();
    }
    // pins
    const visible = (ll) => d3.geoDistance(ll, [-rot[0], -rot[1]]) < Math.PI / 2 - 0.05;
    const pulse = reduced.matches ? 0 : (Math.sin(now / 500) + 1) / 2;
    const pin = (ll, label, on, home) => {
      if (!visible(ll)) return; const [x, y] = projection(ll);
      if (on) { ctx.beginPath(); ctx.arc(x, y, (9 + pulse * 9) * dpr, 0, Math.PI * 2); ctx.strokeStyle = `rgba(233,203,140,${0.6 - pulse * 0.5})`; ctx.lineWidth = 1.2 * dpr; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, (on ? 6 : home ? 4.5 : 4) * dpr, 0, Math.PI * 2);
      ctx.fillStyle = home ? '#fbf8f1' : on ? '#e9cb8c' : '#d2a249'; ctx.fill();
      if (!on && !home) return; // only the selected country and Tel Aviv carry a label; the list names the rest
      ctx.font = `${on ? 600 : 500} ${(on ? 15 : 12.5) * dpr}px Heebo, sans-serif`; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(10,24,54,0.75)'; const tw = ctx.measureText(label).width;
      const ly = home ? y + 22 * dpr : y - 16 * dpr;
      ctx.fillRect(x - tw / 2 - 5 * dpr, ly - 13 * dpr * (on ? 1.15 : 1), tw + 10 * dpr, 17 * dpr * (on ? 1.15 : 1));
      ctx.fillStyle = home ? '#fbf8f1' : on ? '#e9cb8c' : 'rgba(233,203,140,0.9)'; ctx.fillText(label, x, ly);
    };
    pin(HOME.at, HOME.name, false, true);
    for (const k of order) if (k !== selected) pin(PLACES[k].at, PLACES[k].name, false);
    pin(PLACES[selected].at, PLACES[selected].name, true);
  }

  // animation loop: tween to target, gentle idle drift, pulse
  let running = false, idle = true, lastUser = 0;
  const loop = (now) => {
    if (target) {
      const k = 0.08; rot = [rot[0] + (target[0] - rot[0]) * k, rot[1] + (target[1] - rot[1]) * k];
      if (Math.abs(target[0] - rot[0]) < 0.05 && Math.abs(target[1] - rot[1]) < 0.05) target = null;
    } else if (idle && !reduced.matches && !document.documentElement.classList.contains('paused')) {
      rot = [rot[0] + 0.03, rot[1]];
    }
    draw(now);
    anim = running ? requestAnimationFrame(loop) : 0;
  };
  const start = () => { if (!running) { running = true; anim = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(anim); };

  const select = (k, fromUser) => {
    selected = k;
    document.querySelectorAll('[data-where]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.where === k)));
    const cta = document.querySelector('[data-where-cta]');
    if (cta) { cta.textContent = PLACES[k].cta; cta.setAttribute('href', PLACES[k].href); cta.dataset.country = k; }
    const t = centreOn(PLACES[k].at);
    // shortest way round
    while (t[0] - rot[0] > 180) t[0] -= 360; while (t[0] - rot[0] < -180) t[0] += 360;
    if (reduced.matches) { rot = t; target = null; draw(); } else target = t;
    if (fromUser) { idle = false; lastUser = performance.now(); }
  };
  document.querySelectorAll('[data-where]').forEach((b) => b.addEventListener('click', () => select(b.dataset.where, true)));

  // CTA: open that country in the projects section
  document.querySelector('[data-where-cta]')?.addEventListener('click', () => {
    const c = document.querySelector(`.project__country[data-country="${selected}"]`);
    if (c) c.click();
    if (PLACES[selected].href === '#contact') { const box = document.querySelector(`input[name="country"][value="${PLACES[selected].name}"]`); if (box) box.checked = true; }
  });

  // drag to rotate
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, r: rot.slice() }; target = null; idle = false; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return; const k = 160 / canvas.getBoundingClientRect().width;
    rot = [drag.r[0] + (e.clientX - drag.x) * k, Math.max(-80, Math.min(80, drag.r[1] - (e.clientY - drag.y) * k))];
    if (!running) draw();
  });
  const end = () => { drag = null; lastUser = performance.now(); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

  // tap a pin on the globe to select its country
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
    let best = null, bd = 24 * dpr;
    for (const k of order) { const ll = PLACES[k].at; if (d3.geoDistance(ll, [-rot[0], -rot[1]]) > Math.PI / 2) continue; const [px, py] = projection(ll); const d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = k; } }
    if (best) select(best, true);
  });

  // auto-tour through the countries until the visitor takes over
  setInterval(() => {
    if (!running || reduced.matches || document.documentElement.classList.contains('paused')) return;
    if (performance.now() - lastUser < 12000 || drag) return;
    idle = true; select(order[(order.indexOf(selected) + 1) % order.length], false);
  }, 4500);

  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { t0 = performance.now(); start(); } else stop(); }).observe(canvas);
  size(); select('uae', false); if (reduced.matches) draw();
})();
