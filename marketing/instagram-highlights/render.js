// Renders one Instagram highlight cover (1080x1920 PNG) per project, in the same colors as the site's project badges.
// Instagram shows the middle of the image inside the highlight circle, so the name sits in the center.
const { chromium } = require('playwright');
const path = require('path');

const P = [
  ['sora', 'SORA', '#1d7286'], ['bay', 'BAY', '#2b4c96'], ['one-central', 'ONE', '#4a4a55'],
  ['azure', 'AZURE', '#1a6fa8'], ['omya', 'OMYA', '#a5532c'], ['voxa', 'VOXA', '#5f3a94'], ['linea', 'LINEA', '#2c6449'],
  ['blue-sky', 'BLUE<br>SKY', '#2f68b8'], ['laquinta', 'LA<br>QUINTA', '#9a3434'], ['salami', 'SALAMI', '#9a6a1c'],
  ['gonio', 'GONIO', '#2e7a5c'], ['pontus', 'PONTUS', '#233f73'],
  ['best-residence', 'BEST', '#842c50'], ['almeda', 'ALMEDA', '#b0542e'], ['unity', 'UNITY', '#2c56a0'],
  ['gale', 'GALE', '#b2443f'], ['e11even', 'E11EVEN', '#26262b'],
  ['azura', 'AZURA', '#b5602f'], ['hills', 'HILLS', '#5a6b2c'], ['nami', 'NAMI', '#1f7a86'],
  ['silicon', 'SILICON', '#4447a8'], ['waves', 'WAVES', '#1f62a0'], ['navarre', 'NAVARRE', '#80562f'],
  ['metropolitan', 'METRO', '#72293a'],
];

const page = (mark, c) => {
  const n = Math.max(...mark.split('<br>').map((s) => s.length));
  const fs = Math.min(Math.round(1250 / n), 300);
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1080px;height:1920px}
body{display:grid;place-items:center;
background:radial-gradient(70% 40% at 35% 38%,rgba(255,255,255,.28),transparent 60%),
linear-gradient(160deg,color-mix(in oklab,${c} 78%,#fff),${c} 50%,color-mix(in oklab,${c} 68%,#000))}
div{font:700 ${fs}px/1.05 "Frank Ruhl Libre",Georgia,serif;letter-spacing:.06em;color:#fff;text-align:center;
text-shadow:0 4px 12px rgba(0,0,0,.3)}
</style></head><body><div>${mark}</div></body></html>`;
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [id, mark, c] of P) {
    await p.setContent(page(mark, c), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(__dirname, `${id}.png`) });
  }
  await b.close();
})();
