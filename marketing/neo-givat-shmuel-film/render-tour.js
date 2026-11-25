// Renders film.html frame by frame (parallel workers) and encodes an MP4 with the music track.
// Usage: node render.js <outdir> [fps] [onlyTimes,comma,separated|-] [workers]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const out = path.resolve(process.argv[2]); const fps = +(process.argv[3] || 30);
  const only = process.argv[4] && process.argv[4] !== '-' ? process.argv[4].split(',').map(Number) : null; const W = +(process.argv[5] || 4);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const open = async () => { const p = await b.newPage({ viewport: { width: +(process.env.VW || 1920), height: +(process.env.VH || 1080) }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.join(__dirname, process.env.PAGE || 'film.html') + (process.env.QS || ''), { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); return p; };
  const first = await open(); const total = await first.evaluate(() => window.TOTAL);
  const times = only || Array.from({ length: Math.round(total * fps) }, (_, i) => i / fps);
  const pages = [first, ...(await Promise.all(Array.from({ length: (only ? 1 : W) - 1 }, open)))];
  await Promise.all(pages.map(async (p, w) => {
    for (let i = w; i < times.length; i += pages.length) {
      await p.evaluate(async (t) => { await window.render(t); }, times[i]);
      await p.screenshot({ path: path.join(out, (only ? 's' : 'f') + String(i).padStart(5, '0') + (only ? '.png' : '.jpg')), ...(only ? {} : { type: 'jpeg', quality: 93 }) });
    }
  }));
  await b.close();
  if (!only) {
    const music = process.env.AUDIO || path.join(__dirname, 'music.wav'); const args = ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(out, 'f%05d.jpg')];
    if (fs.existsSync(music)) args.push('-i', music, '-c:a', 'aac', '-b:a', '256k', '-shortest');
    args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', path.join(out, 'film.mp4'));
    execFileSync('ffmpeg', args);
  }
  console.log('done', times.length);
})();
