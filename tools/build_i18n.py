"""Build the English and French homepages from the Hebrew source (index.html).

Run from the project root:  python3 tools/build_i18n.py
- Adds the language switcher to the Hebrew page (once).
- Writes en/index.html and fr/index.html, translated with tools/i18n_home.py.
- Fails loudly if a Hebrew string in the table is no longer found, or if any
  Hebrew text is left untranslated, so the three languages never drift apart.
"""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from i18n_home import T, HEAD, STATEMENT_EM, NB, NN
import social_meta

ROOT = pathlib.Path(__file__).resolve().parent.parent
HE_RE = re.compile('[֐-׿]')

LABEL = {'he': 'שפה', 'en': 'Language', 'fr': 'Langue'}
NAMES = [('he', 'עב', 'עברית'), ('en', 'EN', 'English'), ('fr', 'FR', 'Français')]
HREF = {  # page language -> target language -> relative href
    'he': {'he': 'index.html', 'en': 'en/index.html', 'fr': 'fr/index.html'},
    'en': {'he': '../index.html', 'en': 'index.html', 'fr': '../fr/index.html'},
    'fr': {'he': '../index.html', 'en': '../en/index.html', 'fr': 'index.html'},
}

def switcher(page, mobile=False):
    out = []
    for code, short, full in NAMES:
        cur = ' aria-current="true"' if code == page else ''
        inner = full if mobile else f'<span aria-hidden="true">{short}</span><span class="sr">{full}</span>'
        out.append(f'<a href="{HREF[page][code]}" hreflang="{code}" lang="{code}"{cur}>{inner}</a>')
    if mobile:
        return f'<div class="lang" role="group" aria-label="{LABEL[page]}">' + ''.join(out) + '</div>'
    return f'<nav class="lang" aria-label="{LABEL[page]}">' + ''.join(out) + '</nav>'

def alternates(page):
    # Relative for now; switch to absolute URLs once the site has its own domain.
    links = [f'<link rel="alternate" hreflang="{c}" href="{HREF[page][c]}">' for c, _, _ in NAMES]
    links.append(f'<link rel="alternate" hreflang="x-default" href="{HREF[page]["he"]}">')
    return '\n  '.join(links)

def add_chrome(s, page):
    s = re.sub(r'\s*<nav class="lang".*?</nav>', '', s, flags=re.S)
    s = re.sub(r'\s*<div class="lang" role="group".*?</div>', '', s, flags=re.S)
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', s)
    s = s.replace('      <a class="btn btn--small" href="#contact">',
                  '      ' + switcher(page) + '\n      <a class="btn btn--small" href="#contact">', 1)
    s = re.sub(r'(<a class="btn" href="#contact">[^<]*</a>)(\s*</div>\s*</header>)',
               lambda m: m.group(1) + '\n      ' + switcher(page, True) + m.group(2), s, count=1)
    s = s.replace('  <link rel="icon"', '  ' + alternates(page) + '\n  <link rel="icon"', 1)
    return s

def french_typography(html):
    def text(t):
        t = re.sub(r' ([:])', NB + r'\1', t)
        t = re.sub(r' ([;!?])', NN + r'\1', t)
        t = t.replace('« ', '«' + NB).replace(' »', NB + '»')
        t = re.sub(r'(\d) ([%€₪])', r'\1' + NB + r'\2', t)
        t = re.sub(r'(\d) (\d{3})\b', r'\1' + NN + r'\2', t)
        t = re.sub(r'(\d) h (\d)', r'\1' + NB + 'h' + NB + r'\2', t)
        t = re.sub(r'(\d) (h|min)\b', r'\1' + NB + r'\2', t)
        t = t.replace('Tel-Aviv', '<span class="nowrap">Tel-Aviv</span>')
        return t
    parts = re.split(r'(<[^>]+>)', html)
    for i, p in enumerate(parts):
        if p.startswith('<'):
            parts[i] = re.sub(r'((?:alt|aria-label|content|title)=")([^"]*)(")',
                              lambda m: m.group(1) + text(m.group(2)) + m.group(3), p)
        elif not re.search(r'^\s*(\{|\(|document\.)', p):  # leave inline scripts alone
            parts[i] = text(p)
    out = ''.join(parts)
    return re.sub(r'\b(\d)e trimestre', r'\1<sup>e</sup> trimestre', out)

def build(lang, he):
    s = he
    missing = []
    for row in T:
        src, dst = row[0], row[1 if lang == 'en' else 2]
        if src not in s:
            missing.append(src[:70])
            continue
        s = s.replace(src, dst)
    if missing:
        sys.exit(f'[{lang}] strings not found in index.html:\n  ' + '\n  '.join(missing))
    h = HEAD[lang]
    s = s.replace('<html lang="he" dir="rtl">', f'<html lang="{lang}" dir="ltr">', 1)
    s = re.sub(r'<title>[^<]*</title>', f'<title>{h["title"]}</title>', s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + h['desc'], s, count=1)
    s = social_meta.apply(s, lang, 'index.html', h['og_title'], h['og_desc'])
    s = s.replace('<p class="statement__text" data-words>', f'<p class="statement__text" data-words data-em="{STATEMENT_EM[lang]}">', 1)
    s = re.sub(r'(?<=["\s,])assets/', '../assets/', s)
    s = add_chrome(s, lang)
    if lang == 'fr':
        s = french_typography(s)
    # Only the language switcher may still carry Hebrew.
    check = re.sub(r'<(nav|div) class="lang".*?</\1>', '', s, flags=re.S)
    left = [l.strip()[:90] for l in check.split('\n') if HE_RE.search(l)]
    if left:
        sys.exit(f'[{lang}] untranslated Hebrew left:\n  ' + '\n  '.join(left))
    out = ROOT / lang / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(s, encoding='utf-8')
    print(f'{lang}: {out.relative_to(ROOT)} written')

he_path = ROOT / 'index.html'
he = he_path.read_text(encoding='utf-8')
he = he.replace('(<bdi>Galt &amp</bdi>; <bdi>Taggart</bdi>)', '(<bdi>Galt &amp; Taggart</bdi>)')
he = add_chrome(he, 'he')
he = social_meta.apply(he, 'he', 'index.html',
                       social_meta.read(he, 'og:title'), social_meta.read(he, 'og:description'))
he_path.write_text(he, encoding='utf-8')
print('he: index.html switcher and alternates in place')
for lang in ('en', 'fr'):
    build(lang, he)
