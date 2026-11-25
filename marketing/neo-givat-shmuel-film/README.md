# NEO Givat Shmuel Phase B film (2:00, 1920x1080)

- `film.html` + `construct.js`: the film, drawn from `render(t)` (photos with slow camera moves, captions, and an isometric demolition/construction sequence at 21.6–41.6s).
- `music.py`: writes `music.wav` (original track, booms synced to the demolition). Not committed; regenerate before rendering.
- `render.js`: `python3 music.py && node render.js <outdir> 30 - 4` renders frames and encodes `film.mp4`.
- `img/`: project renders and logos supplied by the client.
- Contact line on the end card: set `CONTACT` at the top of the script in `film.html`.
