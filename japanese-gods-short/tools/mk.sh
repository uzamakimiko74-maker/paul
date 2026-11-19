cd /tmp/claude-0/-home-user-paul/5ab72dda-ae82-5fe3-95d1-e8a9fef5e4cc/scratchpad
python3 - <<'P'
ref=open('ref.html').read().split('\n')
html='''<title>Japanese Gods Ranked</title>
<style>
:root{color-scheme:dark;--display:Fredoka,'Trebuchet MS',Arial,sans-serif}
html,body{height:100%;margin:0;background:#0b0b16}
body{display:flex;align-items:center;justify-content:center;font-family:var(--display);color:#fff}
#stage{position:relative;aspect-ratio:9/16;max-height:100vh;background:#000}
#cv{width:100%;height:100%;display:block}
#overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4)}
#playBtn{font:700 24px var(--display);padding:.6em 1.4em;border:0;border-radius:999px;background:#fff;color:#14102a;cursor:pointer}
</style>
<div id="stage"><canvas id="cv"></canvas><div id="overlay"><button id="playBtn">▶ Play with sound</button></div></div>
<audio id="narr" src="narration_mix.mp3" preload="auto"></audio>
<script>
'''+'\n'.join(ref[44:49])+'\nconst WORDS='+open('words.json').read()+';\n'+'\n'.join(ref[65:221])+'\n'+open('engine.js').read()+'\n</script>\n'
open('build/index.html','w').write(html)
P
