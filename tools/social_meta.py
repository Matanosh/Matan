"""Open Graph, Twitter card and canonical tags, shared by every page builder.

One place sets the site address, the share image and the per-language locale,
so the home page and the legal pages, in all three languages, share the same tags.
"""
import html as _html
import re

SITE = 'https://global.msgp.co.il'
SITE_NAME = 'MS Group Global'
IMAGE = f'{SITE}/assets/img/og.jpg'
LOCALE = {'he': 'he_IL', 'en': 'en_US', 'fr': 'fr_FR'}

# Lines this module owns; they are removed and written again on every build.
_OWNED = re.compile(
    r'\n[ \t]*<(?:meta (?:property="og:[^"]+"|name="twitter:[^"]+")|link rel="canonical")[^>]*>')


def page_url(lang, file):
    folder = '' if lang == 'he' else f'{lang}/'
    return f'{SITE}/{folder}{"" if file == "index.html" else file}'


def tags(lang, file, title, desc):
    esc = lambda t: _html.escape(t, quote=True)
    url = page_url(lang, file)
    lines = [
        f'<link rel="canonical" href="{url}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{SITE_NAME}">',
        f'<meta property="og:locale" content="{LOCALE[lang]}">',
        *[f'<meta property="og:locale:alternate" content="{LOCALE[o]}">' for o in LOCALE if o != lang],
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:image" content="{IMAGE}">',
        '<meta property="og:image:type" content="image/jpeg">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{SITE_NAME}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{IMAGE}">',
    ]
    return '\n  '.join(lines)


def apply(s, lang, file, title, desc):
    """Replace the page's social tags with a fresh set, right after theme-color."""
    s = _OWNED.sub('', s)
    anchor = '<meta name="theme-color" content="#0c1d40">'
    if anchor not in s:
        raise SystemExit(f'[{lang}/{file}] theme-color meta not found; cannot place social tags')
    return s.replace(anchor, anchor + '\n  ' + tags(lang, file, title, desc), 1)


def read(s, prop):
    """Current value of og:title / og:description in a page (HTML-unescaped)."""
    m = re.search(rf'<meta property="{prop}" content="([^"]*)"', s)
    return _html.unescape(m.group(1)) if m else None
