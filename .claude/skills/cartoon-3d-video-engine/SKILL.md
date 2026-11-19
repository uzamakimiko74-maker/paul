---
name: cartoon-3d-video-engine
description: Build a deterministic cartoon-style explainer video in a browser page (three.js low-poly worlds + 2D cartoon characters on sprites, word-by-word captions, stamps, flashes, chapter cards) and render it headlessly frame by frame. Use for mythology, history or ranking videos in the Egyptian-gods / Ragnarök short style, 16:9 or vertical, any length.
---

# Cartoon 3D video engine

A page where **everything on screen is a pure function of the clock `t`**: `update(t)` sets camera, world, cast and Blender background; `drawHUD` paints captions/stamps; `renderFrame(t)` returns a JPEG. Because it is deterministic, headless Chromium can render frame N independently and in parallel.

## Files (`scripts/`)
- `cast_core.js`: character painter. Round white heads, dot eyes, dark outline `#1d1830`, kinds in `KINDS` (OD Odin, TH Thor, TY/TR Tyr, FR Freyr, VI Vidar, LO Loki, GE, GI, M soldier, W wolf, RV raven, JO serpent, RO rooster...). Props (gungnir, hammer, horn, antler, gsword, rod, bowl, dart), fx (glow, hearts, runes, poison, spark, steam), expressions (`neutral power angry shocked smug worried happy dizzy point lift reach sleep`).
- `part_head.js` (renderer 1280x720, helpers), `part_cast.js` (extra kinds: BA FG HO HL HM SU SI SS MK VA MO MG OH VK LF LS EN SO GY, rooster sprite, `bowl`/`dart` props), `part_main.js` (worlds void/dusk/hall/cave/winter/doom/plain/fire/green/gimle, Blender background manager, `update`, `drawHUD`, `renderFrame`/`renderClean`), `part_shots_ragnarok_example.js` (the full shot list: copy and rewrite for a new topic).
- `build.py <timeline.json> <out.html> [shots.js]` assembles the page. `render.js` renders frames (`--times out t1,t2` for review, or `out start end fps`). `events.js` exports flash/burst/stamp times for sound design.
- `fonts/`: Fredoka (served locally; Google Fonts is blocked in the sandbox).

## Setup
```bash
mkdir -p web && cd web && npm i three@0.128.0 @fontsource/fredoka playwright   # Chromium is pre-installed
cp -r <skill>/scripts/* . ; mkdir -p fonts; cp fonts/*.woff2 fonts/
python3 build.py ../work/timeline.json ragnarok.html
python3 -m http.server 8765 --bind 127.0.0.1   # from the folder that contains web/ and clips/
NODE_PATH=$(npm root -g):$PWD/node_modules node render.js --times ../test 20,60,120   # look at a contact sheet first
```
WebGL works headless via `--use-gl=angle --use-angle=swiftshader`. About 0.25 s per 1280x720 frame per worker.

## Authoring a shot
`sh(sec, sentenceId, fraction, world, camFrom, camTo, lookFrom, lookTo, opts)`. Start time comes from the narration timeline (sentence id), so shots follow the voice. `opts`: `cast` (array or `(lt,p,t,dur)=>array`), `stamp:[[delay,'TEXT',color,x,y,size]]`, `burst`, `flash`, `cut`, `shake`, `dim`, `darken`, `bl:'clipName'` (Blender interlude, `blFrom/blTo`), `hud(g,W,H,t,lt)` for custom overlays. Cast entry: `C(kind, expression, x, scale, {y,flip,prop,fx,at,pop,rot})`; sprite height = 1.375 x scale.
Reuse the same primitives for every topic: new characters are just new `KINDS` entries.

## Pitfalls already solved
- Do not copy the monster/Egyptian blocks of the original page: they overwrite `KINDS.TY` (Tyr). `KINDS.TR=KINDS.TY` is the alias.
- `SPECIAL` is the table for non-humanoid sprites; `drawChar` is wrapped to consult it first.
- Sprite pool is 24 (patched from 10) so armies fit.
- `flatShading` warnings on Lambert materials in three r128 are harmless.
- Captions use `capIdx(t)` on `WORDS` (real STT times); highlight words via the `EMPH` set.
- Shots must be sorted by start time (`SHOTS.sort`) because `shotAt` is a binary search.
- Missing Blender frames make `renderFrame` throw: render those time ranges only after the clips exist.
