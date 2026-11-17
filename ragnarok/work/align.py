import re, subprocess, json, sys
sys.path.insert(0,'/home/user/paul/ragnarok/work')
from texts import T
A='/home/user/paul/ragnarok/audio'
def silences(i, d=0.28, db=-38):
    out = subprocess.run(['ffmpeg','-hide_banner','-i',f'{A}/s{i}.mp3','-af',f'silencedetect=noise={db}dB:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
    en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    return list(zip(st,en))
def dur(i):
    return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{A}/s{i}.mp3'],capture_output=True,text=True).stdout)
def sentences(text):
    text=text.replace('\n',' ')
    parts=re.findall(r'[^.?!]+[.?!]?',text)
    return [p.strip() for p in parts if p.strip()]
def wlen(w):
    return max(1,len(re.sub(r'[^A-Za-zÀ-ÿ]','',w)))+ (2 if w[-1] in ',;' else 0)
def align(i):
    D=dur(i); S=sentences(T[i]); sil=silences(i,0.22,-40)
    lead=0.12; tail=D-0.1
    tot=sum(sum(wlen(w) for w in s.split()) for s in S)
    cum=0; bounds=[]; prev=lead
    cands=[(a,b) for a,b in sil if a>0.8 and b<D-0.15]
    for k,s in enumerate(S):
        L=sum(wlen(w) for w in s.split()); cum+=L
        if k==len(S)-1:
            bounds.append((prev,tail)); break
        # expected end time given remaining proportion
        exp=prev+(tail-prev)*L/(tot-(cum-L))
        free=[c for c in cands if c[0]>prev+0.5]
        c=min(free,key=lambda c:abs(c[0]-exp)) if free else (exp,exp+0.3)
        bounds.append((prev,c[0])); prev=c[1]
    words=[]
    for (a,b),s in zip(bounds,S):
        ws=s.split(); Lw=[wlen(w) for w in ws]; t=a; tt=sum(Lw)
        for w,l in zip(ws,Lw):
            d=(b-a)*l/tt; words.append(dict(w=w,a=round(t,3),b=round(t+d*0.88,3))); t+=d
    return dict(dur=D,sentences=S,bounds=bounds,words=words)
if __name__=='__main__':
    r=align(1)
    # compare with the real transcript of section 1 (sentence end times)
    truth=[2.14,7.28,10.16,16.16,33.12,35.84]
    mine=[b for a,b in r['bounds']]
    print('mine :',[round(x,2) for x in mine])
    print('truth:',truth)
    print(len(r['sentences']),'sentences')
