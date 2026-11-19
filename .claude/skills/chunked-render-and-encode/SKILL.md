---
name: chunked-render-and-encode
description: Render a deterministic browser video to ~17,000 JPEG frames in parallel chunks that resume after interruptions, then encode MP4s (full quality, small compatible copy, chapter parts) with the mixed audio. Use for any long headless render in a cloud container that may restart.
---

# Chunked render and encode

## Render
`scripts/render.js <outdir> <start> <end> <fps>` writes `NNNNNN.jpg` and **skips frames that already exist**, which is what makes resume work. `scripts/runchunk.sh <startFrame>` renders a 480-frame chunk. Queue them:
```bash
TOTAL=$(python3 -c "import json;print(int(json.load(open('work/timeline.json'))['total']*24)+1)")
seq 0 480 $((TOTAL-1)) | xargs -P4 -n1 work/runchunk.sh        # 4 workers
```
Throughput about 10 frames/s on 4 cores (about 25 min for 12 minutes) when nothing else runs; far less while Blender jobs share the CPU. Start the local server first (`python3 -m http.server 8765 --bind 127.0.0.1`).

## Resume after a container restart
Disk persists; processes do not. Remove truncated JPEGs (last two bytes must be `FF D9`), restart the server, rerun the queue (`finish_resume_example.sh` does queue, two top-up passes, encode). Check missing frames with a quick Python set difference against `range(TOTAL)`.

## Order dependencies
Render chunks that need Blender clips last, or wait for the clips (`progress.txt`). A missing PNG makes `render.js` throw for that chunk; a top-up pass fixes it.

## Encode
```bash
# full quality (about 235 MB for 12 min)
ffmpeg -framerate 24 -i frames/%06d.jpg -i work/mix.wav -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/film.mp4
# compatible copy (about 80 MB): Main profile level 3.1
ffmpeg ... -preset slow -profile:v main -level 3.1 -crf 27 -maxrate 1800k -bufsize 3600k -g 48 -c:a aac -b:a 128k -ar 44100 -ac 2 out/film_small.mp4
```
Extra frames beyond the audio are trimmed by `-shortest`. Validate with `ffmpeg -v error -i file -f null -` and sample frames at chapter times.

## Gotchas
- A 235 MB MP4 may not load in phone apps even though it is valid: always send the small copy too.
- Do not `sleep` long in the foreground; use a background `until grep -q FINISHED log; do sleep 60; done`.
- Commit scripts, not frames/mp4 (add them to `.gitignore`).
