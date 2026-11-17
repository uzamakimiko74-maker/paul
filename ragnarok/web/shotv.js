const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('http://127.0.0.1:8765/thumb_v.html');await p.waitForTimeout(1500);await p.screenshot({path:'/home/user/paul/ragnarok/out/thumbnail_vertical.png'});await b.close()})();
