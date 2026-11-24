// Schematic location map with a rail line, for project films (first used by NEO SEA Bat Yam's Red Line beat).
// Not a street map: a stylised coast, a rail line with a few unnamed station dots, the project pin and a
// fine curved arrow to the nearest station. Say on screen only what the project's wiki page backs.
//
// Usage (film.html):
//   <script src="map.js"></script>
//   const map = createRailMap(document.getElementById('host'), CONFIG);   // host: absolutely positioned, inset 0
//   map.render(t, w, h);   // t = seconds since the chapter started; w, h = frame size in px
//
// CONFIG (all coordinates in a 1000x1000 "world", north up, sea to the west):
//   coast:   [[x,y], ...]           coastline points, south to north (sea is drawn to their west)
//   rail:    { path: 'M ... C ...' } the line in world coords, south to north (SVG path syntax, absolute M/L/C/S/Q only)
//   from:    0..1                    where along the rail the line starts drawing (the project's station)
//   dots:    [0..1, ...]             extra station dots along the rail (unnamed)
//   station: { at: 0..1, label }     the named station near the project
//   pin:     { at: [x,y], label }    the project
//   city:    { at: [x,y], label, lat }  the destination (gets a soft skyline hint)
//   area:    { label, at }           optional faint place name
//   walk:    'html'                  text of the distance label beside the arrow
//   note:    'text'                  small corner note (e.g. "מפה סכמטית, להמחשה")
//   view:    { x, y, w, h }          where the map sits in the frame, px (the camera frames inside it)
//   zoom:    { to: k, focus: [x,y] } close-up scale and world point for the project close-up
//   times:   { in, draw:[a,b], zoomIn:[a,b], pin, arrow:[a,b], zoomOut:[a,b], train:[a,b], out }
//   colors:  { rail, pin, gold, ivory }
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lin = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eout = (x) => 1 - Math.pow(1 - x, 3);
  const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
  const mix = (a, b, x) => a + (b - a) * x;
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

  window.createRailMap = function (host, C) {
    const col = Object.assign({ rail: '#c63a43', pin: '#E8622C', gold: '#cdb07a', ivory: '#f6f1e7' }, C.colors || {});
    host.innerHTML = '';
    const svg = el('svg', { style: 'position:absolute;left:0;top:0;overflow:visible' }, host);
    const defs = el('defs', {}, svg);
    defs.innerHTML = `
      <linearGradient id="rmSea" x1="0" x2="1"><stop offset="0" stop-color="#0e3a57" stop-opacity=".85"/><stop offset="1" stop-color="#0b2e45" stop-opacity=".2"/></linearGradient>
      <radialGradient id="rmGlowR"><stop offset="0" stop-color="#ff7a72" stop-opacity=".85"/><stop offset="1" stop-color="${col.rail}" stop-opacity="0"/></radialGradient>
      <radialGradient id="rmGlowP"><stop offset="0" stop-color="#ffb08a" stop-opacity=".8"/><stop offset="1" stop-color="${col.pin}" stop-opacity="0"/></radialGradient>
      <radialGradient id="rmSkyGlow"><stop offset="0" stop-color="#f3dfb6" stop-opacity=".22"/><stop offset="1" stop-color="#f3dfb6" stop-opacity="0"/></radialGradient>
      <filter id="rmSoft"><feGaussianBlur stdDeviation="4"/></filter>`;
    const gGrid = el('g', { stroke: col.ivory, 'stroke-opacity': .045, 'stroke-width': 1 }, svg);
    const sea = el('path', { fill: 'url(#rmSea)' }, svg);
    const shelf = el('path', { fill: 'none', stroke: '#cfe2ec', 'stroke-opacity': .12, 'stroke-width': 1, 'stroke-dasharray': '2 8' }, svg);
    const coast = el('path', { fill: 'none', stroke: '#cfe2ec', 'stroke-opacity': .42, 'stroke-width': 1.4 }, svg);
    const seaGlints = el('g', { stroke: '#e9f3f7', 'stroke-linecap': 'round' }, svg);
    const skyGlow = el('ellipse', { fill: 'url(#rmSkyGlow)' }, svg);
    const sky = el('g', { fill: col.ivory }, svg);
    const railBase = el('path', { fill: 'none', stroke: col.rail, 'stroke-opacity': .18, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
    const railGlow = el('path', { fill: 'none', stroke: col.rail, 'stroke-opacity': .4, 'stroke-width': 14, 'stroke-linecap': 'round', filter: 'url(#rmSoft)' }, svg);
    const rail = el('path', { fill: 'none', stroke: col.rail, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, svg);
    const dots = (C.dots || []).map(() => el('circle', { fill: '#061a29', stroke: col.ivory, 'stroke-width': 2, r: 0 }, svg));
    const cityGlow = el('circle', { fill: 'url(#rmGlowR)', r: 0 }, svg);
    const cityDot = el('circle', { fill: '#061a29', stroke: col.ivory, 'stroke-width': 2.5, r: 0 }, svg);
    const stDot = el('circle', { fill: col.ivory, stroke: col.rail, 'stroke-width': 3, r: 0 }, svg);
    const arrow = el('path', { fill: 'none', stroke: col.gold, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
    const head = el('path', { fill: 'none', stroke: col.gold, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    const rings = [0, 1].map(() => el('circle', { fill: 'none', stroke: col.pin, 'stroke-width': 1.6, r: 0 }, svg));
    const pinGlow = el('circle', { fill: 'url(#rmGlowP)', r: 0 }, svg);
    const pinHalo = el('circle', { fill: 'none', stroke: col.ivory, 'stroke-opacity': .9, 'stroke-width': 2, r: 0 }, svg);
    const pin = el('circle', { fill: col.pin, r: 0 }, svg);
    const trainGlow = el('circle', { fill: 'url(#rmGlowR)', r: 0 }, svg);
    const train = el('circle', { fill: '#fff4f0', r: 0 }, svg);
    // HTML labels keep Hebrew shaping and the film's fonts
    const lab = (css, html) => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;white-space:nowrap;opacity:0;' + css; d.innerHTML = html; host.appendChild(d); return d; };
    const S = C.styles || {};
    const lCity = lab(S.city || '', `${C.city.label}${C.city.lat ? `<span style="${S.cityLat || ''}">${C.city.lat}</span>` : ''}`);
    const lSt = lab(S.station || '', C.station.label);
    const lPin = lab(S.pin || '', C.pin.label);
    const lWalk = lab(S.walk || '', C.walk || '');
    const lArea = C.area ? lab(S.area || '', C.area.label) : null;
    const lSea = C.sea ? lab(S.sea || '', C.sea.label) : null;
    const lNote = lab(S.note || '', C.note || '');
    // world-space rail, measured once on a hidden path
    const probe = el('path', { d: C.rail.path, fill: 'none', stroke: 'none' }, svg);
    const RL = probe.getTotalLength();
    const R = (u) => { const p = probe.getPointAtLength(clamp(u) * RL); return [p.x, p.y]; };
    const glints = []; { let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 26; i++) glints.push({ x: mix(-150, 230, r()), y: mix(80, 980, r()), ph: r(), sp: .12 + r() * .2, len: 8 + r() * 26 }); }
    const skyBars = [22, 40, 30, 58, 44, 76, 52, 36, 66, 28, 42, 20];
    let gridBuilt = '';

    function render(t, w, h) {
      const T = C.times, V = C.view;
      svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      // camera: wide view of the whole map -> close-up on the project -> back out to the wide view
      const base = Math.min(V.w, V.h) / 1000;
      const zin = ease(lin(t, ...T.zoomIn)), zout = ease(lin(t, ...T.zoomOut)), z = zin * (1 - zout);
      const breathe = 1 + .02 * sine(lin(t, 0, T.out));
      const k = base * Math.exp(mix(0, Math.log(C.zoom.to), z)) * breathe;
      const fx = mix(500, C.zoom.focus[0], z), fy = mix(500, C.zoom.focus[1], z);
      const cx = V.x + V.w / 2, cy = V.y + V.h / 2;
      const P = (p) => [cx + (p[0] - fx) * k, cy + (p[1] - fy) * k];
      const s = (p) => P(p).map((v) => v.toFixed(1)).join(' ');
      // grid: parallax, slower than the map
      const gk = mix(1, 1.25, z), go = 60 * gk, gx = (cx - fx * k * .3) % go, gy = (cy - fy * k * .3) % go;
      let g = ''; for (let x = gx - go; x <= w + go; x += go) g += `<path d="M ${x.toFixed(1)} 0 V ${h}"/>`;
      for (let y = gy - go; y <= h + go; y += go) g += `<path d="M 0 ${y.toFixed(1)} H ${w}"/>`;
      if (g !== gridBuilt) { gGrid.innerHTML = g; gridBuilt = g; }
      const fadeIn = eout(lin(t, T.in, T.in + 1.4));
      gGrid.style.opacity = fadeIn;
      // coast and sea
      const c = C.coast; let d = `M ${s(c[0])}`;
      for (let i = 1; i < c.length; i++) { const a = P(c[i - 1]), b = P(c[i]); d += ` Q ${a[0].toFixed(1)} ${a[1].toFixed(1)} ${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`; }
      d += ` L ${s(c[c.length - 1])}`;
      coast.setAttribute('d', d); sea.setAttribute('d', `${d} L -4000 -4000 L -4000 ${h + 4000} Z`);
      // reversed order closes the polygon on the west side
      sea.setAttribute('d', `${d} L ${-4000} ${P(c[c.length - 1])[1] - 4000} L ${-4000} ${P(c[0])[1] + 4000} Z`);
      let sd = `M ${s([c[0][0] - 45, c[0][1]])}`; for (let i = 1; i < c.length; i++) sd += ` L ${s([c[i][0] - 45, c[i][1]])}`;
      shelf.setAttribute('d', sd);
      [sea, coast, shelf].forEach((e) => { e.style.opacity = fadeIn; });
      // glints on the water
      let gl = '';
      glints.forEach((q) => { const ph = (t * q.sp + q.ph) % 1, a = Math.pow(Math.sin(Math.PI * ph), 3) * .5 * fadeIn;
        const [x, y] = P([q.x + ph * 30, q.y]); gl += `<path d="M ${(x - q.len * k / 2 / base).toFixed(1)} ${y.toFixed(1)} h ${(q.len * k / base).toFixed(1)}" stroke-opacity="${a.toFixed(3)}" stroke-width="1.2"/>`; });
      seaGlints.innerHTML = gl;
      // destination: skyline hint
      const [tx, ty] = P(C.city.at), skyA = mix(.1, .22, eout(lin(t, T.train[1] - .3, T.train[1] + 1)));
      let sk = ''; const bw = 6 * k / base, step = 17 * k / base;
      skyBars.forEach((bh, i) => { const x = tx - step * 6 + i * step, hh = bh * k / base; sk += `<rect x="${x.toFixed(1)}" y="${(ty - 40 * k / base - hh).toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="1"/>`; });
      sky.innerHTML = sk; sky.setAttribute('fill-opacity', (skyA * fadeIn).toFixed(3));
      skyGlow.setAttribute('cx', tx); skyGlow.setAttribute('cy', ty - 70 * k / base); skyGlow.setAttribute('rx', 260 * k / base); skyGlow.setAttribute('ry', 110 * k / base);
      skyGlow.style.opacity = fadeIn;
      // the rail: faint full route, then the red line drawing north from the project's station
      const N = 90; let rd = ''; for (let i = 0; i <= N; i++) rd += (i ? ' L ' : 'M ') + s(R(i / N)); railBase.setAttribute('d', rd);
      railBase.style.opacity = fadeIn;
      const dr = ease(lin(t, ...T.draw)), u1 = mix(C.from, 1, dr);
      let ad = ''; const n2 = Math.max(2, Math.round(N * (u1 - 0)));
      // south part (below the station) appears at once with the draw start; north part grows
      for (let i = 0; i <= n2; i++) { const u = (u1) * i / n2; ad += (i ? ' L ' : 'M ') + s(R(u)); }
      const southIn = eout(lin(t, T.draw[0] - .4, T.draw[0] + .4));
      rail.setAttribute('d', ad); railGlow.setAttribute('d', ad);
      rail.style.opacity = southIn; railGlow.style.opacity = southIn;
      // station dots appear as the line passes them
      (C.dots || []).forEach((u, i) => { const [x, y] = P(R(u)); const q = u <= C.from ? southIn : eout(clamp((u1 - u) / .04));
        dots[i].setAttribute('cx', x); dots[i].setAttribute('cy', y); dots[i].setAttribute('r', 5.5 * q); });
      const [sx, sy] = P(R(C.station.at));
      stDot.setAttribute('cx', sx); stDot.setAttribute('cy', sy); stDot.setAttribute('r', 8.5 * southIn);
      const cityIn = eout(clamp((u1 - .97) / .03));
      cityDot.setAttribute('cx', tx); cityDot.setAttribute('cy', ty); cityDot.setAttribute('r', 8 * cityIn);
      // the train: a soft light gliding from the station to the city
      const tp = ease(lin(t, ...T.train)), tv = sine(lin(t, T.train[0] - .3, T.train[0] + .3)) * (1 - sine(lin(t, T.train[1], T.train[1] + .6)));
      const [trx, try_] = P(R(mix(C.station.at, 1, tp)));
      train.setAttribute('cx', trx); train.setAttribute('cy', try_); train.setAttribute('r', 5 * tv);
      trainGlow.setAttribute('cx', trx); trainGlow.setAttribute('cy', try_); trainGlow.setAttribute('r', 30 * tv);
      const arrive = eout(lin(t, T.train[1] - .2, T.train[1] + 1));
      cityGlow.setAttribute('cx', tx); cityGlow.setAttribute('cy', ty); cityGlow.setAttribute('r', 64 * arrive);
      // the project pin lands with a gentle pulse
      const [px, py] = P(C.pin.at), pp = eout(lin(t, T.pin, T.pin + .9)), land = 1 + .35 * (1 - pp);
      pin.setAttribute('cx', px); pin.setAttribute('cy', py); pin.setAttribute('r', 9 * pp * land);
      pinHalo.setAttribute('cx', px); pinHalo.setAttribute('cy', py); pinHalo.setAttribute('r', 14 * pp);
      pinHalo.style.opacity = pp;
      pinGlow.setAttribute('cx', px); pinGlow.setAttribute('cy', py); pinGlow.setAttribute('r', 54 * pp);
      rings.forEach((r, i) => { const ph = ((t - T.pin + i * 1.3) % 2.6) / 2.6;
        r.setAttribute('cx', px); r.setAttribute('cy', py); r.setAttribute('r', 16 + 46 * eout(ph)); r.style.opacity = t > T.pin ? (1 - ph) * .75 * pp : 0; });
      // fine curved gold arrow: pin -> station
      const vx = sx - px, vy = sy - py, L = Math.hypot(vx, vy) || 1, nx = -vy / L, ny = vx / L;
      const a0 = [px + vx / L * 20, py + vy / L * 20], a1 = [sx - vx / L * 16, sy - vy / L * 16];
      const ctl = [(a0[0] + a1[0]) / 2 + nx * L * .32, (a0[1] + a1[1]) / 2 + ny * L * .32];
      arrow.setAttribute('d', `M ${a0[0].toFixed(1)} ${a0[1].toFixed(1)} Q ${ctl[0].toFixed(1)} ${ctl[1].toFixed(1)} ${a1[0].toFixed(1)} ${a1[1].toFixed(1)}`);
      const ap = ease(lin(t, ...T.arrow)), alen = arrow.getTotalLength();
      arrow.setAttribute('stroke-dasharray', `${(alen * ap).toFixed(1)} ${alen + 10}`);
      const arrowOut = 1 - sine(lin(t, T.zoomOut[0], T.zoomOut[0] + 1.0));
      arrow.style.opacity = arrowOut;
      const tdx = a1[0] - ctl[0], tdy = a1[1] - ctl[1], tl = Math.hypot(tdx, tdy) || 1, ux = tdx / tl, uy = tdy / tl, hs = 11;
      head.setAttribute('d', `M ${(a1[0] - ux * hs + uy * hs * .6).toFixed(1)} ${(a1[1] - uy * hs - ux * hs * .6).toFixed(1)} L ${a1[0].toFixed(1)} ${a1[1].toFixed(1)} L ${(a1[0] - ux * hs - uy * hs * .6).toFixed(1)} ${(a1[1] - uy * hs + ux * hs * .6).toFixed(1)}`);
      head.style.opacity = eout(lin(ap, .92, 1)) * arrowOut;
      // labels
      const place = (e, x, y, ax, ay, o) => { e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.transform = `translate(${ax}%, ${ay}%)`; e.style.opacity = o; };
      place(lCity, tx, ty + 22, -50, 0, eout(lin(t, T.draw[1] - .6, T.draw[1] + .6)) * (.6 + .4 * arrive));
      const stLab = eout(lin(t, T.arrow[0], T.arrow[0] + .8));
      place(lSt, sx + 20, sy, 0, -50, Math.max(stLab, .0) * (1 - z * 0) );
      place(lPin, px - (C.pinLabelDx || 40), py, -100, -50, eout(lin(t, T.pin + .3, T.pin + 1.2)) * mix(1, .7, zout));
      const wq = eout(lin(t, T.arrow[1] - .4, T.arrow[1] + .6)) * arrowOut;
      const wy = Math.max(py, sy) + (C.walkDy || 60);
      const wx = C.walkAt === 'pin' ? px + (C.walkDx || 0) : (px + sx) / 2;
      place(lWalk, wx, wy + (1 - wq) * 12, -50, 0, wq);
      if (lArea) { const [ax, ay] = P(C.area.at); place(lArea, ax, ay, -50, -50, fadeIn * .6); }
      if (lSea) { const [ax, ay] = P(C.sea.at); place(lSea, ax, ay, -50, -50, fadeIn * .8); lSea.style.transform += ' rotate(-76deg)'; }
      lNote.style.opacity = .85 * eout(lin(t, T.in + 1.5, T.in + 3));
      if (C.notePos) Object.assign(lNote.style, C.notePos);
    }
    return { render };
  };
})();
