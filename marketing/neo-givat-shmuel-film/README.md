# NEO Givat Shmuel Phase B film (2:00, 1920x1080)

- `film.html` + `construct.js`: the film, drawn from `render(t)` (photos with slow camera moves, captions, and an isometric demolition/construction sequence at 21.6–41.6s).
- `music.py`: writes `music.wav` (original track, booms synced to the demolition). Not committed; regenerate before rendering.
- `render.js`: `python3 music.py && node render.js <outdir> 30 - 4` renders frames and encodes `film.mp4`.
- `img/`: project renders and logos supplied by the client.
- Contact line on the end card: set `CONTACT` at the top of the script in `film.html`.

## Tour film (v3, 1:52) — `neo-givat-shmuel-tour-1080p.mp4` / `neo-givat-shmuel-tour-whatsapp.mp4`
- Cinematic shots: ElevenLabs flow "NEO Givat Shmuel – Phase B film", Kling 3 Pro image-to-video from the client renders (`src/clips/`).
- Voiceover: ElevenLabs v4, voice "Nimrod – Warm & Confident" (`src/vo/`); score: ElevenLabs Music v2.5 (`src/music/score-b.mp3`).
- Build: extract clip frames (`ffmpeg -i src/clips/X.mp4 -vf fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080 <frames>/X/%04d.jpg`),
  `python3 mix-tour.py`, then `PAGE=tour.html QS="?frames=<frames>" AUDIO=src/tour-mix.wav node render-tour.js <out> 30 - 4`.
- WhatsApp version: 1280x720, 2-pass H.264 at 1 Mbps, under 16 MB.
