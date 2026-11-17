const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const dir = '/home/user/paul/ragnarok/egypt_thumb', nm = '/home/user/paul/ragnarok/web/node_modules';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.route(/^https:\/\//, r => {
    const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: nm + '/three/build/three.min.js', contentType: 'text/javascript' });
    if (u.includes('GLTFLoader')) return r.fulfill({ path: nm + '/three/examples/js/loaders/GLTFLoader.js', contentType: 'text/javascript' });
    if (u.includes('mp4-muxer')) return r.fulfill({ body: 'window.Mp4Muxer={}', contentType: 'text/javascript' });
    if (u.includes('fonts.googleapis')) return r.fulfill({ body: "@font-face{font-family:Fredoka;font-weight:700;src:url(http://local.test/f.woff2) format('woff2')}", contentType: 'text/css' });
    r.abort();
  });
  await p.route('http://local.test/**', r => {
    let q = new URL(r.request().url()).pathname; if (q === '/') q = '/index.html';
    if (q === '/f.woff2') return r.fulfill({ path: '/home/user/paul/ragnarok/web/fonts/fredoka-latin-700-normal.woff2', contentType: 'font/woff2' });
    const f = path.join(dir, q); if (!fs.existsSync(f)) return r.fulfill({ status: 404, body: 'x' });
    r.fulfill({ path: f, contentType: f.endsWith('.jpg') ? 'image/jpeg' : 'text/html' });
  });
  await p.goto('http://local.test/'); await p.waitForTimeout(2500);
  await p.evaluate(() => window.BG_READY);
  await p.addStyleTag({ content: '#overlay,#top{display:none!important}' + (process.env.CLEAN ? '#hud{display:none!important}' : '') });
  for (const t of process.argv.slice(2).map(Number)) {
    await p.evaluate(t => { WORDS.length = 0; playing = false; update(t); renderer.render(scene, cam); paintHud(t); }, t);
    await p.waitForTimeout(400);
    await p.locator('#stage').screenshot({ path: `/home/user/paul/ragnarok/egypt_thumb/${process.env.PFX||'shot'}_${String(Math.round(t * 10)).padStart(4, '0')}.png` });
  }
  console.log('errors', JSON.stringify(errs)); await b.close();
})();
