const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/web/ragnarok.html');
  await p.evaluate(() => window.ready);
  const ev = await p.evaluate(() => SHOTS.map((s, i) => ({ i, a: s.a, b: (SHOTS[i + 1] ? SHOTS[i + 1].a : TL.total), sec: s.sec, w: s.w, bl: s.bl || null, card: s.card || null,
    cut: s.cut || null, flash: s.flash || [], burst: (s.burst || []).map(x => [x[0], x[1]]), stamp: (s.stamp || []).map(x => [x[0], x[1]]) })));
  fs.writeFileSync('../work/events.json', JSON.stringify(ev));
  console.log(ev.length, 'shots');
  await b.close();
})();
