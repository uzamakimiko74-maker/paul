const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('http://127.0.0.1:8765/egypt_thumb_new.html');await p.waitForTimeout(1500);await p.screenshot({path:'/home/user/paul/ragnarok/out/egyptian_gods_thumbnail_new.png'});await b.close()})();
