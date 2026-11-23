#!/usr/bin/env python3
"""Build the M.S. Group holiday greeting cards.

Every holiday gets two HTML pages in the same navy-and-gold design:
  <slug>.html        1080x1350, for WhatsApp chats and Instagram posts
  <slug>-story.html  1080x1920, for WhatsApp status and Instagram stories

Run `python3 build.py`, then `node render.js` to turn them into PNGs.
"""
from pathlib import Path

HERE = Path(__file__).parent

DEFS = """
    <defs>
      <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="430">
        <stop offset="0" stop-color="#e9cb8c"/><stop offset=".5" stop-color="#d2a249"/><stop offset="1" stop-color="#a47b30"/>
      </linearGradient>
      <radialGradient id="flame" cx=".5" cy=".7" r=".6">
        <stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="#ffd98a"/><stop offset="1" stop-color="#e39b2e"/>
      </radialGradient>
      <radialGradient id="glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="rgba(255,214,140,.55)"/><stop offset="1" stop-color="rgba(255,214,140,0)"/>
      </radialGradient>
      <g id="light">
        <circle r="30" fill="url(#glow)"/>
        <path d="M0,-20 C9,-8 9,4 0,10 C-9,4 -9,-8 0,-20 Z" fill="url(#flame)"/>
      </g>
      <g id="bulb">
        <circle r="22" fill="url(#glow)"/>
        <circle r="6" fill="#fff3d6"/>
      </g>
    </defs>"""


def menorah():
    xs = [70, 130, 190, 250, 370, 430, 490, 550]
    arms = "".join(
        f'<path d="M{310 - r},170 A{r},{r} 0 0,0 {310 + r},170"/>' for r in (240, 180, 120, 60)
    )
    cups = "".join(f'<rect x="{x - 14}" y="158" width="28" height="12" rx="3"/>' for x in xs)
    candles = "".join(f'<rect x="{x - 7}" y="112" width="14" height="46" rx="2"/>' for x in xs)
    flames = "".join(f'<use href="#light" x="{x}" y="94"/>' for x in xs)
    return f"""
    <g fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round">
      {arms}<line x1="310" y1="140" x2="310" y2="404"/>
    </g>
    <g fill="url(#g)">{cups}
      <rect x="294" y="126" width="32" height="14" rx="3"/>
      <path d="M268,404 L352,404 L374,424 L246,424 Z"/>
    </g>
    <g fill="#fbf8f1" opacity=".92">{candles}<rect x="302" y="78" width="16" height="48" rx="2"/></g>
    {flames}<use href="#light" x="310" y="60"/>"""


def pomegranate():
    seeds = "".join(
        f'<ellipse cx="{x}" cy="{y}" rx="9" ry="12" fill="url(#g)" opacity=".85"/>'
        for x, y in [(286, 262), (310, 250), (334, 262), (274, 290), (298, 284),
                     (322, 284), (346, 290), (286, 312), (310, 306), (334, 312), (310, 334)]
    )
    return f"""
    <circle cx="310" cy="250" r="170" fill="url(#glow)" opacity=".5"/>
    <circle cx="310" cy="272" r="138" fill="rgba(210,162,73,.08)" stroke="url(#g)" stroke-width="7"/>
    <path d="M266,142 L258,92 L284,114 L298,78 L310,108 L322,78 L336,114 L362,92 L354,142"
          fill="none" stroke="url(#g)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M254,120 C214,108 192,86 178,58 C220,58 248,80 254,120 Z" fill="url(#g)"/>
    <path d="M214,300 A100,100 0 0,1 236,196" fill="none" stroke="#e9cb8c" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <circle cx="310" cy="290" r="62" fill="rgba(10,24,54,.55)" stroke="url(#g)" stroke-width="3"/>
    {seeds}"""


def shofar():
    return """
    <circle cx="320" cy="250" r="190" fill="url(#glow)" opacity=".45"/>
    <path d="M86,160 C120,340 360,410 502,300 C548,264 556,214 528,184
             C536,222 524,256 490,280 C370,362 190,322 158,150 Z" fill="url(#g)"/>
    <path d="M212,268 C230,292 248,306 268,318" fill="none" stroke="#0c1d40" stroke-width="3" opacity=".35"/>
    <path d="M330,330 C352,334 372,334 392,330" fill="none" stroke="#0c1d40" stroke-width="3" opacity=".35"/>
    <ellipse cx="122" cy="155" rx="38" ry="13" transform="rotate(-8 122 155)" fill="#0a1836" stroke="#e9cb8c" stroke-width="4"/>
    <g fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" opacity=".8">
      <path d="M66,104 Q44,150 66,196"/>
      <path d="M40,82 Q8,150 40,218" opacity=".6"/>
    </g>"""


def sukkah():
    leaves = []
    for i, x in enumerate(range(150, 480, 26)):
        angle = 16 if i % 2 else -16
        y = 160 if i % 2 else 150
        leaves.append(f'<ellipse cx="{x}" cy="{y}" rx="30" ry="9" transform="rotate({angle} {x} {y})"/>')
    hangs = [(220, 230), (275, 270), (345, 250), (400, 290)]
    strings = "".join(f'<line x1="{x}" y1="172" x2="{x}" y2="{y}"/>' for x, y in hangs)
    bulbs = "".join(f'<use href="#bulb" x="{x}" y="{y + 8}"/>' for x, y in hangs)
    return f"""
    <rect x="170" y="172" width="280" height="226" fill="rgba(210,162,73,.07)"/>
    <g fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round">
      <line x1="170" y1="172" x2="170" y2="400"/>
      <line x1="450" y1="172" x2="450" y2="400"/>
      <line x1="160" y1="172" x2="460" y2="172"/>
      <line x1="120" y1="404" x2="500" y2="404"/>
    </g>
    <g fill="url(#g)">{''.join(leaves)}</g>
    <g stroke="#d2a249" stroke-width="2" opacity=".7">{strings}</g>
    {bulbs}"""


def cup():
    return """
    <circle cx="310" cy="210" r="170" fill="url(#glow)" opacity=".45"/>
    <path d="M232,150 L388,150 C384,228 352,258 310,260 C268,258 236,228 232,150 Z" fill="#6d1a30"/>
    <path d="M220,118 L400,118 C400,232 360,272 310,274 C260,272 220,232 220,118 Z"
          fill="none" stroke="url(#g)" stroke-width="7" stroke-linejoin="round"/>
    <ellipse cx="310" cy="150" rx="78" ry="7" fill="#8e2a44" opacity=".9"/>
    <path d="M232,196 L388,196" stroke="url(#g)" stroke-width="3" opacity=".6"/>
    <g fill="url(#g)">
      <rect x="302" y="272" width="16" height="92" rx="3"/>
      <ellipse cx="310" cy="318" rx="18" ry="9"/>
      <path d="M236,404 C256,376 288,364 310,364 C332,364 364,376 384,404 Z"/>
    </g>"""


def wheat():
    def stalk(angle):
        grains = []
        for i, y in enumerate(range(118, 250, 24)):
            grains.append(f'<ellipse cx="296" cy="{y}" rx="9" ry="20" transform="rotate(-28 296 {y})"/>')
            grains.append(f'<ellipse cx="324" cy="{y}" rx="9" ry="20" transform="rotate(28 324 {y})"/>')
        grains.append('<ellipse cx="310" cy="98" rx="9" ry="22"/>')
        return f"""
      <g transform="rotate({angle} 310 410)">
        <line x1="310" y1="410" x2="310" y2="110" stroke="url(#g)" stroke-width="5" stroke-linecap="round"/>
        <g fill="url(#g)">{''.join(grains)}</g>
      </g>"""
    return f"""
    <circle cx="310" cy="220" r="190" fill="url(#glow)" opacity=".4"/>
    {stalk(-24)}{stalk(24)}{stalk(0)}
    <path d="M310,330 C280,300 252,300 232,312" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round"/>
    <path d="M310,330 C340,300 368,300 388,312" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round"/>
    <rect x="290" y="352" width="40" height="16" rx="4" fill="url(#g)"/>"""


def star():
    def tri(r, up):
        import math
        pts = []
        for k in range(3):
            a = math.radians((-90 if up else 90) + 120 * k)
            pts.append(f"{310 + r * math.cos(a):.1f},{240 + r * math.sin(a):.1f}")
        return " ".join(pts)
    return f"""
    <circle cx="310" cy="240" r="190" fill="url(#glow)" opacity=".5"/>
    <g fill="none" stroke="url(#g)" stroke-linejoin="round">
      <polygon points="{tri(160, True)}" stroke-width="9"/>
      <polygon points="{tri(160, False)}" stroke-width="9"/>
      <polygon points="{tri(132, True)}" stroke-width="2.5" opacity=".55"/>
      <polygon points="{tri(132, False)}" stroke-width="2.5" opacity=".55"/>
    </g>"""


def tree():
    import math
    leaves = []
    # Canopy: leaves on rings around the crown, angles offset per ring so they interlock.
    for ring, (radius, count) in enumerate([(0, 1), (42, 7), (84, 13), (124, 19)]):
        for k in range(count):
            a = 2 * math.pi * k / count + ring * 0.4
            x = 310 + radius * math.cos(a)
            y = 175 + radius * 0.78 * math.sin(a)
            rot = math.degrees(a) + 35
            shade = "url(#g)" if (k + ring) % 3 else "#e9cb8c"
            leaves.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="19" ry="9" '
                          f'transform="rotate({rot:.0f} {x:.1f} {y:.1f})" fill="{shade}"/>')
    return f"""
    <circle cx="310" cy="190" r="180" fill="url(#glow)" opacity=".45"/>
    <g fill="url(#g)">
      <path d="M296,404 C300,350 302,300 298,250 L322,250 C318,300 320,350 324,404 Z"/>
      <path d="M302,292 C280,270 260,258 236,250 L240,242 C266,250 288,262 306,278 Z"/>
      <path d="M318,272 C338,252 360,240 386,234 L388,242 C364,250 344,262 322,284 Z"/>
    </g>
    <g fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round">
      <path d="M298,404 C280,414 262,418 240,420"/>
      <path d="M322,404 C340,414 358,418 380,420"/>
      <line x1="170" y1="406" x2="450" y2="406" stroke-width="3" opacity=".6"/>
    </g>
    {''.join(leaves)}"""


def mask():
    confetti = "".join(
        f'<rect x="{x}" y="{y}" width="12" height="5" rx="2" fill="{c}" transform="rotate({r} {x} {y})"/>'
        for x, y, r, c in [(110, 110, 30, "#e9cb8c"), (520, 96, -25, "#d2a249"), (560, 230, 60, "#e9cb8c"),
                           (70, 300, -40, "#d2a249"), (180, 380, 20, "#e9cb8c"), (420, 400, -60, "#d2a249"),
                           (300, 70, 15, "#d2a249"), (470, 60, 70, "#e9cb8c")]
    ) + "".join(
        f'<circle cx="{x}" cy="{y}" r="5" fill="{c}"/>'
        for x, y, c in [(160, 70, "#d2a249"), (560, 160, "#fbf8f1"), (90, 200, "#fbf8f1"),
                        (250, 400, "#d2a249"), (530, 330, "#fbf8f1")]
    )
    return f"""
    <circle cx="310" cy="220" r="190" fill="url(#glow)" opacity=".45"/>
    {confetti}
    <line x1="452" y1="272" x2="520" y2="420" stroke="url(#g)" stroke-width="9" stroke-linecap="round"/>
    <path d="M140,200 C150,150 220,140 270,160 C290,168 300,176 310,176 C320,176 330,168 350,160
             C400,140 470,150 480,200 C488,250 450,290 400,292 C360,294 340,270 310,262
             C280,270 260,294 220,292 C170,290 132,250 140,200 Z" fill="url(#g)"/>
    <ellipse cx="230" cy="214" rx="42" ry="25" transform="rotate(8 230 214)" fill="#0c1d40"/>
    <ellipse cx="390" cy="214" rx="42" ry="25" transform="rotate(-8 390 214)" fill="#0c1d40"/>
    <g fill="url(#g)">
      <path d="M176,168 C150,120 152,90 170,60 C182,100 190,130 190,164 Z"/>
      <path d="M200,156 C190,110 198,82 222,58 C224,98 222,128 214,156 Z"/>
      <path d="M156,182 C118,154 106,128 110,96 C130,124 150,148 166,174 Z"/>
    </g>"""


HOLIDAYS = [
    dict(slug="hanukkah", name="חנוכה", art=menorah,
         title='חג חנוכה <span>שמח</span>',
         wish="שהאור של החג ימלא את הבית,<br>ושהבית הבא יהיה בדיוק מה שחלמתם עליו."),
    dict(slug="tu-bishvat", name="ט״ו בשבט", art=tree,
         title='ט״ו בשבט <span>שמח</span>',
         wish="כמו עץ טוב, גם השקעה טובה צריכה שורשים חזקים,<br>סבלנות, ומקום נכון לצמוח."),
    dict(slug="purim", name="פורים", art=mask,
         title='פורים <span>שמח</span>',
         wish="חג של שמחה, צחוק ומשלוחי מנות,<br>ושנה שבה הכול מתהפך לטובה."),
    dict(slug="rosh-hashana", name="ראש השנה", art=pomegranate,
         title='שנה טובה <span>ומתוקה</span>',
         wish="שנה של בריאות, שקט ושגשוג,<br>ושל צעדים חכמים לבית ולהשקעה הבאה."),
    dict(slug="yom-kippur", name="יום כיפור", art=shofar,
         title='גמר חתימה <span>טובה</span>',
         wish="מאחלים לכם צום קל,<br>ושנה של שלום, בריאות ושקט."),
    dict(slug="sukkot", name="סוכות", art=sukkah,
         title='חג סוכות <span>שמח</span>',
         wish="שתשבו בסוכה בשמחה,<br>ותחזרו אחרי החג לבית שאתם הכי אוהבים."),
    dict(slug="pesach", name="פסח", art=cup,
         title='חג פסח <span>כשר ושמח</span>',
         wish="חג של חירות והתחדשות,<br>ובית מלא באנשים שאתם אוהבים."),
    dict(slug="shavuot", name="שבועות", art=wheat,
         title='חג שבועות <span>שמח</span>',
         wish="חג של שפע וביכורים,<br>ושנה של חדשות טובות ופירות מתוקים."),
    dict(slug="yom-haatzmaut", name="יום העצמאות", art=star,
         title='חג עצמאות <span>שמח</span>',
         wish="גאים להיות חלק מהבית הזה,<br>ולבנות יחד עתיד טוב יותר."),
]

CSS = """
  :root {
    --night: #0a1836; --harbor: #0c1d40; --dusk: #15284b;
    --ivory: #fbf8f1; --mist: #ddd6c6;
    --gold: #d2a249; --pale-gold: #e9cb8c; --antique: #a47b30;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1350px; background: var(--night); }
  .card {
    position: relative; width: 1080px; height: 1350px; overflow: hidden;
    background:
      radial-gradient(ellipse 70% 45% at 50% 40%, rgba(210,162,73,.16), transparent 70%),
      radial-gradient(ellipse 120% 80% at 50% 0%, var(--dusk), var(--harbor) 55%, var(--night));
    display: flex; flex-direction: column; align-items: center;
    font-family: Heebo, system-ui, sans-serif; color: var(--ivory);
  }
  .frame { position: absolute; inset: 40px; border: 1px solid rgba(210,162,73,.35); }
  .frame::after { content: ""; position: absolute; inset: 10px; border: 1px solid rgba(210,162,73,.14); }
  .logo { margin-top: 110px; width: 230px; }
  .art { margin-top: 70px; width: 620px; }
  h1 {
    margin-top: 40px;
    font-family: "Frank Ruhl Libre", Georgia, serif; font-weight: 300;
    font-size: 118px; line-height: 1; letter-spacing: -.01em; color: var(--ivory);
  }
  h1 span { color: var(--gold); }
  .rule { margin-top: 44px; width: 90px; height: 1px; background: var(--gold); }
  p.wish {
    margin-top: 40px; text-align: center; font-weight: 300;
    font-size: 38px; line-height: 1.55; color: var(--mist);
  }
  .sign {
    position: absolute; bottom: 92px; left: 0; right: 0; text-align: center;
    font-size: 28px; letter-spacing: .02em; color: var(--pale-gold);
  }
  .sign b { font-weight: 500; color: var(--ivory); }
  .sign .ig { margin-top: 18px; display: flex; justify-content: center; align-items: center; gap: 12px; color: var(--ivory); font-weight: 500; }
  .sign .ig svg { width: 30px; height: 30px; color: var(--gold); }
  .sign .dot { margin: 0 14px; color: var(--antique); }
"""

# Taller canvas for WhatsApp status / stories; keeps clear of the app's top and bottom bars.
STORY_CSS = """
  html, body, .card { height: 1920px; }
  .card { background:
      radial-gradient(ellipse 70% 32% at 50% 40%, rgba(210,162,73,.16), transparent 70%),
      radial-gradient(ellipse 120% 80% at 50% 0%, var(--dusk), var(--harbor) 55%, var(--night)); }
  .frame { inset: 56px 40px; }
  .logo { margin-top: 250px; width: 260px; }
  .art { margin-top: 110px; width: 700px; }
  h1 { margin-top: 70px; font-size: 130px; }
  p.wish { font-size: 42px; }
  .sign { bottom: 300px; font-size: 32px; }
"""

PAGE = """<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>{name} – MS Group</title>
<link rel="stylesheet" href="fonts.css">
<style>{css}</style>
</head>
<body>
<div class="card">
  <div class="frame"></div>
  <img class="logo" src="msgroup-logo.png" alt="M.S. Group">
  <svg class="art" viewBox="0 0 620 440" aria-hidden="true">{defs}{art}
  </svg>
  <h1>{title}</h1>
  <div class="rule"></div>
  <p class="wish">{wish}</p>
  <div class="sign">
    <div><b>מתן</b><span class="dot">|</span><bdi>M.S. Group</bdi><span class="dot">|</span><bdi>msgp.co.il</bdi></div>
    <div class="ig" dir="ltr">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>
      <span>@msgroupproject</span>
    </div>
  </div>
</div>
</body>
</html>
"""


def main():
    for h in HOLIDAYS:
        common = dict(name=h["name"], defs=DEFS, art=h["art"](), title=h["title"], wish=h["wish"])
        (HERE / f"{h['slug']}.html").write_text(PAGE.format(css=CSS, **common), encoding="utf-8")
        (HERE / f"{h['slug']}-story.html").write_text(PAGE.format(css=CSS + STORY_CSS, **common), encoding="utf-8")
        print("built", h["slug"])


if __name__ == "__main__":
    main()
