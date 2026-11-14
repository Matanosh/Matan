/* MS Group Global — interactions */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) root.classList.add('reduced');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* Entrance, once on load */
  document.querySelectorAll('.hero__copy [data-enter]').forEach((el, i) => el.style.setProperty('--d', `${280 + i * 110}ms`));
  const ready = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(ready);
  setTimeout(ready, 1200);

  /* Year */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* Navigation */
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); toggle.focus(); } });

  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  /* Statement: words light up with the scroll */
  const statement = document.querySelector('[data-words]');
  let words = [];
  if (statement) {
    const emph = new Set(['בית:', 'אחד,', 'אחת', 'אחת,', 'המפתח']);
    const parts = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    parts.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = emph.has(w) ? 'w em' : 'w';
      s.textContent = w;
      statement.append(s, i < parts.length - 1 ? ' ' : '');
      words.push(s);
    });
  }

  /* Journey */
  const journey = document.querySelector('[data-journey]');
  const jDraw = document.querySelector('[data-journey-draw]');
  const jSteps = [...document.querySelectorAll('[data-journey-steps] li')];
  const jNodes = [...document.querySelectorAll('[data-journey-nodes] circle')];
  const jKey = document.querySelector('[data-journey-key]');
  let nodeAt = [0, 0.2, 0.4, 0.6, 0.8];
  if (jDraw && jDraw.getTotalLength) {
    const L = jDraw.getTotalLength();
    nodeAt = jNodes.map((c) => {
      const cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy');
      let best = 0, bestD = Infinity;
      for (let s = 0; s <= 400; s++) {
        const p = jDraw.getPointAtLength((s / 400) * L);
        const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
        if (d < bestD) { bestD = d; best = s / 400; }
      }
      return best;
    });
  }

  const reveal = document.querySelector('[data-reveal]');

  /* Destinations */
  const dest = document.querySelector('[data-dest]');
  const track = document.querySelector('[data-dest-track]');
  const bar = document.querySelector('[data-dest-bar]');
  const pinned = () => window.matchMedia('(min-width: 901px) and (min-height: 561px)').matches;

  const progressOf = (el) => {
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  };

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    nav?.classList.toggle('is-solid', y > 24);

    let current = null;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = i; });
    navLinks.forEach((a, i) => { if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });

    if (words.length && !root.classList.contains('reduced')) {
      const r = statement.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }

    if (journey && pinned()) {
      const p = progressOf(journey);
      // the path reaches the key exactly as step 6 begins; the rest of the scroll holds the arrival
      const drawP = clamp(p / 0.75);
      jDraw.style.setProperty('--p', drawP.toFixed(4));
      jNodes.forEach((c, i) => c.classList.toggle('on', drawP >= nodeAt[i] - 0.005));
      const idx = Math.min(jSteps.length - 1, Math.floor(clamp(p / 0.9) * jSteps.length * 0.999));
      jSteps.forEach((li, i) => {
        li.classList.toggle('is-active', i === idx);
        li.setAttribute('aria-hidden', String(i !== idx));
      });
      jKey?.classList.toggle('on', idx === jSteps.length - 1);
    } else if (journey) {
      jSteps.forEach((li) => li.removeAttribute('aria-hidden'));
    }

    if (reveal) {
      if (pinned() && !root.classList.contains('reduced')) {
        const rp = progressOf(reveal);
        const e = 1 - Math.pow(1 - clamp(rp / 0.7), 3); // ease-out over the first 70% of the scroll
        reveal.style.setProperty('--rp', rp.toFixed(4));
        reveal.style.setProperty('--r-y', (22 * (1 - e)).toFixed(2));
        reveal.style.setProperty('--r-x', (30 * (1 - e)).toFixed(2));
        reveal.style.setProperty('--r-rad', (4 * (1 - e)).toFixed(2));
      } else {
        ['--rp', '--r-y', '--r-x', '--r-rad'].forEach((v) => reveal.style.removeProperty(v));
      }
    }

    if (dest && track) {
      if (pinned()) {
        const p = progressOf(dest);
        const items = track.children;
        const a = items[0].getBoundingClientRect(), z = items[items.length - 1].getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
        const max = Math.max(0, (a.right - z.left) - (track.parentElement.clientWidth - 2 * pad));
        track.style.transform = `translate3d(${(p * max).toFixed(1)}px,0,0)`;
        bar?.parentElement.style.setProperty('--p', p.toFixed(4));
        bar && (bar.style.transform = `scaleX(${p})`);
      } else {
        track.style.transform = '';
      }
    }
  };
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* Reveal-once observers (drawings only; content is never hidden) */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  document.querySelectorAll('.country').forEach((el) => io.observe(el));
  const endKey = document.querySelector('[data-endkey]');
  if (endKey) new IntersectionObserver(([e]) => { if (e.isIntersecting) endKey.classList.add('on'); }, { threshold: 0.9 }).observe(endKey);
  const checks = document.querySelector('[data-checks]');
  if (checks) {
    checks.querySelectorAll('.checks__list li').forEach((li, i) => li.style.setProperty('--i', i));
    io.observe(checks);
  }

  /* Selected projects: country filter + accessible tabs */
  const tabs = [...document.querySelectorAll('.project__tabs [role="tab"]')];
  const chips = [...document.querySelectorAll('.project__country')];
  const visibleTabs = () => tabs.filter((t) => !t.hidden);
  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
      }
    });
    if (focus) t.focus();
  };
  const showCountry = (c) => {
    chips.forEach((ch) => ch.setAttribute('aria-pressed', String(ch.dataset.country === c)));
    tabs.forEach((t) => { t.hidden = t.dataset.country !== c; });
    const first = visibleTabs()[0];
    if (first) select(first);
  };
  chips.forEach((ch) => ch.addEventListener('click', () => showCountry(ch.dataset.country)));
  tabs.forEach((t) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const vis = visibleTabs(); const i = vis.indexOf(t);
      // RTL: ArrowLeft moves forward
      const step = { ArrowLeft: 1, ArrowRight: -1 }[e.key];
      if (step) { e.preventDefault(); select(vis[(i + step + vis.length) % vis.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(vis[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(vis[vis.length - 1], true); }
    });
  });

  /* Form */
  const form = document.querySelector('[data-form]');
  const status = document.querySelector('[data-form-status]');
  document.querySelectorAll('[data-pick]').forEach((a) => a.addEventListener('click', () => {
    const v = a.getAttribute('data-pick');
    const box = form?.querySelector(`input[name="country"][value="${v}"]`);
    if (box) box.checked = true;
  }));
  // Where the form sends is not decided yet. Set this to a real endpoint (form service or CRM) to go live.
  const FORM_ENDPOINT = '';
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [
      { el: form.querySelector('#f-name'), err: form.querySelector('#e-name'), ok: (v) => v.trim().length > 1 },
      { el: form.querySelector('#f-phone'), err: form.querySelector('#e-phone'), ok: (v) => v.replace(/[^\d]/g, '').length >= 9 },
    ];
    let first = null;
    fields.forEach(({ el, err, ok }) => {
      const good = ok(el.value);
      el.setAttribute('aria-invalid', String(!good));
      err.hidden = good;
      if (good) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', err.id);
      if (!good && !first) first = el;
    });
    const privacy = form.querySelector('#f-privacy'), pErr = form.querySelector('#e-privacy');
    if (privacy) { pErr.hidden = privacy.checked; privacy.setAttribute('aria-invalid', String(!privacy.checked)); if (!privacy.checked && !first) first = privacy; }
    if (first) { first.focus(); return; }
    if (!FORM_ENDPOINT) {
      // No form backend yet: hand the details to the visitor's email app, addressed to the office.
      const d = new FormData(form);
      const body = [`שם: ${d.get('name')}`, `טלפון: ${d.get('phone')}`, `תקציב: ${d.get('budget') || 'לא צוין'}`,
        `מדינות: ${d.getAll('country').join(', ') || 'לא צוין'}`,
        `אישור מדיניות פרטיות: כן`, `הסכמה לדיוור שיווקי: ${d.get('marketing') ? 'כן' : 'לא'}`].join('\n');
      window.location.href = `mailto:office@msgp.co.il?subject=${encodeURIComponent('פנייה מאתר MS Group Global')}&body=${encodeURIComponent(body)}`;
      status.textContent = 'ניסינו לפתוח הודעת מייל מוכנה עם הפרטים. אם היא לא נפתחה, התקשרו 072-2133266 או כתבו ל־office@msgp.co.il.';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = 'שולחים...';
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.';
    } catch {
      status.textContent = 'השליחה לא הצליחה. נסו שוב בעוד רגע.';
    } finally {
      btn.disabled = false;
    }
  });

  /* Pause control for moving content (WCAG 2.2.2) */
  let userPaused = false;
  const mt = document.querySelector('[data-motion-toggle]');
  const mLabel = document.querySelector('[data-motion-label]');
  mt?.addEventListener('click', () => {
    userPaused = !userPaused;
    root.classList.toggle('paused', userPaused);
    mt.setAttribute('aria-pressed', String(userPaused));
    mLabel.textContent = userPaused ? 'הפעלת אנימציה' : 'עצירת אנימציה';
    window.dispatchEvent(new Event('motionchange'));
  });

  /* Globe */
  const canvas = document.querySelector('[data-globe]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const RAD = Math.PI / 180;
  const home = { name: 'תל אביב', lat: 32.08, lon: 34.78, dx: 0, dy: 26, align: 'center' };
  const places = [
    { name: 'קפריסין', lat: 34.68, lon: 33.04, dx: -12, dy: 18, align: 'right' },
    { name: 'פורטוגל', lat: 38.72, lon: -9.14 },
    { name: 'רומניה', lat: 44.43, lon: 26.1 },
    { name: 'גאורגיה', lat: 41.72, lon: 44.79 },
    { name: 'דובאי', lat: 25.2, lon: 55.27 },
  ];
  const N = 1700;
  const dots = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const lat = Math.asin(y) / RAD;
    const lon = ((i * 137.508) % 360) - 180;
    dots.push({ lat, lon });
  }
  const toVec = (lat, lon) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
  const toLL = ([x, y, z]) => [Math.asin(clamp(z, -1, 1)) / RAD, Math.atan2(y, x) / RAD];
  const slerp = (a, b, t) => {
    const d = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1);
    const w = Math.acos(d);
    if (w < 1e-6) return a;
    const s = Math.sin(w);
    const k1 = Math.sin((1 - t) * w) / s, k2 = Math.sin(t * w) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  };
  const arcs = places.map((p) => {
    const a = toVec(home.lat, home.lon), b = toVec(p.lat, p.lon);
    const ang = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const t = i / 64;
      const [lat, lon] = toLL(slerp(a, b, t));
      pts.push({ lat, lon, h: Math.sin(Math.PI * t) * (0.06 + ang * 0.28) });
    }
    return pts;
  });

  let W = 0, H = 0, dpr = 1, R = 0, cx = 0, cy = 0;
  const size = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.round(r.width * dpr);
    H = canvas.height = Math.round(r.height * dpr);
    R = Math.min(W, H) * 0.6; cx = W * 0.5; cy = H * 0.66;
  };
  size();
  new ResizeObserver(size).observe(canvas);

  let lat0 = 22, lon0 = 24, tiltX = 0, tiltY = 0, aimX = 0, aimY = 0;
  const project = (lat, lon, h = 0) => {
    const la = lat * RAD, dl = (lon - lon0 - tiltX) * RAD, l0 = (lat0 + tiltY) * RAD;
    const x = Math.cos(la) * Math.sin(dl);
    const y = Math.cos(l0) * Math.sin(la) - Math.sin(l0) * Math.cos(la) * Math.cos(dl);
    const z = Math.sin(l0) * Math.sin(la) + Math.cos(l0) * Math.cos(la) * Math.cos(dl);
    const k = R * (1 + h);
    return { x: cx + x * k, y: cy - y * k, z };
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    aimX = (e.clientX / window.innerWidth - 0.5) * -10;
    aimY = (e.clientY / window.innerHeight - 0.5) * 6;
  }, { passive: true });

  let visible = true, start = performance.now(), raf = 0;
  const draw = (now) => {
    const t = reduced.matches ? 4200 : now - start;
    // a slow sway that keeps every destination on the visible side
    lon0 = 25 + Math.sin(t / 9000) * 4;
    tiltX += (aimX - tiltX) * 0.04;
    tiltY += (aimY - tiltY) * 0.04;
    ctx.clearRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25);
    glow.addColorStop(0, 'rgba(40,66,120,0.45)');
    glow.addColorStop(0.7, 'rgba(22,38,70,0.18)');
    glow.addColorStop(1, 'rgba(11,18,32,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(210,162,73,0.6)';
    ctx.lineWidth = 1.2 * dpr;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    const shade = ctx.createLinearGradient(cx - R, cy + R * 0.4, cx + R * 0.6, cy - R * 0.6);
    shade.addColorStop(0, 'rgba(6,10,20,0.55)');
    shade.addColorStop(0.55, 'rgba(6,10,20,0)');
    ctx.fillStyle = shade;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    const ds = 1.9 * dpr;
    for (const d of dots) {
      const p = project(d.lat, d.lon);
      if (p.z <= 0) continue;
      ctx.fillStyle = `rgba(210,162,73,${(0.18 + p.z * 0.62).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, ds / 2 * (0.6 + p.z * 0.5), 0, Math.PI * 2); ctx.fill();
    }

    const cycle = 7000, stagger = 380;
    arcs.forEach((pts, i) => {
      const local = reduced.matches ? 1 : clamp(((t - 600 - i * stagger) % cycle) / 1500);
      const lead = Math.max(1, Math.floor(local * (pts.length - 1)));
      ctx.lineWidth = 1.6 * dpr;
      ctx.strokeStyle = 'rgba(210,162,73,0.9)';
      ctx.beginPath();
      let started = false;
      for (let j = 0; j <= lead; j++) {
        const p = project(pts[j].lat, pts[j].lon, pts[j].h);
        if (p.z < -0.05) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      if (local < 1) {
        const p = project(pts[lead].lat, pts[lead].lon, pts[lead].h);
        ctx.fillStyle = 'rgba(255,240,205,0.95)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.6 * dpr, 0, Math.PI * 2); ctx.fill();
      }
    });

    ctx.font = `500 ${13 * dpr}px Heebo, sans-serif`;
    ctx.textAlign = 'center';
    [home, ...places].forEach((pl, i) => {
      const p = project(pl.lat, pl.lon);
      if (p.z <= 0.05) return;
      const pulse = reduced.matches ? 0 : (Math.sin(t / 600 + i) + 1) / 2;
      ctx.fillStyle = i === 0 ? '#f3eee4' : '#e6d2a0';
      ctx.beginPath(); ctx.arc(p.x, p.y, (i === 0 ? 3.6 : 3) * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(230,210,160,${(0.5 - pulse * 0.45).toFixed(3)})`;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath(); ctx.arc(p.x, p.y, (6 + pulse * 7) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = i === 0 ? 'rgba(243,238,228,0.95)' : 'rgba(230,210,160,0.95)';
      ctx.textAlign = pl.align || 'center';
      ctx.fillText(pl.name, p.x + (pl.dx ?? 0) * dpr, p.y + (pl.dy ?? -14) * dpr);
      ctx.textAlign = 'center';
    });

    if (visible && !reduced.matches && !userPaused) raf = requestAnimationFrame(draw);
  };
  const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) run(); });
  reduced.addEventListener?.('change', (e) => { root.classList.toggle('reduced', e.matches); run(); });
  window.addEventListener('motionchange', () => { if (!userPaused) { start = performance.now() - pausedAt; run(); } else { pausedAt = performance.now() - start; } });
  let pausedAt = 0;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
})();
