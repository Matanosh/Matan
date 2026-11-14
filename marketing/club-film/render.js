// Renders film.html frame by frame to PNGs, then encodes an MP4 with ffmpeg.
// Usage: node render.js <outdir> [fps] [onlyTimes,comma,separated]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const out = process.argv[2]; const fps = +(process.argv[3] || 30); const only = process.argv[4];
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'film.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => window.TOTAL);
  const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(total * fps) }, (_, i) => i / fps);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate((t) => window.render(t), times[i]);
    await p.screenshot({ path: path.join(out, (only ? 's' : 'f') + String(i).padStart(4, '0') + '.png') });
  }
  await b.close();
  if (!only) execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(out, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', path.join(out, 'film.mp4')]);
  console.log('done', times.length);
})();
