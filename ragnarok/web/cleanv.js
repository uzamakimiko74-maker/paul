const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.goto('http://127.0.0.1:8765/web/ragnarok.html'); await p.evaluate(() => window.ready);
  const d = await p.evaluate(async (t) => { await prep(t); update(t); renderer.setSize(1080,1920,false); cam.aspect=1080/1920; cam.fov=50; cam.updateProjectionMatrix();
    cam.position.set(0.3,3.6,24); cam.lookAt(0.3,5.2,0); renderer.render(scene,cam); return glc.toDataURL('image/jpeg',.95); }, +process.argv[2]);
  fs.writeFileSync(process.argv[3], Buffer.from(d.split(',')[1], 'base64')); await b.close(); })();
