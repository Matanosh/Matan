#!/usr/bin/env python3
"""Builds the transparent logo PNGs in marketing/brand/ from the files in each */source/ folder.

Usage: python3 -I marketing/brand/make-logos.py

Method (same for every logo): the source is a flat-colour logo on white. It is upscaled with
Lanczos, then each pixel is unmixed against white: for each official colour F of the logo,
alpha = how far the pixel lies from white towards F (projection on the white->F line). The colour
with the smallest residual wins, the pixel gets that exact brand colour and that alpha. So edges
keep their anti-aliasing but carry no white fringe (no halo on dark grounds). The result is
trimmed to the visible edges plus a small even margin.
Each logo gets: *-color.png (brand colours, for light grounds), *-white.png (all white, for dark
grounds or photos) and, where the brand has one, *-on-dark.png (brand's own dark-ground variant).
"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
WHITE = np.array([255.0, 255.0, 255.0])


def unmix(rgb, colours, gain=1.0):
    """rgb: HxWx3 float on white. colours: list of (r,g,b). Returns (alpha HxW, label HxW)."""
    d = WHITE - rgb                                   # distance from white, per pixel
    best_a = np.zeros(rgb.shape[:2]); best_r = np.full(rgb.shape[:2], np.inf); label = np.zeros(rgb.shape[:2], int)
    for i, c in enumerate(colours):
        v = WHITE - np.array(c, float)
        a = (d @ v) / (v @ v)
        a = np.clip(a, 0, 1)
        res = np.linalg.norm(d - a[..., None] * v, axis=2)
        take = res < best_r
        best_r[take] = res[take]; best_a[take] = a[take]; label[take] = i
    if gain != 1.0:                                   # tighten soft (upscaled) edges around 50 %
        best_a = np.clip((best_a - .5) * gain + .5, 0, 1)
    best_a[best_a < 0.02] = 0                         # paper noise / JPEG ringing
    return best_a, label


def flatten(im):
    """Any source to RGB on white (a transparent PNG is composited on white first, so its whitish
    edge pixels are unmixed like any other anti-aliased edge)."""
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        return Image.alpha_composite(bg, im).convert('RGB')
    return im.convert('RGB')


def build(name, src, colours, scale, crop=None, gain=1.0, variants=None, margin=0.03, keep=None):
    """variants: {suffix: list of output colours, one per input colour}."""
    im = flatten(Image.open(os.path.join(HERE, src)))
    if crop:
        im = im.crop(crop)
    if keep is not None:                              # blank areas outside the logo (e.g. other print on a plan)
        m = Image.new('L', im.size, 0)
        from PIL import ImageDraw
        dr = ImageDraw.Draw(m)
        for box in keep:
            dr.rectangle(box, fill=255)
        im = Image.composite(im, Image.new('RGB', im.size, (255, 255, 255)), m)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    rgb = np.asarray(im).astype(float)
    alpha, label = unmix(rgb, colours, gain)
    ys, xs = np.where(alpha > 0.04)
    pad = round(margin * (xs.max() - xs.min()))
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, alpha.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, alpha.shape[1])
    alpha, label = alpha[y0:y1, x0:x1], label[y0:y1, x0:x1]
    out = {}
    for suffix, cols in variants.items():
        pal = np.array(cols, float)
        px = pal[label]
        rgba = np.dstack([px, alpha * 255]).round().astype(np.uint8)
        path = os.path.join(HERE, name + '-' + suffix + '.png')
        Image.fromarray(rgba, 'RGBA').save(path, optimize=True)
        out[suffix] = path
        print(os.path.relpath(path, HERE), rgba.shape[1], 'x', rgba.shape[0])
    return out


W = (255, 255, 255)

# NEO Beit Shemesh: no logo file exists; cut from the developer's Type D plan (2000x1412 px),
# where the mark is only about 228x121 px. Orange from the plan; "BEIT SHEMESH" is near-black grey.
NEO_ORANGE = (226, 94, 40); BS_GREY = (61, 61, 61)
build('neo-beit-shemesh/neo-beit-shemesh', '../neo-reel/img/plan.png', [NEO_ORANGE, BS_GREY], scale=4,
      crop=(1530, 30, 1810, 190), gain=1.25,
      variants={'color': [NEO_ORANGE, BS_GREY], 'white': [W, W], 'on-dark': [NEO_ORANGE, W]})

# NEO SEA | BAT YAM (Drive "לוגו בת ים.jpg", 1417x768 JPEG): blue word mark, coral gull and tagline.
SEA_BLUE = (28, 146, 222); SEA_CORAL = (253, 86, 87)
build('neo-bat-yam/neo-sea-bat-yam', 'neo-bat-yam/source/neo-sea-bat-yam.jpg', [SEA_BLUE, SEA_CORAL], scale=2, gain=1.1,
      variants={'color': [SEA_BLUE, SEA_CORAL], 'white': [W, W]})

# NEO Seaside Living Bat Yam: the mark printed on the developer's 2026 floor plans (8031 px wide JPEG).
SL_NAVY = (5, 54, 86); SL_WAVE = (140, 218, 250)
build('neo-bat-yam/neo-seaside-living-bat-yam', 'neo-bat-yam/plans/A.jpg', [SL_NAVY, SL_WAVE], scale=1,
      crop=(150, 260, 1220, 900), gain=1.0,
      variants={'color': [SL_NAVY, SL_WAVE], 'white': [W, W], 'on-dark': [W, SL_WAVE]})

# MS Group (Drive "logo ms group.png", 1286x587): gold mark and rule, charcoal lettering.
MS_GOLD = (171, 123, 46); MS_CHAR = (59, 61, 68); MS_CREAM = (250, 246, 236)
build('ms-group/ms-group', 'ms-group/source/ms-group-logo.png', [MS_GOLD, MS_CHAR], scale=2, gain=1.1,
      variants={'color': [MS_GOLD, MS_CHAR], 'white': [W, W], 'on-dark': [MS_GOLD, MS_CREAM]})


# Bank Mizrahi Tefahot (owner, 2026-11-24, 1200x800 transparent PNG): orange ribbon, grey loop and lettering.
# The PNG's edge pixels are blended with white, so it is flattened on white and unmixed like the rest.
MZ_ORANGE = (244, 130, 33); MZ_GREY = (81, 90, 95)
build('mizrahi-tefahot/mizrahi-tefahot', 'source/mizrahi-tefahot.png', [MZ_ORANGE, MZ_GREY], scale=1,
      variants={'color': [MZ_ORANGE, MZ_GREY], 'white': [W, W], 'on-dark': [MZ_ORANGE, W]})


def build_gradient(name, src, scale, split_x=None, margin=0.03, sharpen=(1.2, 60, 2)):
    """For a logo with colour gradients on white (no flat palette to unmix against).
    Upscale with Lanczos and a light unsharp mask, then: pixels far from white are 'core' ink and keep
    their own colour at full alpha; every other pixel takes the colour of the nearest core ink
    (spread outwards a few pixels) and alpha = its projection on the white->that-colour line. Edges keep
    their anti-aliasing, the colour stays the logo's own, and no white is left in the edge (no halo).
    split_x (source px): ink right of it is the mark; left of it is lettering (white in *-on-dark)."""
    from PIL import ImageFilter
    im = flatten(Image.open(os.path.join(HERE, src)))
    im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(*sharpen))
    rgb = np.asarray(im).astype(float)
    d = WHITE - rgb
    dist = np.linalg.norm(d, axis=2)
    core = dist > 0.70 * np.percentile(dist[dist > 60], 50)
    col = np.where(core[..., None], rgb, 0.0); known = core.copy()
    for _ in range(4 * scale):                        # spread core colours outwards
        acc = np.zeros_like(col); n = np.zeros(known.shape)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            acc += np.roll(np.roll(col * known[..., None], dy, 0), dx, 1)
            n += np.roll(np.roll(known, dy, 0), dx, 1)
        new = (~known) & (n > 0)
        col[new] = acc[new] / n[new][:, None]; known |= new
    v = WHITE - col
    a = np.einsum('ijk,ijk->ij', d, v) / np.maximum(np.einsum('ijk,ijk->ij', v, v), 1)
    a = np.clip(a, 0, 1); a[core] = 1; a[~known] = 0; a[a < 0.04] = 0
    ys, xs = np.where(a > 0.04)
    pad = round(margin * (xs.max() - xs.min()))
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, a.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, a.shape[1])
    is_text = np.zeros(a.shape, bool)
    if split_x is not None:
        is_text[:, :split_x * scale] = True
    a, col, is_text = a[y0:y1, x0:x1], np.clip(col[y0:y1, x0:x1], 0, 255), is_text[y0:y1, x0:x1]
    for suffix in ('color', 'white', 'on-dark'):
        if suffix == 'color':
            px = col
        elif suffix == 'white':
            px = np.full_like(col, 255)
        else:
            if split_x is None:
                continue
            px = np.where(is_text[..., None], 255.0, col)
        rgba = np.dstack([px, a * 255]).round().astype(np.uint8)
        path = os.path.join(HERE, name + '-' + suffix + '.png')
        Image.fromarray(rgba, 'RGBA').save(path, optimize=True)
        print(os.path.relpath(path, HERE), rgba.shape[1], 'x', rgba.shape[0])


# Developer "ע.ט החברה להתחדשות עירונית" (owner, 2026-11-24): source/developer-at-urban-renewal-large.png,
# 730x300 transparent PNG (mark plus lettering about 717x167 px). Blue gradient lettering; mark of navy,
# sky-blue and orange-red columns (gradients). Flattened on white, upscaled 2x (Lanczos + light unsharp),
# not redrawn. The owner's first copy, source/developer-at-urban-renewal.jpg (260x130), is superseded.
build_gradient('at-urban-renewal/at-urban-renewal', 'source/developer-at-urban-renewal-large.png', scale=2,
               split_x=592, sharpen=(1.0, 40, 2))


# Electra Construction, executing contractor of NEO Bat Yam (owner, 2026-11-24): source/electra-construction.jpg,
# 450x300 JPEG. "אלקטרה בנייה, מקבוצת אלקטרה": blue mark and "בנייה", charcoal lettering. Upscaled 2x.
EL_BLUE = (2, 142, 216); EL_CHAR = (52, 50, 48)
build('electra-construction/electra-construction', 'source/electra-construction.jpg', [EL_BLUE, EL_CHAR], scale=2, gain=1.1,
      variants={'color': [EL_BLUE, EL_CHAR], 'white': [W, W], 'on-dark': [EL_BLUE, W]})


def build_transparent(name, src, split_x, margin=0.03):
    """For a source that is already a clean transparent PNG (edges not blended with white): keep its pixels
    and alpha as they are, only trim. *-white: every pixel white, same alpha. *-on-dark: lettering (ink left of
    split_x, source px; Hebrew word mark to the right of the mark is at x >= split_x here) turned white,
    the mark kept in its own colours."""
    im = np.asarray(Image.open(os.path.join(HERE, src)).convert('RGBA')).astype(float)
    a = im[..., 3]
    ys, xs = np.where(a > 10)
    pad = round(margin * (xs.max() - xs.min()))
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, a.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, a.shape[1])
    is_text = np.zeros(a.shape, bool); is_text[:, split_x:] = True
    im, is_text = im[y0:y1, x0:x1], is_text[y0:y1, x0:x1]
    rgb, al = im[..., :3], im[..., 3:]
    for suffix, px in (('color', rgb), ('white', np.full_like(rgb, 255)),
                       ('on-dark', np.where(is_text[..., None], 255.0, rgb))):
        rgba = np.dstack([px, al]).round().astype(np.uint8)
        path = os.path.join(HERE, name + '-' + suffix + '.png')
        Image.fromarray(rgba, 'RGBA').save(path, optimize=True)
        print(os.path.relpath(path, HERE), rgba.shape[1], 'x', rgba.shape[0])


# Shikun & Binui – Solel Boneh, executing contractor of NEO Bat Yam (owner, 2026-11-24):
# source/shikun-binui-solel-boneh.png, 1280x476, transparent. Gradient mark (blue, grey, lime), navy word mark.
# Already clean, so kept at 1x and only trimmed; *-on-dark has white lettering and rule beside the colour mark.
build_transparent('shikun-binui-solel-boneh/shikun-binui-solel-boneh', 'source/shikun-binui-solel-boneh.png', split_x=490)
