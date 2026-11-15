/* MS Group Global — interactions */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) root.classList.add('reduced');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const LANG = (root.lang || 'he').slice(0, 2);
  const RTL = getComputedStyle(root).direction === 'rtl';
  const T = {
    he: { emph: ['בית:', 'אחד,', 'אחת', 'אחת,', 'המפתח'], name: 'שם', phone: 'טלפון', budget: 'תקציב', countries: 'מדינות', none: 'לא צוין', privacyOk: 'אישור מדיניות פרטיות: כן', marketing: 'הסכמה לדיוור שיווקי', yes: 'כן', no: 'לא', subject: 'פנייה מאתר MS Group Global',
      mailto: 'ניסינו לפתוח הודעת מייל מוכנה עם הפרטים. אם היא לא נפתחה, התקשרו 072-2133266 או כתבו ל־office@msgp.co.il.', sending: 'שולחים...', thanks: 'תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.', failed: 'השליחה לא הצליחה. נסו שוב בעוד רגע.', play: 'הפעלת אנימציה', pause: 'עצירת אנימציה', email: 'דוא״ל', vPause: 'עצירת הסרטון', vPlay: 'הפעלת הסרטון', clubSubject: 'הצטרפות למועדון VIP של MS Group Global', clubConsent: 'אישור קבלת עדכונים: כן', clubMailto: 'ניסינו לפתוח הודעת מייל מוכנה עם הפרטים. אם היא לא נפתחה, כתבו ל־office@msgp.co.il ונצרף אתכם למועדון.',
      home: 'תל אביב', places: ['קפריסין', 'פורטוגל', 'רומניה', 'גאורגיה', 'דובאי', 'אוקראינה', '← מיאמי, ארה״ב'], font: 'Heebo' },
    en: { emph: ['home', 'one', 'company,', 'key.'], name: 'Name', phone: 'Phone', budget: 'Budget', countries: 'Countries', none: 'Not specified', privacyOk: 'Privacy policy accepted: yes', marketing: 'Marketing consent', yes: 'yes', no: 'no', subject: 'Enquiry from the MS Group Global website',
      mailto: 'We tried to open a ready-made email with your details. If it did not open, call +972-72-2133266 or write to office@msgp.co.il.', sending: 'Sending…', thanks: 'Thank you! We have your details and will be in touch shortly.', failed: 'Sending failed. Please try again in a moment.', play: 'Play animation', pause: 'Pause animation', email: 'Email', vPause: 'Pause the film', vPlay: 'Play the film', clubSubject: 'Joining the MS Group Global VIP club', clubConsent: 'Consent to receive updates: yes', clubMailto: 'We tried to open a ready-made email with your details. If it did not open, write to office@msgp.co.il and we will add you to the club.',
      home: 'Tel Aviv', places: ['Cyprus', 'Portugal', 'Romania', 'Georgia', 'Dubai', 'Ukraine', '← Miami, USA'], font: 'Heebo' },
    fr: { emph: ['maison\u00a0:', 'seule', 'seul', 'clé.'], name: 'Nom', phone: 'Téléphone', budget: 'Budget', countries: 'Pays', none: 'Non précisé', privacyOk: 'Politique de confidentialité acceptée\u00a0: oui', marketing: 'Accord pour la prospection commerciale', yes: 'oui', no: 'non', subject: 'Demande depuis le site MS Group Global',
      mailto: 'Nous avons tenté d’ouvrir un e-mail prérempli avec vos coordonnées. S’il ne s’est pas ouvert, appelez le +972 72 213 3266 ou écrivez à office@msgp.co.il.', sending: 'Envoi en cours…', thanks: 'Merci\u202f! Nous avons bien reçu vos coordonnées et revenons vers vous très vite.', failed: 'L’envoi a échoué. Merci de réessayer dans un instant.', play: 'Relancer l’animation', pause: 'Mettre l’animation en pause', email: 'E-mail', vPause: 'Mettre la vidéo en pause', vPlay: 'Lire la vidéo', clubSubject: 'Adhésion au club VIP MS Group Global', clubConsent: 'Accord pour recevoir des actualités\u00a0: oui', clubMailto: 'Nous avons tenté d’ouvrir un e-mail prérempli avec vos coordonnées. S’il ne s’est pas ouvert, écrivez à office@msgp.co.il et nous vous ajouterons au club.',
      home: 'Tel-Aviv', places: ['Chypre', 'Portugal', 'Roumanie', 'Géorgie', 'Dubaï', 'Ukraine', '← Miami, États-Unis'], font: 'Heebo' },
  }[LANG] || null;
  const L = T || {};

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
    const emph = new Set(statement.dataset.em ? statement.dataset.em.split('|') : L.emph);
    const parts = statement.textContent.trim().split(/[ \t\n\r]+/);
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
      // phone: fill the line down to the reading point, light each step as it is reached
      const list = journey.querySelector('[data-journey-steps]');
      const line = innerHeight * 0.6;
      const r = list.getBoundingClientRect();
      list.style.setProperty('--jm', clamp((line - r.top) / r.height).toFixed(4));
      jSteps.forEach((li) => li.classList.toggle('lit', li.getBoundingClientRect().top < line));
    }

    if (reveal) {
      // the frame-to-full-screen opening runs only on wide screens; phones and narrow windows get the full image at once
      if (window.matchMedia('(min-width: 1101px) and (min-height: 561px)').matches && !root.classList.contains('reduced')) {
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
        const span = RTL ? a.right - z.left : z.right - a.left;
        const max = Math.max(0, span - (track.parentElement.clientWidth - 2 * pad));
        track.style.transform = `translate3d(${((RTL ? 1 : -1) * p * max).toFixed(1)}px,0,0)`;
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
      // reading direction decides which arrow moves forward
      const step = (RTL ? { ArrowLeft: 1, ArrowRight: -1 } : { ArrowLeft: -1, ArrowRight: 1 })[e.key];
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
  // Form delivery: FormSubmit sends each submission straight to the office inbox (no account; the inbox confirms once).
  // If the service is unreachable or not yet confirmed, the visitor's email app opens with the details instead, so no lead is lost.
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/office@msgp.co.il';
  const sendForm = async (fields, subject) => {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...fields, _subject: subject, _template: 'table', _captcha: 'false' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.status);
  };
  const kv = (line) => { const [k, ...v] = line.split(/\s*:\s*/); return { [k]: v.join(':') || '✓' }; };
  const viaMail = (subject, lines) => {
    window.location.href = `mailto:office@msgp.co.il?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };
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
    const d = new FormData(form);
    if (d.get('_honey')) return; // bots fill the hidden field
    const sep = LANG === 'fr' ? '\u00a0: ' : ': ';
    const rows = {
      [L.name]: d.get('name'), [L.phone]: d.get('phone'), [L.budget]: d.get('budget') || L.none,
      [L.countries]: d.getAll('country').join(', ') || L.none, [L.marketing]: d.get('marketing') ? L.yes : L.no, Language: LANG,
    };
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = L.sending;
    try {
      await sendForm({ ...rows, ...kv(L.privacyOk) }, L.subject);
      form.reset();
      status.textContent = L.thanks;
    } catch {
      viaMail(L.subject, [...Object.entries(rows).map(([k, v]) => `${k}${sep}${v}`), L.privacyOk]);
      status.textContent = L.mailto;
    } finally {
      btn.disabled = false;
    }
  });

  /* YouTube films: a still and a play button until the visitor asks for the video, then the privacy-enhanced player */
  document.querySelectorAll('a[data-yt]').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0&playsinline=1&hl=${LANG}`;
    f.title = a.dataset.ytTitle || a.textContent.trim();
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.className = 'yt__frame';
    a.replaceWith(f);
    f.focus();
  }));

  /* VIP club: sign-up, delivered by the same form service (email-app fallback) */
  const club = document.querySelector('[data-club-form]');
  club?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checks = [
      ['#c-name', '#ce-name', (v) => v.trim().length > 1],
      ['#c-phone', '#ce-phone', (v) => v.replace(/[^\d]/g, '').length >= 9],
      ['#c-email', '#ce-email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
    ];
    let first = null;
    checks.forEach(([f, er, ok]) => {
      const el = club.querySelector(f), err = club.querySelector(er), good = ok(el.value);
      el.setAttribute('aria-invalid', String(!good)); err.hidden = good;
      if (good) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', err.id);
      if (!good && !first) first = el;
    });
    const consent = club.querySelector('#c-consent'), cErr = club.querySelector('#ce-consent');
    cErr.hidden = consent.checked; consent.setAttribute('aria-invalid', String(!consent.checked));
    if (!consent.checked && !first) first = consent;
    if (first) { first.focus(); return; }
    const d = new FormData(club), sep = LANG === 'fr' ? '\u00a0: ' : ': ';
    if (d.get('_honey')) return;
    const rows = { [L.name]: d.get('name'), [L.phone]: d.get('phone'), [L.email]: d.get('email'), Language: LANG };
    const st = club.querySelector('[data-club-status]'), btn = club.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    st.textContent = L.sending;
    try {
      await sendForm({ ...rows, ...kv(L.clubConsent), _replyto: d.get('email') }, L.clubSubject);
      club.reset();
      st.textContent = L.thanks;
    } catch {
      viaMail(L.clubSubject, [...Object.entries(rows).map(([k, v]) => `${k}${sep}${v}`), L.clubConsent]);
      st.textContent = L.clubMailto;
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  /* VIP club film: plays muted while on screen; respects reduced motion, the page pause button and its own toggle */
  const film = document.querySelector('[data-club-video]');
  if (film) {
    const tog = document.querySelector('[data-club-video-toggle]'), lab = document.querySelector('[data-club-video-label]');
    let stopped = reduced.matches, onScreen = false;
    const sync = () => {
      const play = onScreen && !stopped && !root.classList.contains('paused');
      if (play) film.play().catch(() => {}); else film.pause();
      tog.setAttribute('aria-pressed', String(stopped)); lab.textContent = stopped ? L.vPlay : L.vPause;
    };
    tog.addEventListener('click', () => { stopped = !stopped; sync(); });
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(film);
    window.addEventListener('motionchange', () => { if (root.classList.contains('paused')) stopped = true; sync(); });
    sync();
  }

  /* Presenter film: captions drawn in our own layer, pinned to the bottom of the frame */
  document.querySelectorAll('[data-cc-video]').forEach((fig) => {
    const v = fig.querySelector('video'), out = fig.querySelector('[data-cc]');
    const pick = () => [...v.textTracks].find((t) => t.language === LANG) || v.textTracks[0];
    const show = () => {
      [...v.textTracks].forEach((t) => { if (t.mode === 'showing') t.mode = 'hidden'; });
      const t = [...v.textTracks].find((x) => x.mode === 'hidden' && x.__on) || pick();
      const cue = t && t.activeCues && t.activeCues[0];
      // Latin names inside Hebrew stay whole and in order
      const esc = (s) => s.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
      out.innerHTML = cue ? esc(cue.text).replace(/MS Group Global|VIP/g, (m) => `<bdi class="nowrap">${m}</bdi>`) : '';
      out.dir = t && t.language === 'he' ? 'rtl' : 'ltr';
      out.hidden = !cue;
    };
    const arm = () => {
      [...v.textTracks].forEach((t) => {
        t.__on = t === pick(); t.mode = 'hidden';
        t.oncuechange = show;
      });
    };
    arm(); out.hidden = true;
    v.textTracks.addEventListener?.('change', () => {
      // the viewer chose a language (or "off") in the player menu
      const chosen = [...v.textTracks].find((t) => t.mode === 'showing');
      [...v.textTracks].forEach((t) => { t.__on = t === chosen; if (t.mode === 'showing') t.mode = 'hidden'; });
      if (!chosen && ![...v.textTracks].some((t) => t.__on)) { out.hidden = true; }
      show();
    });
    v.addEventListener('timeupdate', show);
  });

  /* VIP card: follows the pointer on desktop */
  const card = document.querySelector('[data-vip-card]');
  if (card && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const wrap = card.parentElement;
    wrap.addEventListener('pointermove', (e) => {
      if (root.classList.contains('reduced') || root.classList.contains('paused')) return;
      const r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(x * 22).toFixed(2)}deg`); card.style.setProperty('--rx', `${(-y * 16).toFixed(2)}deg`);
      card.style.setProperty('--sx', `${(x * 60).toFixed(1)}%`);
    });
    wrap.addEventListener('pointerleave', () => ['--rx', '--ry', '--sx'].forEach((v) => card.style.removeProperty(v)));
  }

  /* Pause control for moving content (WCAG 2.2.2) */
  let userPaused = false;
  const mt = document.querySelector('[data-motion-toggle]');
  const mLabel = document.querySelector('[data-motion-label]');
  mt?.addEventListener('click', () => {
    userPaused = !userPaused;
    root.classList.toggle('paused', userPaused);
    mt.setAttribute('aria-pressed', String(userPaused));
    mLabel.textContent = userPaused ? L.play : L.pause;
    window.dispatchEvent(new Event('motionchange'));
  });

  /* Globe */
  const canvas = document.querySelector('[data-globe]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const RAD = Math.PI / 180;
  const home = { name: L.home, lat: 32.08, lon: 34.78, dx: 0, dy: 26, align: 'center' };
  const places = [
    { name: L.places[0], lat: 34.68, lon: 33.04, dx: -12, dy: 18, align: 'right' },
    { name: L.places[1], lat: 38.72, lon: -9.14 },
    { name: L.places[2], lat: 44.43, lon: 26.1 },
    { name: L.places[3], lat: 41.72, lon: 44.79 },
    { name: L.places[4], lat: 25.2, lon: 55.27 },
    { name: L.places[5], lat: 46.48, lon: 30.73, dy: -30 },
    // Miami is on the far side of the globe: the route ends at the western edge, with an arrow pointing on west
    { name: L.places[6], lat: 32, lon: -23, far: true, dx: -6, dy: 22, align: 'left' },
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
      pts.push({ lat, lon, h: Math.sin(Math.PI * t) * (0.06 + Math.min(ang, p.far ? 0.55 : 9) * 0.28) });
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

/* Images fade in once decoded, instead of popping in line by line */
(() => {
  const show = (img) => img.classList.add('is-in');
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete && img.naturalWidth) return show(img);
    img.addEventListener('load', () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => show(img)), { once: true });
    img.addEventListener('error', () => show(img), { once: true });
  });
})();

/* Project galleries: full-screen viewer in the manner of iOS Photos.
   The image grows out of the thumbnail you tapped and shrinks back into it; every motion is a spring
   that starts from where things are on screen and inherits the finger's speed; the ends rubber-band. */
(() => {
  const lang = (document.documentElement.lang || 'he').slice(0, 2);
  const rtl = document.documentElement.dir === 'rtl';
  const TX = {
    he: { open: 'הגדלת התמונה', close: 'סגירה', prev: 'התמונה הקודמת', next: 'התמונה הבאה', of: 'מתוך', label: 'תמונות הפרויקט' },
    en: { open: 'Enlarge image', close: 'Close', prev: 'Previous image', next: 'Next image', of: 'of', label: 'Project images' },
    fr: { open: 'Agrandir l’image', close: 'Fermer', prev: 'Image précédente', next: 'Image suivante', of: 'sur', label: 'Images du projet' },
  }[lang] || {};
  const galleries = document.querySelectorAll('.project__gallery');
  if (!galleries.length || typeof HTMLDialogElement === 'undefined') return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* --- physics helpers (Apple's damping/response model, WWDC "Designing Fluid Interfaces") --- */
  // A spring has no fixed duration; it starts from the current value and velocity and can be re-targeted any time.
  const spring = ({ from, to, velocity = 0, damping = 1, response = 0.4, onUpdate, onDone }) => {
    const k = (2 * Math.PI / response) ** 2, c = 4 * Math.PI * damping / response;
    let x = from, v = velocity, last = performance.now(), id = 0, alive = true;
    const span = Math.max(Math.abs(to - from), 1);
    const step = (now) => {
      if (!alive) return;
      let dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      while (dt > 0) { const h = Math.min(dt, 1 / 240); v += (-k * (x - to) - c * v) * h; x += v * h; dt -= h; }
      if (Math.abs(x - to) < span * 0.0008 && Math.abs(v) < span * 0.01) { onUpdate(to); alive = false; onDone?.(); return; }
      onUpdate(x); id = requestAnimationFrame(step);
    };
    if (reduce.matches) { onUpdate(to); onDone?.(); return { stop() {} }; }
    id = requestAnimationFrame(step);
    return { stop() { alive = false; cancelAnimationFrame(id); }, get value() { return x; }, get velocity() { return v; } };
  };
  // where a flick would come to rest (iOS scroll deceleration)
  const project = (v /* px/s */, d = 0.998) => (v / 1000) * d / (1 - d);
  // soft edge: the further past the bound, the less it follows
  const rubber = (o, dim, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));
  const best = (img) => {
    const set = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((p) => p[0]);
    set.sort((a, b) => parseInt(b[1] || 0, 10) - parseInt(a[1] || 0, 10));
    return set[0]?.[0] || img.currentSrc || img.src;
  };

  /* --- markup --- */
  const dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', TX.label);
  dlg.innerHTML = `
    <div class="lb__scrim"></div>
    <div class="lb__stage"><img class="lb__img" alt="" decoding="async"></div>
    <div class="lb__chrome">
      <p class="lb__cap"></p>
      <p class="lb__count" aria-live="polite"></p>
      <button type="button" class="lb__btn lb__close" aria-label="${TX.close}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <button type="button" class="lb__btn lb__prev" aria-label="${TX.prev}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
      <button type="button" class="lb__btn lb__next" aria-label="${TX.next}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
    </div>`;
  document.body.append(dlg);
  const scrim = dlg.querySelector('.lb__scrim'), stage = dlg.querySelector('.lb__stage'), big = dlg.querySelector('.lb__img');
  const chrome = dlg.querySelector('.lb__chrome'), cap = dlg.querySelector('.lb__cap'), count = dlg.querySelector('.lb__count');
  const bPrev = dlg.querySelector('.lb__prev'), bNext = dlg.querySelector('.lb__next');

  /* --- state: one transform for the image, driven by springs --- */
  let list = [], idx = 0, opener = null, closing = false;
  const st = { x: 0, y: 0, s: 1, p: 1 };          // drag offset, drag scale, presence (0 = in the thumbnail, 1 = full screen)
  let zoom = null;                                 // the thumbnail geometry for the current image
  const springs = {};
  const run = (key, opts) => { springs[key]?.stop(); springs[key] = spring({ ...opts, onUpdate: (v) => { st[key] = v; paint(); }, onDone: () => { delete springs[key]; opts.onDone?.(); } }); };
  const stopAll = () => Object.keys(springs).forEach((k) => { springs[k].stop(); delete springs[k]; });

  const measure = () => {
    // thumbnail rect vs. where the image sits at rest, so the image can grow out of the thumbnail
    const t = list[idx]; if (!t) return null;
    const tr = t.getBoundingClientRect();
    if (!tr.width || tr.bottom < 0 || tr.top > innerHeight) return null;
    const prev = big.style.transform; big.style.transform = 'none';
    const fr = big.getBoundingClientRect(); big.style.transform = prev;
    if (!fr.width) return null;
    const s = Math.max(tr.width / fr.width, tr.height / fr.height);   // cover, like the thumbnail
    return {
      dx: tr.left + tr.width / 2 - (fr.left + fr.width / 2), dy: tr.top + tr.height / 2 - (fr.top + fr.height / 2), s,
      ix: Math.max(0, (fr.width - tr.width / s) / 2), iy: Math.max(0, (fr.height - tr.height / s) / 2),
    };
  };
  const paint = () => {
    const p = st.p, z = zoom || { dx: 0, dy: 0, s: 0.92, ix: 0, iy: 0 };
    const k = 1 - p;
    const sc = (z.s + (1 - z.s) * p) * st.s;
    big.style.transform = `translate3d(${z.dx * k + st.x}px, ${z.dy * k + st.y}px, 0) scale(${sc})`;
    big.style.clipPath = k > 0.001 ? `inset(${z.iy * k}px ${z.ix * k}px round ${6 + 4 * k}px)` : '';
    big.style.opacity = zoom ? '1' : String(Math.min(1, p * 1.4));
    const drag = Math.min(Math.abs(st.y) / 420, 0.7);
    scrim.style.opacity = String(Math.max(0, p - drag));
    chrome.style.opacity = String(Math.max(0, Math.min(1, (p - 0.6) / 0.4) - drag * 1.6));
  };

  const fill = () => {
    const t = list[idx];
    big.width = t.naturalWidth || t.width; big.height = t.naturalHeight || t.height;
    big.src = t.currentSrc || t.src;               // the thumbnail is already decoded: open instantly
    big.alt = t.alt; cap.textContent = t.alt;
    count.textContent = list.length > 1 ? `${idx + 1} ${TX.of} ${list.length}` : '';
    bPrev.hidden = idx === 0; bNext.hidden = idx === list.length - 1;
    const hi = best(t);
    if (hi && !big.src.endsWith(hi.replace(/^.*\//, ''))) { const pre = new Image(); pre.onload = () => { if (list[idx] === t) big.src = hi; }; pre.src = hi; }
    [idx + 1, idx - 1].forEach((n) => { if (list[n]) new Image().src = best(list[n]); });
  };

  /* --- open / close --- */
  const open = (img) => {
    list = [...img.closest('.project__gallery').querySelectorAll('img')];
    idx = list.indexOf(img); opener = img; closing = false;
    stopAll(); Object.assign(st, { x: 0, y: 0, s: 1, p: 0 });
    fill();
    dlg.showModal();
    document.documentElement.classList.add('lb-open');
    zoom = measure(); paint();
    run('p', { from: 0, to: 1, damping: 1, response: 0.42 });
  };
  const close = (vy = 0) => {
    if (closing) return; closing = true;
    stopAll();
    // fly back into the thumbnail from exactly where the image is now, keeping the finger's downward speed
    zoom = measure();
    const dist = zoom ? Math.max(Math.abs(zoom.dy - st.y), 120) : 400;
    run('p', { from: st.p, to: 0, damping: 1, response: 0.38, velocity: -Math.max(vy, 0) / dist, onDone: () => dlg.close() });
    run('x', { from: st.x, to: 0, damping: 1, response: 0.38 });
    run('y', { from: st.y, to: 0, damping: 1, response: 0.38 });
    run('s', { from: st.s, to: 1, damping: 1, response: 0.38 });
  };
  dlg.addEventListener('close', () => {
    stopAll(); document.documentElement.classList.remove('lb-open');
    big.removeAttribute('src'); opener?.focus({ preventScroll: true }); closing = false;
  });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

  /* --- browsing --- */
  const W = () => stage.clientWidth || innerWidth;
  const go = (dir, vx = 0) => {
    const n = idx + dir;
    if (n < 0 || n >= list.length) { run('x', { from: st.x, to: 0, damping: 0.8, response: 0.3, velocity: vx }); return; }
    const out = -dir * (rtl ? -1 : 1) * W();   // where the current image leaves to
    run('x', {
      from: st.x, to: out, damping: 1, response: 0.28, velocity: vx,
      onDone: () => { idx = n; zoom = null; fill(); st.x = -out * 0.35; paint(); requestAnimationFrame(() => { if (!drag) run('x', { from: st.x, to: 0, damping: 1, response: 0.3 }); }); },
    });
  };
  dlg.querySelector('.lb__close').addEventListener('click', () => close());
  bNext.addEventListener('click', () => go(1));
  bPrev.addEventListener('click', () => go(-1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
    if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
  });

  /* --- direct manipulation: 1:1 with the finger, velocity from recent samples --- */
  var drag = null, moved = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || closing) return;
    // grab mid-flight: stop the springs and continue from what is on screen
    ['x', 'y'].forEach((k) => { springs[k]?.stop(); delete springs[k]; });
    drag = { x0: e.clientX - st.x, y0: e.clientY - st.y, axis: '', samples: [{ t: performance.now(), x: e.clientX, y: e.clientY }] };
    moved = false;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    drag.samples.push({ t: performance.now(), x: e.clientX, y: e.clientY });
    if (drag.samples.length > 6) drag.samples.shift();
    if (!drag.axis && Math.hypot(dx - st.x * 0, dy) > 10) drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (!drag.axis) return;
    moved = true;
    if (drag.axis === 'x') {
      const fwd = rtl ? dx > 0 : dx < 0;
      const atEnd = (fwd && idx === list.length - 1) || (!fwd && idx === 0);
      st.x = atEnd ? rubber(dx, W()) : dx;
    } else {
      st.y = dy > 0 ? dy : rubber(dy, innerHeight);
      st.s = 1 - Math.min(Math.max(dy, 0) / 1800, 0.14);
      st.x = (e.clientX - drag.x0) * 0.6;
    }
    paint();
  });
  const release = () => {
    if (!drag) return;
    const sm = drag.samples, a = sm[0], b = sm[sm.length - 1], dt = Math.max((b.t - a.t) / 1000, 0.016);
    const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt, axis = drag.axis;
    drag = null;
    if (axis === 'x') {
      const end = st.x + project(vx);
      const fwd = rtl ? end > 0 : end < 0;
      // commit by where the flick would land, or by a clearly fast flick in the same direction
      const commit = Math.abs(end) > Math.min(W() * 0.42, 260) || (Math.abs(vx) > 450 && Math.sign(vx) === Math.sign(st.x));
      if (commit && list.length > 1) go(fwd ? 1 : -1, vx);
      else run('x', { from: st.x, to: 0, damping: 0.85, response: 0.32, velocity: vx });
    } else if (axis === 'y') {
      if (st.y + project(vy) > 220) close(vy);
      else { run('y', { from: st.y, to: 0, damping: 0.85, response: 0.32, velocity: vy }); run('x', { from: st.x, to: 0, damping: 1, response: 0.32 }); run('s', { from: st.s, to: 1, damping: 1, response: 0.32 }); }
    }
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  // a tap on the dark area closes; a swipe never counts as a tap
  dlg.addEventListener('click', (e) => { if (moved) { moved = false; return; } if (e.target === stage || e.target === scrim || e.target === dlg) close(); });
  addEventListener('resize', () => { if (dlg.open) { zoom = null; paint(); } });

  /* --- hook up the galleries --- */
  galleries.forEach((g) => g.querySelectorAll('img').forEach((img) => {
    img.classList.add('is-zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${TX.open}: ${img.alt}`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
  }));
})();

/* Destination cards: open the projects section on that country */
document.querySelectorAll('[data-show-country]').forEach((a) => a.addEventListener('click', () => {
  document.querySelector(`.project__country[data-country="${a.dataset.showCountry}"]`)?.click();
}));

/* Project tab row: mark when more tabs sit beyond the far edge (drives the fade) */
document.querySelectorAll('.project__tabs').forEach((row) => {
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    const done = Math.abs(row.scrollLeft) >= max - 4;   // scrollLeft is negative in RTL
    row.classList.toggle('has-more', max > 4 && !done);
  };
  row.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  new MutationObserver(update).observe(row, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  update();
});
