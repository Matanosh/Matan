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


def build(name, src, colours, scale, crop=None, gain=1.0, variants=None, margin=0.03, keep=None):
    """variants: {suffix: list of output colours, one per input colour}."""
    im = Image.open(os.path.join(HERE, src)).convert('RGB')
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
