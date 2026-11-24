#!/bin/bash
# Pre-extracts every frame of the AI shots as JPEG for film.html (video/frames/<name>/0001.jpg ...).
# The clips are HEVC 10-bit, which Playwright's Chromium cannot decode, and per-frame JPEGs make the
# render frame-accurate without relying on <video> seeking. Frames are not committed (.gitignore);
# run this once before node render.js.
set -e
cd "$(dirname "$0")"
for f in aerial lobby living country; do
  mkdir -p frames/$f
  [ -f frames/$f/0001.jpg ] && [ frames/$f/0001.jpg -nt $f.mp4 ] && continue
  rm -f frames/$f/*.jpg
  ffmpeg -loglevel error -y -i $f.mp4 -vf format=yuvj420p -q:v 2 frames/$f/%04d.jpg
  echo "$f: $(ls frames/$f | wc -l) frames"
done
