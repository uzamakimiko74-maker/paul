import json,subprocess,numpy as np,wave,re
SR=44100
raw=subprocess.run("ffmpeg -v error -i build/narration.mp3 -ac 1 -ar 44100 -f f32le -",shell=True,capture_output=True).stdout
nar=np.frombuffer(raw,dtype=np.float32).copy();N=len(nar)
W=json.load(open('words.json'));cl=lambda s:re.sub(r"[^a-z']","",s.lower())
def wt(key,after=0,n=0):
    for w in W:
        if w['a']>=after-.01 and cl(w['w'])==key:
            if n==0:return w['a']
            n-=1
    return after+1
sfx=np.zeros(N,dtype=np.float32);rs=np.random.RandomState(3)
def add(t,x,g=1.0):
    x=x/max(1e-6,np.abs(x).max());i=int(t*SR)
    if i<0:x=x[-i:];i=0
    e=min(N,i+len(x))
    if e>i:sfx[i:e]+=x[:e-i]*g
def lp(x,a):
    y=np.zeros_like(x);s=0
    for i,v in enumerate(x):s+=a*(v-s);y[i]=s
    return y
def thump(f=70,d=.7):
    t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*(f+60*np.exp(-t*14))*t)*np.exp(-t*6)
def whoosh(d=.45):
    n=int(d*SR);x=lp(rs.randn(n).astype(np.float32),.08);t=np.linspace(0,1,n);return x*np.sin(np.pi*t)**2*6
def rumble(d=1.8):
    n=int(d*SR);x=lp(rs.randn(n).astype(np.float32),.02);t=np.arange(n)/SR;return x*np.exp(-t*1.6)*30
def chime(f,d=1.2):
    t=np.arange(int(d*SR))/SR;return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2*t))*np.exp(-t*3.2)
def pop(d=.12):
    t=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*(900-3000*t)*t)*np.exp(-t*30)
n5=[w['a'] for w in W if w['w']=='Number']
T_LINE=wt('these');OUT=wt('who',60)
add(.02,thump(50,1.4),.35);add(0,whoosh(.4),.12)
for t in [T_LINE]+[x-.06 for x in n5]+[OUT-.05]:
    add(t-.35,whoosh(),.18);add(t,thump(),.3)
sec4=[x for x in n5][1]
add(wt('wrecked',n5[1]),rumble(),.3)
add(wt('mirror',n5[4]),chime(1175),.16);add(wt('mirror',n5[4])+.12,chime(1568),.12);add(wt('mirror',n5[4])+.24,chime(1976),.1)
add(wt('lure',n5[4]),chime(880,1.5),.18);add(wt('lure',n5[4])+.1,chime(1320,1.5),.14)
add(wt('hers',n5[4]),chime(1568,1.5),.2);add(wt('hers',n5[4])+.1,chime(2093,1.5),.15)
add(wt('subscribe',OUT)+.35,pop(),.3)
for k,(key,aft) in enumerate([('thousand',n5[3]),('fifteen',n5[3])]):add(wt(key,aft),thump(110,.4),.3)
mix=nar*1.0+sfx
pk=np.abs(mix).max();print('peak',pk)
if pk>.97:mix*=.97/pk
w=wave.open('mix.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
print('ok',N/SR)
