# Generates music.wav (original, royalty-free): warm pad, piano-like arpeggio and a soft pulse from the Phase B reveal.
import numpy as np, wave
SR = 44100; D = 120; t = np.arange(SR * D) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
chords = [[57, 64, 69, 72], [53, 60, 65, 69], [48, 55, 60, 64], [55, 62, 67, 71]]  # Am F C G
bar = 6.0
L = np.zeros_like(t); R = np.zeros_like(t)
for k in range(int(D / bar) + 1):
    c = chords[k % 4]; a = k * bar; s = int(a * SR); e = min(len(t), int((a + bar + 1.5) * SR))
    if s >= len(t): break
    tt = t[s:e] - a; env = np.minimum(1, tt / 1.8) * np.minimum(1, np.maximum(0, (bar + 1.5 - tt) / 1.5))
    for i, m in enumerate(c):
        f = hz(m); v = sum(np.sin(2 * np.pi * f * d * tt + i) / (j + 1) ** 1.6 for j, d in enumerate([1, 2, 3, 1.003]))
        L[s:e] += 0.05 * env * v * (1 - i * 0.1); R[s:e] += 0.05 * env * v * (0.7 + i * 0.1)
    # arpeggio (eighths at 80 bpm-ish) from 9s
    if a >= 9:
        step = bar / 12
        for n in range(12):
            m = c[[0, 1, 2, 3, 2, 1][n % 6]] + 12; na = a + n * step; ns = int(na * SR); ne = min(len(t), ns + int(1.6 * SR))
            if ns >= len(t): break
            tt2 = t[ns:ne] - na; env2 = np.exp(-tt2 * 3.2) * np.minimum(1, tt2 / 0.005)
            v = (np.sin(2 * np.pi * hz(m) * tt2) + 0.3 * np.sin(4 * np.pi * hz(m) * tt2)) * env2 * 0.06
            pan = 0.5 + 0.35 * np.sin(n); L[ns:ne] += v * (1 - pan); R[ns:ne] += v * pan
# soft pulse 30s-108s (construction onwards)
beat = 60 / 80
for b in np.arange(30.2, 108, beat):
    s = int(b * SR); e = min(len(t), s + int(0.4 * SR)); tt = t[s:e] - b
    k = np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9) * 0.16 * min(1, (b - 30.2) / 4)
    L[s:e] += k; R[s:e] += k
# swell into the Phase B reveal via noise riser
s, e = int(35.4 * SR), int(39.2 * SR); n = np.random.default_rng(1).standard_normal(e - s); n = np.convolve(n, np.ones(40) / 40, 'same')
rise = np.linspace(0, 1, e - s) ** 2 * 0.05; L[s:e] += n * rise; R[s:e] += n * rise
# demolition: a deep boom and rumble per building
rng = np.random.default_rng(7)
for b0 in [23.6, 24.35, 25.1]:
    s = int(b0 * SR); e = min(len(t), s + int(3.2 * SR)); tt = t[s:e] - b0
    boom = np.sin(2 * np.pi * (38 + 70 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 2.2) * 0.55
    rum = np.convolve(rng.standard_normal(e - s), np.ones(220) / 220, 'same') * np.exp(-tt * 1.3) * 2.2
    crack = rng.standard_normal(e - s) * np.exp(-tt * 28) * 0.25
    L[s:e] += boom + rum + crack; R[s:e] += boom + rum * 0.9 + crack
# simple stereo echo
d = int(0.33 * SR); L[d:] += 0.25 * R[:-d]; R[d:] += 0.25 * L[:-d]
fade = np.minimum(1, t / 2.5) * np.minimum(1, (D - t) / 5)
out = np.stack([L, R], 1) * fade[:, None]; out /= np.abs(out).max() / 0.85
w = wave.open('music.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
