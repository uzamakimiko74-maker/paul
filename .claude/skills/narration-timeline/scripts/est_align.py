import json, re, subprocess, sys, numpy as np
sys.path.insert(0,'/home/user/paul/ragnarok/work')
def envelope(path, hop=0.01):
    x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',path,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout,dtype=np.float32)
    n=int(16000*hop); m=len(x)//n
    e=np.sqrt((x[:m*n].reshape(m,n)**2).mean(1))
    k=5; e=np.convolve(e,np.ones(k)/k,mode='same')
    return e, hop
def wlen(w): return max(1,len(re.sub(r'[^A-Za-zÀ-ÿ0-9]','',w)))+(3 if w[-1] in ',;:' else 0)
def est(path, items):
    e,hop=envelope(path); T=len(e)*hop
    thr=np.percentile(e,35)*0.6
    # speech span
    sp=np.where(e>thr*2)[0]; t0=sp[0]*hop; t1=sp[-1]*hop+hop
    # expected sentence durations
    L=[sum(wlen(w) for w in it['text'].split()) + (4 if it['para'] else 2) for it in items]
    tot=sum(L); cum=np.cumsum([0]+L)/tot
    N=len(items); fr=len(e)
    # candidate boundary frames: local minima of energy inside the speech span
    lo=int(t0/hop); hi=int(t1/hop)
    cand=[i for i in range(lo+20,hi-20) if e[i]<=e[max(0,i-15):i+16].min()+1e-9 and e[i]<np.percentile(e[lo:hi],45)]
    # a pause is a run of low energy: take the centre of low runs
    low=(e<np.percentile(e[lo:hi],30)); runs=[];i=lo
    while i<hi:
        if low[i]:
            j=i
            while j<hi and low[j]: j+=1
            if (j-i)*hop>=0.22: runs.append(((i+j)//2,(j-i)*hop))
            i=j
        else: i+=1
    # DP over boundaries: sentence k should last about rate*L_k seconds
    Lraw=[sum(wlen(w) for w in it['text'].split()) for it in items]
    rate=(t1-t0)/(sum(Lraw)+2.2*N*0.0+1e-9)*0.93
    R=len(runs); cost=np.full((N,R),1e18); prev=np.zeros((N,R),int)
    starts=[t0]+[None]*(N-1)
    for r in range(R):
        tr=runs[r][0]*hop; d=tr-runs[r][1]/2-t0
        cost[1,r]=((d-rate*Lraw[0])/(0.28*rate*Lraw[0]+0.35))**2 if N>1 else 0
    for k in range(2,N):
        for r in range(R):
            tr=runs[r][0]*hop-runs[r][1]/2
            for q in range(r):
                ts=runs[q][0]*hop+runs[q][1]/2
                d=tr-ts
                if d<0.4: continue
                v=cost[k-1,q]+((d-rate*Lraw[k-1])/(0.28*rate*Lraw[k-1]+0.35))**2
                if v<cost[k,r]: cost[k,r]=v; prev[k,r]=q
    # last sentence closes at t1
    best=1e18; rb=0
    for r in range(R):
        ts=runs[r][0]*hop+runs[r][1]/2; d=t1-ts
        if N>1 and cost[N-1,r]<1e17:
            v=cost[N-1,r]+((d-rate*Lraw[N-1])/(0.28*rate*Lraw[N-1]+0.35))**2
            if v<best: best=v; rb=r
    idx=[0]*N; r=rb
    for k in range(N-1,0,-1):
        idx[k]=r; r=prev[k,r]
    bounds=[runs[idx[k]] for k in range(1,N)]
    # sentence spans: end of pause k-1 .. start of pause k
    spans=[]; s=t0
    for k in range(N):
        if k<N-1:
            c,d=bounds[k]; ctr=c*hop; end=ctr-d/2; spans.append((s,end)); s=ctr+d/2
        else: spans.append((s,t1))
    words=[]
    for (a,b),it in zip(spans,items):
        ws=it['text'].split(); Lw=[wlen(w) for w in ws]; tt=sum(Lw); t=a
        for w,l in zip(ws,Lw):
            d=(b-a)*l/tt; words.append(dict(w=w,a=round(t,3),b=round(t+d*0.92,3),id=it['id'])); t+=d
    return words,spans
if __name__=='__main__':
    sec=int(sys.argv[1]); S=json.load(open('script2.json'))[str(sec)]
    words,spans=est(f'../audio2/s{sec}.mp3',S)
    if len(sys.argv)>2:   # compare to truth
        W=json.load(open(f'words2_s{sec}.json')); from align2 import align
        al,_=align(W,S); err=[]
        for (sid,f,l),(a,b) in zip(al,spans): err.append((abs(W[f]['a']-a),abs(W[l]['b']-b)))
        err=np.array(err); print('mean start err',err[:,0].mean().round(2),'mean end err',err[:,1].mean().round(2),'max',err.max().round(2))
    else:
        json.dump([dict(w=w['w'],a=w['a'],b=w['b']) for w in words],open(f'words2_s{sec}.json','w')); print('wrote',len(words))
