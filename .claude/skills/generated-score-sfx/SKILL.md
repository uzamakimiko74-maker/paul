---
name: generated-score-sfx
description: Synthesise a cinematic music bed and sound effects with numpy (drones, pads, war drums, impacts, bells, horn, roosters, howl, ambience) timed to a video's cuts, flashes and stamps, then duck it under the narration. Use when a video needs original sound with no stock audio and no audio API.
---

# Generated score and SFX

`scripts/score.py` reads `timeline.json` (sections, sentence times) and `events.json` (from `cartoon-3d-video-engine/scripts/events.js`) and writes `mix.wav`.

## What it builds
- Beds: dark minor pad loop (8 s chords), hopeful major pad that fades in at the rebirth chapter, sub drone; intensity curves per chapter.
- Cues from events: chapter card = riser + boom; `cut` = whoosh + thump; flash >= 0.6 = boom, else swish; bursts map by word (CRASH/THUD = boom, CLANG/BONK = metal, CHOMP/RIP = crunch, SPLASH = noise); stamps = soft tick (rate-limited to one per 0.5 s).
- Story moments by sentence id (`sentstart(sec,id)`): horn chord, three roosters then a howl, thunder, fire swell, rebirth bells, Gimle chimes, dragon rumble.
- Drums for the march and the battle chapter; sparse pentatonic plucks in calm chapters; ambience (wind, crackle) from each shot's world.
- Mix: music is ducked by 62% whenever the narration envelope is up (smoothed release), `tanh` soft limiter, peak about 0.87.

## Notes
- 44.1 kHz stereo, whole film in memory (about 130 MB float32): fine at 12 minutes.
- Runs in about 45 s. Re-run it after every timeline change (it depends on sentence ids and shot events).
- To change the mood, edit the chord tables in `chords()` and the `dark`/`hope` curves; to change loudness edit the `/ peak * .55` music level.
- No external samples or network are used, so it works offline in the sandbox.
