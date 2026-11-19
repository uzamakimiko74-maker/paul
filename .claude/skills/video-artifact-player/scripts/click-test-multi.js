// node click-test-multi.js <dir-with-index.html-and-files> ".dl" <count>
// Serves <dir> at http://local.test/, stubs the viewer's `downloads` capability, clicks each matching button at its real
// position (checks nothing covers it) and prints every saved file. Run from a folder that has node_modules/playwright.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=path.resolve(process.argv[2]),sel=process.argv[3]||'.dl',count=+(process.argv[4]||1);
const types={'.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png'};
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:390,height:780}});const log=[];
 pg.on('pageerror',e=>log.push('PAGEERR '+e.message));
 await pg.addInitScript(()=>{window.claude={use:async n=>n==='downloads'?{save:async o=>{(window.__saved=window.__saved||[]).push({name:o.filename,size:o.data.size,type:o.data.type})}}:null}});
 await pg.route(/^https:\/\/fonts\./,r=>r.abort());
 await pg.route('http://local.test/**',r=>{let p=new URL(r.request().url()).pathname;if(p==='/')p='/index.html';const f=path.join(dir,p);if(!fs.existsSync(f))return r.fulfill({status:404,body:'x'});
  if(p==='/index.html')return r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>'});
  r.fulfill({path:f,contentType:types[path.extname(f)]||'application/octet-stream'})});
 await pg.goto('http://local.test/');await pg.waitForTimeout(1200);
 for(let i=0;i<count;i++){const loc=pg.locator(sel).nth(i);const bb=await loc.boundingBox();const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
  const under=await pg.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);const b=e&&e.closest&&e.closest('button');return b?'button '+(b.dataset.part||b.id):(e?e.tagName:'nothing')},[cx,cy]);
  await pg.mouse.click(cx,cy);await pg.waitForTimeout(2500);console.log('button',i,'under pointer:',under)}
 console.log('saved:',JSON.stringify(await pg.evaluate(()=>window.__saved||null)));console.log(log.join('\n')||'no page errors');await br.close()})();
