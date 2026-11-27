import subprocess, wave, json, numpy as np
D='/home/user/paul/video/story/'
LINES=["My city is a giant staircase, and every night the sea climbs one step higher.",
"The higher you live, the safer you are. The poor sleep at the bottom, where the water arrives first.",
"I live on step four with my little brother, Pip. Every evening he paints our house number on the door, so the sea knows we are still here.",
"But tonight the sea stopped. And the lamp on the tower, which has burned white all my life, began to blink.",
"Then came a rumble. The sea was not stopping. It was draining away.",
"So I ran down the stairs, past empty houses, to find out what was hiding under the water.",
"At the very bottom, there was a huge door. And it was breathing.",
"I sprinted home, but I was too late. Pip had painted our number on the door again. It no longer said four. It said one."]
lead,gap=0.3,0.5
pcm=[];t=lead;starts=[];words=[];SR=None
for i,txt in enumerate(LINES):
    subprocess.run(['espeak-ng','-v','en-us','-s','150','-p','40','-w',f'{D}l{i}.wav',txt],check=True)
    w=wave.open(f'{D}l{i}.wav');SR=w.getframerate();d=np.frombuffer(w.readframes(w.getnframes()),np.int16);dur=len(d)/SR
    starts.append(t);ws=txt.split();wt=[len(x)+2 for x in ws];tot=sum(wt);acc=0
    for x,k in zip(ws,wt):
        words.append((t+dur*acc/tot,t+dur*(acc+k)/tot,x));acc+=k
    pcm.append(d);pcm.append(np.zeros(int(gap*SR),np.int16));t+=dur+gap
total=t+2.0
starts[0]=0.0
lines=[{'start':starts[i],'end':(starts[i+1] if i+1<len(starts) else total)} for i in range(len(starts))]
json.dump({'lines':lines,'total':total},open(D+'timeline.json','w'))
voice=np.concatenate([np.zeros(int(lead*SR),np.int16)]+pcm).astype(np.float32)
N=int(total*SR);v=np.zeros(N,np.float32);v[:min(N,len(voice))]=voice[:N]/32768*0.9
x=np.arange(N)/SR
m=sum(np.sin(2*np.pi*f*x+p) for f,p in((110,0),(110.4,1),(130.8,2),(164.8,3),(55,0)))*0.012*(0.6+0.4*np.sin(2*np.pi*x/7))
nz=np.random.default_rng(1).standard_normal(N).astype(np.float32);nz=np.convolve(nz,np.ones(400)/400,'same')*0.5*(0.5+0.5*np.sin(2*np.pi*x/5))
mix=np.clip(v+m+nz*0.03,-1,1)
o=wave.open(D+'mix.wav','wb');o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((mix*32767).astype(np.int16).tobytes());o.close()
def ts(s):
    h=int(s//3600);mi=int(s%3600//60);return f"{h}:{mi:02d}:{s%60:05.2f}"
ev=[]
for j,(a,b,x_) in enumerate(words):
    e=min(words[j+1][0],b+0.25) if j+1<len(words) else b+0.4
    ev.append(f"Dialogue: 0,{ts(a)},{ts(e)},Default,,0,0,0,,{{\\pos(540,1280)}}{x_}")
open(D+'cap.ass','w').write("[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\nStyle: Default,DejaVu Sans,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,8,2,5,40,40,0,1\n\n[Events]\nFormat: Layer,Start,End,Style,MarginL,MarginR,MarginV,Effect,Text\n"+"\n".join(ev)+"\n")
print('total',round(total,1),'s frames',int(total*30))
