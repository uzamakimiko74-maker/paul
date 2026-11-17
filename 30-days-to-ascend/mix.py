#!/usr/bin/env python3
"""30 Days to Ascend: original 1930s-style band score + synthesized foley + optical-soundtrack ageing -> out/mix.wav (48 kHz stereo).
Everything is synthesized with numpy/scipy; no samples, no downloads."""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000; DUR = 70.0; BPM = 120; BEAT = 60 / BPM
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(30)
N = int(DUR * SR)

def tt(d): return np.arange(int(round(d * SR))) / SR
def env(d, tau): return np.exp(-tt(d) / tau)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(round(d * SR)))
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def ov(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def fade(x, a=.004, r=.01):
    n = len(x); fa, fr = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    x = x.copy(); x[:fa] *= np.linspace(0, 1, fa); x[n - fr:] *= np.linspace(1, 0, fr); return x
def add(buf, t0, sig, g=1.0):
    i = int(round(t0 * SR));
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i] * g

# ——— instruments ———
def tuba(m, d):
    t = tt(d); f = mtof(m); x = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(1, 1), (2, .55), (3, .3), (4, .12)])
    return fade(lp(x, 700) * np.exp(-t / (d * .55)), .006, .03)
def banjo(m, d=.35):
    t = tt(d); f = mtof(m); x = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / (.09 / k ** .35)) for k, a in [(1, 1), (2, .8), (3, .7), (4, .5), (5, .35), (6, .2)])
    return fade(hp(x, 180), .001, .02)
def piano(m, d=.5):
    t = tt(d); f = mtof(m); x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / (.28 / k ** .5)) for k, a in [(1, 1), (2, .5), (3, .3), (4, .15)])
    return fade(x + hp(noise(d), 3000) * np.exp(-t / .004) * .15, .001, .03)
def clarinet(m, d, vib=1):
    t = tt(d); f = mtof(m) * (1 + .004 * vib * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t * 4)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(a * np.sin(ph * k) for k, a in [(1, 1), (3, .5), (5, .28), (7, .12), (9, .06)]) + .03 * lp(noise(d), 4000)
    e = np.minimum(1, t / .03) * np.minimum(1, (d - t) / .05); return fade(x * e, .005, .04)
def brass(m, d, mute=False):
    t = tt(d); f = mtof(m); ph = 2 * np.pi * f * t; x = sum(np.sin(ph * k) / k ** .8 for k in range(1, 9))
    x = lp(x, 2400 if not mute else 1500) if not mute else bp(x, 600, 2200)
    return fade(x * np.minimum(1, t / .02) * np.exp(-t / (d * 1.2)), .004, .05)
def woodblock(p=1.0):
    t = tt(.1); return fade(np.sin(2 * np.pi * 900 * p * t) * np.exp(-t / .018) + .4 * np.sin(2 * np.pi * 1350 * p * t) * np.exp(-t / .012), .0005, .01)
def cymbal(d=1.0):
    return fade(hp(noise(d), 5000) * env(d, d * .28), .001, .05)
def snare(d=.18): return fade(hp(noise(d), 1500) * env(d, .05), .0005, .02)

# ——— sound effects ———
def slide(f0, f1, d, vib=0):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) * (1 + vib * .02 * np.sin(2 * np.pi * 7 * t)); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(np.sin(ph) * .8 + .15 * np.sin(2 * ph), .01, .04)
def boing(d=.6):
    t = tt(d); f = 180 + 60 * np.exp(-t / .1) * np.sin(2 * np.pi * 14 * t) + 140 * np.exp(-t / .25); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade((np.sin(ph) + .4 * np.sin(2 * ph)) * np.exp(-t / .3), .002, .05)
def bell(f=1800, d=.8):
    t = tt(d); return fade(sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (d * k)) for r, a, k in [(1, 1, .4), (2.76, .5, .25), (5.4, .25, .15)]), .001, .05)
def thud(d=.4):
    t = tt(d); return fade(np.sin(2 * np.pi * (70 + 120 * np.exp(-t / .05)) * t) * np.exp(-t / .12) + .5 * lp(noise(d), 600) * np.exp(-t / .03), .001, .04)
def bonk():
    w = np.pad(woodblock(.55), (0, int(.4 * SR))); th = thud(.5); n = min(len(w), len(th)); return fade(w[:n] * .8 + th[:n] * .9, .001, .05)
def squeak(d=.35):
    t = tt(d); f = 500 + 900 * (t / d) ** .7; ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(bp(np.sign(np.sin(ph)) * .5 + np.sin(ph), 500, 3000) * np.minimum(1, t / .02), .005, .05)
def crack():
    d = .6; x = hp(noise(d), 1500) * env(d, .03)
    for k in range(9): add(x, rng.random() * .35, hp(noise(.02), 3000) * env(.02, .004), 1.5)
    return fade(x, .0005, .05)
def whoop(): return slide(300, 1500, .5)
def paper(d=.25): return fade(bp(noise(d), 1500, 6000) * np.sin(np.pi * tt(d) / d) ** 1.5, .005, .03)
def pop():
    d = .12; t = tt(d); return fade(np.sin(2 * np.pi * (500 + 1500 * np.exp(-t / .01)) * t) * np.exp(-t / .03) + hp(noise(d), 2000) * np.exp(-t / .006) * .6, .0005, .01)
def chew():
    d = .3; t = tt(d); return fade(lp(noise(d), 700) * np.sin(np.pi * np.minimum(1, t / .12)) * np.exp(-t / .12) + .6 * np.sin(2 * np.pi * (140 - 60 * t / d) * t) * np.exp(-t / .1), .004, .05)
def ratchet(d=.6):
    x = np.zeros(int(d * SR)); t0 = 0; gap = .02
    while t0 < d - .02: add(x, t0, woodblock(1.6)[:int(.03 * SR)], .8); t0 += gap; gap *= 1.08
    return x
def buzz(d=3.0):
    t = tt(d); f = 180 + 12 * np.sin(2 * np.pi * 3 * t) + 25 * np.sin(2 * np.pi * .7 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(bp(np.sign(np.sin(ph)) * .3, 150, 1500) * (.6 + .4 * np.sin(2 * np.pi * 9 * t)) * (.5 + .5 * np.sin(np.pi * t / d)), .1, .2) * .5
def wahwah():
    out = np.zeros(int(1.6 * SR)); notes = [(70, .32), (69, .32), (68, .32), (66, .9)]; t0 = 0
    for m, d in notes:
        x = brass(m, d, mute=True) * (.6 + .4 * np.abs(np.sin(np.pi * tt(d) / d * (2 if d < .5 else 5)))); add(out, t0, x, .9); t0 += d
    return out
def stinger(m=60):
    d = .5; x = sum(brass(m + i, d) for i in (0, 4, 7, 12)); return fade(x, .003, .08)
def sting_hit(m=60):
    d = .6; x = ov(sum(brass(m + i, d) for i in (0, 4, 7, 12)) * .5, piano(m - 12, d), cymbal(d) * .5); return fade(x, .002, .1)
def tinkle():
    x = np.zeros(int(.8 * SR))
    for i, m in enumerate((88, 91, 95, 100)): add(x, i * .08, bell(mtof(m), .5), .5)
    return x
def footstep(): return ov(fade(lp(noise(.08), 900) * env(.08, .02), .001, .02), woodblock(.5) * .2)

# ——— events ———
ev = json.load(open(os.path.join(HERE, 'events.json')))['ev']
sfx = np.zeros(N)
for e in ev:
    t0, ty = e['t'], e['type']
    S = {'hit': lambda: sting_hit(60), 'shade': ratchet, 'wah': wahwah, 'boing': boing, 'gulp': lambda: slide(220, 90, .25),
         'flex': squeak, 'wince': lambda: slide(900, 500, .25), 'flag': lambda: ov(bell(2200, .5) * .8, pop() * .5), 'crack': crack,
         'wave': lambda: ov(clarinet(79, .18), np.pad(clarinet(75, .3), (int(.2 * SR), 0))), 'shoes': footstep, 'sign': woodblock,
         'stop': lambda: np.zeros(10), 'page': paper, 'bzz': lambda: buzz(e.get('dur', 3)), 'sting': lambda: sting_hit(62),
         'puff': lambda: fade(lp(noise(.5), 1200) * np.sin(np.pi * tt(.5) / .5), .02, .1) * .6, 'chew': chew, 'pop': pop,
         'plink': lambda: bell(2600, .5) * .7, 'bonk': bonk, 'lamp': lambda: bell(700, 1.0) * .8, 'whistle_up': lambda: slide(400, 2200, .9, 1),
         'whistle_down': lambda: slide(2200, 300, 1.2, 1), 'stars': tinkle, 'smug': lambda: wahwah()[:int(.7 * SR)] * .7, 'frame': lambda: woodblock(.8),
         'ding': lambda: bell(1600, 1.0) * .9}.get(ty)
    if S is None: print('no sfx for', ty); continue
    x = S(); add(sfx, t0, np.asarray(x, dtype=float), .7)
# extra frame-tap double and lamp clang body
add(sfx, 54.62, woodblock(.8), .6); add(sfx, 39.2, bell(520, .9), .4)

# ——— score ———
music = np.zeros(N)
CH = [(0, [48, 51, 55], 36), (1, [47, 50, 53, 55], 43), (2, [48, 51, 55], 36), (3, [47, 50, 53, 55], 43)]   # C minor / G7 pairs
MOTIF = [  # (beat in 4-bar phrase, midi, beats)
    (0, 72, .5), (.5, 75, .5), (1.5, 77, .5), (2, 79, 1), (3.5, 77, .5), (4, 75, .5), (5, 72, .5), (5.5, 70, .5), (6, 67, 1.5),
    (8, 72, .5), (8.5, 75, .5), (9.5, 79, .5), (10, 82, 1), (11.5, 79, .5), (12, 77, .5), (13, 75, .5), (13.5, 74, .5), (14, 72, 2)]
def score(t_from, t_to, melody=True, stride=True, trans=0, vol=1.0):
    b0 = int(t_from / BEAT); b1 = int(t_to / BEAT)
    for b in range(b0, b1):
        t = b * BEAT; bar = (b // 4) % 4; bt = b % 4; _, notes, root = CH[bar]; root += trans
        if stride:
            if bt in (0, 2): add(music, t, tuba(root + (7 if bt == 2 else 0), .4), .55 * vol)
            else:
                for m in notes: add(music, t, banjo(m + trans, .3), .16 * vol); add(music, t, piano(m + trans, .3), .1 * vol)
            if bt in (1, 3): add(music, t, snare(.1), .06 * vol)
        else: add(music, t, woodblock(1.0 if bt % 2 else .8), .25 * vol)
    if melody:
        ph = (b0 // 16) * 16
        for k in range(ph, b1 + 16, 16):
            for pb, m, d in MOTIF:
                t = (k + pb) * BEAT
                if t_from <= t < t_to: add(music, t, clarinet(m + trans, d * BEAT * .92), .26 * vol)
# song map: title (full band) → tier (stride, no melody) → mirror (melody returns) → mew (stride thinning, then stop) → stop → return …
score(0, 4, True, True, 0, 1.0); score(4, 10, False, True, 0, .9); score(10, 20, True, True, 0, 1.0)
score(20, 23, False, False, 0, 1.0)               # mewing: only woodblock ticks, then the band stops (silence 23.0–26.5)
score(26.5, 30, True, True, 0, 1.0); score(30, 40, True, True, 0, 1.0); score(40, 50, True, True, 0, 1.0); score(50, 52.6, False, True, 0, .9)
score(52.6, 60, True, True, -2, .8); score(60, 70, True, True, 2, 1.0)
add(music, 26.5, sting_hit(60), .8); add(music, 60.0, sting_hit(62), .6)
# hard stop of reverb tails etc: mute 23.0–26.5, and the final second fades out
m = np.ones(N); i0, i1 = int(23.0 * SR), int(26.5 * SR); m[i0:i1] = 0; m[i0 - 240:i0] = np.linspace(1, 0, 240)
m[int(69.2 * SR):] *= np.linspace(1, 0, N - int(69.2 * SR)); music *= m
# duck the music a little under effects
sidec = np.abs(sfx); sidec = lp(sidec, 8); sidec = np.clip(1 - sidec * 2.2, .55, 1)
mix = music * sidec + sfx * 1.0

# ——— optical soundtrack ageing ———
mix = bp(mix, 110, 6200, 2)
n = np.arange(N) / SR; wob = .0007 * np.sin(2 * np.pi * .6 * n) + .00025 * np.sin(2 * np.pi * 7 * n)
pos = np.clip(np.arange(N) + np.cumsum(wob) * SR * 0 + wob * SR * 20, 0, N - 1); mix = np.interp(pos, np.arange(N), mix)
mix = np.tanh(mix * 1.6) / 1.6
hiss = bp(noise(DUR), 800, 5500) * .006; crackle = np.zeros(N)
for _ in range(220): add(crackle, rng.random() * DUR, hp(noise(.004), 2000) * env(.004, .001), rng.random() * .12)
clatter = lp(np.sign(np.sin(2 * np.pi * 24 * n)) * .004, 600)
mix = mix + hiss + crackle + clatter * (1 - m)   # the projector clatter is the only sound inside the silence
mix = mix / max(1e-9, np.abs(mix).max()) * .9
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), np.stack([mix, mix], 1).astype(np.float32), SR, subtype='PCM_16')
print('mix ok', len(mix) / SR, 's, events', len(ev))
