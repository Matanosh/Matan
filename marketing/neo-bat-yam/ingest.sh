#!/usr/bin/env bash
# Downloads a generated clip and extracts it to frames/<name>/0001.jpg... at 30 fps, 1080x1920.
# Usage: ./ingest.sh <name> <url>     name: presenter | drone | lobby | balcony
set -euo pipefail
cd "$(dirname "$0")"
name=$1; url=$2
# LAND=1 extracts a landscape clip to frames-land/<name> at 1920x1080
if [ "${LAND:-0}" = 1 ]; then FD=frames-land; SZ=1920:1080; CL=clips-land; else FD=frames; SZ=1080:1920; CL=clips; fi
mkdir -p "$CL" "$FD/$name"
curl -sSfL -o "$CL/$name.mp4" "$url"
rm -f "$FD/$name"/*.jpg
ffmpeg -loglevel error -y -i "$CL/$name.mp4" -vf "fps=30,scale=$SZ:force_original_aspect_ratio=increase,crop=$SZ" -q:v 2 "$FD/$name/%04d.jpg"
echo "$name: $(ls "$FD/$name" | wc -l) frames, $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$CL/$name.mp4")s"
