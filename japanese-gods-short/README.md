# Japanese gods ranked (short)

Source for `out/japanese-gods-ranked.mp4` (93.8 s, 1080x1920).

- `index.html` – self-contained canvas page (open through a local web server); plays `narration_mix.mp3`.
- `bg/` – seven backgrounds rendered in Blender (`tools/scenes.py`, run `blender -b -P scenes.py -- <scene> <out.jpg>`).
- `tools/align.py` – places script words on the audio using its pauses (no speech recognition).
- `tools/mix.py` – mixes light sound effects under the narration.
- `tools/render.js` – captures frames with Playwright; encode with ffmpeg.
- `tools/engine.js` + `tools/mk.sh` – page logic and the assembler. `mk.sh` splices the character painter from the ranking-short skill's reference page, which is not included here.
