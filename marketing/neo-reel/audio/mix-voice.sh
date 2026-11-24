#!/bin/bash
# Builds voice.wav (80 s) by placing each narration clip at its scene time.
# Clip v6 (room list) is cut into phrases so each lands on its apartment card.
set -e
cd "$(dirname "$0")"
ffmpeg -loglevel error -y \
 -i v1.mp3 -i v2.mp3 -i v3.mp3 -i v4.mp3 -i v5.mp3 -i v6.mp3 -i v7.mp3 -filter_complex "
 [5]asplit=6[r1][r2][r3][r4][r5][r6];
 [r1]atrim=0:1.05,asetpts=PTS-STARTPTS[p1];
 [r2]atrim=1.40:2.35,asetpts=PTS-STARTPTS[p2];
 [r3]atrim=2.68:3.60,asetpts=PTS-STARTPTS[p3];
 [r4]atrim=3.92:4.98,asetpts=PTS-STARTPTS[p4];
 [r5]atrim=5.33:7.05,asetpts=PTS-STARTPTS[p5];
 [r6]atrim=7.40,asetpts=PTS-STARTPTS[p6];
 [0]adelay=600:all=1[a1];  [1]adelay=6000:all=1[a2]; [2]adelay=15000:all=1[a3];
 [3]adelay=24000:all=1[a4]; [4]adelay=35500:all=1[a5];
 [p1]adelay=43000:all=1[b1]; [p2]adelay=47500:all=1[b2]; [p3]adelay=52000:all=1[b3];
 [p4]adelay=59000:all=1[b4]; [p5]adelay=63600:all=1[b5]; [p6]adelay=65900:all=1[b6];
 [6]adelay=70500:all=1[a7];
 [a1][a2][a3][a4][a5][b1][b2][b3][b4][b5][b6][a7]amix=inputs=12:normalize=0,apad,atrim=0:80,aresample=48000[v]" \
 -map "[v]" -ac 2 voice.wav
