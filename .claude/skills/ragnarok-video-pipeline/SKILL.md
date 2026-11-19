---
name: ragnarok-video-pipeline
description: End-to-end recipe for turning a script into a finished 12-minute cartoon mythology video (voiceover, 3D worlds, Blender interludes, generated score, thumbnail, MP4s, artifact page). Orchestrates the other video skills in order. Use when asked to make a long-form video "like the Ragnarök/Egyptian gods ones" from a script.
---

# Long-form cartoon video pipeline

Work in `ragnarok/` (or any project folder) with `web/` (page), `work/` (timeline, audio), `clips/` (Blender PNGs), `frames/`, `out/`.

| # | Step | Skill |
|---|------|-------|
| 0 | Read the script (a doc/artifact link: use the Docs connector `read`, then `export` or read the node XML). Confirm voice, length (about 2.75 words/s), format (16:9 or 9:16). Check ElevenLabs credits. | `narration-timeline` |
| 1 | Install Blender and start the six hero-shot renders in the background (slowest step, about 30 to 40 min, shares CPU). | `blender-hero-shots` |
| 2 | Generate narration per section, transcribe for word times, build `timeline.json` + `narration.wav` (target total length, chapter cards). | `narration-timeline` |
| 3 | Write the shot list per sentence id, build the page, review a contact sheet of ~24 frames. | `cartoon-3d-video-engine` |
| 4 | Export events, synthesise the score and mix. | `generated-score-sfx` |
| 5 | Render all frames in chunks, then encode full, small and chapter-part MP4s. QA sample frames and audio levels. | `chunked-render-and-encode` |
| 6 | Thumbnail(s). | `thumbnail-maker` |
| 7 | Publish the artifact page with per-part download buttons. | `video-artifact-player` |
| 8 | Adobe steps only where the user asks. | `adobe-media-workflows` |

## Rules for the whole project
- Estimate cost before spending credits; confirm for long generations.
- Never claim you listened to audio or watched the video: say what was measured or sampled.
- Keep a **local copy of the original narration** so a voice change (deeper, restored) is free.
- A lengthened script should keep old sentence ids so old shots survive.
- Send deliverables with `SendUserFile` (small compatible MP4, thumbnails) and keep large files out of git.
- Commit code often and push to the PR branch; if the push returns 403, GitHub access needs reconnecting (do not retry in a loop).
- Container restarts kill background jobs but not disk: re-create waiters and resume.
- If a name in the request is unclear (a voice, a plugin), search the library/catalog first, then ask one short question.
