// usage: node render.js <outdir> <startFrame> <endFrame> <fps> [step]   (writes NNNNNN.jpg)  or  node render.js --times out.json t1,t2,...
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const args = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('flatShading')) console.log('PAGE', m.type(), m.text().slice(0, 300)); });
  p.on('pageerror', e => console.log('PAGEERROR', String(e.stack||e).slice(0, 700)));
  await p.goto('http://127.0.0.1:8765/web/ragnarok.html');
  await p.evaluate(() => window.ready);
  let list = [];
  if (args[0] === '--times') {
    const times = args[2].split(',').map(Number);
    fs.mkdirSync(args[1], { recursive: true });
    for (const t of times) {
      let d; try { d = await p.evaluate(t => window.renderFrame(t, .92), t); } catch (e) { console.log('skip', t, String(e).slice(0,80)); continue; }
      fs.writeFileSync(`${args[1]}/t${String(Math.round(t * 10)).padStart(5, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    }
  } else {
    const [out, s, e, fps, step] = [args[0], +args[1], +args[2], +args[3], +(args[4] || 1)];
    fs.mkdirSync(out, { recursive: true });
    const t0 = Date.now();
    for (let f = s; f < e; f += step) {
      const fn = `${out}/${String(f).padStart(6, '0')}.jpg`;
      if (fs.existsSync(fn)) continue;
      const d = await p.evaluate(t => window.renderFrame(t, .9), f / fps);
      fs.writeFileSync(fn, Buffer.from(d.split(',')[1], 'base64'));
      if ((f - s) % 240 === 0) console.log(`frame ${f}/${e}  ${((Date.now() - t0) / 1000 / ((f - s) / step + 1)).toFixed(2)}s/frame`);
    }
  }
  await b.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
