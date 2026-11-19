cd /tmp/claude-0/-home-user-paul/5ab72dda-ae82-5fe3-95d1-e8a9fef5e4cc/scratchpad
python3 - <<'P'
ref=open('ref.html').read().split('\n')
PAINT='\n'.join(ref[65:221])
old='g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,256,352)'
assert PAINT.count(old)==1, PAINT.count(old)
PAINT=PAINT.replace(old,'g.setTransform(SS,0,0,SS,0,0);g.clearRect(0,0,256,352)')
html='''<title>Japanese Gods Ranked</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">
<style>
  /* One 9:16 stage on a night ground; controls float inside it. Committed dark look: a video, not a document. */
  :root{color-scheme:dark;--ground:#0b0b16;--ink:#14102a;--paper:#ffffff;--gold:#ffd34d;
        --glass:rgba(10,8,24,.62);--line:rgba(255,255,255,.38);
        --display:Fredoka,'Trebuchet MS','Arial Rounded MT Bold',Arial,sans-serif}
  html,body{height:100%}
  body{margin:0;background:var(--ground);color:var(--paper);font-family:var(--display);
       overflow:hidden;display:flex;align-items:center;justify-content:center}
  #stage{position:relative;height:100%;max-width:100%;aspect-ratio:9/16;background:#000;overflow:hidden;margin:auto}
  #cv{width:100%;height:100%;display:block}
  #top{position:absolute;z-index:3;top:0;left:0;right:0;display:flex;align-items:center;gap:10px;padding:10px 12px}
  #prog{flex:1;min-width:0;height:4px;background:rgba(255,255,255,.22);border-radius:2px;overflow:hidden}
  #fill{height:100%;width:0;background:var(--gold)}
  #dl{flex:none;background:var(--glass);border:1px solid var(--line);color:var(--paper);border-radius:9px;
      padding:5px 11px;font:600 13px var(--display);cursor:pointer}
  #dl:disabled{opacity:.6;cursor:default}
  #overlay{position:absolute;z-index:2;inset:0;display:flex;flex-direction:column;align-items:center;
           justify-content:center;gap:12px;background:rgba(0,0,0,.45);text-align:center;padding:20px}
  #playBtn:disabled{opacity:.7;cursor:progress}
  #playBtn{font:700 23px var(--display);padding:.6em 1.4em;border:0;border-radius:999px;
           background:var(--paper);color:var(--ink);cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.45)}
  #hint{font-size:14px;font-weight:600;text-shadow:0 1px 4px #000;opacity:.92}
  button:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){#fill{transition:none}}
</style>
<div id="stage">
  <canvas id="cv"></canvas>
  <div id="top"><div id="prog"><div id="fill"></div></div><button id="dl">Download video</button></div>
  <div id="overlay">
    <button id="playBtn" disabled>Loading&hellip;</button>
    <div id="hint">Five Japanese gods ranked &middot; 94 seconds &middot; with narration</div>
  </div>
</div>
<audio id="narr" src="narration_mix.mp3" preload="auto"></audio>
<script>
'''+'\n'.join(ref[44:49])+'\nconst WORDS='+open('words.json').read()+';\n'+PAINT+'\n'+open('engine.js').read()+'\n</script>\n'
open('build/index.html','w').write(html)
print('page',len(html))
P
