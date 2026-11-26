"""Assembles the long voiceover from the two narration parts, with pauses between sections.

Writes src/vo-long.wav (the film's voice track), src/words-long.json (every word on the film
clock, for captions), src/presenter-audio2.mp3 (only the on-camera lines, for the talking-head
clip) and src/timeline.json (where each section and on-camera line sits on the film clock).
"""
import json
import subprocess
from pathlib import Path

SRC = Path(__file__).parent / "src"
# (id, source file, words file, start, end in the source, where it starts in the film, on camera)
SEGMENTS = [
    ("v1", "vo2-a.mp3", "words2-a.json", 0.00, 10.87, 6.0, True),      # hello, Neo Bat Yam
    ("v2", "vo2-a.mp3", "words2-a.json", 11.17, 28.73, 18.1, False),   # location, light rail
    ("v3", "vo2-a.mp3", "words2-a.json", 29.13, 41.37, 37.2, False),   # two towers
    ("v4", "vo2-a.mp3", "words2-a.json", 41.63, 56.77, 51.2, False),   # lobby
    ("v5", "vo2-a.mp3", "words2-a.json", 57.33, 73.67, 68.0, False),   # elevators, 4 per floor
    ("v6", "vo2-a.mp3", "words2-a.json", 74.05, 76.61, 85.4, True),    # and now, the apartments
    ("v7", "vo2-a.mp3", "words2-a.json", 76.93, 89.76, 88.8, False),   # apartment mix
    ("v8", "vo2-p2.mp3", "words2-p2.json", 0.00, 18.12, 103.2, False), # living room
    ("v9", "vo2-p2.mp3", "words2-p2.json", 18.61, 27.50, 122.5, False),# vitrine, balcony
    ("v10", "vo2-p2.mp3", "words2-p2.json", 28.05, 37.92, 134.0, True),# closing
]
TOTAL = 153.0
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
                words.append({"text": w["text"], "start": round(w["start"] - a + at, 3), "end": round(w["end"] - a + at, 3)})
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
    json.dump({"total": TOTAL, "presenter_clip_length": round(clip_t, 3), "segments": timeline}, open(SRC / "timeline.json", "w"), indent=1)
    print(json.dumps(timeline, indent=1))
    print("presenter clip", round(clip_t, 2), "s; words", len(words))


if __name__ == "__main__":
    main()
