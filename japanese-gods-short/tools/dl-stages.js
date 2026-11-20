// Watches the Download button's label through each stage, with a save() that stays pending like the real prompt.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=path.resolve('build');
(async()=>{
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:390,height:780}});
 await pg.addInitScript(()=>{window.__confirm=null;window.claude={use:async n=>n==='downloads'?{save:async o=>{window.__pending=o.data.size;await new Promise(r=>window.__confirm=r);window.__saved=o.data.size;return {status:'saved'}}}:null}});
 await pg.route('http://local.test/**',async r=>{let p=new URL(r.request().url()).pathname;if(p==='/')p='/index.html';const f=path.join(dir,p);
  if(!fs.existsSync(f))return r.fulfill({status:404,body:'missing'});
  if(p==='/index.html')return r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>'});
  const ct={'.mp4':'video/mp4','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg'}[path.extname(f)];
  r.fulfill({status:200,contentType:ct,headers:{'Accept-Ranges':'bytes'},body:fs.readFileSync(f)})});
 await pg.goto('http://local.test/');await pg.waitForFunction('window.READY===true');
 const seen=[];const poll=setInterval(async()=>{try{const s=await pg.evaluate(()=>dlBtn.textContent);if(seen[seen.length-1]!==s)seen.push(s)}catch(_){}},30);
 await pg.click('#dl');
 await pg.waitForFunction('window.__pending>0',null,{timeout:20000});
 await pg.waitForTimeout(500);
 console.log('while waiting for the viewer:',JSON.stringify(await pg.evaluate(()=>({button:dlBtn.textContent,disabled:dlBtn.disabled,status:hint.textContent}))));
 await pg.evaluate(()=>window.__confirm());
 await pg.waitForFunction('window.__saved>0');await pg.waitForTimeout(300);clearInterval(poll);
 console.log('labels seen:',seen.map(s=>'"'+s+'"').join(' -> '));
 console.log('bytes saved:',await pg.evaluate(()=>window.__saved));await br.close()})();
