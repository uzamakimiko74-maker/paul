---
name: narration-timeline
description: Turn a script into narration audio and a sentence-accurate master timeline (word times, chapter cards, pauses) using ElevenLabs text-to-speech and speech-to-text, with a pause-based aligner when STT credits run out, plus a deeper-voice recipe. Use when a video must be cut to the voiceover and captions must land on the right words.
---

# Narration and master timeline

## 1. Script as sentences with ids (`scripts/script2.py`, `texts.py`)
Keep every sentence that already has a shot (id `'0','1',...`) and add new ones with new ids (`a1`, `b2`...) via an insertion table `INS[section][afterOldIndex]`. That lets you lengthen a script without redoing the shot list. Mark paragraph ends (`para`) for pacing. One TTS request per section (about 1,000 to 2,800 characters is fine).

## 2. Generate and transcribe (ElevenLabs connector)
- Voice: `mcp__ElevenLabs__creative_list_voices` (Brad - Deep Cinematic Narrator `9z2KRE0crZu7bZt1ZfUH` was used; Jarnathan `c6SfcYrb2t09NHXiT80T` exists). Model `eleven_v4`, `generations_count: 1`, same `flow_id` for everything.
- Natural pace is about 2.75 words per second; about $0.20 per 1,000 characters. Estimate first (`estimate_only: true`).
- Requests beyond the concurrency limit queue and retry on their own; poll `creative_get_flow_run_status`.
- Download the mp3 from `content_url` right away (links expire in about 2 hours).
- Word timestamps: `creative_attach_reference_file` (url of the mp3) then `creative_transcribe_audio`. The status result is too large for context: it is saved to a file, so parse it with Python (`transcripts[].words[]` with `text,start,end,type`). Never print it.
- Credits: the plan quota can run out mid-project (error "0 credits remaining"). Check before regenerating.

## 3. Timeline (`align2.py`, `plan2.py`)
`align2.align(stt_words, sentences)` matches script tokens to STT tokens with difflib (accents stripped) and returns first/last word per sentence id. `plan2.py` cuts each section audio at the midpoint of sentence gaps, adds weighted pads (paragraph end 3x, headings 2x), inserts a 4.5 s chapter card before sections 2 to 7, then writes `timeline.json` (`words`, `secs`, `sent`, `outro`, `total`) and `narration.wav`. Solve the pad unit so the total hits the target (e.g. 720 s); a longer script means smaller pads and faster pacing.

## 4. When STT is unavailable (`est_align.py`)
Energy-envelope Viterbi: low-energy runs are candidate sentence boundaries; sentence durations follow `rate x characters`. Measured against real transcripts: mean error 0.05 to 0.13 s, worst boundary about 1.9 s. Good enough for captions, not for frame-exact cuts.

## 5. Deeper voice (post, free)
```bash
ffmpeg -i s.mp3 -af "rubberband=pitch=0.81,equalizer=f=110:t=h:width=90:g=3,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,alimiter=limit=0.95" -ar 44100 -ac 1 deep.wav
```
Pitch 0.81 lowers the median F0 about 12% (95 to 84 Hz, measured with `f0.py`) and keeps duration, so the timeline is unchanged. Keep the untouched recordings so the original voice can be restored by pointing `plan2.py` at them.
