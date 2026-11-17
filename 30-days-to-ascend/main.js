// 30 Days to Ascend — pilot (1:10). 1930s Rubber Hose style: 4:3 gate inside a vertical 1080x1920 frame.
import * as T from '/styles/rubber-hose/demo/toon.js';
import { P, pieEye, brow, mouth, glove, shoe, hose } from '/styles/rubber-hose/demo/chars.js';
import { fatTitle, subPlate } from '/styles/rubber-hose/demo/ui.js';
import { clamp, lerp, hash, vnoise, TAU, seg, ss, eio, eo, back, spring } from '/core/lib.js';

const Q = new URLSearchParams(location.search);
const cv = document.getElementById('c'), g = cv.getContext('2d');
const SW = 1080, SH = 810, GATE_Y = 555, GY = 735, BEAT = .5, DUR = 70;
const SC = document.createElement('canvas'); SC.width = SW; SC.height = SH; const sg = SC.getContext('2d');
T.init(SC);
await document.fonts.ready;
for (const f of ['40px Shrikhand', '40px Limelight', '38px "IM Fell English SC"']) await document.fonts.load(f);

// ————— timeline —————
const SHOTS = [[0, 4, 'title'], [4, 10, 'tier'], [10, 20, 'mirror'], [20, 30, 'mew'], [30, 40, 'jaw'], [40, 50, 'height'], [50, 60, 'psl'], [60, 70, 'vote']];
const CAPS = [
  [4.2, 7.0, 'This is Gus.\nHe has thirty days.'],
  [7.2, 9.9, 'The group chat drops its Tier List.\nGus is Rat Tier.'],
  [10.2, 13.0, 'Day one. Gus rates his own face.'],
  [13.2, 16.0, 'The mirror says three out of ten.'],
  [16.2, 19.8, 'Then it asks to be\nleft out of this.'],
  [20.2, 22.9, 'Next: mewing.\nTongue on the roof of the mouth.'],
  [26.7, 29.8, 'Verdict: nobody noticed.\nNobody spoke.'],
  [30.2, 33.0, 'The jaw trainer.\nTen thousand chews.'],
  [33.3, 36.4, 'Jawline update:\nstill a loaf of bread.'],
  [36.7, 39.9, 'Hunter eyes! Canthal tilt: plus twelve.\nVision: minus twelve.'],
  [40.2, 43.3, 'Heightmaxxing: platform shoes.\nPlus four inches.'],
  [43.6, 46.6, 'Gus is now taller\nthan most doorframes.'],
  [46.9, 49.9, 'Mogged by an actual doorframe.'],
  [50.2, 53.2, 'Day one results:\nPSL zero point zero.'],
  [53.4, 56.5, 'But Gus has a plan.\nFrame is everything.'],
  [56.7, 59.9, 'At least his frame is excellent.\nIt is solid oak.'],
  [60.2, 63.2, 'Day two: pick his weapon.'],
  [63.4, 66.4, 'Comment MEW or MOG.\nThe winner trains first.'],
  [66.6, 69.6, 'Day two starts soon.\nThirty days to ascend.']
];
// the "silence" card for the mewing band-stop is a gag: the card itself is blank, then a lone title
CAPS.push([23.2, 26.5, 'Three days.\nZero words.']);
const shotAt = t => SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1];
const q12 = t => Math.floor(t * 12 + 1e-6) / 12;
const br = t => Math.cos(t / BEAT * TAU);
const rnd = (a, b, s) => lerp(a, b, hash(s));

// ————— sound events (read by mix.py) —————
const EV = [];
const ev = (t, type, o = {}) => EV.push({ t, type, ...o });
ev(0.0, 'hit'); ev(3.4, 'shade'); ev(6.3, 'wah'); ev(6.35, 'boing'); ev(7.6, 'gulp');
ev(10.5, 'flex'); ev(12.5, 'flex'); ev(14.0, 'wince'); ev(13.2, 'flag'); ev(16.2, 'crack'); ev(17.0, 'wave'); ev(18.2, 'shoes'); ev(19.2, 'shoes');
ev(20.9, 'sign'); ev(23.0, 'stop'); ev(23.5, 'page'); ev(24.4, 'page'); ev(25.3, 'page'); ev(23.4, 'bzz', { dur: 3 }); ev(26.5, 'sting'); ev(26.6, 'puff');
ev(31.0, 'chew'); ev(32.0, 'chew'); ev(33.0, 'chew'); ev(33.3, 'pop'); ev(33.35, 'boing'); ev(34.4, 'plink'); ev(36.8, 'plink'); ev(39.1, 'bonk'); ev(39.2, 'lamp');
ev(40.8, 'whistle_up'); ev(42.5, 'shoes'); ev(44.0, 'shoes'); ev(45.5, 'shoes'); ev(46.3, 'bonk'); ev(46.4, 'stars'); ev(47.6, 'smug');
ev(50.8, 'plink'); ev(52.0, 'wah'); ev(52.3, 'boing'); ev(54.5, 'frame'); ev(55.5, 'ding');
ev(60.0, 'hit'); ev(65.4, 'ding'); ev(66.0, 'sting'); ev(68.3, 'whistle_down'); ev(68.5, 'ding');

// ————— backgrounds (painted once) —————
function paintBG(kind) {
  const c = document.createElement('canvas'); c.width = SW; c.height = SH; const b = c.getContext('2d');
  if (kind === 'room') {
    b.fillStyle = '#8C8981'; b.fillRect(0, 0, SW, SH);
    b.strokeStyle = '#7B7870'; b.lineWidth = 3;
    for (let x = -60; x < SW + 60; x += 90) for (let y = -20; y < 540; y += 90) { b.beginPath(); b.moveTo(x, y - 34); b.lineTo(x + 34, y); b.lineTo(x, y + 34); b.lineTo(x - 34, y); b.closePath(); b.stroke(); }
    b.fillStyle = '#6E6B64'; b.fillRect(0, 520, SW, 120); b.strokeStyle = '#2A2927'; b.lineWidth = 4; b.strokeRect(-6, 520, SW + 12, 120);
    for (let x = 30; x < SW; x += 160) { b.strokeStyle = '#55524C'; b.lineWidth = 3; b.strokeRect(x, 545, 110, 70); }
  } else {
    b.fillStyle = '#A29F97'; b.fillRect(0, 0, SW, SH);
    b.strokeStyle = '#8A877F'; b.lineWidth = 3; for (let x = 0; x < SW; x += 70) { b.beginPath(); b.moveTo(x, 0); b.lineTo(x, 640); b.stroke(); } for (let y = 0; y < 640; y += 70) { b.beginPath(); b.moveTo(0, y); b.lineTo(SW, y); b.stroke(); }
    b.fillStyle = '#55524C'; b.fillRect(0, 620, SW, 20);
  }
  for (let y = 640, r = 0; y < SH; y += 52, r++) for (let x = (r % 2) * 60 - 60; x < SW; x += 120) { b.fillStyle = '#A29F97'; b.fillRect(x, y, 60, 52); b.fillStyle = '#6B6963'; b.fillRect(x + 60, y, 60, 52); }
  b.strokeStyle = '#1A1918'; b.lineWidth = 5; b.beginPath(); b.moveTo(0, 640); b.lineTo(SW, 640); b.stroke();
  for (let i = 0; i < 60; i++) { b.fillStyle = `rgba(0,0,0,${.025 + hash(i) * .035})`; b.beginPath(); b.ellipse(hash(i * 3.3) * SW, hash(i * 7.7) * 640, 30 + hash(i * 1.9) * 80, 20 + hash(i * 2.9) * 60, 0, 0, 7); b.fill(); }
  return c;
}
const BG = { room: paintBG('room'), bath: paintBG('bath') };
function drawBG(kind) { const m = T.getM(); sg.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); sg.drawImage(BG[kind], 0, 0); sg.setTransform(1, 0, 0, 1, 0, 0); }
const cam = (z = 1, cx = 540, cy = 405) => { T.reset(); T.translate(540, 405); T.scale(z); T.translate(-cx, -cy); };

// ————— helpers —————
function fillPoly(pts, col) { const s = pts.map(p => T.tx(p[0], p[1])); T.g.setTransform(1, 0, 0, 1, 0, 0); T.g.fillStyle = col; T.g.beginPath(); T.g.moveTo(s[0][0], s[0][1]); for (const p of s) T.g.lineTo(p[0], p[1]); T.g.closePath(); T.g.fill(); }
const tx = (s, x, y, o = {}) => T.text(s, x, y, { font: o.font || '36px Limelight', fill: o.fill || P.ink, align: o.align || 'center', rot: o.rot || 0, outlineW: o.ow || 0, outlineCol: o.oc || P.ink });
function star(x, y, r, rot = 0) { const p = []; for (let i = 0; i < 8; i++) { const a = rot + i / 8 * TAU, rr = i % 2 ? r * .4 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } T.shape(p, { fill: P.white, lw: 4 }); }
function puff(x, y, u, n = 5, sz = 26) { for (let i = 0; i < n; i++) { const a = i / n * TAU + .5, d = u * 90; T.shape(T.ell(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, sz * (.6 + u * .6), sz * (.6 + u * .6), 12), { fill: P.pale, lw: 4, alpha: 1 - u * .8 }); } }
function walk(t, spd = 1) { const ph = t / BEAT * Math.PI * spd; return { L: [-38 + 26 * Math.sin(ph), -Math.max(0, Math.cos(ph)) * 22], R: [38 - 26 * Math.sin(ph), -Math.max(0, -Math.cos(ph)) * 22], bob: -Math.abs(Math.sin(ph)) * 9 }; }

// ————— Gus: a lumpy potato in a bow tie; the whole object is the body —————
const BODY = [[-90, -70], [-108, -120], [-104, -190], [-80, -250], [-30, -290], [34, -292], [82, -255], [106, -195], [108, -120], [90, -72], [40, -56], [-40, -58]];
function gus(p) {
  const k = p.k || 1, t = p.t || 0, still = !!p.still;
  let sx = p.sx || 1, sy = p.sy || 1; if (!still) { sy *= 1 + .03 * br(t); sx *= 1 - .02 * br(t); }
  T.push(); T.translate(p.x + (p.shake ? Math.sin(t * 95) * p.shake : 0), p.y); T.scale(k * (p.flip ? -1 : 1), k); T.scale(sx, sy); if (p.lean) T.rotate(p.lean);
  const fL = p.footL || [-38, 0], fR = p.footR || [38, 0];
  for (const [f, sgn] of [[fL, -1], [fR, 1]]) {
    hose([sgn * 34, -62], [f[0], f[1] - 12], sgn * 6, 15);
    if (p.plat) { T.shape(T.rr(f[0] - 42 + sgn * 14, f[1] - 4, 84, p.plat, 20), { fill: P.ink, lw: 5 }); T.shape(T.ell(f[0] + sgn * 36, f[1] + 12, 14, 5, 10), { fill: P.white, stroke: false, boil: .3 }); }
    else shoe(f[0] + (sgn < 0 ? 14 : -14), f[1], sgn < 0 ? -1 : 1, 1.15);
  }
  // body + one hard form-shadow band on the right
  T.shape(T.spline(BODY, true, 8), { fill: P.pale, lw: 7, shade: () => fillPoly([[46, -300], [130, -300], [130, -40], [58, -40], [74, -150]], P.light) });
  for (const [x, y, r] of [[-62, -108, 6], [60, -232, 5], [-72, -224, 7], [70, -96, 6], [-20, -262, 5]]) T.shape(T.ell(x, y, r, r * .7, 10), { fill: P.mid, stroke: false, boil: .3 });
  // sprout
  T.stroke(T.spline([[0, -288], [-4, -318], [12, -338], [28, -332]], false, 6), 6); T.shape(T.ell(34, -330, 14, 8, 12, .4), { fill: P.white, lw: 4 });
  // bow tie
  T.shape([[-8, -58], [-44, -76], [-44, -42]], { fill: P.ink, lw: 4 }); T.shape([[8, -58], [44, -76], [44, -42]], { fill: P.ink, lw: 4 }); T.shape(T.ell(0, -58, 9, 9, 10), { fill: P.dark, lw: 4 });
  // arms (hose from the shoulder, white glove at the wrist)
  const arm = (a, sgn, def) => {
    a = a || def; const s0 = [sgn * 96, -150], w = [a.x, a.y];
    hose(s0, w, a.bend ?? sgn * 10, 14);
    glove(w[0], w[1], Math.atan2(w[1] - s0[1], w[0] - s0[0]) + (a.rot || 0), a.hand || 'open', 1.0);
  };
  const face = () => {
    const E = p.eyes || {}, ey = -195;
    const et = E.type || 'open';
    if (et === 'squeeze') { pieEye(-34, ey, 20, 24, { type: 'squeeze', side: 1 }); pieEye(34, ey, 20, 24, { type: 'squeeze', side: -1 }); }
    else { pieEye(-34, ey, 20, 24, { ...E }); pieEye(34, ey, 20, 24, { ...E }); }
    const B = p.brows; if (B) { brow(-34, ey - 40, 38, B, -1); brow(34, ey - 40, 38, B, 1); }
    T.shape(T.ell(0, -160, 8, 6, 10), { fill: P.dmid, lw: 4 });
    const M = p.mouth || { type: 'smile' }; mouth(0, -124, M.w || 54, M.type, M);
    if (p.sweat) for (const [x, y, r] of p.sweat) T.shape([[x, y - r * 1.6], [x + r, y + r * .3], [x, y + r], [x - r, y + r * .3]], { fill: P.white, lw: 4 });
  };
  face();
  if (p.faceOver) p.faceOver();
  arm(p.armL, -1, { x: -130, y: -88, hand: 'open' }); arm(p.armR, 1, { x: 130, y: -88, hand: 'open' });
  T.pop();
}

// ————— props —————
function tierBoard(x, y, w, h, t, flash) {
  T.shape(T.rr(x, y, w, h, 16), { fill: P.paper, lw: 7 });
  tx('TIER LIST', x + w / 2, y + 36, { font: '34px Shrikhand', fill: P.ink });
  const rows = [['ASCENDED', P.white], ['CHAD', P.light], ['NORMIE', P.mid], ['RAT', P.dmid]];
  rows.forEach(([n, c], i) => {
    const ry = y + 70 + i * 70; T.shape(T.rr(x + 16, ry, w - 32, 58, 8), { fill: c, lw: 4 });
    tx(n, x + 120, ry + 31, { font: '26px Limelight', fill: i > 1 ? P.white : P.ink });
    if (i === 0) { T.shape(T.ell(x + w - 70, ry + 12, 20, 6, 12), { fill: P.white, lw: 4 }); }
  });
  const ry = y + 70 + 3 * 70;
  if (flash > 0) {   // Gus's portrait token pops into the RAT row
    const s = back(flash) * 1;
    T.push(); T.translate(x + w - 70, ry + 29); T.scale(s); T.shape(T.ell(0, 0, 26, 26, 16), { fill: P.pale, lw: 5 }); pieEye(-9, -4, 6, 8, { type: 'wide' }); pieEye(9, -4, 6, 8, { type: 'wide' }); T.stroke([[-10, 12], [0, 8], [10, 12]], 4); T.pop();
  }
}
function mirrorChar(o) {
  const { x, y = GY, t = 0 } = o, cy = y - 340;
  T.push(); T.translate(x, 0);
  const wiggle = o.walking ? walk(t, 1) : null;
  for (const [sgn, f] of [[-1, wiggle ? wiggle.L : [-30, 0]], [1, wiggle ? wiggle.R : [30, 0]]]) { hose([sgn * 30, y - 150], [f[0] * .9 + sgn * 6, y + f[1] - 12], sgn * 5, 14); shoe(f[0] + (sgn < 0 ? 14 : -14) + sgn * 6, y + f[1], sgn < 0 ? -1 : 1, 1.05); }
  T.shape(T.ell(0, cy, 128, 192, 40), { fill: P.dark, lw: 8 });
  T.shape(T.ell(0, cy, 108, 172, 40), { fill: P.pale, lw: 6, shade: () => { fillPoly([[-70, cy - 170], [-30, cy - 170], [40, cy + 170], [0, cy + 170]], P.white); } });
  const E = o.eyes || 'open';
  pieEye(-40, cy - 20, 23, 27, { type: E, lx: o.lx || 0 }); pieEye(40, cy - 20, 23, 27, { type: E, lx: o.lx || 0 });
  mouth(0, cy + 70, 70, o.mouth || 'smile');
  if (o.crack > 0) for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3, L = o.crack * (90 + 70 * hash(i + 4)); T.stroke([[10, cy - 40], [10 + Math.cos(a) * L * .5 + 8, cy - 40 + Math.sin(a) * L * .5], [10 + Math.cos(a) * L + (i % 2 ? 10 : -10), cy - 40 + Math.sin(a) * L]], 4); }
  const sign = o.sign || 0;
  for (const sgn of [-1, 1]) {
    const hand = sign > 0 ? [sgn * (30 + 40 * (1 - sign)), cy - 190 - 40 * sign] : [sgn * 170, cy + 140 + (o.wave && sgn > 0 ? -260 + Math.sin(t * 22) * 26 : 0)];
    const s0 = [sgn * 126, cy + 10]; hose(s0, hand, sgn * 14, 13);
    glove(hand[0], hand[1], Math.atan2(hand[1] - s0[1], hand[0] - s0[0]), sign > 0 ? 'grab' : (o.wave && sgn > 0 ? 'wave' : 'open'), .95);
  }
  if (sign > 0) { T.push(); T.translate(0, cy - 215); T.scale(back(sign)); T.shape(T.rr(-80, -45, 160, 90, 10), { fill: P.white, lw: 6 }); tx('3/10', 0, 3, { font: '56px Shrikhand', fill: P.ink }); T.pop(); }
  T.pop();
}
function loaf(x, y, label) { T.shape(T.spline([[x - 110, y], [x - 118, y - 50], [x - 80, y - 88], [x + 80, y - 88], [x + 118, y - 50], [x + 110, y]], true, 8), { fill: P.pale, lw: 6 }); for (const dx of [-50, 0, 50]) T.stroke([[x + dx - 12, y - 78], [x + dx + 12, y - 52]], 5); tx(label, x, y - 125, { font: '24px Limelight' }); }

// ————— shots —————
function title(t) {
  sg.fillStyle = '#6B6963'; sg.fillRect(0, 0, SW, SH);
  const cx = 540, cy = 330; sg.save(); sg.translate(cx, cy);
  for (let i = 0; i < 28; i++) { const a0 = i / 28 * TAU + t * .12, a1 = a0 + TAU / 56; sg.fillStyle = '#8C8981'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1200, a0, a1); sg.closePath(); sg.fill(); }
  sg.restore();
  const bn = i => -Math.max(0, Math.sin(t / BEAT * TAU - i * .45)) * 16;
  fatTitle(sg, '30 DAYS', 540, 190, 150, { bounce: bn, track: 4 }); fatTitle(sg, 'TO ASCEND', 540, 350, 130, { bounce: i => bn(i + 7), track: 3 });
  sg.save(); sg.fillStyle = P.paper; sg.font = '30px Limelight'; sg.textAlign = 'center'; sg.fillText('A  RUBBER  HOSE  SERIES   ·   EPISODE  ONE', 540, 440); sg.restore();
  cam(); gus({ x: 540, y: GY + 40, k: .92, t, eyes: { lx: 0, ly: -.2 }, mouth: { type: 'grin' }, armR: { x: 140, y: -230, hand: 'wave', bend: -22 }, armL: { x: -130, y: -90 } });
}
function tier(t) {
  const u = t - 4; cam(); drawBG('room');
  const flash = seg(u, 2.3, 2.8);
  tierBoard(90, 70, 480, 380, u, flash);
  const sh = u > 3.4 && u < 6 ? Math.sin(u * 60) * 4 : 0;
  T.push(); T.translate(sh, 0); T.shape(T.rr(90, 478, 480, 62, 10), { fill: P.ink, lw: 5 }); tx('DROPS IN 30 DAYS', 330, 510, { font: '30px Limelight', fill: P.white }); T.pop();
  const wx = lerp(1260, 800, eo(clamp(u / 2.6))), moving = u < 2.6, w = walk(t, 1);
  const gaze = u > 2.6 ? -1 : -.3;
  let m = { type: 'smile' }, br_ = null, sweat = null, eyes = { lx: gaze, type: 'open' };
  if (u > 2.4) { m = { type: u > 3.2 ? 'wavy' : 'o' }; br_ = 'sad'; eyes.type = 'wide'; sweat = [[-80, -250 + (u * 60 % 30), 8], [78, -240 + ((u * 60 + 14) % 30), 7]]; }
  gus({ x: wx, y: GY + (moving ? w.bob : 0), k: 1, t, still: false, footL: moving ? w.L : null, footR: moving ? w.R : null, eyes, mouth: m, brows: br_, sweat, shake: u > 3.2 ? 2.2 : 0, armL: { x: -120, y: -110, hand: 'open', bend: -6 }, armR: { x: 126, y: -96 } });
}
function mirror(t) {
  const u = t - 10; cam(1 + .02 * seg(u, 0, 10), 540, 405); drawBG('bath');
  // Gus flexes on the beat, then slumps
  const beat = Math.floor(u / 1.0) % 2, shocked = u > 3.3;
  const mx = u < 7.5 ? 780 : 780 + 60 * (u - 7.5) ** 2 * 1.4;
  const mEyes = u < 2 ? 'open' : (u < 6.2 ? 'squeeze' : 'shut'), mMouth = u < 2 ? 'smile' : (u < 6.2 ? 'pucker' : 'flat');
  mirrorChar({ x: mx, t, eyes: mEyes, mouth: mMouth, sign: seg(u, 3.2, 3.7), crack: seg(u, 6.2, 6.6), wave: u > 7 && u < 8.2, walking: u > 7.5, lx: -.5 });
  const flexL = beat ? { x: -150, y: -250, hand: 'fist', bend: 36 } : { x: -140, y: -92 }, flexR = !beat ? { x: 150, y: -250, hand: 'fist', bend: -36 } : { x: 140, y: -92 };
  gus({ x: 320, y: GY, k: 1.05, t, still: false, eyes: { type: shocked ? 'wide' : 'open', lx: .8 }, mouth: { type: shocked ? 'frown' : 'grin' }, brows: shocked ? 'sad' : 'up', armL: shocked ? { x: -130, y: -92 } : flexL, armR: shocked ? { x: 130, y: -92 } : flexR, sweat: shocked ? [[78, -250, 7]] : null, sy: shocked ? .96 : 1 });
}
function mew(t) {
  const u = t - 20, frozen = u >= 3 && u < 6.5; cam(1 + .03 * seg(u, 0, 3), 540, 405); drawBG('room');
  // calendar
  T.shape(T.rr(130, 110, 170, 190, 10), { fill: P.paper, lw: 6 }); T.shape(T.rect(130, 110, 170, 40), { fill: P.dark, lw: 5 });
  const days = ['MON', 'TUE', 'WED', 'THU'], d = u < 3.5 ? 0 : u < 4.5 ? 1 : u < 5.5 ? 2 : 3, flip = (u > 3.5 && u < 6.3) ? ((u - 3.5) % 1) : 1;
  tx(days[d], 215, 220, { font: '44px Shrikhand' });
  if (flip < .35) { T.push(); T.translate(130, 150); T.scale(1, 1 - flip / .35); T.shape(T.rect(0, 0, 170, 150), { fill: P.pale, lw: 5 }); tx(days[d - 1] || 'MON', 85, 90, { font: '44px Shrikhand' }); T.pop(); }
  // sandwich board
  const sb = back(seg(u, .4, .9)); T.push(); T.translate(880, GY - 120); T.scale(sb); T.shape(T.rr(-100, -130, 200, 250, 12), { fill: P.paper, lw: 7 }); tx('MEWING', 0, -80, { font: '38px Shrikhand' }); tx('IN PROGRESS', 0, -30, { font: '22px Limelight' }); tx('DO NOT', 0, 30, { font: '22px Limelight' }); tx('TALK TO ME', 0, 60, { font: '22px Limelight' }); T.pop();
  // cobweb + spider
  const wb = seg(u, 4, 6); if (wb > 0) { for (let i = 0; i < 5; i++) T.stroke([[1090, -10], [1090 - Math.cos(i * .38 + .1) * 360 * wb, -10 + Math.sin(i * .38 + .1) * 360 * wb]], 3); for (let r = 1; r <= 3; r++) T.stroke(T.arc(1090, -10, 100 * r * wb, 100 * r * wb, Math.PI * .5, Math.PI, 10), 3); const sy = 120 * wb; T.stroke([[760, -10], [760, sy]], 3); T.shape(T.ell(760, sy + 12, 16, 12, 12), { fill: P.ink, lw: 3 }); }
  // fly
  if (u > 3) { const a = (u - 3) * 7; T.dot(540 + Math.cos(a) * 190 + 20 * Math.sin(a * 3), 330 + Math.sin(a * 1.3) * 90, 5); }
  const sq = u < 3 ? 1 : 1; const eyes = { type: 'open', lx: 0 }; if (frozen && (Math.floor(u * 2) % 6 === 4)) eyes.type = 'shut';
  gus({ x: 540, y: GY + 20, k: 1.22, t, still: frozen, sx: u < 3 ? 1 + .04 * Math.abs(br(t)) : 1.04, eyes, mouth: { type: u >= 6.5 && u < 8 ? 'o' : 'flat' }, brows: u < 3 ? 'angry' : 'flat', armL: { x: -126, y: -96 }, armR: u < 3 ? { x: 130, y: -148, hand: 'point', bend: -6, rot: .5 } : { x: 128, y: -92 } });
  if (u >= 6.5 && u < 8.2) puff(540, 560, seg(u, 6.5, 8.2), 6, 30);
}
function jaw(t) {
  const u = t - 30; cam(); drawBG('room');
  // lamp
  const bonk = u > 9.0; T.stroke([[150, 640], [150, 380]], 9); T.shape(T.ell(150, 642, 50, 14, 20), { fill: P.dark, lw: 5 });
  const lampOnHead = bonk ? seg(u, 9.0, 9.4) : 0;
  const stage = u < 6.4 ? 'jaw' : 'eyes';
  if (!bonk) T.shape([[110, 380], [190, 380], [215, 300], [85, 300]], { fill: P.paper, lw: 6 });
  let gx = 540, eyes = { type: 'open' }, m = { type: 'open', open: .5 }, extra = null, sy = 1, sweat = null, brows = null, still = false;
  if (stage === 'jaw') {
    const ch = u < 3.3, chewPh = Math.abs(Math.sin(u / BEAT * Math.PI)); sy = 1 - .05 * chewPh;
    if (ch) { m = { type: 'open', open: .25 + .4 * chewPh }; eyes = { type: 'squeeze', side: 1 }; brows = 'angry'; tx('x ' + Math.floor(eo(u / 3.2) * 10000).toLocaleString('en-US'), 840, 250, { font: '44px Shrikhand', fill: P.ink, rot: -.06 }); }
    else { m = { type: 'o', open: 1.5 }; eyes = { type: 'wide' }; brows = 'up'; sweat = [[-78, -260, 7]]; }
    extra = () => { if (ch) T.shape(T.ell(0, -126, 30, 30, 18), { fill: P.dmid, lw: 5 }); else { const dj = 36 + 26 * Math.abs(Math.sin((u - 3.3) * 9)) * Math.exp(-(u - 3.3) * 1.2); T.shape(T.ell(0, -96 + dj * .2, 40, 22 + dj * .3, 16), { fill: P.pale, lw: 6 }); } };
    if (!ch) { const bu = u - 3.3, bx = 540 + bu * 260, by = 480 - 520 * bu + 700 * bu * bu; if (bx < 1150) T.shape(T.ell(bx, by, 32, 32, 18), { fill: P.dmid, lw: 5 }); }
    if (u > 4.4) { const s = back(seg(u, 4.4, 4.9)); T.push(); T.translate(0, 0); loaf(880, GY - 10, 'LOAF'); T.pop(); T.push(); T.translate(540, GY - 120); T.scale(s); tx('JAWLINE', 0, -165, { font: '26px Limelight' }); T.pop(); tx('0.0 CM', 540, 150, { font: '40px Shrikhand', fill: P.ink, rot: .05 }); }
  } else {
    const eu = u - 6.4; eyes = { type: 'squeeze', side: 1 }; brows = 'angry'; m = { type: 'flat' };
    gx = lerp(660, 205, ss(clamp(eu / 2.6))) ; const w = walk(t, 1);
    if (eu > 2.7) { eyes = { type: 'wide', ly: -.6 }; m = { type: 'o' }; brows = 'up'; }
    tx('+12°', 760, 190, { font: '90px Shrikhand', fill: P.white, ow: 14, rot: -.12 + .04 * Math.sin(eu * 5) });
    if (eu < 2.7) { gus({ x: gx, y: GY + w.bob, k: 1, t, footL: w.L, footR: w.R, eyes, mouth: m, brows, armL: { x: -126, y: -96 }, armR: { x: 126, y: -96 } }); }
    else gus({ x: 205 + Math.max(0, -(eu - 2.7) * 80) * 0, y: GY, k: 1, t, shake: seg(u, 9.0, 9.5) * 3, sx: 1 + .06 * Math.exp(-(eu - 2.7) * 5), eyes, mouth: m, brows, armL: { x: -126, y: -96 }, armR: { x: 126, y: -96 }, faceOver: bonk ? () => T.shape([[-80, -285], [80, -285], [100, -205], [-100, -205]], { fill: P.paper, lw: 6 }) : null });
    if (eu > 2.7) { for (let i = 0; i < 3; i++) star(gx + 20 + Math.cos(u * 8 + i * 2.1) * 80, 400 + Math.sin(u * 8 + i * 2.1) * 24, 16, u * 3 + i); }
    return;
  }
  gus({ x: gx, y: GY, k: 1, t, still, sy, eyes, mouth: m, brows, sweat, faceOver: extra, armL: { x: -126, y: -96 }, armR: { x: 126, y: -96 } });
}
function height(t) {
  const u = t - 40; cam(); drawBG('room');
  // doorframe character
  const bonk = u > 6.3, smug = u > 6.9;
  T.shape(T.rect(760, 417, 30, 318), { fill: P.dark, lw: 6 }); T.shape(T.rect(960, 417, 30, 318), { fill: P.dark, lw: 6 }); T.shape(T.rect(790, 417, 170, 318), { fill: '#3B3A37', lw: 5, stroke: false });
  T.shape(T.rr(740, 330, 270, 87, 12), { fill: P.dmid, lw: 7 });
  const sq = smug ? 'squeeze' : (bonk ? 'wide' : 'shut'); pieEye(840, 372, 14, 17, { type: sq, side: 1 }); pieEye(910, 372, 14, 17, { type: sq, side: -1 });
  mouth(875, 398, 36, smug ? 'beam' : (bonk ? 'o' : 'flat'));
  // wall ruler
  T.shape(T.rr(60, 120, 60, 560, 6), { fill: P.paper, lw: 5 }); for (let i = 0; i < 12; i++) T.stroke([[60, 150 + i * 46], [i % 2 ? 90 : 104, 150 + i * 46]], 4);
  const plat = 66 * eo(seg(u, .8, 1.8)), lift = plat;
  const wk = u > 2.6 ? clamp((u - 2.6) / 3.7) : 0, gx = lerp(360, 700, ss(wk)) - (u > 6.4 ? 90 * ss(seg(u, 6.4, 7.4)) : 0);
  const w = walk(t, .8), wob = Math.sin(u * 5) * .06 * seg(u, 1.8, 3) * (1 - seg(u, 6.4, 7));
  const fall = bonk ? Math.exp(-(u - 6.3) * 2) * -.25 : 0;
  if (u > .3 && u < .85) { T.shape(T.rr(300, 40 + (u - .3) * 1100, 120, 70, 20), { fill: P.ink, lw: 5 }); T.shape(T.rr(440, 40 + (u - .3) * 1100, 120, 70, 20), { fill: P.ink, lw: 5 }); }
  const moving = wk > 0 && wk < 1;
  gus({ x: gx, y: GY - lift + (moving ? w.bob * .5 : 0), k: 1, t, plat: plat > 2 ? plat : 0, footL: moving ? [w.L[0], w.L[1]] : [-40, 0], footR: moving ? [w.R[0], w.R[1]] : [40, 0], lean: wob + fall, eyes: { type: bonk ? 'wide' : 'open', lx: .8 }, mouth: { type: bonk ? 'o' : 'grin' }, brows: bonk ? 'sad' : 'up', armL: u > 1.8 && u < 6.3 ? { x: -150, y: -190, hand: 'wave', bend: -30 } : { x: -128, y: -96 }, armR: { x: 130, y: -96 } });
  if (bonk && u < 7.8) for (let i = 0; i < 4; i++) star(gx - 30 + Math.cos(u * 9 + i * 1.6) * 90, 210 + Math.sin(u * 9 + i * 1.6) * 22, 18, u * 3 + i);
  if (u > 1.5 && u < 6.2) tx('+4 IN', 220, 100, { font: '60px Shrikhand', fill: P.white, ow: 12, rot: -.1 });
}
function psl(t) {
  const u = t - 50; cam(); drawBG('room');
  const cx = 540, cy = 360, R = 250;
  T.shape(T.arc(cx, cy + 6, R + 26, R + 26, Math.PI, TAU, 40), { fill: P.dark, lw: 8 }); T.shape(T.arc(cx, cy, R, R, Math.PI, TAU, 40), { fill: P.paper, lw: 6 });
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; T.stroke([[cx + Math.cos(a) * (R - 8), cy + Math.sin(a) * (R - 8)], [cx + Math.cos(a) * (R - 36), cy + Math.sin(a) * (R - 36)]], 6); if (i % 5 === 0) tx(String(i), cx + Math.cos(a) * (R - 64), cy + Math.sin(a) * (R - 64), { font: '30px Limelight' }); }
  tx('PSL', cx, cy - 120, { font: '60px Shrikhand' });
  let val = 0; if (u > 1 && u < 2) val = .6 * ss((u - 1)); else if (u >= 2 && u < 3) val = .6 * (1 - ss(u - 2)); if (u >= 2.2 && u < 3.1) val = Math.max(0, .6 * (1 - (u - 2) * 1.2)) + Math.sin(u * 40) * .05 * Math.exp(-(u - 2.2) * 3);
  const a = Math.PI + clamp(val, 0, 10) / 10 * Math.PI; hose([cx, cy], [cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30)], 0, 12); T.shape(T.ell(cx, cy, 20, 20, 14), { fill: P.ink, lw: 4 });
  window.__psl = u > 1 && u < 2.4 ? '0.1' : '0.0';
  // Gus holds a picture frame around his face
  const proud = u > 5.5;
  gus({ x: 540, y: GY + 20, k: 1.12, t, still: false, eyes: { type: u > 2 && u < 5 ? 'wide' : 'open', lx: u < 5 ? -.4 : 0 }, mouth: { type: u < 2 ? 'smile' : (u < 5 ? 'wavy' : 'beam') }, brows: u < 2 ? 'up' : (u < 5 ? 'sad' : 'up'), sweat: u > 2 && u < 5 ? [[-80, -250, 7]] : null,
    armL: u > 4.2 ? { x: -92, y: -112, hand: 'grab', bend: 20 } : { x: -128, y: -92 }, armR: u > 4.2 ? { x: 92, y: -112, hand: 'grab', bend: -20 } : { x: 128, y: -92 },
    faceOver: u > 4.2 ? () => { const s = back(seg(u, 4.2, 4.8)); T.push(); T.translate(0, -185); T.scale(s); for (const r of [T.rect(-92, -98, 184, 20), T.rect(-92, 78, 184, 20), T.rect(-104, -98, 20, 196), T.rect(84, -98, 20, 196)]) T.shape(r, { fill: P.dmid, lw: 6 }); T.pop(); } : null });
  if (proud) tx('SOLID OAK', 850, 500, { font: '44px Shrikhand', fill: P.white, ow: 12, rot: -.04 });
}
function vote(t) {
  const u = t - 60; cam(); sg.fillStyle = P.dark; sg.fillRect(0, 0, SW / 2, SH); sg.fillStyle = '#B0ADA4'; sg.fillRect(SW / 2, 0, SW / 2, SH);
  sg.fillStyle = 'rgba(0,0,0,.18)'; sg.fillRect(0, 640, SW, 170);
  sg.strokeStyle = '#F1EEE6'; sg.lineWidth = 6; sg.beginPath(); sg.moveTo(SW / 2, 0); sg.lineTo(SW / 2, SH); sg.stroke();
  const bn = i => -Math.max(0, Math.sin(t / BEAT * TAU - i * .5)) * 10;
  fatTitle(sg, 'COMMENT ONE WORD', 540, 62, 58, { bounce: bn });
  fatTitle(sg, 'MEW', 270, 185, 150, { bounce: bn }); fatTitle(sg, 'MOG', 810, 185, 150, { bounce: i => bn(i + 3) });
  sg.save(); sg.fillStyle = P.paper; sg.font = '26px Limelight'; sg.textAlign = 'center'; sg.fillText('TONGUE UP. STAY SILENT.', 270, 290); sg.fillStyle = P.ink; sg.fillText('SQUINT. STARE. DOMINATE.', 810, 290); sg.restore();
  cam();
  gus({ x: 270, y: GY, k: .92, t, eyes: { type: 'squeeze', side: 1 }, mouth: { type: 'flat' }, brows: 'angry', armL: { x: -128, y: -92 }, armR: { x: 60, y: -142, hand: 'point', rot: -.2, bend: -10 } });
  gus({ x: 810, y: GY, k: .92, t: t + .25, eyes: { type: 'squeeze', side: 1 }, mouth: { type: 'grin' }, brows: 'angry', armL: { x: -150, y: -230, hand: 'fist', bend: 30 }, armR: { x: 150, y: -230, hand: 'fist', bend: -30 } });
  const bs = u > 5.4 ? back(seg(u, 5.4, 5.9)) : 0;
  if (bs > 0) { T.push(); T.translate(540, 410); T.rotate(-.04 + .02 * Math.sin(u * 4)); T.scale(bs); T.shape(T.rr(-330, -50, 660, 100, 16), { fill: P.ink, lw: 6 }); fatTitle(sg, '', 0, 0, 10); T.pop(); fatBanner(u, bs); }
  // iris out on Gus (right), pulled shut by a glove
  if (u > 8.3) {
    const r = lerp(760, 0, eo(seg(u, 8.3, 9.7))), cx = 810, cy = 520;
    sg.save(); sg.fillStyle = '#000'; sg.beginPath(); sg.rect(0, 0, SW, SH); sg.arc(cx, cy, Math.max(r, .01), 0, TAU, true); sg.fill('evenodd'); sg.restore();
    if (r > 30) { cam(); const ex = cx - r; hose([ex - 160, cy - 140], [ex, cy], 20, 16); glove(ex, cy, 0, 'grab', 1.3); }
  }
}
function fatBanner(u, bs) { sg.save(); sg.translate(540, 410); sg.rotate(-.04 + .02 * Math.sin(u * 4)); sg.scale(bs, bs); sg.fillStyle = P.white; sg.font = '60px Shrikhand'; sg.textAlign = 'center'; sg.textBaseline = 'middle'; sg.fillText('DAY 2 STARTS', 0, 6); sg.restore(); }
const FN = { title, tier, mirror, mew, jaw, height, psl, vote };

// ————— composite: scene → film gate, HUD, title strip, caption cards —————
function plaque(x, y, w, h, top, bot) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = 'rgba(12,11,10,.94)'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 16); g.fill();
  g.strokeStyle = P.paper; g.lineWidth = 3; g.beginPath(); g.roundRect(x - w / 2 + 8, y - h / 2 + 8, w - 16, h - 16, 11); g.stroke(); g.lineWidth = 1; g.beginPath(); g.roundRect(x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 8); g.stroke();
  g.fillStyle = P.paper; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '26px Limelight'; g.fillText(top, x, y - 26); g.font = '62px Shrikhand'; g.fillText(bot, x, y + 20); g.restore();
}
function composite(t, jump) {
  const f = Math.floor(t * 24 + 1e-6);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
  const wx = (vnoise(t * 1.3) - .5) * 2.4 + (hash(f * 7.1) > .985 ? (hash(f) - .5) * 5 : 0), wy = (vnoise(t * 1.1 + 40) - .5) * 2.6 + jump;
  g.save(); g.beginPath(); g.roundRect(0, GATE_Y - 4, SW, SH + 8, 28); g.clip();
  g.filter = 'blur(0.55px) contrast(1.14)'; g.drawImage(SC, wx, GATE_Y + wy); g.filter = 'none';
  const fl = (hash(f * 1.618) - .5) * .08 + (vnoise(t * 3) - .5) * .04; g.fillStyle = fl > 0 ? `rgba(255,252,240,${fl})` : `rgba(0,0,0,${-fl})`; g.fillRect(0, GATE_Y, SW, SH);
  const sgm = Math.floor(t * 2.3);
  for (let i = 0; i < 3; i++) { if (hash(sgm * 13.7 + i * 3.1) < .45) continue; const sx = hash(sgm * 5.3 + i) * SW + Math.sin(t * 7 + i) * 6; g.strokeStyle = hash(sgm + i * 9) > .4 ? 'rgba(245,242,230,.5)' : 'rgba(10,10,8,.45)'; g.lineWidth = .8 + hash(sgm * 2 + i) * 1.4; g.beginPath(); const y0 = GATE_Y + hash(sgm * 3 + i) * SH * .5; g.moveTo(sx, y0); g.lineTo(sx + (hash(f + i) - .5) * 3, y0 + SH * (.4 + hash(sgm + i * 5) * .6)); g.stroke(); }
  const nd = 3 + Math.floor(hash(f * 2.7) * 6);
  for (let i = 0; i < nd; i++) { const dx = hash(f * 11.1 + i * 1.7) * SW, dy = GATE_Y + hash(f * 17.3 + i * 2.9) * SH, rr = .8 + hash(f + i * 4.4) * 2.8; g.fillStyle = hash(f * 1.3 + i) > .35 ? 'rgba(12,11,10,.75)' : 'rgba(250,248,240,.7)'; g.beginPath(); g.ellipse(dx, dy, rr * (1 + hash(i + f) * 1.5), rr, hash(i * 3 + f) * 3, 0, 7); g.fill(); }
  const vg = g.createRadialGradient(540, GATE_Y + 405, 300, 540, GATE_Y + 405, 700); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(.7, 'rgba(0,0,0,.18)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = vg; g.fillRect(0, GATE_Y, SW, SH);
  g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 14; g.filter = 'blur(6px)'; g.beginPath(); g.roundRect(0, GATE_Y - 4, SW, SH + 8, 28); g.stroke(); g.filter = 'none'; g.restore();
  // HUD + running title (off during the opening title card)
  if (t >= 3.6) {
    fatTitle(g, '30 DAYS TO ASCEND', 540, 190, 84, { track: 2 });
    const day = t >= 68.5 ? '29' : '30', psl = window.__psl || '0.0';
    plaque(290, 400, 400, 130, 'DAYS LEFT', day); plaque(790, 400, 400, 130, 'PSL SCORE', t >= 50 && t < 60 ? psl : '0.0');
  }
  // caption cards in the lower black band
  const c = CAPS.find(c => t >= c[0] && t < c[1]);
  if (c) { const lines = c[2].split('\n'), sz = 54, y0 = 1540 - (lines.length - 1) * 66; lines.forEach((L, i) => subPlate(g, L, 540 + wx, y0 + i * 132 + wy, { size: sz })); }
  g.save(); g.fillStyle = 'rgba(241,238,230,.55)'; g.font = '24px Limelight'; g.textAlign = 'center'; g.fillText('EPISODE ONE  ·  A  RUBBER  HOSE  SERIES', 540, 1800); g.restore();
}

// ————— render —————
const cuts = SHOTS.map(s => s[0]);
const drawFrame = t => {
  t = Math.min(t, DUR - 1e-4); T.frame(t); sg.setTransform(1, 0, 0, 1, 0, 0); sg.fillStyle = '#000'; sg.fillRect(0, 0, SW, SH);
  const sh = shotAt(t);
  if (t >= 3.4 && t < 4) {   // the title card rolls up like a window shade, revealing the first scene
    FN.tier(t); T.reset(); const edge = SH * (1 - ss((t - 3.4) / .6));
    sg.save(); sg.beginPath(); sg.rect(0, 0, SW, edge); sg.clip(); FN.title(t); sg.restore();
    sg.fillStyle = P.paper; sg.fillRect(0, edge - 6, SW, 12); sg.strokeStyle = '#0E0D0C'; sg.lineWidth = 4; sg.strokeRect(0, edge - 6, SW, 12);
  } else FN[sh[2]](t);
  const f = Math.round(t * 24), jump = cuts.some(c => c > 0 && Math.round(c * 24) === f) ? 3 : 0;
  composite(t, jump);
};
window.DUR = DUR; window.EV = EV;
window.SUBS = CAPS.map(c => ({ t0: c[0], t1: c[1], text: c[2].replace('\n', ' ') }));
window.render = t => drawFrame(t);
window.READY = true;
