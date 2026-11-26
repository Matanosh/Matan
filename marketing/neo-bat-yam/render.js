// Renders film.html frame by frame to JPEGs, then encodes the MP4 with the voiceover and music.
// Usage: node render.js <outdir> [fps] [onlyTimes,comma,separated | -]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const out = path.resolve(process.argv[2]); const fps = +(process.argv[3] || 30);
  const only = process.argv[4] && process.argv[4] !== '-' ? process.argv[4].split(',').map(Number) : null;
  const shard = +(process.argv[5] || 0), shards = +(process.argv[6] || 1);
  fs.mkdirSync(out, { recursive: true });
  // frame sequences of the generated clips, and the voiceover word timings for captions
  const media = {};
  const fdir = path.join(__dirname, process.env.LAND === '1' ? 'frames-land' : 'frames');
  if (fs.existsSync(fdir)) for (const d of fs.readdirSync(fdir)) media[d] = fs.readdirSync(path.join(fdir, d)).filter((f) => f.endsWith('.jpg')).length;
  const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/words-long.json'), 'utf8')).words.filter((w) => !w.type || w.type === 'word');
  const land = process.env.LAND === '1';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: land ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const timeline = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/timeline.json'), 'utf8'));
  await p.addInitScript(([m, w, tl]) => { window.MEDIA = m; window.WORDS = w; window.TIMELINE = tl; }, [media, words, timeline]);
  await p.goto('file://' + path.join(__dirname, 'film.html') + (land ? '?land=1' : ''), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => window.TOTAL);
  const times = only || Array.from({ length: Math.round(total * fps) }, (_, i) => i / fps);
  for (let i = 0; i < times.length; i++) {
    if (!only && i % shards !== shard) continue;
    await p.evaluate((t) => window.render(t), times[i]);
    await p.evaluate(() => Promise.all([...document.images].map((im) => (im.complete && im.naturalWidth ? 0 : im.decode().catch(() => 0)))));
    if (!only) await p.evaluate((t) => window.render(t), times[i]); // re-place images whose size was unknown before decode
    await p.screenshot({ path: path.join(out, (only ? 's' : 'f') + String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    if (i % 150 === 0) console.log('frame', i, '/', times.length);
  }
  await b.close();
  if (!only && shards === 1) {
    const mix = path.join(__dirname, 'src/mix.wav');
    const audio = fs.existsSync(mix) ? mix : path.join(__dirname, 'src/vo-long.wav');
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(out, 'f%05d.jpg'), '-i', audio,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(out, 'film.mp4')]);
  }
  console.log('done', times.length);
})();
