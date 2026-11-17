import json, subprocess, numpy as np
from scipy.io import wavfile
SR=44100
A='/home/user/paul/ragnarok/audio'
TARGET=720.0
INTRO=3.0; CARD=5.5; OUTRO=24.0
PARA_END={1:{1,3,5,6},2:{0,2},3:{0,3,6,9,10,14,15,20,22,23},4:{2,4,7,10,14},5:{1,7,12,16,19,22,25},6:{3,4,5,8,12,14},7:{6,8,9,11,12}}
HEAD={3:{0,10,15},5:{2,8,13,17,20}}       # short title sentences get a longer pause
def sents(W):
    cur=[];res=[]
    for w in W:
        cur.append(w)
        if w['w'][-1] in '.?!': res.append(cur);cur=[]
    if cur: res.append(cur)
    return res
S={};W={}
for i in range(1,8):
    W[i]=json.load(open(f'work/words_s{i}.json')); S[i]=sents(W[i])
def audio(i):
    p=subprocess.run(['ffmpeg','-v','error','-i',f'{A}/s{i}.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True)
    return np.frombuffer(p.stdout,dtype=np.float32)
AU={i:audio(i) for i in range(1,8)}
def weight(i,k):
    if k==len(S[i])-1: return 0
    if k in HEAD.get(i,()): return 1.6
    return 2.3 if k in PARA_END[i] else 1.0
tot_w=sum(weight(i,k) for i in S for k in range(len(S[i])))
narr=sum(len(AU[i])/SR for i in AU)
fixed=INTRO+narr+CARD*6+OUTRO
u=(TARGET-fixed)/tot_w
print('narration',round(narr,1),'fixed',round(fixed,1),'unit pad',round(u,3),'weights',tot_w)
out=np.zeros(int(TARGET*SR)+SR*2,dtype=np.float32)
t=INTRO; words=[]; secs=[]; sent=[]
for i in range(1,8):
    if i>1:
        secs.append(dict(n=i,card=t,start=t+CARD)); t+=CARD
    else: secs.append(dict(n=1,card=None,start=t))
    off=t; a=AU[i]; D=len(a)/SR
    # cut points: middle of the gap between sentence k and k+1
    cuts=[0.0]+[ (S[i][k][-1]['b']+S[i][k+1][0]['a'])/2 for k in range(len(S[i])-1)]+[D]
    shift=0.0
    for k,g in enumerate(S[i]):
        seg=a[int(cuts[k]*SR):int(cuts[k+1]*SR)].copy()
        n=len(seg); f=int(0.006*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f)
        place=off+cuts[k]+shift
        out[int(place*SR):int(place*SR)+n]+=seg
        for w in g: words.append(dict(w=w['w'],a=round(w['a']+shift+off,3),b=round(w['b']+shift+off,3),s=i))
        sent.append(dict(sec=i,k=k,a=round(g[0]['a']+shift+off,3),b=round(g[-1]['b']+shift+off,3),pad=round(weight(i,k)*u,3)))
        shift+=weight(i,k)*u
    t=off+D+shift
    secs[-1]['end']=t
print('narration ends',round(t,2))
OUTRO_START=t; END=t+OUTRO
print('total',round(END,2))
pk=np.abs(out).max(); out=out/pk*0.9
wavfile.write('work/narration.wav',SR,(out[:int(END*SR)]*32767).astype(np.int16))
json.dump(dict(words=words,secs=secs,sent=sent,outro=OUTRO_START,total=END,intro=INTRO),open('work/timeline.json','w'))
for s in secs: print(s)
