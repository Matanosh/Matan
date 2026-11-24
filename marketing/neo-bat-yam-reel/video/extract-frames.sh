#!/bin/bash
# Pre-extracts every frame of the AI shots (video/<name>.mp4) as JPEG for film.html: video/frames/<name>/0001.jpg ...
# and writes video/frames/index.js (frame count and fps per clip). film.html switches a scene from its still
# render to the clip only when the clip is listed there. The clips are HEVC 10-bit, which Playwright's Chromium
# cannot decode. Frames are not committed (.gitignore); run this once before node render.js.
set -e
cd "$(dirname "$0")"
mkdir -p frames
echo "window.VIDEO_FRAMES = {" > frames/index.js.tmp
for f in aerial-sea living-sea living-city penthouse-living light-rail-ride; do
  [ -f $f.mp4 ] || continue
  mkdir -p frames/$f
  if ! { [ -f frames/$f/0001.jpg ] && [ frames/$f/0001.jpg -nt $f.mp4 ]; }; then
    rm -f frames/$f/*.jpg
    ffmpeg -loglevel error -y -i $f.mp4 -vf format=yuvj420p -q:v 2 frames/$f/%04d.jpg
  fi
  n=$(ls frames/$f | wc -l)
  fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 $f.mp4 | awk -F/ '{printf "%.4f", $1/($2?$2:1)}')
  echo "  \"$f\": { frames: $n, fps: $fps }," >> frames/index.js.tmp
  echo "$f: $n frames @ $fps fps"
done
echo "};" >> frames/index.js.tmp
mv frames/index.js.tmp frames/index.js
