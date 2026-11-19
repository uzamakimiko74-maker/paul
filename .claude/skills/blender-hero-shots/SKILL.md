---
name: blender-hero-shots
description: Render short low-poly 3D hero shots (eclipse, rainbow bridge breaking, ship on waves, world tree, fire giant, green rebirth) with headless Blender EEVEE on a CPU-only cloud container, then use the PNG sequences as full-screen interludes in a video. Use when a video needs real Blender footage and no GPU is available.
---

# Blender hero shots (headless, no GPU)

## Setup
`scripts/setup_blender.sh` installs Blender 4.0 (apt), `python3-numpy` (Blender's Python needs it), and the GL libs, then smoke-tests Cycles. Put the same apt line in the environment setup script to keep it across sessions.

## Run
```bash
blender -b --python scripts/blender_shots.py -- <shot> <outdir> [width height]    # shots: eclipse bifrost naglfar yggdrasil surtr rebirth
FRAMES=100:101:1 blender -b --python scripts/blender_shots.py -- eclipse t/eclipse 640 360   # one test frame
ffmpeg -framerate 24 -i out/f%04d.png ...                                                       # optional encode
```
Output is `f0000.png ...` (192 frames = 8 s; rebirth 240). Run two shots in parallel (4 cores); a 720p EEVEE frame takes about 6 to 12 s on CPU, so six shots take ~30 to 40 minutes. `run_blender_example.sh` shows the two-lane queue and the `progress.txt` marker the render pipeline waits on.

## What worked / pitfalls
- EEVEE runs headless on software GL even though it prints `EGL Error ... NOT_INITIALIZED`; ignore those lines.
- Cycles has no denoiser in the Ubuntu build: set `use_denoising=False` or the render raises "Build without OpenImageDenoiser".
- Bloom is too strong at the defaults: use `bloom_intensity 0.07`, `threshold 1.6`, emission strengths of 1.5 to 9, not 30+.
- World sky gradient: drive a ColorRamp from the **Object** output of Texture Coordinate (`Generated` is flat in EEVEE). Map Z from about -0.1 to 0.85.
- Filmic view transform + "Medium High Contrast" keeps the flat-colour look.
- Remove large black cones/props near the camera: with bloom they read as translucent diamonds (the eclipse jaws were removed for that reason).
- Always render a single mid-shot frame at 640x360 and look at it before launching the full sequence.
- In the video page the clip is stretched across the shot with cross-faded frames (`prep()` in `part_main.js`), so slow-motion stays smooth.
