# Sound for the 7 s logo reveal: an airy pad, a soft tonal hit as each bar rises, a swell on the text and a shimmer on the light sweep.
import numpy as np, wave
SR, D = 48000, 7.0; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(3); L = np.zeros(N); R = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(at, sig, pan=0.5):
    s = int(at * SR); e = min(N, s + len(sig)); L[s:e] += sig[: e - s] * (1 - pan) * 2; R[s:e] += sig[: e - s] * pan * 2
env = np.minimum(1, t / 1.5) * np.minimum(1, (D - t) / 1.2)
for m in [50, 57, 62, 64, 66]:
    L += 0.02 * env * np.sin(2 * np.pi * hz(m) * t); R += 0.02 * env * np.sin(2 * np.pi * hz(m) * 1.002 * t + 1)
for k, (at, m) in enumerate([(0.45, 62), (0.8, 66), (1.15, 69)]):
    n = int(2.5 * SR); tt = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (60 + 80 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 7) * 0.5
    bell = sum(np.sin(2 * np.pi * hz(m) * r * tt) * np.exp(-tt * (2.2 + i)) / (i + 1) for i, r in enumerate([1, 2.01, 3.0])) * 0.16
    add(at, thump + bell, [0.35, 0.5, 0.65][k])
n = int(1.6 * SR); tt = np.arange(n) / SR; w = np.convolve(rng.standard_normal(n), np.ones(30) / 30, 'same') * np.sin(np.pi * tt / 1.6) ** 2 * 0.35
add(1.8, w)
n = int(3.2 * SR); tt = np.arange(n) / SR
add(3.0, sum(np.sin(2 * np.pi * hz(m) * tt) for m in [62, 69, 74, 78]) * np.exp(-tt * 0.9) * 0.05)
n = int(1.4 * SR); tt = np.arange(n) / SR
add(3.7, sum(np.sin(2 * np.pi * f * tt + rng.random() * 6) for f in rng.uniform(3000, 7000, 24)) * np.sin(np.pi * tt / 1.4) ** 2 * 0.012)
out = np.stack([L, R], 1); out /= np.abs(out).max() / 0.9
with wave.open('src/logo-anim.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out * 32767).astype(np.int16).tobytes())
print('ok')
