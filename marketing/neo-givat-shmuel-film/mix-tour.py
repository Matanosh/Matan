# Mixes the tour film soundtrack: ElevenLabs score + Hebrew voiceover (ducked) + demolition booms and transition whooshes.
# Writes tour-mix.wav (112 s, 48 kHz stereo, about -14 LUFS).
import subprocess, numpy as np, wave
SR, D = 48000, 105.0
N = int(SR * D)
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
db = lambda v: 10 ** (v / 20)
music = np.zeros((N, 2), np.float32); m = load('src/music/score-b.mp3')[:N]; music[:len(m)] = m
music *= db(-19) / rms(music[: int(100 * SR)])
t = np.arange(N) / SR
music *= np.clip((D - t) / 3.5, 0, 1)[:, None] * np.clip(t / 1.0, 0, 1)[:, None]
# voiceover placements (seconds)
VO = {1: 1.6, 2: 8.8, 3: 17.8, 4: 23.4, 5: 33.8, 6: 50.6, 7: 58.0, 8: 73.2, 9: 82.4, 10: 91.2, 11: 98.4}
vo = np.zeros((N, 2), np.float32)
for k, at in VO.items():
    x = load(f'src/vo/vo{k:02d}.mp3'); x *= db(-16) / rms(x[np.abs(x).max(1) > 0.01])
    s = int(at * SR); vo[s:s + len(x)] += x[: N - s]
# ducking envelope from VO activity
act = (np.abs(vo).max(1) > 0.02).astype(np.float32)
w = int(0.35 * SR); act = np.convolve(act, np.ones(w) / w, 'same'); act = np.clip(act * 3, 0, 1)
# smooth (attack/release) with a second box filter
w2 = int(0.5 * SR); act = np.convolve(act, np.ones(w2) / w2, 'same')
duck = 1 - 0.62 * act
mix = music * duck[:, None] + vo
# sfx
rng = np.random.default_rng(5)
def add(at, sig):
    s = int(at * SR); e = min(N, s + len(sig)); mix[s:e] += sig[: e - s, None]
for b0 in []:
    n = int(3 * SR); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (36 + 70 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 2.4) * 0.5
    rum = np.convolve(rng.standard_normal(n), np.ones(260) / 260, 'same') * np.exp(-tt * 1.4) * 2.4
    add(b0, (boom + rum + rng.standard_normal(n) * np.exp(-tt * 30) * 0.2).astype(np.float32) * db(-4))
def whoosh(at, dur=1.4, g=-14):
    n = int(dur * SR); tt = np.arange(n) / SR
    noise = rng.standard_normal(n); env = np.sin(np.pi * tt / dur) ** 3
    k = 40; noise = np.convolve(noise, np.ones(k) / k, 'same') * 4
    add(at - dur / 2, (noise * env * db(g)).astype(np.float32))
for at in [7.2, 32.8, 90.5, 97.4]: whoosh(at)
# riser into the Phase B reveal
n = int(2.6 * SR); tt = np.arange(n) / SR; r = np.convolve(rng.standard_normal(n), np.ones(20) / 20, 'same') * (tt / 2.6) ** 2.5 * db(-12) * 4
add(20.6, r.astype(np.float32) * 0.6)
peak = np.abs(mix).max(); mix /= max(1, peak / 0.95)
with wave.open('src/tour-premix.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'src/tour-premix.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11', '-ar', '48000', 'src/tour-mix.wav'], check=True)
print('ok', peak)
