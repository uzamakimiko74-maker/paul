"""Synthesised score + sound effects for the Ragnarok video (numpy only), timed to events.json / timeline.json."""
import json, numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter, butter, sosfilt
SR = 44100
TL = json.load(open('/home/user/paul/ragnarok/work/timeline.json'))
EV = json.load(open('/home/user/paul/ragnarok/work/events.json'))
N = int(TL['total'] * SR) + SR * 3
rng = np.random.default_rng(11)
L = np.zeros(N, np.float32); Rr = np.zeros(N, np.float32)

def put(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0 or i >= N: return
    n = min(len(sig), N - i)
    L[i:i + n] += sig[:n] * gain * (1 - max(0, pan)); Rr[i:i + n] += sig[:n] * gain * (1 + min(0, pan))

def env(n, a=.01, d=.3, curve=3.0):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d * curve / 3)

def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x).astype(np.float32)
def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x).astype(np.float32)
def noise(n): return rng.standard_normal(n).astype(np.float32)
def sine(f, n, ph=0): return np.sin(2 * np.pi * np.cumsum(np.full(n, f) if np.isscalar(f) else f) / SR + ph).astype(np.float32)
def glide(f0, f1, n): return np.linspace(f0, f1, n)

# ---------- one-shots ----------
def boom(dur=1.8, f0=70, f1=28, gain=1):
    n = int(dur * SR); b = sine(glide(f0, f1, n), n) * env(n, .004, dur * .55)
    x = lp(noise(n), 400) * env(n, .002, .35) * .5
    return (b * .9 + x) * gain
def hit(dur=.5, gain=1):            # metal clang
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(420, 1), (690, .7), (1130, .5), (1710, .3), (2380, .2)]) * np.exp(-t * 7)
    return (s * .25 + hp(noise(n), 3000) * np.exp(-t * 60) * .3) * gain
def whoosh(dur=.7, up=True, gain=1):
    n = int(dur * SR); x = noise(n); f = np.linspace(300, 5000, n) if up else np.linspace(5000, 300, n)
    out = np.zeros(n, np.float32); blk = 512
    for i in range(0, n, blk):
        fc = float(f[i]); out[i:i + blk] = lp(x[i:i + blk], min(fc, SR / 2 - 100), 1)
    w = np.sin(np.pi * np.arange(n) / n) ** 2
    return out * w * gain
def thud(dur=.6, gain=1):
    n = int(dur * SR); return sine(glide(120, 40, n), n) * env(n, .002, .25) * gain
def crunch(gain=1):
    n = int(.35 * SR); return (lp(noise(n), 2500) * env(n, .002, .12) + sine(glide(180, 60, n), n) * env(n, .002, .2)) * gain
def tick(gain=1):
    n = int(.25 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 880 * t) * np.exp(-t * 28) * .5 + np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 40) * .3) * gain
def bell(f, dur=3.0, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * m * t) * a * np.exp(-t * d) for m, a, d in [(1, 1, 1.6), (2.76, .5, 2.4), (5.4, .25, 3.4), (8.9, .12, 4.5)]).astype(np.float32) * gain * .35
def pluck(f, dur=1.2, gain=1):
    n = int(dur * SR); d = int(SR / f); buf = noise(d) * .6; out = np.zeros(n, np.float32)
    for i in range(n):
        out[i] = buf[i % d]; buf[i % d] = .5 * (buf[i % d] + buf[(i + 1) % d]) * .996
    return out * gain
def horn(f=110, dur=3.4, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * t + k) / k for k in range(1, 9)).astype(np.float32)
    e = np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .9)
    return lp(s, 900) * e * gain * .35
def crow(gain=1):
    n = int(.9 * SR); t = np.arange(n) / SR
    f = np.interp(t, [0, .15, .45, .9], [700, 1500, 1250, 800])
    s = (sine(f, n) + .5 * sine(f * 2, n) + .25 * sine(f * 3, n)) * np.minimum(1, t / .03) * np.exp(-((t - .3) / .35) ** 2)
    return s * gain * .3
def howl(gain=1):
    n = int(3.2 * SR); t = np.arange(n) / SR
    f = np.interp(t, [0, .6, 1.8, 3.2], [260, 520, 560, 300]) * (1 + .01 * np.sin(2 * np.pi * 6 * t))
    s = sine(f, n) + .4 * sine(f * 2, n) + .2 * sine(f * 3, n)
    return lp(s, 1800) * np.sin(np.pi * t / 3.2) ** .6 * gain * .3
def riser(dur=2.5, gain=1):
    n = int(dur * SR); t = np.arange(n) / SR; x = noise(n); out = np.zeros(n, np.float32)
    for i in range(0, n, 1024):
        out[i:i + 1024] = hp(lp(x[i:i + 1024], 600 + 7000 * (i / n) ** 2, 1), 200, 1)
    return out * (t / dur) ** 2 * gain * .5
def drum(f=75, gain=1, dur=.5):
    n = int(dur * SR); return (sine(glide(f * 1.8, f, n), n) * env(n, .003, dur * .45) + lp(noise(n), 700) * env(n, .001, .06) * .25) * gain

# ---------- beds ----------
def bed(freqs, dur, gain, lfo=.07):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k, f in enumerate(freqs):
        for det in (-.15, .1, .2):
            s += np.sin(2 * np.pi * (f + det * (1 + k * .3)) * t + k + det * 5) * (1 / (1 + k * .5))
    s *= (.65 + .35 * np.sin(2 * np.pi * lfo * t))
    return lp(s, 1400) / max(1, len(freqs)) * gain
def chords(kind, total):
    """returns stereo-mono pad for the whole video: 8s chords"""
    prog = {'dark': [[55, 82.4, 110, 130.8], [43.7, 65.4, 87.3, 110], [49, 73.4, 98, 123.5], [41.2, 61.7, 82.4, 98]],
            'hope': [[65.4, 98, 130.8, 164.8], [49, 73.4, 98, 123.5], [55, 82.4, 110, 130.8], [43.7, 65.4, 87.3, 110]]}[kind]
    out = np.zeros(N, np.float32); t = 0; i = 0
    while t < total:
        seg = bed(prog[i % 4], 8.6, 1.0)
        e = np.ones(len(seg), np.float32); f = int(.6 * SR); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
        j = int(t * SR); n = min(len(seg), N - j)
        if n > 0: out[j:j + n] += (seg * e)[:n]
        t += 8; i += 1
    return out
def smooth(points, total):
    """piecewise-linear gain curve over time: points = [(t, g), ...]"""
    ts = np.arange(N) / SR
    return np.interp(ts, [p[0] for p in points], [p[1] for p in points]).astype(np.float32)

T = TL['total']; secs = {s['n']: s for s in TL['secs']}
S0 = lambda n: secs[n]['start']; E0 = lambda n: secs[n].get('end', T)
# intensity curves
dark = smooth([(0, .5), (S0(1) + 30, .6), (S0(2), .35), (S0(3), .6), (S0(4), .85), (S0(5), 1.0), (E0(5), .9), (S0(6) + 14, .3), (S0(6) + 20, .0), (T, .0)], T)
hope = smooth([(0, 0), (S0(6) + 14, 0), (S0(6) + 24, .8), (S0(7), .65), (TL['outro'], .6), (T, .35)], T)
padD = chords('dark', T) * dark * .22
padH = chords('hope', T) * hope * .26
L += padD; Rr += np.roll(padD, 900)
L += padH; Rr += np.roll(padH, 700)
# sub drone
t_all = np.arange(N) / SR
drone = (np.sin(2 * np.pi * 36.7 * t_all) + .5 * np.sin(2 * np.pi * 73.4 * t_all + 1)).astype(np.float32) * smooth([(0, .6), (S0(5), 1), (S0(6) + 12, .2), (S0(6) + 20, 0), (T, 0)], T) * .14
L += drone; Rr += drone

# ambience per world, from events
def amb_wind(t0, t1, g):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    x = lp(noise(n), 500) * (.6 + .4 * np.sin(2 * np.pi * .13 * np.arange(n) / SR)) * g
    f = np.minimum(1, np.arange(n) / (SR * .8)) * np.minimum(1, (n - np.arange(n)) / (SR * .8))
    put(x.astype(np.float32) * f, t0); put(lp(noise(n), 450) * f * g * .6, t0 + .01, pan=.3)
def amb_fire(t0, t1, g):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    x = np.zeros(n, np.float32); c = rng.random(int((t1 - t0) * 40))
    for k in range(len(c)):
        i = int(rng.random() * (n - 2000)); m = 1500
        x[i:i + m] += hp(noise(m), 1500) * np.exp(-np.arange(m) / 250) * (.3 + c[k] * .7)
    x += lp(noise(n), 250) * .5
    f = np.minimum(1, np.arange(n) / (SR * .6)) * np.minimum(1, (n - np.arange(n)) / (SR * .6))
    put(x * f * g, t0)
for e in EV:
    d = e['b'] - e['a']
    if e['bl'] is None or e['bl'] in ('naglfar', 'bifrost'):
        if e['w'] in ('winter',): amb_wind(e['a'], e['b'], .12)
        elif e['w'] in ('void', 'dusk', 'doom', 'plain'): amb_wind(e['a'], e['b'], .06 if e['w'] != 'doom' else .09)
    if e['w'] in ('fire', 'doom') or e['bl'] in ('surtr',): amb_fire(e['a'], e['b'], .07)
    if e['bl'] == 'naglfar': amb_wind(e['a'], e['b'], .12)

# ---------- cues from the shot list ----------
last_tick = -9
for e in EV:
    a = e['a']
    if e['card']:
        put(riser(2.5), a - 2.2, .8); put(boom(2.6, 60, 24), a + .02, .8); put(whoosh(.8, False), a, .5)
    if e['cut']:
        amp = e['cut'][1]; put(whoosh(.5, True), a - .35, .3 * amp); put(thud(.5), a, .55 * amp)
    for (d, col, amp) in e['flash']:
        put(boom(1.4, 90, 34, 1), a + d, .55 * amp) if amp >= .6 else put(whoosh(.5, False), a + d, .35 * amp)
    for (d, text) in e['burst']:
        tt = a + d; u = text.upper()
        if any(k in u for k in ('CRASH', 'THUD', 'RUMBLE', 'KRA', 'CRACK')): put(boom(1.3, 80, 30), tt, .8)
        elif any(k in u for k in ('CLANG', 'CLASH', 'BONK', 'SLASH', 'BOING')): put(hit(), tt, .7); put(thud(.3), tt, .3)
        elif 'CHOMP' in u: put(crunch(), tt, .9); put(thud(.4), tt, .5)
        elif 'RIP' in u: put(crunch(), tt, 1); put(whoosh(.5, True), tt - .2, .4)
        elif 'SPLASH' in u: put(lp(noise(int(.8 * SR)), 2500) * env(int(.8 * SR), .01, .25), tt, .6)
        else: put(thud(), tt, .7)
    for (d, text) in e['stamp']:
        tt = a + d
        if tt - last_tick > .5: put(tick(), tt, .22); last_tick = tt

# ---------- story moments ----------
def sentstart(sec, k, f=0):
    for s in TL['sent']:
        if s['sec'] == sec and str(s['id']) == str(k): return s['a'] + (s['b'] - s['a']) * f
# Gjallarhorn
t = sentstart(4, 11) + .4; put(horn(110, 3.4), t, .9); put(horn(165, 3.2), t + .15, .5); put(horn(220, 3.0), t + .3, .3)
# roosters and Garm
t0 = sentstart(3, 22)
for dt, pan in [(1.4, -.5), (3.4, 0), (5.4, .5)]: put(crow(), t0 + dt - .3 + 0, .8, pan)
put(howl(), t0 + 7.7, .8)
# thunder for Thor
for k in (10, 12): put(boom(2.2, 55, 22), sentstart(5, k) + .75, .9)
# Surtr fire swell
put(riser(4.5), sentstart(6, 0) + .5, .9); put(boom(3.5, 50, 20), sentstart(6, 1) + .2, 1.0)
# rebirth bells
tr = sentstart(6, 5)
for i, f in enumerate([523.3, 659.3, 784, 1046.5, 784, 659.3, 880, 1318.5]): put(bell(f, 3.4), tr + i * .9, .45, (i % 3 - 1) * .4)
put(bell(261.6, 5, 1), sentstart(6, 8), .5); put(bell(392, 5, 1), sentstart(6, 9) + .3, .5)
# gimle chime
for i, f in enumerate([784, 988, 1175, 1568]): put(bell(f, 3), sentstart(6, 11) + i * .4, .4)
# Níðhöggr rumble
put(boom(3, 70, 36), sentstart(6, 14), .6)

# ---------- war drums (chapter 5 plus the march) ----------
def drums(t0, t1, bpm, gain, roll=False):
    beat = 60 / bpm; t = t0; i = 0
    while t < t1:
        f = 62 if i % 4 == 0 else (75 if i % 4 == 2 else 68); g = 1.0 if i % 4 == 0 else .55
        put(drum(f, g * gain, .55), t);
        if roll and i % 2 == 1: put(drum(90, .3 * gain, .3), t + beat / 2)
        t += beat / (2 if roll else 1); i += 1
drums(sentstart(4, 14), E0(4), 84, .55)
drums(S0(5), E0(5) - 8, 92, .6, True)
drums(sentstart(1, 4, .64), sentstart(1, 4, .86), 100, .4)
drums(sentstart(7, 5), sentstart(7, 6), 90, .4)
# final heartbeat fade at the very end
for i in range(6): put(drum(55, .4 * (1 - i / 7), .6), TL['outro'] + 3 + i * 1.4)

# ---------- melody: sparse nordic pentatonic in the calm chapters ----------
pent = [220, 246.9, 293.7, 329.6, 392, 440, 493.9, 587.3]
def melody(t0, t1, gap, gain, seed):
    r = np.random.default_rng(seed); t = t0; k = 3
    while t < t1:
        k = int(np.clip(k + r.integers(-2, 3), 0, len(pent) - 1)); put(pluck(pent[k], 1.6, 1), t, gain, r.uniform(-.4, .4)); t += gap * r.choice([1, 1, 1.5, 2])
melody(S0(2), E0(2), 1.8, .25, 1)
melody(S0(6) + 16, E0(6), 1.4, .22, 2)
melody(S0(7), TL['outro'], 1.6, .2, 3)
melody(TL['outro'], T, 1.8, .22, 4)

# ---------- mix with the narration (sidechain-style ducking on the music) ----------
nar = wavfile.read('/home/user/paul/ragnarok/work/narration.wav')[1].astype(np.float32) / 32768
nar = np.pad(nar, (0, max(0, N - len(nar))))[:N]
envn = np.abs(nar); k = int(.12 * SR)
envn = np.convolve(envn, np.ones(k, np.float32) / k, mode='same')
duck = 1 - .62 * np.clip(envn / .06, 0, 1)
duck = lfilter([1 - .9995], [1, -.9995], duck).astype(np.float32)   # smooth release
music_L = L * duck; music_R = Rr * duck
peak = max(np.abs(music_L).max(), np.abs(music_R).max())
mixL = nar * 1.0 + music_L / peak * .55
mixR = nar * 1.0 + music_R / peak * .55
out = np.stack([mixL, mixR], 1)[:int(T * SR)]
out = np.tanh(out * 1.1) / np.tanh(1.1) * .92
wavfile.write('/home/user/paul/ragnarok/work/mix.wav', SR, (out * 32767).astype(np.int16))
print('mix ok', out.shape, 'peak', float(np.abs(out).max()))
