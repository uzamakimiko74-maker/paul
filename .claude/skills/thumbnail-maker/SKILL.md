---
name: thumbnail-maker
description: Make a video thumbnail (horizontal 1280x720 or vertical 1080x1920) from a clean render of the video's own characters and world plus bold Fredoka title text, exported as PNG. Use when the user asks for a thumbnail, cover or poster for a cartoon video; includes the Egyptian-gods version and the Adobe Express export caveats.
---

# Thumbnail maker

## Recipe
1. **Clean background, no HUD or captions.** For the Ragnarök engine: `scripts/render_clean_frame.js <t> out.jpg` (16:9) or `render_clean_frame_portrait.js <t> out.jpg` (1080x1920; moves the camera back to about z=24, y=3.6 so two characters fit). Pick `t` from `timeline.json` (a sentence start plus 1 to 2 s). For the saved Egyptian-gods page use `render_egypt_page_frames.js <times...>` with `CLEAN=1 PFX=clean` (needs the page's `bg_*.jpg`, three.js and GLTFLoader served locally; the Egyptian title card is around t=6.9 s, Ra at 75.6 s).
2. **HTML layout over it** (`thumb_*_example.html`): 1080x1920 or 1280x720 `.slide`, background image, Fredoka 700 text with `-webkit-text-stroke` + `paint-order: stroke fill`, one rounded tag at the bottom. Fonts load from a local `woff2` (Google Fonts is blocked).
3. **Render:** `node scripts/screenshot.js http://127.0.0.1:8765/thumb.html out.png 1080 1920`.
4. Look at the PNG once; fix clipping, then send with `SendUserFile` (`display: render`) and commit it.

## Rules learned
- Title width: "RAGNARÖK" at 168px fits 1080 wide; at 218px it clips. Leave a margin on both sides; check the subtitle too.
- Keep the tag clear of the characters' feet (bottom 55 px is safe).
- Do not add a duration badge or a "VS" unless asked (the user removed both).
- Put the title in the empty sky area; shift the camera x so both characters are fully in frame.
- Vertical = 9:16 (shorts); the video and the thumbnail can differ in aspect.

## Adobe Express export (optional)
`export_html_to_express` takes the HTML inline or a hosted URL. Inline base64 images make the call huge; an Adobe-hosted presigned URL imported as a blank placeholder, and fonts were mapped to Source Sans. Result: editable text layers but no picture. Treat the PNG as the deliverable and mention that the Express document lacks the photo layer. See `adobe-media-workflows`.
