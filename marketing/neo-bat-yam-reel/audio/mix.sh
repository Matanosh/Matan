#!/bin/bash
# Builds the NEO Bat Yam soundtrack and muxes it onto the silent render.
# Usage: audio/mix.sh <silent.mp4> <out.mp4>
# 1. voice.wav (72 s): each narration clip placed on its scene (times match film.html).
#    v4 (numbers) and v8 (apartment list) are cut into phrases so each lands on its number / card.
#    The title line "ניאו בת ים" is the first phrase of v9 (end-card clip), reused at 7.7 s.
# 2. Music ducked under the voice (sidechaincompress), mixed, loudness-normalised to -14 LUFS, -1 dBTP.
set -e
SRC=$(realpath "$1"); OUT=$(realpath -m "$2")
cd "$(dirname "$0")"
ffmpeg -loglevel error -y \
 -i v1-sea.mp3 -i v3-location.mp3 -i v4-numbers.mp3 -i v5-living-sea.mp3 -i v6-living-city.mp3 \
 -i v7-penthouse.mp3 -i v8-cards.mp3 -i v9-end.mp3 -filter_complex "
 [2]asplit=3[n1][n2][n3];
 [n1]atrim=0:0.95,asetpts=PTS-STARTPTS[q1]; [n2]atrim=1.05:2.45,asetpts=PTS-STARTPTS[q2]; [n3]atrim=2.70,asetpts=PTS-STARTPTS[q3];
 [6]asplit=5[c1][c2][c3][c4][c5];
 [c1]atrim=0:1.24,asetpts=PTS-STARTPTS[d1]; [c2]atrim=1.46:2.52,asetpts=PTS-STARTPTS[d2];
 [c3]atrim=2.55:3.78,asetpts=PTS-STARTPTS[d3]; [c4]atrim=3.95:4.93,asetpts=PTS-STARTPTS[d4];
 [c5]atrim=5.24,asetpts=PTS-STARTPTS[d5];
 [7]asplit=2[e1][e2]; [e1]atrim=0:1.0,afade=t=out:st=0.85:d=0.15,asetpts=PTS-STARTPTS[ti];
 [0]adelay=1000:all=1[a1]; [ti]adelay=7700:all=1[a2]; [1]adelay=12400:all=1[a3];
 [q1]adelay=19500:all=1[b1]; [q2]adelay=22300:all=1[b2]; [q3]adelay=24300:all=1[b3];
 [3]adelay=28000:all=1[a5]; [4]adelay=34800:all=1[a6]; [5]adelay=40800:all=1[a7];
 [d1]adelay=47500:all=1[k1]; [d2]adelay=50600:all=1[k2]; [d3]adelay=53600:all=1[k3];
 [d4]adelay=56600:all=1[k4]; [d5]adelay=59400:all=1[k5];
 [e2]adelay=63600:all=1[a9];
 [a1][a2][a3][b1][b2][b3][a5][a6][a7][k1][k2][k3][k4][k5][a9]amix=inputs=15:normalize=0,apad,atrim=0:72,aresample=48000[v]" \
 -map "[v]" -ac 2 voice.wav
ffmpeg -loglevel error -y -i "$SRC" -i music.mp3 -i voice.wav -filter_complex "
 [1]aresample=48000,aformat=channel_layouts=stereo,atrim=0:72,afade=t=in:st=0:d=0.5,afade=t=out:st=70:d=2,volume=0.55[m];
 [2]aformat=channel_layouts=stereo,asplit=2[vs][vm];
 [m][vs]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=450[duck];
 [duck][vm]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart -t 72 "$OUT"
echo "wrote $OUT"
