#!/usr/bin/env bash
# Builds src/mix.wav: the voiceover, music ducked under the voice, and a whoosh on each cut.
# Usage: ./mix.sh src/music.mp3
set -euo pipefail
cd "$(dirname "$0")/src"
MUSIC=$(basename "${1:-music-long.wav}")
TOTAL=153
# cut times (seconds), the same seams as SHOTS in film.html
CUTS=(6.0 17.3 22.9 29.3 36.8 42.9 50.5 57.3 60.1 63.9 68.0 71.9 78.9 85.2 88.5 94.3 98.1 103.0 109.7 113.9 117.4 122.5 130.4 134.0 144.4)
inputs=(-i vo-long.wav -i "$MUSIC")
filters=""
labels=""
i=2
for c in "${CUTS[@]}"; do
  inputs+=(-i whoosh.mp3)
  ms=$(python3 -c "print(int(max(0,($c-0.35))*1000))")
  filters+="[$i:a]volume=0.55,adelay=${ms}|${ms}[w$i];"
  labels+="[w$i]"
  i=$((i+1))
done
n=${#CUTS[@]}
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "
[0:a]aformat=channel_layouts=stereo,apad=whole_dur=${TOTAL},asplit=2[vo][key];
[1:a]aformat=channel_layouts=stereo,atrim=0:${TOTAL},afade=t=out:st=$(python3 -c "print(${TOTAL}-1.2)"):d=1.2,volume=0.55[m];
[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=30:release=400[md];
${filters}
${labels}amix=inputs=${n}:normalize=0[wh];
[vo][md][wh]amix=inputs=3:normalize=0,alimiter=limit=0.95,atrim=0:${TOTAL}[out]" -map "[out]" -ar 48000 -c:a pcm_s16le mix.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 mix.wav
