"""Build the English and French versions of the project pages from their Hebrew sources.

Run from the project root:  python3 tools/build_projects.py
Pages (Hebrew source -> table key in tools/i18n_projects.py):
  projects/azure.html        -> 'azure'          (project landing page)
  present/azure/index.html   -> 'present-azure'  (project presentation app)
- Adds the language switcher and hreflang links to every language of every page.
- Writes en/<source path> and fr/<source path>.
- Translates with the page's own table, then the shared rows (COMMON), then the home table
  (tools/i18n_home.py) for everything the page shares with the home page.
- Fails loudly if a string of the page's own table is no longer found, or if any Hebrew is left.
Run it after any Hebrew change to one of these pages, and after tools/build_i18n.py.
"""
import re, sys, os, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from i18n_home import T as HOME
from i18n_projects import COMMON, PROJECTS
from build_i18n import french_typography, HE_RE

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {'projects/azure.html': 'azure', 'present/azure/index.html': 'present-azure'}
NAMES = [('he', 'עב', 'עברית'), ('en', 'EN', 'English'), ('fr', 'FR', 'Français')]
LABEL = {'he': 'שפה', 'en': 'Language', 'fr': 'Langue'}
ROOT_FILES = r'(assets/|index\.html|privacy\.html|accessibility\.html|terms\.html)'
ATTR = r'((?:href|src|srcset|poster)="|, )'

def file_for(lang, src):
    return src if lang == 'he' else f'{lang}/{src}'

def href(page, target, src):
    rel = os.path.relpath(file_for(target, src), os.path.dirname(file_for(page, src)) or '.')
    return rel.replace(os.sep, '/')

def chrome(s, page, src):
    s = re.sub(r'\s*<nav class="lang".*?</nav>', '', s, flags=re.S)
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', s)
    links = ''.join(
        f'<a href="{href(page, c, src)}" hreflang="{c}" lang="{c}"{" aria-current=\"true\"" if c == page else ""}>'
        f'<span aria-hidden="true">{short}</span><span class="sr">{full}</span></a>' for c, short, full in NAMES)
    nav = f'<nav class="lang" aria-label="{LABEL[page]}" style="margin-inline-start:auto">{links}</nav>'
    if '<!-- lang -->' in s:
        s = s.replace('<!-- lang -->', '<!-- lang -->' + nav, 1)
    else:
        s = s.replace('      <a class="btn btn--small" href="#contact">', f'      {nav}\n      <a class="btn btn--small" href="#contact">', 1)
    alts = [f'<link rel="alternate" hreflang="{c}" href="{href(page, c, src)}">' for c, _, _ in NAMES]
    alts.append(f'<link rel="alternate" hreflang="x-default" href="{href(page, "he", src)}">')
    return s.replace('  <link rel="icon"', '  ' + '\n  '.join(alts) + '\n  <link rel="icon"', 1)

def build(lang, he, src, key):
    col = 1 if lang == 'en' else 2
    depth = src.count('/')
    # Work with the root-relative paths the home table was written for, then point them one level deeper.
    s = re.sub(ATTR + re.escape('../' * depth) + ROOT_FILES, r'\1\2', he)
    missing = [row[0][:70] for row in PROJECTS[key] if len(row) < 4 and row[0] not in s]
    if missing:
        sys.exit(f'[{lang}] {src}: strings not found:\n  ' + '\n  '.join(missing))
    for row in PROJECTS[key] + COMMON + HOME:
        s = s.replace(row[0], row[col])
    # Shared files (assets/) sit one level further up; pages link to the same language's version.
    s = re.sub(ATTR + r'(assets/)', r'\1' + '../' * (depth + 1) + r'\2', s)
    s = re.sub(ATTR + r'(index\.html|privacy\.html|accessibility\.html|terms\.html)', r'\1' + '../' * depth + r'\2', s)
    s = chrome(s, lang, src)
    if lang == 'fr':
        s = french_typography(s)
    check = re.sub(r'<nav class="lang".*?</nav>', '', s, flags=re.S)
    left = [l.strip()[:90] for l in check.split('\n') if HE_RE.search(l)]
    if left:
        sys.exit(f'[{lang}] {src}: untranslated Hebrew left:\n  ' + '\n  '.join(left))
    out = ROOT / file_for(lang, src)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(s, encoding='utf-8')
    print(f'{lang}: {out.relative_to(ROOT)} written')

def main():
    for src, key in PAGES.items():
        path = ROOT / src
        he = chrome(path.read_text(encoding='utf-8'), 'he', src)
        path.write_text(he, encoding='utf-8')
        print(f'he: {src} switcher and alternates in place')
        for lang in ('en', 'fr'):
            build(lang, he, src, key)

if __name__ == '__main__':
    main()
