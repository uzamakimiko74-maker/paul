---
name: adobe-media-workflows
description: How to use the Adobe connector from a cloud container (mandatory init, uploading sandbox files, speech enhancement, Express export of HTML designs) and which steps failed in practice. Use whenever a task says to use Adobe tools for images, audio or design.
---

# Adobe connector workflows

1. **Always call `adobe_mandatory_init` first**, once per conversation. For designs also call `create_visual_design_express_skill` (it returned only a session id here).
2. **Upload a sandbox file**: `asset_initialize_file_upload(path,file_size,media_type)` returns a transfer document with a one-chunk PUT URL (`at.adobe.com/...`, allowed host). PUT the bytes with `curl -L -X PUT --data-binary @file -H "Content-Type: <mime>"`, then `asset_finalize_file_upload(filename, transfer_document)` with the document verbatim. A finalize once failed ("no Location header"); a fresh initialize + upload + finalize worked (retry once, new path name). Results give `assetId` and `presignedAssetUrl`.
3. **Speech enhancement** (`media_enhance_speech(assetId)`) returns a task with `pollTool: enhanceSpeechPoll`, but that poll tool is not exposed in this connector, so the result cannot be fetched. Do not rely on it; use ffmpeg (`rubberband`, EQ, compressor) for voice work instead.
4. **Express export** (`html_export_readiness_skill`, then `export_html_to_express`): text, shapes and fonts import (fonts map to Source Sans), but an external image URL imported as a blank placeholder. Embedding base64 inline works in principle but is very large in a tool call. Deliver the PNG you rendered yourself and mention the Express draft is text-only.
5. `video_render` is capped at 10 minutes of timeline, so it cannot assemble a 12-minute film; use ffmpeg.
6. Tell the user honestly which Adobe steps worked and which did not.
