#!/bin/bash
# Builds the NEO SEA Bat Yam soundtrack (114 s) and muxes it onto a silent render.
# Usage: audio/mix.sh <silent.mp4> <out.mp4>
# 1. voice.wav: each narration clip placed on its scene (times match film.html).
#    v4 (numbers) and v8 (apartment list) are cut into phrases so each lands on its number / card.
#    The title line "ניאו בת ים" is the first phrase of v9 (end-card clip), reused on the title.
#    Second cut (2026-11-24) adds: v-rail1 / v-rail2 (light rail, Red Line), v-telaviv, v-developer.
# 2. Music (music.mp3, 114 s instrumental bed) ducked under the voice, mixed, then two-pass loudnorm
#    to -14 LUFS / -1.5 dBTP (pass 1 measures, pass 2 applies the measurement, linear where possible).
set -e
SRC=$(realpath "$1"); OUT=$(realpath -m "$2")
cd "$(dirname "$0")"
D=114
ffmpeg -loglevel error -y \
 -i v1-sea.mp3 -i v3-location.mp3 -i v4-numbers.mp3 -i v5-living-sea.mp3 -i v6-living-city.mp3 \
 -i v7-penthouse.mp3 -i v8-cards.mp3 -i v9-end.mp3 -i v-rail1.mp3 -i v-rail2.mp3 -i v-telaviv.mp3 -i v-developer.mp3 -filter_complex "
 [2]asplit=3[n1][n2][n3];
 [n1]atrim=0:0.95,asetpts=PTS-STARTPTS[q1]; [n2]atrim=1.05:2.45,asetpts=PTS-STARTPTS[q2]; [n3]atrim=2.70,asetpts=PTS-STARTPTS[q3];
 [6]asplit=5[c1][c2][c3][c4][c5];
 [c1]atrim=0:1.24,asetpts=PTS-STARTPTS[d1]; [c2]atrim=1.46:2.52,asetpts=PTS-STARTPTS[d2];
 [c3]atrim=2.55:3.78,asetpts=PTS-STARTPTS[d3]; [c4]atrim=3.95:4.93,asetpts=PTS-STARTPTS[d4];
 [c5]atrim=5.24,asetpts=PTS-STARTPTS[d5];
 [7]asplit=2[e1][e2]; [e1]atrim=0:1.0,afade=t=out:st=0.85:d=0.15,asetpts=PTS-STARTPTS[ti];
 [0]adelay=1200:all=1[a1]; [ti]adelay=9300:all=1[a2]; [1]adelay=14600:all=1[a3];
 [8]adelay=23000:all=1[r1]; [9]adelay=30600:all=1[r2]; [10]adelay=38600:all=1[ta];
 [q1]adelay=45300:all=1[b1]; [q2]adelay=48000:all=1[b2]; [q3]adelay=50000:all=1[b3];
 [3]adelay=54500:all=1[a5]; [4]adelay=62300:all=1[a6]; [5]adelay=68800:all=1[a7];
 [d1]adelay=76000:all=1[k1]; [d2]adelay=79800:all=1[k2]; [d3]adelay=83400:all=1[k3];
 [d4]adelay=87000:all=1[k4]; [d5]adelay=90400:all=1[k5];
 [11]adelay=95300:all=1[dv]; [e2]adelay=107000:all=1[a9];
 [a1][a2][a3][r1][r2][ta][b1][b2][b3][a5][a6][a7][k1][k2][k3][k4][k5][dv][a9]amix=inputs=19:normalize=0,apad,atrim=0:$D,aresample=48000[v]" \
 -map "[v]" -ac 2 voice.wav
MIX="[1]aresample=48000,aformat=channel_layouts=stereo,atrim=0:$D,afade=t=in:st=0:d=1,afade=t=out:st=110.5:d=3.5,volume=0.5[m];
 [2]aformat=channel_layouts=stereo,asplit=2[vs][vm];
 [m][vs]sidechaincompress=threshold=0.03:ratio=6:attack=25:release=500[duck];
 [duck][vm]amix=inputs=2:normalize=0"
LN="loudnorm=I=-14:TP=-1.5:LRA=11"
M=$(ffmpeg -hide_banner -nostats -i "$SRC" -i music.mp3 -i voice.wav -filter_complex "$MIX,$LN:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
v() { echo "$M" | sed -n "s/.*\"$1\" : \"\([^\"]*\)\".*/\1/p"; }
ffmpeg -loglevel error -y -i "$SRC" -i music.mp3 -i voice.wav -filter_complex \
 "$MIX,$LN:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true,aresample=48000[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart -t $D "$OUT"
echo "wrote $OUT"
