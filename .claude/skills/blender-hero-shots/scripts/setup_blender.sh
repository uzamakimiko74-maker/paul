#!/bin/bash
# Headless Blender in a cloud container (no GPU). Run once per container; add the same lines to the environment setup script to keep it.
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq blender python3-numpy libegl1 libgl1 libxkbcommon0 libsm6 libxi6 libxrender1 libxxf86vm1
blender --version | head -1
# smoke test: one tiny Cycles frame (denoising must be OFF: the Ubuntu build has no OpenImageDenoise)
blender -b --python-expr "import bpy;s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=8;s.cycles.use_denoising=False;s.render.resolution_x=320;s.render.resolution_y=180;s.render.filepath='/tmp/blender_smoke.png';bpy.ops.render.render(write_still=True)" >/dev/null 2>&1 && ls -la /tmp/blender_smoke.png
