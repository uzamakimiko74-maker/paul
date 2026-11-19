import re, json, subprocess
SCRIPT="""One goddess plunged the entire world into darkness... by hiding in a cave. These are Japan's five most powerful gods, ranked.
Number five. Ebisu. God of luck and fishermen. He was born without bones, and set adrift at sea. Somehow, he's still smiling. Today he's one of the Seven Lucky Gods, and fishermen still pray to him. Power? Mostly vibes.
Number four. Susanoo. The storm god. He beat an eight-headed serpent by getting it drunk. Smart. Inside its tail, he found the legendary sword Kusanagi. Then he wrecked heaven itself, and got thrown out. Less smart.
Number three. Tsukuyomi. God of the moon. Cold, silent, and extremely petty. He killed a goddess over bad table manners. Now the sun refuses to look at him. That's why day and night never meet.
Number two. Izanami. Queen of the underworld. She vowed to kill a thousand people every day. Her husband replied: I'll create fifteen hundred. Ancient relationship drama... with a body count. And she's the reason the dead never come back.
Number one. Amaterasu. Goddess of the sun. When she hid, the world went dark. It took a mirror and a dance party to lure her out. Japan's emperors still claim her as their ancestor. Light, order, and the throne. All hers.
Who did I rank wrong? Comment below, and subscribe for more."""
out=subprocess.run("ffmpeg -hide_banner -i build/narration.mp3 -af silencedetect=noise=-30dB:d=0.06 -f null - 2>&1",shell=True,capture_output=True,text=True).stdout
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",out)]
en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",out)]
sil=list(zip(st,en)); END=93.8
speech0=sil[0][1] if sil[0][0]<.1 else 0
if sil[0][0]<.1: sil=sil[1:]
if sil and sil[-1][1]>=END-.4: sil=sil[:-1]
phr=[p.strip() for p in re.split(r"\.\.\.|[.,:?]",SCRIPT.replace("\n"," ")) if p.strip()]
def syl(w):
    w=re.sub(r"[^a-z]","",w.lower()); n=len(re.findall(r"[aeiouy]+",w))
    if w.endswith("e") and n>1 and not w.endswith("le"): n-=1
    return max(1,n)
W=[sum(syl(w)+.35 for w in p.split()) for p in phr]
n=len(phr); m=len(sil)
tot=sum(W); a=(END-.3-speech0-sum(e-s for s,e in sil)*.6)/tot
INF=1e18
def run(a):
    # dp[j][i]: phrase j ends at silence i (boundary after phrase j); last phrase ends at END
    dp=[[INF]*(m+1) for _ in range(n)]; bp=[[None]*(m+1) for _ in range(n)]
    def cost(j,t0,t1,sidx):
        d=(t1-t0)-W[j]*a
        lo=.6*W[j]*a
        pen=60*(lo-(t1-t0))**2 if (t1-t0)<lo else 0
        return d*d+pen
    for i in range(m):
        dp[0][i]=cost(0,speech0,sil[i][0],i)-1.5*min(sil[i][1]-sil[i][0],.8)
    for j in range(1,n):
        for i in range(m+1):
            t1=sil[i][0] if i<m else END
            if j<n-1 and i==m: continue
            if j==n-1 and i!=m: continue
            for k in range(i):
                if dp[j-1][k]>=INF: continue
                c=dp[j-1][k]+cost(j,sil[k][1],t1,i)-(1.5*min(sil[i][1]-sil[i][0],.8) if i<m else 0)
                if c<dp[j][i]: dp[j][i]=c; bp[j][i]=k
    i=m; bounds=[]
    for j in range(n-1,0,-1):
        k=bp[j][i]; bounds.append(k); i=k
    return bounds[::-1]
b=run(a)
# refine rate
segs=[]; prev=speech0
for j in range(n):
    t1=sil[b[j]][0] if j<n-1 else END
    segs.append((prev,t1)); prev=sil[b[j]][1] if j<n-1 else END
a2=sum(s1-s0 for s0,s1 in segs)/tot
b=run(a2)
segs=[]; prev=speech0
for j in range(n):
    t1=sil[b[j]][0] if j<n-1 else END
    segs.append((prev,t1)); prev=sil[b[j]][1] if j<n-1 else END
# speech intervals inside each phrase
def speech_iv(t0,t1):
    iv=[(t0,t1)]
    for s,e in sil:
        nxt=[]
        for x,y in iv:
            if e<=x or s>=y: nxt.append((x,y))
            else:
                if s>x: nxt.append((x,s))
                if e<y: nxt.append((e,y))
        iv=nxt
    return iv
KEY=set("goddess darkness cave five four three two one number ebisu susanoo tsukuyomi izanami amaterasu luck bones smiling lucky vibes serpent drunk smart kusanagi wrecked thrown moon petty killed sun never thousand fifteen drama dead sky mirror dance throne wrong comment subscribe world dark gods ranked".split())
words=[]
dbg=[]
for j,(p,(t0,t1)) in enumerate(zip(phr,segs)):
    ws=p.split(); ww=[syl(w)+.35 for w in ws]; iv=speech_iv(t0,t1); tl=sum(y-x for x,y in iv) or (t1-t0)
    def at(f):
        d=f*tl
        for x,y in iv:
            if d<=y-x+1e-9: return x+d
            d-=y-x
        return iv[-1][1]
    c=0; T=sum(ww)
    for w,wt in zip(ws,ww):
        s=at(c/T); e=at((c+wt*.86)/T); c+=wt
        words.append({"w":w,"k":1 if re.sub(r"[^a-z]","",w.lower()) in KEY else 0,"a":round(s,2),"b":round(e,2)})
    dbg.append((round(t0,2),round(t1,2),p))
json.dump(words,open("words.json","w"))
for d in dbg: print(*d)
print(len(words),"words; rate",round(a2,3))
