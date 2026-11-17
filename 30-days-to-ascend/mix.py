#!/usr/bin/env python3
"""30 Days to Ascend: warm, gentle score + soft foley + narration -> out/mix.wav (48 kHz stereo).
No hiss, crackle, projector clatter or tape ageing: the bed is clean. Everything is synthesized (numpy/scipy) except the Kokoro narration."""
import json, os
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

SR = 48000; DUR = 70.0; BPM = 120; BEAT = 60 / BPM
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(30)
N = int(DUR * SR)

def tt(d): return np.arange(int(round(d * SR))) / SR
def env(d, tau): return np.exp(-tt(d) / tau)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(round(d * SR)))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def ov(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def fade(x, a=.004, r=.02):
    n = len(x); fa, fr = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    x = x.copy()
    if fa: x[:fa] *= np.linspace(0, 1, fa)
    if fr: x[n - fr:] *= np.linspace(1, 0, fr)
    return x
def add(buf, t0, sig, g=1.0):
    i = int(round(t0 * SR))
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i] * g

# ——— warm instruments ———
def bass(m, d=.55):
    t = tt(d); f = mtof(m); x = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t)
    return fade(lp(x, 500) * np.exp(-t / (d * .6)), .008, .08)
def marimba(m, d=.5):
    t = tt(d); f = mtof(m); x = np.sin(2 * np.pi * f * t) * np.exp(-t / .22) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / .05) + .1 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / .02)
    return fade(x, .001, .06)
def uke(m, d=.35):
    t = tt(d); f = mtof(m); x = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / (.16 / k ** .4)) for k, a in [(1, 1), (2, .5), (3, .3), (4, .12)])
    return fade(lp(x, 4500), .002, .06)
def glock(m, d=.9):
    t = tt(d); f = mtof(m); x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (.55 / k)) for r, a, k in [(1, 1, 1), (2.76, .25, 1.8), (5.4, .08, 2.5)])
    return fade(lp(x, 9000), .002, .1)
def pad(ms, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(m) * t) + .3 * np.sin(2 * np.pi * mtof(m) * 2 * t) for m in ms)
    e = np.minimum(1, t / .5) * np.minimum(1, (d - t) / .6); return lp(x, 1800) * e / max(1, len(ms))
def soft_tick(p=1.0): t = tt(.06); return fade(np.sin(2 * np.pi * 1100 * p * t) * np.exp(-t / .012), .0005, .01)

# ——— soft foley ———
def slide(f0, f1, d, vib=0):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) * (1 + vib * .015 * np.sin(2 * np.pi * 6 * t)); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(lp(np.sin(ph) * .8 + .12 * np.sin(2 * ph), 5000), .02, .06)
def boing(d=.6):
    t = tt(d); f = 190 + 50 * np.exp(-t / .1) * np.sin(2 * np.pi * 12 * t) + 120 * np.exp(-t / .25); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(lp(np.sin(ph) + .3 * np.sin(2 * ph), 3000) * np.exp(-t / .3), .004, .06)
def bell(f=1800, d=.8):
    t = tt(d); return fade(sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (d * k)) for r, a, k in [(1, 1, .4), (2.76, .35, .25), (5.4, .12, .15)]), .001, .08)
def thud(d=.4):
    t = tt(d); return fade(np.sin(2 * np.pi * (60 + 90 * np.exp(-t / .06)) * t) * np.exp(-t / .13), .002, .05)
def bonk():
    w = marimba(43, .5) * 1.4; th = thud(.5); n = min(len(w), len(th)); return fade(w[:n] * .8 + th[:n] * .8, .002, .06)
def squeak(d=.35):
    t = tt(d); f = 520 + 700 * (t / d) ** .7; ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(lp(np.sin(ph), 3000) * np.minimum(1, t / .03) * .7, .01, .08)
def crack():   # soft cracking: a few marimba knocks instead of a noise burst
    x = np.zeros(int(.5 * SR))
    for k in range(5): add(x, k * .06 + rng.random() * .02, marimba(80 - k * 3, .1), .5)
    return x
def paper(d=.25): return fade(marimba(84, d) + marimba(91, d) * .6, .002, .08)
def pop():
    d = .15; t = tt(d); return fade(np.sin(2 * np.pi * (400 + 900 * np.exp(-t / .02)) * t) * np.exp(-t / .04), .001, .03)
def chew():
    d = .3; t = tt(d); return fade(np.sin(2 * np.pi * (150 - 60 * t / d) * t) * np.exp(-t / .1) * .8, .005, .06)
def ratchet(d=.6):
    x = np.zeros(int(d * SR)); t0 = 0; gap = .03
    while t0 < d - .03: add(x, t0, soft_tick(1.2), .5); t0 += gap; gap *= 1.07
    return x
def wahwah():
    out = np.zeros(int(1.6 * SR)); notes = [(66, .32), (65, .32), (64, .32), (62, .9)]; t0 = 0
    for m, d in notes:
        t = tt(d); f = mtof(m); ph = 2 * np.pi * f * t; x = sum(np.sin(ph * k) / k ** 1.2 for k in range(1, 6))
        x = lp(x, 1100) * np.minimum(1, t / .03) * (.6 + .4 * np.abs(np.sin(np.pi * t / d * (2 if d < .5 else 5)))) * np.exp(-t / (d * 1.5))
        add(out, t0, fade(x, .01, .06), .55); t0 += d
    return out
def chime(m=72, d=.9): return ov(*[glock(m + i, d) * (1 - .15 * k) for k, i in enumerate((0, 4, 7, 12))])
def tinkle():
    x = np.zeros(int(.8 * SR))
    for i, m in enumerate((88, 91, 95, 100)): add(x, i * .08, glock(m - 12, .5), .5)
    return x
def footstep(): return ov(marimba(48, .12) * .5, soft_tick(.7) * .3)

# ——— events ———
ev = json.load(open(os.path.join(HERE, 'events.json')))['ev']
S = {'hit': lambda: chime(72), 'shade': ratchet, 'wah': wahwah, 'boing': boing, 'gulp': lambda: slide(220, 100, .25),
     'flex': squeak, 'wince': lambda: slide(800, 500, .25), 'flag': lambda: ov(glock(84, .6), pop() * .5), 'crack': crack,
     'wave': lambda: ov(glock(79, .5), np.pad(glock(76, .6), (int(.2 * SR), 0))), 'shoes': footstep, 'sign': lambda: marimba(60, .3),
     'stop': lambda: np.zeros(10), 'page': paper, 'bzz': None, 'sting': lambda: chime(74), 'puff': lambda: slide(300, 160, .45) * .5,
     'chew': chew, 'pop': pop, 'plink': lambda: glock(88, .5), 'bonk': bonk, 'lamp': lambda: bell(700, .9) * .6,
     'whistle_up': lambda: slide(400, 1800, .9, 1), 'whistle_down': lambda: slide(1800, 300, 1.2, 1), 'stars': tinkle,
     'smug': lambda: wahwah()[:int(.7 * SR)], 'frame': lambda: marimba(55, .3), 'ding': lambda: glock(96, 1.0)}
sfx = np.zeros(N)
for e in ev:
    f = S.get(e['type'])
    if f is None: continue
    add(sfx, e['t'], np.asarray(f(), dtype=float), .55)

# ——— score: C – G – Am – F, warm and bouncy ———
music = np.zeros(N)
PROG = [([48, 52, 55], 36, [60, 64, 67]), ([47, 50, 55], 31, [59, 62, 67]), ([48, 52, 57], 33, [60, 64, 69]), ([48, 53, 57], 29, [60, 65, 69])]
MEL = [(0, 76, .5), (.5, 79, .5), (1.5, 81, .5), (2, 79, 1), (3.5, 76, .5), (4, 74, 1), (5.5, 76, .5), (6, 72, 2),
       (8, 76, .5), (8.5, 79, .5), (9.5, 84, .5), (10, 81, 1), (11.5, 79, .5), (12, 77, 1), (13, 76, .5), (13.5, 74, .5), (14, 72, 2)]
def score(a, b, mel=True, strum=True, trans=0, vol=1.0, arp=True):
    for k in range(int(a / BEAT), int(b / BEAT)):
        t = k * BEAT; bar = (k // 4) % 4; bt = k % 4; ch, root, hi = PROG[bar]
        if bt in (0, 2): add(music, t, bass(root + trans + (0 if bt == 0 else 7), .5), .42 * vol)
        if strum and bt in (1, 3):
            for i, m in enumerate(ch): add(music, t + i * .012, uke(m + 12 + trans, .35), .075 * vol)
        if arp:
            for j in range(2): add(music, t + j * BEAT / 2, marimba(hi[(k * 2 + j) % 3] + trans, .4), .08 * vol)
        if k % 4 == 0 and k >= 0: add(music, t, pad([m + trans for m in ch], 2.0), .06 * vol)
    if mel:
        for p0 in range((int(a / BEAT) // 16) * 16, int(b / BEAT) + 16, 16):
            for pb, m, d in MEL:
                t = (p0 + pb) * BEAT
                if a <= t < b: add(music, t, glock(m + trans, .9), .13 * vol)
score(0, 4, True, True, 0, 1.0)
score(4, 10, False, True, 0, .9)
score(10, 20, True, True, 0, 1.0)
score(20, 23, False, False, 0, .8, arp=True)             # mewing: bass + marimba only, then the band stops (23.0-26.5)
score(26.5, 40, True, True, 0, 1.0)
score(40, 52.6, True, True, 0, 1.0)
score(52.6, 60, True, True, -2, .85)
score(60, 70, True, True, 2, 1.0)
add(music, 26.5, chime(72), .3); add(music, 60.0, chime(74), .3)
m = np.ones(N); i0, i1 = int(23.0 * SR), int(26.5 * SR); m[i0:i1] = 0; m[i0 - 480:i0] = np.linspace(1, 0, 480)
m[int(69.0 * SR):] *= np.linspace(1, 0, N - int(69.0 * SR)); music *= m
# gentle room
ir = np.exp(-tt(.45) / .12) * rng.standard_normal(int(.45 * SR)); ir = lp(ir, 5000); ir /= np.abs(ir).sum() * .55
music = .86 * music + .14 * fftconvolve(music, ir)[:N]

# ——— narration ———
V = os.path.join(HERE, 'voice'); cues = json.load(open(os.path.join(V, 'cues.json')))
OFF = {'c02': -.15, 'c11': -.15, 'c19': -.25, 'c20': .1}
voice = np.zeros(N)
for i, s, e, txt in cues:
    w, sr = sf.read(os.path.join(V, i + '.wav')); w = w.astype(float)
    if w.ndim > 1: w = w.mean(1)
    w = resample_poly(w, SR // sr, 1) if SR % sr == 0 else np.interp(np.arange(int(len(w) * SR / sr)) / SR * sr, np.arange(len(w)), w)
    w = hp(w, 80, 2); w = w / (np.sqrt(np.mean(w ** 2)) + 1e-9) * .09; w = np.tanh(w * 1.8) / 1.8 * 1.15
    start = s + .05 + OFF.get(i, 0); add(voice, start, fade(w, .01, .05), 1.0)
vr = fftconvolve(voice, ir * .5)[:N]; voice = voice * .93 + .07 * vr
venv = lp(np.abs(voice), 6, 1); venv = np.clip(venv / (np.percentile(venv, 98) + 1e-9) * 3, 0, 1)
duck = 1 - .5 * venv                                        # music (and effects) dip under the voice
mix = (music * duck) * .9 + (sfx * (1 - .35 * venv)) + voice * 1.0
mix = hp(mix, 50, 2); mix = lp(mix, 14000, 2)
mix = mix / max(1e-9, np.abs(mix).max()) * .9
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), np.stack([mix, mix], 1).astype(np.float32), SR, subtype='PCM_16')
print('mix ok', len(mix) / SR, 's, events', len(ev), 'voice lines', len(cues))
