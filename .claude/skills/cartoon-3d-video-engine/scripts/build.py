"""Assemble ragnarok.html (or any topic): head + cast_core + cast extras + timeline data + main + shots.
Usage: python3 build.py <timeline.json> <out.html> [shots.js]   (run from the folder holding the part_*.js files)"""
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(sys.argv[1])); out = sys.argv[2]; shots = sys.argv[3] if len(sys.argv) > 3 else os.path.join(H, 'part_shots_ragnarok_example.js')
words = [dict(w=w['w'], a=w['a'], b=w['b']) for w in tl['words']]
data = "const TL=" + json.dumps(dict(secs=tl['secs'], sent=tl['sent'], outro=tl['outro'], total=tl['total'], intro=tl['intro'])) + ";\nconst WORDS=" + json.dumps(words) + ";\n"
rd = lambda n: open(os.path.join(H, n)).read()
js = '\n'.join([rd('part_head.js'), rd('cast_core.js'), rd('part_cast.js'), data, rd('part_main.js'), open(shots).read()])
html = """<!doctype html><html><head><meta charset=utf8><title>Video</title>
<style>@font-face{font-family:Fredoka;font-weight:700;src:url(/web/fonts/fredoka-latin-700-normal.woff2) format('woff2')}
@font-face{font-family:Fredoka;font-weight:600;src:url(/web/fonts/fredoka-latin-600-normal.woff2) format('woff2')}
html,body{margin:0;background:#000}canvas{display:block}</style></head><body>
<canvas id=gl width=1280 height=720></canvas><canvas id=hud width=1280 height=720 style=display:none></canvas>
<script src="/web/node_modules/three/build/three.min.js"></script>
<script>
""" + js + "\n</script></body></html>"
open(out, 'w').write(html); print('built', out, len(html) // 1024, 'KB')
