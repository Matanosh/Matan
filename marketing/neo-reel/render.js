// Renders film.html (1080x1920) frame by frame with Playwright, then encodes an MP4 with ffmpeg.
// Usage: node render.js <outdir> [fps=30]            full film -> <outdir>/neo-reel.mp4
//        node render.js <outdir> stills 3,10.5,47      check stills -> <outdir>/s00_3.png ...
// Same pipeline as marketing/club-film/render.js. AI shots play from frames pre-extracted by
// video/extract-frames.sh (run it first): window.render(t) returns a promise that settles once
// every visible frame image has decoded, so each screenshot is frame-accurate.
// Encode is capped at 5 Mbit/s so the final film stays under 60 MB.
// Uses $HTTPS_PROXY for Google Fonts when set. WORKERS=n sets parallel browser pages (default 4).
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { execFileSync } = require('child_process');

async function openPage(browser) {
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'film.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fonts = await p.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
  if (!fonts.some((f) => /Heebo/.test(f)) || !fonts.some((f) => /Frank/.test(f))) throw new Error('fonts did not load: ' + fonts.join(','));
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await p.evaluate(() => Promise.all(window.__videos().map((v) => v.readyState >= 2 ? 0 : new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); v.addEventListener('error', r, { once: true }); }))));
  return p;
}

(async () => {
  const out = path.resolve(process.argv[2] || 'out'); fs.mkdirSync(out, { recursive: true });
  const stills = process.argv[3] === 'stills';
  const fps = stills ? 30 : +(process.argv[3] || 30);
  const launch = process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {};
  const browser = await chromium.launch(launch);
  let jobs;
  const first = await openPage(browser);
  if (stills) jobs = process.argv[4].split(',').map((t, i) => [+t, 's' + String(i).padStart(2, '0') + '_' + t + '.png']);
  else { const n = Math.round(await first.evaluate(() => window.TOTAL) * fps); jobs = Array.from({ length: n }, (_, i) => [i / fps, 'f' + String(i).padStart(5, '0') + '.png']); }
  const workers = stills ? 1 : +(process.env.WORKERS || 4);
  const pages = [first]; for (let i = 1; i < workers; i++) pages.push(await openPage(browser));
  let next = 0, done = 0;
  await Promise.all(pages.map(async (p) => {
    while (next < jobs.length) {
      const [t, name] = jobs[next++];
      await p.evaluate((t) => window.render(t), t);
      await p.screenshot({ path: path.join(out, name), type: 'png' });
      if (++done % 300 === 0) console.log(done + '/' + jobs.length);
    }
  }));
  await browser.close();
  if (!stills) {
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(out, 'f%05d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-maxrate', '5M', '-bufsize', '10M', '-preset', 'slow', '-profile:v', 'high', '-movflags', '+faststart', path.join(out, 'neo-reel.mp4')]);
  }
  console.log('done', jobs.length);
})().catch((e) => { console.error(e); process.exit(1); });
