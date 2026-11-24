# Builds img/plan-order.png: a grey map that tells film.html in what order each pixel
# of img/plan.png is drawn (0 = first, 255 = last). Walls are drawn first, following
# the wall lines outward from the front door; then the rooms fill in, walking in from the door.
# Usage: python3 make-plan-order.py   (needs numpy and Pillow)
import numpy as np
from PIL import Image
import os
here = os.path.dirname(os.path.abspath(__file__))
src = Image.open(os.path.join(here, 'img/plan.png')).convert('RGB')
W, H = src.size
S = 2  # work at half resolution
g = np.array(src.resize((W // S, H // S), Image.BILINEAR)).astype(float).mean(2)
h, w = g.shape
wall = g < 120
bg = g >= 250
door = (600 // S, 960 // S)  # (x, y) just inside the entrance arrow

def geodesic(mask, seed):
    d = np.full(mask.shape, -1, int)
    front = np.zeros(mask.shape, bool)
    step = 0
    while True:
        if not front.any():
            left = mask & (d < 0)
            if not left.any():
                break
            ys, xs = np.nonzero(left)
            k = np.argmin((xs - seed[0]) ** 2 + (ys - seed[1]) ** 2)
            front[ys[k], xs[k]] = True
        d[front] = step
        n = front.copy()
        n[1:] |= front[:-1]; n[:-1] |= front[1:]; n[:, 1:] |= front[:, :-1]; n[:, :-1] |= front[:, 1:]
        front = n & mask & (d < 0)
        step += 1
    return d

dw = geodesic(wall, door)
other = ~wall & ~bg
dr = geodesic(~wall, door)  # walk through rooms (anything that is not wall)
order = np.zeros((h, w))
order[wall] = 0.02 + 0.50 * dw[wall] / max(1, dw[wall].max())
m = other & (dr >= 0)
order[m] = 0.52 + 0.43 * dr[m] / max(1, dr[m].max())
order[other & (dr < 0)] = 0.97
order[bg] = 0
out = Image.fromarray((order * 255).round().astype(np.uint8)).resize((W, H), Image.NEAREST)
out.save(os.path.join(here, 'img/plan-order.png'), optimize=True)
print('ok', dw.max(), dr.max())
