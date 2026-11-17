import json,re
L=open('egypt_src.html').read().split('\n')
def sl(a,b): return '\n'.join(L[a-1:b])
A=sl(69,404)
A=A.replace('for(let i=0;i<10;i++){const c=document.createElement','for(let i=0;i<24;i++){const c=document.createElement')
assert 'i<24' in A
old="const FUR='#4b5370',DK='#343a52',LT='#9aa1b8'"
assert old in A
A=A.replace(old,"const FUR=c.fur||'#4b5370',DK=c.dk||'#343a52',LT=c.lt||'#9aa1b8'")
SPECIAL="""const SPECIAL={};
{const _dc=drawChar;drawChar=function(g,c,t){const f=SPECIAL[c.k];if(!f)return _dc(g,c,t);
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,256,352);g.shadowBlur=0;g.globalAlpha=1;if(c.flip){g.translate(256,0);g.scale(-1,1)}g.lineJoin=g.lineCap='round';g.strokeStyle=OL;
  f(g,c,t,c.ph||0);if(c.fx){g.setTransform(1,0,0,1,0,0);if(c.flip){g.translate(256,0);g.scale(-1,1)}drawFx(g,c.fx,t)}}}"""
B=sl(554,598)
C=sl(677,711)
TL=json.load(open('../work/timeline.json'))
words=[dict(w=w['w'],a=w['a'],b=w['b']) for w in TL['words']]
data="const TL="+json.dumps(dict(secs=TL['secs'],sent=TL['sent'],outro=TL['outro'],total=TL['total'],intro=TL['intro']))+";\nconst WORDS="+json.dumps(words)+";\n"
parts=[open('part_head.js').read(),A,SPECIAL,B,C,open('part_cast.js').read(),data,open('part_main.js').read(),open('part_shots.js').read()]
js='\n'.join(parts)
html="""<!doctype html><html><head><meta charset=utf8><title>Ragnarok</title>
<style>@font-face{font-family:Fredoka;font-weight:700;src:url(/web/fonts/fredoka-latin-700-normal.woff2) format('woff2')}
@font-face{font-family:Fredoka;font-weight:600;src:url(/web/fonts/fredoka-latin-600-normal.woff2) format('woff2')}
html,body{margin:0;background:#000}canvas{display:block}</style></head><body>
<canvas id=gl width=1280 height=720></canvas><canvas id=hud width=1280 height=720 style=display:none></canvas>
<script src="/web/node_modules/three/build/three.min.js"></script>
<script>
"""+js+"""
</script></body></html>"""
open('ragnarok.html','w').write(html)
print('built',len(html)//1024,'KB')
