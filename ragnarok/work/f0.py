import sys, subprocess, numpy as np
def f0(path):
    x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',path,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout,dtype=np.float32)
    sr=16000; fr=int(.04*sr); hop=int(.02*sr); res=[]
    for i in range(0,len(x)-fr,hop):
        w=x[i:i+fr]; 
        if np.sqrt((w**2).mean())<0.02: continue
        w=w-w.mean(); ac=np.correlate(w,w,'full')[fr-1:]; lo,hi=int(sr/300),int(sr/60)
        k=lo+np.argmax(ac[lo:hi]); 
        if ac[k]/ac[0]>0.5: res.append(sr/k)
    return np.median(res), np.percentile(res,10), np.percentile(res,90), len(res)
for p in sys.argv[1:]: print(p, [round(v,1) for v in f0(p)])
