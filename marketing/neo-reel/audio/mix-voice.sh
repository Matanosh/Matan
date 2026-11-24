#!/bin/bash
# Builds voice.wav (95 s) by placing each narration clip at its scene time.
# v2 (7.0 s) was re-recorded on 2026-11-24 with "עד עשרים ושבע קומות" (27 floors). Since the location
# map (8.6–14.6 s) it is cut in three: "NEO." on the logo (6.0 s), "רובע מגורים חדש, עם מגדלים של עד
# עשרים ושבע קומות" over the map (9.4 s), "שדרות ירוקות ורחובות מוארים" over the complex (15.0 s).
# Clip v6 (room list) is cut into phrases so each lands on its apartment card.
# v8 (2026-11-24, developer chapter 74–83 s): "היזם: עין טית, החברה להתחדשות עירונית. מהחברות
# המובילות בישראל, עם ניסיון של עשרות אלפי יחידות דיור." Flow YlXoNdRvzhPYem6Fvfo1, node 06OWoZh6wF6E8bMFbbZ2.
# Every scene after the map is 6 s later than in the 80 s cut; the end card (v7) is 15 s later.
set -e
cd "$(dirname "$0")"
ffmpeg -loglevel error -y \
 -i v1.mp3 -i v2.mp3 -i v3.mp3 -i v4.mp3 -i v5.mp3 -i v6.mp3 -i v7.mp3 -i v8.mp3 -filter_complex "
 [1]asplit=3[n1][n2][n3];
 [n1]atrim=0:0.62,asetpts=PTS-STARTPTS[q1];
 [n2]atrim=0.62:4.44,asetpts=PTS-STARTPTS[q2];
 [n3]atrim=4.44,asetpts=PTS-STARTPTS[q3];
 [5]asplit=6[r1][r2][r3][r4][r5][r6];
 [r1]atrim=0:1.05,asetpts=PTS-STARTPTS[p1];
 [r2]atrim=1.40:2.35,asetpts=PTS-STARTPTS[p2];
 [r3]atrim=2.68:3.60,asetpts=PTS-STARTPTS[p3];
 [r4]atrim=3.92:4.98,asetpts=PTS-STARTPTS[p4];
 [r5]atrim=5.33:7.05,asetpts=PTS-STARTPTS[p5];
 [r6]atrim=7.40,asetpts=PTS-STARTPTS[p6];
 [0]adelay=600:all=1[a1];
 [q1]adelay=6000:all=1[c1]; [q2]adelay=9200:all=1[c2]; [q3]adelay=14850:all=1[c3];
 [2]adelay=21000:all=1[a3]; [3]adelay=30000:all=1[a4]; [4]adelay=41500:all=1[a5];
 [p1]adelay=49000:all=1[b1]; [p2]adelay=53500:all=1[b2]; [p3]adelay=58000:all=1[b3];
 [p4]adelay=65000:all=1[b4]; [p5]adelay=69600:all=1[b5]; [p6]adelay=71900:all=1[b6];
 [7]adelay=74600:all=1[a8];
 [6]adelay=85500:all=1[a7];
 [a1][c1][c2][c3][a3][a4][a5][b1][b2][b3][b4][b5][b6][a8][a7]amix=inputs=15:normalize=0,apad,atrim=0:95,aresample=48000[v]" \
 -map "[v]" -ac 2 voice.wav
