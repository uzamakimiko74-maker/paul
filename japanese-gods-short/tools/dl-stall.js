const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const dir=path.resolve('build');
(async()=>{
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:390,height:780}});
 await pg.addInitScript(()=>{window.claude={use:async n=>n==='downloads'?{save:async()=>({status:'saved'})}:null}});
 await pg.route('http://local.test/**',async r=>{let p=new URL(r.request().url()).pathname;if(p==='/')p='/index.html';const f=path.join(dir,p);
  if(p.endsWith('.mp4'))return;   // never answer: a stalled fetch
  if(!fs.existsSync(f))return r.fulfill({status:404,body:'missing'});
  if(p==='/index.html')return r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>'});
  r.fulfill({status:200,contentType:{'.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg'}[path.extname(f)],body:fs.readFileSync(f)})});
 await pg.goto('http://local.test/');await pg.waitForFunction('window.READY===true');
 const t0=Date.now();await pg.click('#dl');
 console.log('after click:',await pg.evaluate(()=>dlBtn.textContent));
 await pg.waitForFunction(()=>/Could not save/.test(dlBtn.textContent),null,{timeout:45000});
 console.log('after',((Date.now()-t0)/1000).toFixed(0)+'s:',await pg.evaluate(()=>({button:dlBtn.textContent,enabled:!dlBtn.disabled})));
 await br.close()})();
