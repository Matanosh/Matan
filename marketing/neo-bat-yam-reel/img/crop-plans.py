# Crops the drawing (no header, no developer marks, no key plan) from the owner's floor plans
# in marketing/brand/neo-bat-yam/plans/ for the 16:9 film. Run: python3 -I img/crop-plans.py (from this folder).
from PIL import Image
import os
SRC = os.path.join(os.path.dirname(__file__), '..', '..', 'brand', 'neo-bat-yam', 'plans')
# box in source pixels (8031 x 5669): left, top, right, bottom
CROPS = {'C2': (717, 1061, 7228, 4560), 'A': (402, 946, 7715, 4417), 'B': (344, 1503, 7887, 4118)}
for name, box in CROPS.items():
    im = Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB').crop(box)
    im.thumbnail((2000, 2000), Image.LANCZOS)
    im.save(os.path.join(os.path.dirname(__file__), 'plan-' + name + '.jpg'), quality=90)
    print(name, im.size)
