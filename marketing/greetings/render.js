// Render every greeting page built by build.py into a PNG.
//   <slug>.html       -> <slug>-msgroup.png         (1080x1350)
//   <slug>-story.html -> <slug>-msgroup-status.png  (1080x1920)
// Usage: node render.js [slug ...]   (no arguments renders all)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const only = process.argv.slice(2);
  const pages = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
    .filter(n => !only.length || only.includes(n.replace(/-story$/, '')));
  const browser = await chromium.launch();
  for (const name of pages) {
    const story = name.endsWith('-story');
    const slug = name.replace(/-story$/, '');
    const page = await browser.newPage({ viewport: { width: 1080, height: story ? 1920 : 1350 } });
    await page.goto('file://' + path.join(__dirname, name + '.html'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const out = `${slug}-msgroup${story ? '-status' : ''}.png`;
    await page.screenshot({ path: path.join(__dirname, out) });
    await page.close();
    console.log('rendered', out);
  }
  await browser.close();
})();
