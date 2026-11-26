#!/usr/bin/env bash
# Renders the film on all cores, then encodes it with the mix.  Usage: ./build.sh <outdir>
set -euo pipefail
cd "$(dirname "$0")"; OUT=$(realpath -m "$1"); mkdir -p "$OUT"; N=${N:-4}
for s in $(seq 0 $((N-1))); do node render.js "$OUT" 30 - $s $N > "$OUT/shard$s.log" 2>&1 & done; wait
AUD=src/mix.wav; [ -f "$AUD" ] || AUD=src/vo-a.wav
ffmpeg -loglevel error -y -framerate 30 -i "$OUT/f%05d.jpg" -i "$AUD" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT/film.mp4"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/film.mp4"
