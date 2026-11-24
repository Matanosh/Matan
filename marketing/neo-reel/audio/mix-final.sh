#!/bin/bash
# Mixes narration (voice.wav, from mix-voice.sh) and music option A over a silent reel into a
# final film. Same filter as the commit 24ebafd previews: music at 0.3, ducked under the voice
# (sidechain), 4 s fade at the end, loudness -14 LUFS.
# Loudness is two-pass: pass 1 measures the mix, pass 2 feeds those measurements back to loudnorm
# (linear where the true-peak ceiling allows; this mix needs ~10 dB, so loudnorm compresses), and
# the film measures -14.3 LUFS. The old one-pass loudnorm measured -15.1.
# Usage: audio/mix-final.sh [silent.mp4] [out.mp4]
#   defaults: neo-beit-shemesh-reel-he.mp4 -> neo-beit-shemesh-reel-he-final.mp4 (9:16 master).
#   Tall phone version: audio/mix-final.sh <out>/neo-reel.mp4 neo-beit-shemesh-reel-he-phone.mp4
#   (silent render from H=2340 node render.js <out>).
#   16:9 film: audio/mix-final.sh <out>/neo-reel.mp4 neo-beit-shemesh-film-he-16x9.mp4
#   (silent render from W=1920 H=1080 node render.js <out>). Relative paths are taken from neo-reel/.
set -e
cd "$(dirname "$0")/.."
IN="${1:-neo-beit-shemesh-reel-he.mp4}"; OUT="${2:-neo-beit-shemesh-reel-he-final.mp4}"
MIX="[2]volume=0.3,afade=t=out:st=76:d=4[mu];[1]asplit=2[vo1][vo2];[mu][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=450[md];[md][vo2]amix=inputs=2:normalize=0"
LN="loudnorm=I=-14:TP=-1.5:LRA=11"
M=$(ffmpeg -hide_banner -nostats -i "$IN" -i audio/voice.wav -i audio/music-a.mp3 -filter_complex "$MIX,$LN:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
v() { echo "$M" | sed -n "s/.*\"$1\" : \"\([^\"]*\)\".*/\1/p"; }
ffmpeg -loglevel error -y -i "$IN" -i audio/voice.wav -i audio/music-a.mp3 -filter_complex \
 "$MIX,$LN:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true,aresample=48000[aout]" \
 -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
