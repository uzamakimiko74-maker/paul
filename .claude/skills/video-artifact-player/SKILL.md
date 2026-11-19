---
name: video-artifact-player
description: Publish a long video as a claude.ai artifact: a themed player page that stitches several chapter-aligned MP4 parts (each under the 15 MB file limit) into one timeline, with chapter list and per-part download buttons that use the downloads capability. Use whenever a user asks to "make the video an artifact" or needs a playable/downloadable video page.
---

# Video artifact player

## Limits that shape the design
- Artifact files: **15 MB each** (assets 20 MiB). A 12-minute video cannot be one file, so cut it into parts at chapter boundaries and play them back to back.
- Video via a relative `<video src="part1.mp4">` plays; use H.264 Main + AAC, `+faststart`.
- The viewer allows **one save per click**. Three saves from one click fail on the third: use **one button per part** (`.dl` with `data-part`).

## Steps
1. Encode parts: `scripts/encode_parts.sh frames work/mix.wav 24 "part1:0:7290:0:303.75:290 ..."` (budget `(14 MB x 8 - audio) / seconds`; 854x480, crf 27 with `-maxrate`). Check one frame per part by eye. Keep the full-quality file for the chat (`SendUserFile`).
2. Copy `scripts/player_index_example.html`, edit `PARTS` (src, start, dur), `TOTAL`, `CHAPTERS`, title and copy. It double-buffers two `<video>` elements, has a single global scrubber, play/pause, mute, full screen, chapter buttons, a poster, and the dark Fredoka look. No `<html>/<head>` tags (the platform wraps the page).
3. Test: `node scripts/click-test-multi.js <dir> ".dl" 3` from a folder with `node_modules/playwright`. It checks nothing covers each button, stubs `downloads`, clicks, and lists the saved names/sizes. See the user's `artifact-download-button` skill for the overlay and stacking rules.
4. Publish: `Artifact` with `file_path`, `files:{"part1.mp4":path,...,"poster.jpg":path}`, `capabilities:{"downloads":true}`, `icon:"video"`, one-sentence `description`. Republish with `url` to keep the link; omit `capabilities` to carry them forward.
5. Say plainly: the real save prompt only appears inside claude.ai and was not seen; the artifact is private until shared.

## Gotchas
- The page title (first 8 KB) names the artifact; keep it stable.
- The local test server lacks a charset header, so "ö" looks garbled locally only.
- Publishing 3 x ~13 MB is fine (limit 64 MB per publish).
- After changing audio, re-encode **and** republish all parts.
