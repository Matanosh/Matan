# Marketing films

## How films are made (history)
- As of `Matanosh/Matan@c459f27` (2026-11-24): films are a single `film.html` with a `window.render(t)` timeline and `window.TOTAL`, rendered frame by frame by `render.js` (Playwright screenshots, then ffmpeg to MP4). See `marketing/club-film/`.
- 2026-11-16: 30 s vertical Beit Shemesh film, branch `claude/prompt-audit-0e2ua3`, `marketing/beit-shemesh-film/`.
- 2026-11-24: 66 s horizontal NEO film (build-up of the towers, lobby, apartment, view, country club, Type D plan), branch `ccr-a2ee6db7-laq945`, commit 4e7d338, `marketing/neo-film/`. Not merged to main.
- 2026-11-24: The owner referred to a series called "נדל"ן בלי פילטרים". No trace of it was found in the repo, on any branch or on the web; its look is unknown.

## Tools available (2026-11-24)
- ElevenLabs connector: Hebrew TTS and image-to-video models (e.g. Seedance, Kling). Account tier "growing_business", about 1.15M of 1.8M credits left on 2026-11-24. Reference images must reach it as a conversation attachment or a public https URL; there is no local-file upload tool.
- AI-generated shots and voices follow `docs/policies/ai-images-policy.md`: label renders "הדמיה", label AI voice, no numbers from AI.

## NEO vertical reel (started 2026-11-24)
- Owner's choices (2026-11-24): vertical 9:16 reel, 60–90 s; Hebrew AI narrator; AI camera moves over the renders for a virtual tour; all apartment types, not only Type D.
- Draft script sent to the owner on 2026-11-24 (session transcript), waiting on: other floor plans, whether phase B is NEO, price and phone to show.

Related: [neo-beit-shemesh](neo-beit-shemesh.md), [file-intake](file-intake.md).
- 2026-11-24: Owner decided the NEO reel shows no price (session transcript).
- 2026-11-24: Owner chose phone 054-522-0030 for the NEO reel end card (session transcript).
- 2026-11-24: Narration recorded with ElevenLabs voice "Nimrod - Warm & Confident" (ZiofZHcEBTn5sRySe5h8), model eleven_v4, one clip per paragraph so each lands on its scene; timing in `marketing/neo-reel/audio/mix-voice.sh` (commit 24ebafd). Two music options (eleven_music_v2_5). All on ElevenLabs flow YlXoNdRvzhPYem6Fvfo1.
- 2026-11-24: Four Seedance 2.5 image-to-video shots (9:16, 1080p, 8–10 s) set up on that flow; estimate 213,156 credits (about $35). Waiting for the owner's go-ahead before running.
- 2026-11-24: Lesson: ElevenLabs output files live on elevenlabsusercontent.com, which the Default environment blocks; the "Matan" cloud environment allows it. Reference images reach ElevenLabs via raw.githubusercontent.com (the repo is public).
- 2026-11-24: Open: the reel has no "AI voice" label yet (policy rule 3); add before publishing.
- 2026-11-24: Plan (chief of staff): with two project reels built the same way (NEO Beit Shemesh, NEO Bat Yam), extract a shared film kit once the Bat Yam reel lands: one `film.html` engine, one render/mix script, and a per-project data file (facts, scenes, narration lines, phone). Each fact in the data file cites its wiki line. Goal: a new project film becomes "write the data file + add renders", with numbers only from the data file.
- 2026-11-24: Owner approved the AI shots ("כן"). Four Seedance 2.5 shots started on flow YlXoNdRvzhPYem6Fvfo1: 213,156 credits charged (session transcript). Music A chosen by default for the final Beit Shemesh cut; owner may still switch to B.
- 2026-11-24: Brand assets (logos for NEO Beit Shemesh, NEO Bat Yam, MS Group; Bat Yam floor plans from Drive folder "תכניות דירה" 1bz9OB5SWJlKgel5NLfI3TU81ctN8zX5W) being prepared into `marketing/brand/`.
- 2026-11-24: Brand assets landed in `marketing/brand/` (commit f679c8b): transparent logos for NEO Beit Shemesh, NEO Sea Bat Yam, NEO Seaside Living Bat Yam, MS Group, each in colour/on-dark/white, listed in its README. The NEO Beit Shemesh mark was cut from the plan at 228 px: fine on phones, needs a vector file from the developer for print. Beit Shemesh reel with real logos, "שיווק: MS Group" and "קריינות: AI": `marketing/neo-reel/neo-beit-shemesh-reel-he-final.mp4` (stills, before the AI shots).
- 2026-11-24: Final NEO Beit Shemesh reel with the four AI shots, real logo, narration and music A sent to the owner: `marketing/neo-reel/neo-beit-shemesh-reel-he-final.mp4` (commit ea51a18, 80 s, 28.6 MB, -15.1 LUFS).
- 2026-11-24: Lesson (agent report, ea51a18): Seedance returns HEVC 10-bit, which Playwright's Chromium cannot decode; frames are pre-extracted with `marketing/neo-reel/video/extract-frames.sh` before rendering (frames not committed). Seedance with a start frame keeps the start frame's aspect ("auto") even when 9:16 is requested; crop in the edit. In the country shot the "קאנטרי" sign drifts out of frame halfway.
