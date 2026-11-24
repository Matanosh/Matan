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
- 2026-11-24: NEO Bat Yam reel finished and sent to the owner: `marketing/neo-bat-yam-reel/neo-bat-yam-reel-he.mp4` (commit 34cc127, 72 s, NEO SEA logo, 8 Nimrod clips, -13.4 LUFS). Agent report: one speech call timed out and may have been charged; ElevenLabs music nodes show "Instrumental: False" despite "no vocals" in the prompt, so both films' music needs a listen for singing.
- 2026-11-24: Owner asked that films fill the phone screen. 9:16 (1080x1920) masters have no bars but tall phones (~9:19.5) show bars in WhatsApp/gallery; decision: keep 9:16 for Instagram/TikTok and also deliver a 1080x2340 "phone" version.
- 2026-11-24: Beit Shemesh reel corrected to "עד עשרים ושבע קומות" (narration clip from flow node OLDnYyZqM2qPdGTUlq6Q, the timed-out call had finished; nothing re-generated) and delivered in two versions: `neo-beit-shemesh-reel-he-final.mp4` (1080x1920) and `neo-beit-shemesh-reel-he-phone.mp4` (1080x2340); commit 49cde20. film.html takes a height parameter.
- 2026-11-24: Lesson: an ElevenLabs call that times out may still have completed; check the flow before generating again.
- 2026-11-24: Beit Shemesh horizontal film delivered: `marketing/neo-reel/neo-beit-shemesh-film-he-16x9.mp4` (commit fc72eed, 1920x1080, 80 s, -14.3 LUFS). film.html takes ?w=&h=; render.js takes W=; loudnorm is now two-pass.
- 2026-11-24: Bat Yam horizontal film delivered: `marketing/neo-bat-yam-reel/neo-bat-yam-film-he-16x9.mp4` (commit e4ae17b, 72 s, -14.0 LUFS, plans C2/A/B drawn beside cards; `film.html?format=16x9`). Plan B too wide and touching the panel edge; a fix was started the same day.
- 2026-11-24: Bat Yam 16:9 plan fix delivered: 5 rooms now shows plan G (B too wide, B1 portrait), all plans fit their panel with even margins; commit 9de4771. Note: all Bat Yam plans are about 3:1, so room labels stay small at film size.
- 2026-11-24: Environment "Matan" now allows overpass-api.de and nominatim.openstreetmap.org (owner approved the edit) for accurate maps from OpenStreetMap. Map modules live in `marketing/maps/`.
- 2026-11-24: Attempt at accurate OSM maps failed: overpass-api.de tunnel closes mid-exchange through the agent proxy (ws_closed_mid_exchange), and a background agent for the map job was refused by the session's permission classifier. Fallback chosen: a schematic Red Line map in the Bat Yam film, labelled "מפה סכמטית, להמחשה". Revisit with the owner if exact maps are needed.
- 2026-11-24: Owner approved AI shots for Bat Yam ("תאשר את השוטים של AI לבת ים"). Four Seedance 2.5 shots started on flow YlXoNdRvzhPYem6Fvfo1 (nodes BY1–BY4: aerial-sea, penthouse-living, living-sea, living-city), 200,480 credits.
- 2026-11-24: Bat Yam second cut delivered (commit fd3fbda, 114 s, both 9:16 and 16:9, -14.0 LUFS): Red Line schematic map (`marketing/neo-bat-yam-reel/map.js`), Tel Aviv beat, developer chapter (ע.ט, Bank Mizrahi), four Seedance shots, hidden slots for competitor prices and open-view claim. About 1,990 credits (speech + new 114 s music).
- 2026-11-24: Lesson: two render agents used the same scratch folder name ("rv") at once and could corrupt each other's frames. Every render must use its own folder named after the project and format.
- 2026-11-24: Beit Shemesh third cut delivered (commit 6fbabbb, 95 s, all three formats, -14.4 LUFS): schematic Ramat Lehi location map and ע.ט developer chapter; music extended by repeating calm sections (not yet heard by a person). DEVELOPER_LOGO slot empty in both films.
- 2026-11-24: Owner: remove the "היזם / ע.ט" heading from the developer chapter in both films; the developer logo ("החברה להתחדשות עירונית") is the same company and suffices. Narration still names ע.ט.
- 2026-11-24: Owner: remove "ע.ט" from the narration too ("למחוק ע.ט"). Developer is referred to only as "החברה להתחדשות עירונית" in both films. Supersedes the line above about narration.
