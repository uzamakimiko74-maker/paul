// node screenshot.js <url> <out.png> [width=1280] [height=720] [deviceScaleFactor=1]
// Renders an HTML thumbnail layout (served by any local http server) to a PNG. Wait 1.5 s so the local Fredoka font is applied.
const { chromium } = require('playwright');
(async () => {
  const [url, out, w, h, dsf] = [process.argv[2], process.argv[3], +(process.argv[4] || 1280), +(process.argv[5] || 720), +(process.argv[6] || 1)];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
  await p.goto(url); await p.waitForTimeout(1500); await p.screenshot({ path: out }); await b.close();
})();
