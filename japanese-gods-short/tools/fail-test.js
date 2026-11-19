const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=path.resolve('build');const types={'.mp4':'video/mp4','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg'};
async function run(label,block){
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:390,height:780}});
 await pg.addInitScript(()=>{window.claude={use:async n=>n==='downloads'?{save:async()=>{}}:null}});
 await pg.route('http://local.test/**',r=>{let p=new URL(r.request().url()).pathname;if(p==='/')p='/index.html';
  if(block&&p.includes(block))return r.fulfill({status:404,body:'nope'});
  const f=path.join(dir,p);if(!fs.existsSync(f))return r.fulfill({status:404,body:'missing'});
  if(p==='/index.html')return r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>'});
  const buf=fs.readFileSync(f),rg=r.request().headers()['range'];
  if(rg){const m=/bytes=(\d+)-(\d*)/.exec(rg),a=+m[1],b=m[2]?+m[2]:buf.length-1;return r.fulfill({status:206,contentType:types[path.extname(f)],headers:{'Content-Range':`bytes ${a}-${b}/${buf.length}`,'Accept-Ranges':'bytes'},body:buf.slice(a,b+1)})}
  r.fulfill({status:200,contentType:types[path.extname(f)],body:buf})});
 await pg.goto('http://local.test/');await pg.waitForTimeout(2500);
 const st=await pg.evaluate(()=>({btn:playBtn.textContent.trim(),disabled:playBtn.disabled,hint:hint.textContent}));
 console.log(label.padEnd(24),'button:',JSON.stringify(st.btn),'disabled:',st.disabled);console.log(' '.repeat(24),'status:',st.hint);
 if(!st.disabled){await pg.click('#playBtn');await pg.waitForTimeout(2500);
  const r=await pg.evaluate(()=>({t:clockT().toFixed(2),silent,overlayHidden:overlay.hidden,bar:fillEl.style.width,hint:hint.textContent}));
  console.log(' '.repeat(24),'after click -> clock',r.t+'s','silent:',r.silent,'overlay hidden:',r.overlayHidden,'bar:',r.bar);console.log(' '.repeat(24),'status:',r.hint)}
 await br.close()}
(async()=>{await run('everything present');await run('audio missing','narration_mix');await run('one image missing','bg/dawn.jpg');await run('hagoromo missing','hagoromo.png')})();
