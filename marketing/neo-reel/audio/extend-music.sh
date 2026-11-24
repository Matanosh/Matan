#!/bin/bash
# Builds music-a-ext.wav (95.04 s) from music-a.mp3 (80.04 s) for the 95 s cut, with no new
# generation: two calm sections are played twice, each joined with a 0.6 s equal-power crossfade.
# The track is 80 bpm in 4/4 (3.0 s bars), so each repeat is whole bars and lands on the beat.
#   +6 s (2 bars) at 7.50 s: the quiet intro (1.50–7.50) plays again under the location map beat.
#   +9 s (3 bars) at 23.60 s: the steady -20 LUFS section (14.60–23.60) plays again.
# Splice points were chosen by spectral similarity of the two sides (0.91 and 0.93 on a 0–1 scale).
# The track's own decay (originally 76–80 s) now ends the film at 91–95 s, as before.
set -e
cd "$(dirname "$0")"
H=0.3   # half the crossfade
ffmpeg -loglevel error -y -i music-a.mp3 -filter_complex "
 [0]asplit=3[a][b][c];
 [a]atrim=0:$(echo "7.50+$H"|bc),asetpts=PTS-STARTPTS[s1];
 [b]atrim=$(echo "1.50-$H"|bc):$(echo "23.60+$H"|bc),asetpts=PTS-STARTPTS[s2];
 [c]atrim=$(echo "14.60-$H"|bc),asetpts=PTS-STARTPTS[s3];
 [s1][s2]acrossfade=d=0.6:c1=qsin:c2=qsin[x];
 [x][s3]acrossfade=d=0.6:c1=qsin:c2=qsin,aresample=48000[out]" -map "[out]" music-a-ext.wav
