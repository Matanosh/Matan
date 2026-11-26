"""Assembles the long voiceover from the two narration parts, with pauses between sections.

Writes src/vo-long.wav (the film's voice track), src/words-long.json (every word on the film
clock, for captions), src/presenter-audio2.mp3 (only the on-camera lines, for the talking-head
clip) and src/timeline.json (where each section and on-camera line sits on the film clock).
"""
import json
import subprocess
from pathlib import Path

SRC = Path(__file__).parent / "src"
# Sections of the narration (Nimrod voice, two parts). Each keeps the pause that preceded it in the
# original 2:33 cut, so the edit is re-timed by a piecewise-linear map from the old film clock.
# (id, source, words, start, end in the source, on camera)
SOURCES = [
    ("v1", "nim-intro.mp3", "words-nim-intro.json", 0.00, 7.68, True),
    ("v2", "nim-p1.mp3", "words-nim-p1.json", 9.03, 24.69, False),
    ("v3", "nim-p1.mp3", "words-nim-p1.json", 25.07, 35.43, False),
    ("v4", "nim-p1.mp3", "words-nim-p1.json", 35.43, 48.93, False),
    ("v5", "nim-p1.mp3", "words-nim-p1.json", 49.43, 62.55, False),
    ("v6", "nim-p1.mp3", "words-nim-p1.json", 62.99, 64.91, True),
    ("v7", "nim-p1.mp3", "words-nim-p1.json", 64.95, 75.28, False),
    ("v8", "nim-p2.mp3", "words-nim-p2.json", 0.00, 15.46, False),
    ("v9", "nim-p2.mp3", "words-nim-p2.json", 15.46, 22.94, False),
    ("v10", "nim-p2.mp3", "words-nim-p2.json", 22.94, 31.12, True),
]
# where each section sat in the original 2:33 cut (start, end), and that cut's length
OLD = [(6.0, 16.87), (18.1, 35.66), (37.2, 49.44), (51.2, 66.34), (68.0, 84.34), (85.4, 87.96),
       (88.8, 101.63), (103.2, 121.32), (122.5, 131.39), (134.0, 143.87)]
OLD_TOTAL = 153.0
FIXES = {"ופפו.": "יפו.", "עור": "אור"}  # transcription slips, for captions only
SEGMENTS, WARP = [], [(0.0, 0.0)]
t = OLD[0][0]
for i, (sid, f, wf, a, b, cam) in enumerate(SOURCES):
    if i:
        prev = SEGMENTS[-1]
        t = prev[5] + (prev[4] - prev[3]) + (OLD[i][0] - OLD[i - 1][1])
    SEGMENTS.append((sid, f, wf, a, b, round(t, 3), cam))
    WARP += [(OLD[i][0], round(t, 3)), (OLD[i][1], round(t + b - a, 3))]
TOTAL = round(WARP[-1][1] + OLD_TOTAL - OLD[-1][1], 3)
WARP.append((OLD_TOTAL, TOTAL))

GAP = 0.5  # silence between on-camera lines in the presenter clip


def run(args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


def main():
    words, timeline, presenter = [], [], []
    inputs, parts, pres_parts = [], [], []
    files = sorted({s[1] for s in SEGMENTS})
    for f in files:
        inputs += ["-i", str(SRC / f)]
    clip_t = 0.0
    for i, (sid, f, wf, a, b, at, cam) in enumerate(SEGMENTS):
        k = files.index(f)
        fade = f"afade=t=in:d=0.01,afade=t=out:st={b - a - 0.04:.3f}:d=0.04"
        parts.append(f"[{k}:a]atrim={a}:{b},asetpts=N/SR/TB,{fade},aformat=sample_rates=48000:channel_layouts=mono,adelay={int(at * 1000)}[s{i}]")
        for w in json.load(open(SRC / wf))["words"]:
            if w["type"] == "word" and a <= w["start"] < b:
                words.append({"text": FIXES.get(w["text"], w["text"]), "start": round(w["start"] - a + at, 3), "end": round(w["end"] - a + at, 3)})
        entry = {"id": sid, "start": at, "end": round(at + b - a, 3), "camera": cam}
        if cam:
            entry["clip_start"] = round(clip_t, 3)  # where this line starts inside the presenter clip
            pres_parts.append(f"[{k}:a]atrim={a}:{b},asetpts=N/SR/TB,aformat=sample_rates=48000:channel_layouts=mono,apad=pad_dur={GAP}[p{len(pres_parts)}]")
            clip_t += b - a + GAP
        timeline.append(entry)
    mix = ";".join(parts) + ";" + "".join(f"[s{i}]" for i in range(len(SEGMENTS))) + f"amix=inputs={len(SEGMENTS)}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[out]"
    run([*inputs, "-filter_complex", mix, "-map", "[out]", "-c:a", "pcm_s16le", str(SRC / "vo-long.wav")])
    pres = ";".join(pres_parts) + ";" + "".join(f"[p{i}]" for i in range(len(pres_parts))) + f"concat=n={len(pres_parts)}:v=0:a=1[out]"
    run([*inputs, "-filter_complex", pres, "-map", "[out]", "-b:a", "192k", str(SRC / "presenter-audio2.mp3")])
    json.dump({"words": words}, open(SRC / "words-long.json", "w"), ensure_ascii=False)
    json.dump({"total": TOTAL, "presenter_clip_length": round(clip_t, 3), "segments": timeline, "warp": WARP}, open(SRC / "timeline.json", "w"), indent=1)
    print(json.dumps(timeline, indent=1))
    print("presenter clip", round(clip_t, 2), "s; words", len(words))


if __name__ == "__main__":
    main()
