import json, subprocess, numpy as np, sys
from scipy.io import wavfile
sys.path.insert(0, '/home/user/paul/ragnarok/work')
from align2 import align
SR = 44100
TARGET = 720.0; INTRO = 3.0; CARD = 4.5; OUTRO = 20.0
SCRIPT = {int(k): v for k, v in json.load(open('script2.json')).items()}
HEAD_IDS = {3: {'0', '10', '15'}, 5: {'2', '8', '13', '17', '20'}}
def audio(i):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'/home/user/paul/ragnarok/audio2/orig_s{i}.wav', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True)
    return np.frombuffer(p.stdout, dtype=np.float32)
AU = {i: audio(i) for i in range(1, 8)}
STT = {i: json.load(open(f'words2_s{i}.json')) for i in range(1, 8)}
AL = {}
for i in range(1, 8):
    AL[i], cov = align(STT[i], SCRIPT[i]); print('sec', i, 'script words matched', round(cov * 100), '%')
def weight(i, idx):
    it = SCRIPT[i][idx]
    if idx == len(SCRIPT[i]) - 1: return 0
    if it['id'] in HEAD_IDS.get(i, ()): return 2.0
    return 3.0 if it['para'] else 0.0
tot_w = sum(weight(i, k) for i in SCRIPT for k in range(len(SCRIPT[i])))
narr = sum(len(AU[i]) / SR for i in AU)
fixed = INTRO + narr + CARD * 6 + OUTRO
u = max(0.12, (TARGET - fixed) / tot_w) if tot_w else 0
u = min(u, 0.6)
print('narration', round(narr, 1), 's  fixed', round(fixed, 1), ' pad unit', round(u, 3), ' projected total', round(fixed + u * tot_w, 1))
total_len = fixed + u * tot_w + 2
out = np.zeros(int(total_len * SR) + SR * 4, dtype=np.float32)
t = INTRO; words = []; secs = []; sent = []
for i in range(1, 8):
    if i > 1: secs.append(dict(n=i, card=t, start=t + CARD)); t += CARD
    else: secs.append(dict(n=1, card=None, start=t))
    off = t; a = AU[i]; D = len(a) / SR; W = STT[i]; al = AL[i]
    # cut between sentence idx and idx+1 at the middle of the gap
    cuts = [0.0] + [(W[al[k][2]]['b'] + W[al[k + 1][1]]['a']) / 2 for k in range(len(al) - 1)] + [D]
    shift = 0.0
    for k, (sid, f, l) in enumerate(al):
        seg = a[int(cuts[k] * SR):int(cuts[k + 1] * SR)].copy(); n = len(seg); fd = int(0.006 * SR)
        if n > 2 * fd: seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
        place = off + cuts[k] + shift
        out[int(place * SR):int(place * SR) + n] += seg
        for j in range(f, l + 1):
            words.append(dict(w=W[j]['w'], a=round(W[j]['a'] + shift + off, 3), b=round(W[j]['b'] + shift + off, 3), s=i))
        sent.append(dict(sec=i, id=sid, a=round(W[f]['a'] + shift + off, 3), b=round(W[l]['b'] + shift + off, 3), pad=round(weight(i, k) * u, 3)))
        shift += weight(i, k) * u
    t = off + D + shift; secs[-1]['end'] = t
OUTRO_START = t; END = t + OUTRO
print('narration ends', round(t, 1), 'total', round(END, 1))
pk = np.abs(out).max(); out = out / pk * 0.9
wavfile.write('narration.wav', SR, (out[:int(END * SR)] * 32767).astype(np.int16))
json.dump(dict(words=words, secs=secs, sent=sent, outro=OUTRO_START, total=END, intro=INTRO), open('timeline.json', 'w'))
