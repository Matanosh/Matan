# Builds Hebrew caption cues (captions-tour.js, captions-vertical.js) from the ElevenLabs Scribe word timings of
# src/vo/vo-all.mp3 (the 11 narration lines joined in order) and each film's narration placements.
import json, subprocess, numpy as np
words = [w for w in json.load(open('src/vo/words.json'))['words'] if w.get('type') == 'word' and w['text'].strip('-–') != '']
durs, onsets = [], []
for k in range(1, 12):
    f = f'src/vo/vo{k:02d}.mp3'
    durs.append(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout))
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    onsets.append(np.argmax(np.abs(a) > 0.02) / 16000)
# words per narration line, in order (the join drifts, so split by count, not by time)
COUNTS = [7, 17, 8, 24, 15, 9, 15, 9, 6, 11, 10]
assert sum(COUNTS) == len(words), (sum(COUNTS), len(words))
segs, i = {}, 0
for k, n in enumerate(COUNTS, 1): segs[k] = [dict(w) for w in words[i:i + n]]; i += n
# one token per number phrase, NEO in Latin letters
MERGE = [(['מאה', 'ארבעים', 'וארבע'], '144'), (['ארבע', 'עשרה'], '14'), (['מאתיים', 'ושתיים'], '202'), (['עשר', 'עד', 'שש', 'עשרה.'], '\u206610–16\u2069.'), (['עשר', 'עד', 'שש', 'עשרה'], '\u206610–16\u2069')]
def merge(ws):
    out, i = [], 0
    while i < len(ws):
        for seq, rep in MERGE:
            if [x['text'] for x in ws[i:i + len(seq)]] == seq:
                out.append({'text': rep, 'start': ws[i]['start'], 'end': ws[i + len(seq) - 1]['end']}); i += len(seq); break
        else:
            t = ws[i]['text'].replace('נאו', 'NEO'); out.append({**ws[i], 'text': t}); i += 1
    return out
def chunks(ws, maxw=4):
    cur = []
    for w in ws:
        cur.append(w)
        if len(cur) >= maxw or w['text'][-1] in '.,:' and len(cur) >= 2:
            yield cur; cur = []
    if cur: yield cur
def build(place, name):
    cues = []
    for k, at in place.items():
        ws = merge(segs[k]); shift = at + onsets[k - 1] - ws[0]['start']
        for c in chunks(ws):
            txt = ' '.join(w['text'] for w in c).rstrip(',')
            cues.append([round(c[0]['start'] + shift - 0.05, 2), round(c[-1]['end'] + shift + 0.3, 2), txt])
    for a, b in zip(cues, cues[1:]): a[1] = min(a[1], b[0] - 0.02)
    open(name, 'w').write('window.CUES = ' + json.dumps(cues, ensure_ascii=False) + ';\n')
    print(name, len(cues)); [print(c) for c in cues[:6]]
build({1: 1.6, 2: 8.8, 3: 17.8, 4: 23.4, 5: 33.8, 6: 50.6, 7: 58.0, 8: 73.2, 9: 82.4, 10: 91.2, 11: 98.4}, 'captions-tour.js')

print([len(segs[k]) for k in segs])
