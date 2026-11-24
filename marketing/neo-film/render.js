// Renders film.html frame by frame to PNGs (1920x1080).
// Usage: node render.js <outdir> <fps> <startFrame> <endFrame>   (frames named f%05d.png)
//        node render.js <outdir> stills <t1,t2,...>               (quick check stills)
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'film.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
  let jobs;
  if (process.argv[3] === 'stills') jobs = process.argv[4].split(',').map((t, i) => [+t, 's' + String(i).padStart(2, '0') + '_' + t + '.png']);
  else { const fps = +process.argv[3], a = +process.argv[4], e = +process.argv[5];
    jobs = []; for (let i = a; i < e; i++) jobs.push([i / fps, 'f' + String(i).padStart(5, '0') + '.png']); }
  for (const [t, name] of jobs) { await p.evaluate((t) => window.render(t), t); await p.screenshot({ path: path.join(out, name), type: 'png' }); }
  await b.close(); console.log('done', jobs.length);
})();
