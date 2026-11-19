const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.goto('http://127.0.0.1:8765/web/ragnarok.html'); await p.evaluate(() => window.ready);
  const t = +process.argv[2]; const d = await p.evaluate(t => window.renderClean(t), t);
  fs.writeFileSync(process.argv[3], Buffer.from(d.split(',')[1], 'base64')); await b.close(); })();
