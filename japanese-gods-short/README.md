# Japanese gods ranked (short)

Source for `out/japanese-gods-ranked.mp4` (93.8 s, 1080x1920).
Published as an artifact: https://claude.ai/artifact/43N7zrkoHdhnmu5hseyh4R

- `index.html` – self-contained canvas page (open through a local web server); plays `narration_mix.mp3`.
- `bg/` – seven backgrounds rendered in Blender (`tools/scenes.py`, run `blender -b -P scenes.py -- <scene> <out.jpg>`).
- `hagoromo.png` – Amaterasu's celestial mantle: a 16-frame flutter loop modelled and rendered in Blender
  (`tools/hagoromo.py`, run `blender -b -P hagoromo.py -- "hago/f%02d.png" 16`), tiled 4x4 into one sheet.
- `tools/align.py` – places script words on the audio using its pauses (no speech recognition).
- `tools/mix.py` – mixes light sound effects under the narration.
- `tools/render.js` – captures frames with Playwright; encode with ffmpeg.
- `tools/cuts.js` – prints the shot count and shot-length spread, to keep the cutting honest.
- `tools/click-states.js` – checks the Download button in all three overlay states (start, mid-playback,
  finished), since the overlay changes between them. Serves range requests so seeking to the end works.
- Type is Fredoka, loaded from Google Fonts by the page. Install it locally before rendering frames,
  or the captured video falls back to a different face than the published page shows.
- `tools/engine.js` + `tools/mk.sh` – page logic and the assembler. `mk.sh` splices the character painter from the ranking-short skill's reference page, which is not included here.
