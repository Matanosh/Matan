"""Build the English and French project landing pages from the Hebrew sources in projects/.

Run from the project root:  python3 tools/build_projects.py
- Adds the language switcher and hreflang links to every language of every project page.
- Writes en/projects/<name>.html and fr/projects/<name>.html.
- Translates with the project table (tools/i18n_projects.py), then with the home table
  (tools/i18n_home.py) for everything the page shares with the home page.
- Fails loudly if a project string is no longer found or if any Hebrew is left untranslated.
Run it after any Hebrew change to a project page, and after tools/build_i18n.py.
"""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from i18n_home import T as HOME
from i18n_projects import COMMON, PROJECTS
from build_i18n import french_typography, HE_RE

ROOT = pathlib.Path(__file__).resolve().parent.parent
NAMES = [('he', 'עב', 'עברית'), ('en', 'EN', 'English'), ('fr', 'FR', 'Français')]
LABEL = {'he': 'שפה', 'en': 'Language', 'fr': 'Langue'}

def href(page, target, name):
    if page == 'he':
        return f'{name}.html' if target == 'he' else f'../{target}/projects/{name}.html'
    if target == 'he':
        return f'../../projects/{name}.html'
    return f'{name}.html' if target == page else f'../../{target}/projects/{name}.html'

def chrome(s, page, name):
    s = re.sub(r'\s*<nav class="lang".*?</nav>', '', s, flags=re.S)
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', s)
    links = ''.join(
        f'<a href="{href(page, c, name)}" hreflang="{c}" lang="{c}"{" aria-current=\"true\"" if c == page else ""}>'
        f'<span aria-hidden="true">{short}</span><span class="sr">{full}</span></a>' for c, short, full in NAMES)
    nav = f'<nav class="lang" aria-label="{LABEL[page]}" style="margin-inline-start:auto">{links}</nav>'
    s = s.replace('      <a class="btn btn--small" href="#contact">', f'      {nav}\n      <a class="btn btn--small" href="#contact">', 1)
    alts = [f'<link rel="alternate" hreflang="{c}" href="{href(page, c, name)}">' for c, _, _ in NAMES]
    alts.append(f'<link rel="alternate" hreflang="x-default" href="{href(page, "he", name)}">')
    return s.replace('  <link rel="icon"', '  ' + '\n  '.join(alts) + '\n  <link rel="icon"', 1)

def build(lang, he, name):
    col = 1 if lang == 'en' else 2
    # Work with the paths the home table was written for, then point them one level deeper.
    s = re.sub(r'((?:href|src|srcset|poster)="|, )\.\./', r'\1', he)
    missing = [row[0][:70] for row in COMMON + PROJECTS[name] if row[0] not in s]
    if missing:
        sys.exit(f'[{lang}] {name}: strings not found in projects/{name}.html:\n  ' + '\n  '.join(missing))
    for row in COMMON + PROJECTS[name] + HOME:
        s = s.replace(row[0], row[col])
    s = re.sub(r'((?:href|src|srcset|poster)="|, )(assets/|index\.html|privacy\.html|accessibility\.html|terms\.html)', r'\1../\2', s)
    s = re.sub(r'((?:href|src|srcset|poster)="|, )\.\./assets/', r'\1../../assets/', s)
    s = chrome(s, lang, name)
    if lang == 'fr':
        s = french_typography(s)
    check = re.sub(r'<nav class="lang".*?</nav>', '', s, flags=re.S)
    left = [l.strip()[:90] for l in check.split('\n') if HE_RE.search(l)]
    if left:
        sys.exit(f'[{lang}] {name}: untranslated Hebrew left:\n  ' + '\n  '.join(left))
    out = ROOT / lang / 'projects' / f'{name}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(s, encoding='utf-8')
    print(f'{lang}: {out.relative_to(ROOT)} written')

def main():
    for name in PROJECTS:
        path = ROOT / 'projects' / f'{name}.html'
        he = chrome(path.read_text(encoding='utf-8'), 'he', name)
        path.write_text(he, encoding='utf-8')
        print(f'he: projects/{name}.html switcher and alternates in place')
        for lang in ('en', 'fr'):
            build(lang, he, name)

if __name__ == '__main__':
    main()
