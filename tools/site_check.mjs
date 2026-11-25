// Pre-publish browser check for the site, in all three languages, phone and desktop.
// Run from the project root:  node tools/site_check.mjs
//
// For every page in PAGES x every language x {phone, desktop} it checks:
//   - the page loads with no JavaScript errors and no broken local files (404s)
//   - nothing sticks out sideways (no horizontal page scroll)
//   - the phone menu opens and closes after scrolling down (lesson of 2026-11-15)
//   - accessibility (axe-core), when axe-core is installed; otherwise it says so
// Screenshots go to .cache/site-check/ (ignored by git). Exits 1 if anything fails.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); // the global install, found via NODE_PATH
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.cache', 'site-check');
const LANGS = { he: '', en: 'en/', fr: 'fr/' };
const PAGES = ['index.html', 'privacy.html', 'terms.html', 'accessibility.html'];
const SIZES = { phone: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };

// axe-core is optional: look in the project, then in .cache/node (where /ship installs it).
let axeSource = null;
for (const base of [ROOT, path.join(ROOT, '.cache', 'node')]) {
  try {
    const req = createRequire(path.join(base, 'package.json'));
    axeSource = await readFile(req.resolve('axe-core/axe.min.js'), 'utf8');
    break;
  } catch {}
}

const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(ROOT, p.endsWith('/') ? p + 'index.html' : p);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];
let checks = 0;

for (const [lang, dir] of Object.entries(LANGS)) {
  for (const page of PAGES) {
    for (const [size, viewport] of Object.entries(SIZES)) {
      const label = `${lang} ${dir}${page} @${size}`;
      const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const tab = await ctx.newPage();
      const errs = [];
      tab.on('pageerror', e => errs.push(`JavaScript error: ${e.message}`));
      tab.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) errs.push(`missing file ${r.status()}: ${r.url().slice(base.length)}`); });
      try {
        await tab.goto(base + dir + page, { waitUntil: 'load' });
        await tab.waitForTimeout(300);

        const overflow = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) errs.push(`page scrolls sideways by ${overflow}px`);

        if (size === 'phone' && await tab.locator('[data-menu-toggle]').count()) {
          await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
          await tab.waitForTimeout(300);
          const toggle = tab.locator('[data-menu-toggle]').first();
          if (!(await toggle.isVisible())) errs.push('phone menu button is not visible after scrolling');
          else {
            await toggle.click();
            await tab.waitForTimeout(400);
            if (!(await tab.locator('[data-menu]').first().isVisible())) errs.push('phone menu did not open after scrolling');
            else {
              await tab.screenshot({ path: path.join(OUT, `${lang}-${page.replace('.html', '')}-${size}-menu.png`) });
              await toggle.click({ force: true }).catch(() => {});
              await tab.waitForTimeout(400);
              if (await tab.locator('[data-menu]').first().isVisible()) errs.push('phone menu did not close again');
            }
          }
          await tab.evaluate(() => window.scrollTo(0, 0));
        }

        await tab.screenshot({ path: path.join(OUT, `${lang}-${page.replace('.html', '')}-${size}.png`) });

        if (axeSource) {
          await tab.addScriptTag({ content: axeSource });
          const v = await tab.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
            .filter(x => x.impact === 'serious' || x.impact === 'critical')
            .map(x => `${x.impact}: ${x.id} (${x.nodes.length}x) ${x.help}`));
          v.forEach(x => errs.push(`accessibility ${x}`));
        }
      } catch (e) { errs.push(`could not check: ${e.message.split('\n')[0]}`); }
      checks++;
      if (errs.length) problems.push(`${label}\n    - ${errs.join('\n    - ')}`);
      await ctx.close();
    }
  }
}
await browser.close();
server.close();

console.log(`site check: ${checks} page/size combinations in he, en, fr`);
console.log(axeSource ? 'accessibility (axe-core): checked, serious and critical issues only'
                      : 'accessibility (axe-core): SKIPPED, axe-core is not installed (see /ship)');
console.log(`screenshots: ${path.relative(ROOT, OUT)}/`);
if (problems.length) { console.log(`\nFAILED (${problems.length}):\n  ` + problems.join('\n  ')); process.exit(1); }
console.log('all checks passed');
