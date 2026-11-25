// Isometric demolition + construction sequence drawn on <canvas id="con">. drawConstruct(t) uses absolute film time.
(() => {
  const cv = document.getElementById('con'), g = cv.getContext('2d');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeIn = (x) => Math.pow(clamp(x), 2.2);
  const easeIO = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const span = (t, a, b) => clamp((t - a) / (b - a));
  let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const rgb = (c, f, a = 1) => `rgba(${Math.round(Math.min(255, c[0] * f))},${Math.round(Math.min(255, c[1] * f))},${Math.round(Math.min(255, c[2] * f))},${a})`;

  // ---- world ----
  const FH = 0.62, GH = 0.9, NF = 14;
  const TOWERS = [[-9.5, -0.5], [0, 0.5], [9.5, -0.5]].map(([x, y], i) => ({ x, y, w: 5, d: 4.6, i }));
  const OLD = [[-11.5, -2.5, 7, 4.2, 4], [-2.8, -1.8, 5.8, 5, 3], [7, -2.6, 7.2, 4.4, 4]].map(([x, y, w, d, n], i) => ({ x, y, w, d, n, i, col: [[214, 190, 160], [200, 184, 168], [222, 200, 170]][i], tc: 23.6 + i * 0.75 }));
  const ctxB = [];
  for (let k = 0; k < 140; k++) {
    const x = -32 + rnd() * 64, y = -26 + rnd() * 52;
    if (Math.abs(x) < 17 && y > -7 && y < 6.5) continue;
    if (y > 6.6 && y < 9.4) continue; // road
    const w = 1.6 + rnd() * 3, d = 1.6 + rnd() * 3; const tree = rnd() < 0.3;
    ctxB.push({ x, y, w, d, h: tree ? 0 : 0.6 + rnd() * (rnd() < 0.15 ? 4 : 2), tree, c: [[188, 176, 160], [170, 165, 158], [200, 186, 166], [150, 160, 162]][Math.floor(rnd() * 4)] });
  }
  // debris + dust per old building
  for (const b of OLD) {
    b.deb = Array.from({ length: 46 }, () => ({ x: b.x + rnd() * b.w, y: b.y + rnd() * b.d, z: rnd() * b.n * 0.7, vx: (rnd() - 0.5) * 7, vy: (rnd() - 0.5) * 7, vz: 2 + rnd() * 6, s: 0.12 + rnd() * 0.3, r: rnd() * 6, dt: rnd() * 0.9 }));
    b.dust = Array.from({ length: 70 }, () => ({ x: b.x + rnd() * b.w, y: b.y + rnd() * b.d, vx: (rnd() - 0.5) * 3.2, vy: (rnd() - 0.5) * 3.2, vz: 0.4 + rnd() * 2.4, r0: 0.4 + rnd() * 0.8, dt: rnd() * 1.2, a: 0.25 + rnd() * 0.35 }));
    b.flash = Array.from({ length: 5 }, (_, k) => ({ x: b.x + (k + 0.5) * b.w / 5, y: b.y + (k % 2 ? 0 : b.d), dt: k * 0.07 }));
  }
  const lit = TOWERS.map(() => Array.from({ length: (NF + 1) * 8 }, () => rnd()));

  // ---- camera ----
  let K, CX, CY, C, S;
  const P = (x, y, z) => { const rx = x * C - y * S, ry = x * S + y * C; return [CX + (rx - ry) * 0.866 * K, CY + (rx + ry) * 0.5 * K - z * K]; };
  const depth = (x, y) => (x * S + y * C) + (x * C - y * S);
  const poly = (pts, fill) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fillStyle = fill; g.fill(); };
  // returns visible side faces of an axis-aligned box: [{A,B,shade}] where A,B are the bottom edge endpoints (x,y)
  const faces = (x0, y0, x1, y1) => {
    const out = [];
    for (const [nx, ny, A, B] of [[1, 0, [x1, y0], [x1, y1]], [-1, 0, [x0, y1], [x0, y0]], [0, 1, [x1, y1], [x0, y1]], [0, -1, [x0, y0], [x1, y0]]]) {
      const rx = nx * C - ny * S, ry = nx * S + ny * C;
      if (rx + ry > 0.001) out.push({ A, B, f: 0.62 + 0.3 * clamp((rx - ry + 1.4) / 2.8) });
    }
    return out;
  };
  const box = (x0, y0, z0, x1, y1, z1, col, a = 1) => {
    for (const fc of faces(x0, y0, x1, y1)) poly([P(fc.A[0], fc.A[1], z0), P(fc.B[0], fc.B[1], z0), P(fc.B[0], fc.B[1], z1), P(fc.A[0], fc.A[1], z1)], rgb(col, fc.f, a));
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], rgb(col, 1.08, a));
  };
  const lerp2 = (A, B, u) => [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u];
  const facePanel = (fc, u0, u1, z0, z1, fill) => { const a = lerp2(fc.A, fc.B, u0), b = lerp2(fc.A, fc.B, u1); poly([P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)], fill); };

  window.drawConstruct = (t) => {
    const p = span(t, 21.6, 41.6);
    const th = -0.42 + 0.5 * easeIO(p);
    C = Math.cos(th); S = Math.sin(th);
    K = 31 + 10 * easeIO(span(t, 21.6, 34)) - 2 * easeIO(span(t, 36, 41.6));
    // camera shake during the collapse
    let sx = 0, sy = 0;
    for (const b of OLD) { const k = span(t, b.tc, b.tc + 0.12) * (1 - span(t, b.tc + 0.1, b.tc + 1.6)); sx += Math.sin(t * 71 + b.i) * 9 * k; sy += Math.cos(t * 59 + b.i * 2) * 7 * k; }
    CX = 960 + sx; CY = 660 + sy + 60 * easeIO(span(t, 30, 38));
    // sky
    const dusk = span(t, 33, 39);
    const sk = g.createLinearGradient(0, 0, 0, 1080);
    sk.addColorStop(0, rgb([22, 44, 56], 1 - 0.35 * dusk)); sk.addColorStop(0.45, rgb([70, 112, 122], 1 - 0.45 * dusk)); sk.addColorStop(0.75, rgb([220, 170, 130], 1 - 0.25 * dusk));
    g.fillStyle = sk; g.fillRect(0, 0, 1920, 1080);
    const sun = g.createRadialGradient(1500, 330, 0, 1500, 330, 520); sun.addColorStop(0, `rgba(255,214,160,${0.55 - 0.3 * dusk})`); sun.addColorStop(1, 'rgba(255,214,160,0)');
    g.fillStyle = sun; g.fillRect(0, 0, 1920, 1080);
    // ground
    poly([P(-60, -60, 0), P(60, -60, 0), P(60, 60, 0), P(-60, 60, 0)], rgb([58, 72, 70], 1 - 0.3 * dusk));
    poly([P(-18, -7, 0), P(18, -7, 0), P(18, 6.4, 0), P(-18, 6.4, 0)], rgb([92, 98, 90], 1 - 0.3 * dusk)); // site
    poly([P(-60, 6.8, 0), P(60, 6.8, 0), P(60, 9.2, 0), P(-60, 9.2, 0)], rgb([40, 44, 48], 1)); // Ben Gurion road
    g.strokeStyle = 'rgba(240,230,200,0.5)'; g.lineWidth = 2; g.setLineDash([14, 14]); g.beginPath(); const r0 = P(-60, 8, 0), r1 = P(60, 8, 0); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); g.stroke(); g.setLineDash([]);
    // excavation pits
    const dig = easeIO(span(t, 27.8, 30.2));
    for (const tw of TOWERS) if (dig > 0) {
      const inset = 0.3, x0 = tw.x - 0.6, y0 = tw.y - 0.6, x1 = tw.x + tw.w + 0.6, y1 = tw.y + tw.d + 0.6;
      poly([P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0)], rgb([74, 56, 40], 1, dig));
      poly([P(x0 + inset, y0 + inset, -1.2 * dig), P(x1 - inset, y0 + inset, -1.2 * dig), P(x1 - inset, y1 - inset, -1.2 * dig), P(x0 + inset, y1 - inset, -1.2 * dig)], rgb([46, 34, 24], 1, dig));
    }
    // ---- build draw list ----
    const items = [];
    for (const b of ctxB) items.push({ d: depth(b.x + b.w / 2, b.y + b.d / 2), f: () => {
      if (b.tree) { const q = P(b.x + 1, b.y + 1, 1.4); g.fillStyle = rgb([62, 98, 66], 1 - 0.35 * dusk); g.beginPath(); g.arc(q[0], q[1], 0.9 * K, 0, 6.283); g.fill(); return; }
      box(b.x, b.y, 0, b.x + b.w, b.y + b.d, b.h, b.c.map((v) => v * (1 - 0.35 * dusk)));
    } });
    for (const b of OLD) {
      const c = span(t, b.tc + 0.15, b.tc + 1.5); if (c >= 1) continue;
      items.push({ d: depth(b.x + b.w / 2, b.y + b.d / 2), f: () => {
        const H = b.n * 0.7 * (1 - easeIn(c)); const tilt = Math.sin(c * 3) * 0.35 * c;
        for (let k = 0; k < b.n; k++) {
          const z0 = Math.min(H, k * 0.7), z1 = Math.min(H, (k + 1) * 0.7); if (z1 - z0 < 0.02) continue;
          const dx = tilt * k * 0.4;
          box(b.x + dx, b.y, z0, b.x + b.w + dx, b.y + b.d, z1, b.col);
          for (const fc of faces(b.x + dx, b.y, b.x + b.w + dx, b.y + b.d)) for (let u = 0; u < 5; u++) facePanel(fc, 0.08 + u * 0.18, 0.18 + u * 0.18, z0 + 0.22 * (z1 - z0), z0 + 0.7 * (z1 - z0), 'rgba(60,70,80,0.75)');
        }
        // red tiled roof
        if (H > 0.2) poly([P(b.x, b.y, H), P(b.x + b.w, b.y, H), P(b.x + b.w, b.y + b.d, H), P(b.x, b.y + b.d, H)], rgb([176, 92, 66], 1));
      } });
    }
    // towers: skeleton floors pop in, cladding follows
    for (const tw of TOWERS) {
      const st = 30.2 + tw.i * 0.55, dt = 0.4;
      for (let k = 0; k <= NF; k++) {
        const ts = st + k * dt, tc = ts + 1.5;
        if (t < ts) break;
        const z0 = k === 0 ? 0 : GH + (k - 1) * FH, h = k === 0 ? GH : FH;
        const drop = (1 - ease(span(t, ts, ts + 0.32))) * 2.2, a = span(t, ts, ts + 0.2);
        const x0 = tw.x, y0 = tw.y, x1 = tw.x + tw.w, y1 = tw.y + tw.d, zz = z0 + drop;
        items.push({ d: depth(tw.x + tw.w / 2, tw.y + tw.d / 2) + k * 0.0001, f: () => {
          const clad = span(t, tc, tc + 0.5);
          if (clad < 1) { // concrete skeleton
            const con = [150, 152, 150];
            box(x0 + 1.6, y0 + 1.5, zz, x1 - 1.6, y1 - 1.5, zz + h, con, a);
            for (const [cx, cy] of [[x0, y0], [x1 - 0.3, y0], [x0, y1 - 0.3], [x1 - 0.3, y1 - 0.3], [x0 + 2.35, y0], [x0 + 2.35, y1 - 0.3]]) box(cx, cy, zz, cx + 0.3, cy + 0.3, zz + h - 0.1, con, a);
            box(x0 - 0.15, y0 - 0.15, zz + h - 0.12, x1 + 0.15, y1 + 0.15, zz + h, [176, 176, 172], a);
          }
          if (clad > 0) { // facade
            const base = k === 0 ? [70, 96, 108] : [236, 238, 238];
            box(x0, y0, zz, x1, y1, zz + h, base, clad);
            for (const fc of faces(x0, y0, x1, y1)) {
              if (k === 0) { facePanel(fc, 0.05, 0.95, zz + 0.1, zz + h - 0.15, rgb([120, 170, 190], fc.f, 0.8 * clad)); continue; }
              const L = lit[tw.i][k * 8 + (fc.A[0] > tw.x + 0.1 ? 1 : 0)];
              const on = span(t, 37 + L * 3, 37.4 + L * 3);
              facePanel(fc, 0.06, 0.94, zz + 0.12, zz + 0.5, rgb([90 + 165 * on, 130 + 80 * on, 160 - 20 * on], fc.f, clad));
              facePanel(fc, 0, 1, zz + h - 0.07, zz + h, rgb([255, 255, 255], 1, clad));
            }
          }
        } });
      }
      // roof crown once complete
      const done = span(t, st + NF * dt + 1.5, st + NF * dt + 2.1);
      if (done > 0) { const zt = GH + (NF - 1) * FH + FH; items.push({ d: depth(tw.x + tw.w / 2, tw.y + tw.d / 2) + 0.01, f: () => box(tw.x + 0.6, tw.y + 0.6, zt, tw.x + tw.w - 0.6, tw.y + tw.d - 0.6, zt + 0.5 * done, [230, 232, 232]) }); }
    }
    // cranes
    const cr = easeIO(span(t, 29.4, 31)) * (1 - easeIO(span(t, 37.8, 39.4)));
    if (cr > 0) TOWERS.forEach((tw) => {
      const mx = tw.x + tw.w + 0.9, my = tw.y + tw.d / 2, top = (GH + NF * FH + 3.2) * cr;
      items.push({ d: depth(mx, my) + 0.02, f: () => {
        const yel = [238, 180, 52];
        box(mx, my, 0, mx + 0.42, my + 0.42, top, yel, cr);
        const ang = 1.1 + tw.i * 1.3 + (t - 29) * 0.22 * (tw.i % 2 ? -1 : 1);
        const tip = [mx + 0.21 + Math.cos(ang) * 8, my + 0.21 + Math.sin(ang) * 8], back = [mx + 0.21 - Math.cos(ang) * 3, my + 0.21 - Math.sin(ang) * 3];
        const a0 = P(back[0], back[1], top), a1 = P(tip[0], tip[1], top);
        g.strokeStyle = rgb(yel, 1, cr); g.lineWidth = 0.16 * K; g.beginPath(); g.moveTo(a0[0], a0[1]); g.lineTo(a1[0], a1[1]); g.stroke();
        const pk = P(mx + 0.21, my + 0.21, top + 1.4); g.lineWidth = 2; g.beginPath(); g.moveTo(a0[0], a0[1]); g.lineTo(pk[0], pk[1]); g.lineTo(a1[0], a1[1]); g.stroke();
        box(back[0] - 0.4, back[1] - 0.4, top - 0.5, back[0] + 0.4, back[1] + 0.4, top, [120, 120, 120], cr);
        const hu = 0.55 + 0.25 * Math.sin(t * 1.7 + tw.i), hp = lerp2([mx + 0.21, my + 0.21], tip, hu), hz = top - 2 - 2.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + tw.i * 2));
        const c0 = P(hp[0], hp[1], top), c1 = P(hp[0], hp[1], hz);
        g.strokeStyle = `rgba(30,30,30,${cr})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(c0[0], c0[1]); g.lineTo(c1[0], c1[1]); g.stroke();
        g.fillStyle = rgb([150, 150, 150], 1, cr); g.fillRect(c1[0] - 0.4 * K, c1[1], 0.8 * K, 0.35 * K);
        // red aviation light
        if (Math.sin(t * 6 + tw.i) > 0) { g.fillStyle = 'rgba(255,60,50,0.95)'; g.beginPath(); g.arc(pk[0], pk[1], 5, 0, 6.283); g.fill(); }
      } });
    });
    items.sort((a, b) => a.d - b.d).forEach((it) => it.f());

    // ---- effects ----
    for (const b of OLD) {
      // charges
      for (const fl of b.flash) {
        const k = span(t, b.tc + fl.dt, b.tc + fl.dt + 0.08) * (1 - span(t, b.tc + fl.dt + 0.08, b.tc + fl.dt + 0.5));
        if (k <= 0) continue; const q = P(fl.x, fl.y, 0.4);
        const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], 3.2 * K); gr.addColorStop(0, `rgba(255,250,220,${k})`); gr.addColorStop(0.25, `rgba(255,170,60,${0.85 * k})`); gr.addColorStop(1, 'rgba(255,120,30,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], 3.2 * K, 0, 6.283); g.fill();
      }
      // debris
      for (const d of b.deb) {
        const tt = t - b.tc - 0.15 - d.dt * 0.5; if (tt < 0 || tt > 2.4) continue;
        const z = Math.max(0, d.z + d.vz * tt - 9.8 * tt * tt * 0.5); const q = P(d.x + d.vx * tt * 0.6, d.y + d.vy * tt * 0.6, z);
        g.save(); g.translate(q[0], q[1]); g.rotate(d.r + tt * 8); g.fillStyle = rgb([150, 130, 110], 1, 1 - span(tt, 1.8, 2.4)); const s = d.s * K; g.fillRect(-s / 2, -s / 2, s, s * 0.7); g.restore();
      }
      // dust clouds
      for (const d of b.dust) {
        const tt = t - b.tc - 0.1 - d.dt * 0.6; if (tt < 0 || tt > 7) continue;
        const gr0 = 1 - Math.exp(-tt * 1.1);
        const q = P(d.x + d.vx * gr0 * 2.2, d.y + d.vy * gr0 * 2.2, d.vz * gr0 * 2.4), r = (d.r0 + gr0 * 3.4) * K;
        const al = d.a * span(tt, 0, 0.25) * (1 - span(tt, 2.5, 7));
        const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], r); gr.addColorStop(0, `rgba(205,190,168,${al})`); gr.addColorStop(1, 'rgba(205,190,168,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], r, 0, 6.283); g.fill();
      }
    }
    // welding sparks on the rising floors
    if (t > 30.5 && t < 38.6) TOWERS.forEach((tw) => {
      const st = 30.2 + tw.i * 0.55, k = clamp(Math.floor((t - st) / 0.4), 0, NF), z = k === 0 ? 0.5 : GH + (k - 1) * FH + 0.3;
      for (let s = 0; s < 14; s++) {
        const ph = ((t * 2.3 + s * 0.37 + tw.i * 0.21) % 1), ang = s * 2.4 + tw.i;
        const q = P(tw.x + tw.w * (0.2 + 0.6 * ((s * 0.618) % 1)), tw.y, z);
        const x = q[0] + Math.cos(ang) * ph * 40, y = q[1] - 10 + ph * ph * 60 - Math.sin(ang) * ph * 20;
        g.fillStyle = `rgba(255,${200 + 55 * (1 - ph)},120,${(1 - ph) * 0.9})`; g.fillRect(x, y, 3, 3);
      }
    });
    // final glow + vignette
    const glow = span(t, 38.4, 40.4);
    if (glow > 0) { const q = P(0, 0, 5); const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], 900); gr.addColorStop(0, `rgba(255,220,170,${0.25 * glow})`); gr.addColorStop(1, 'rgba(255,220,170,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080); }
    const vg = g.createRadialGradient(960, 540, 400, 960, 540, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = vg; g.fillRect(0, 0, 1920, 1080);
  };
})();
