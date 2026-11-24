# Crops the drawing (no header, no developer marks, no key plan) from the owner's floor plans
# in marketing/brand/neo-bat-yam/plans/ for the 16:9 film. Run: python3 -I img/crop-plans.py (from this folder).
# Each crop is the drawing's tight bounding box plus the same PAD on every side, so all plans
# sit in the film's plan box with the same margins.
from PIL import Image
import os
SRC = os.path.join(os.path.dirname(__file__), '..', '..', 'brand', 'neo-bat-yam', 'plans')
PAD = 40   # source pixels around the drawing
# region holding the drawing in source pixels (8031 x 5669): left, top, right, bottom.
# 5 rooms: G (2.9:1 drawing) fills the 16:9 plan box a little better than B (2.9:1) and far better than B1 (portrait).
REGIONS = {'C2': (717, 1061, 7228, 4560), 'A': (402, 946, 7715, 4417), 'G': (100, 1400, 7950, 4300)}
for name, region in REGIONS.items():
    im = Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB')
    ink = im.crop(region).convert('L').point(lambda v: 255 if v < 200 else 0).getbbox()
    box = (region[0] + ink[0] - PAD, region[1] + ink[1] - PAD, region[0] + ink[2] + PAD, region[1] + ink[3] + PAD)
    im = im.crop(box)
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(os.path.join(os.path.dirname(__file__), 'plan-' + name + '.jpg'), quality=90)
    print(name, box, im.size)
