#!/bin/bash
# Mixes narration (voice.wav, from mix-voice.sh) and music option A over the silent reel into the
# final film. Same filter as the commit 24ebafd previews: music at 0.3, ducked under the voice
# (sidechain), 4 s fade at the end, loudness -14 LUFS.
set -e
cd "$(dirname "$0")/.."
ffmpeg -loglevel error -y -i neo-beit-shemesh-reel-he.mp4 -i audio/voice.wav -i audio/music-a.mp3 -filter_complex \
 "[2]volume=0.3,afade=t=out:st=76:d=4[mu];[1]asplit=2[vo1][vo2];[mu][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=450[md];[md][vo2]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[aout]" \
 -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart neo-beit-shemesh-reel-he-final.mp4
