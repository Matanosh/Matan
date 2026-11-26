#!/usr/bin/env bash
# Downloads a generated clip and extracts it to frames/<name>/0001.jpg... at 30 fps, 1080x1920.
# Usage: ./ingest.sh <name> <url>     name: presenter | drone | lobby | balcony
set -euo pipefail
cd "$(dirname "$0")"
name=$1; url=$2
mkdir -p clips "frames/$name"
curl -sSfL -o "clips/$name.mp4" "$url"
rm -f "frames/$name"/*.jpg
ffmpeg -loglevel error -y -i "clips/$name.mp4" -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 2 "frames/$name/%04d.jpg"
echo "$name: $(ls "frames/$name" | wc -l) frames, $(ffprobe -v error -show_entries format=duration -of csv=p=0 "clips/$name.mp4")s"
