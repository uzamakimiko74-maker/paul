// Same harness as the skill's click-test, run in all three states the overlay passes through.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=path.resolve(process.argv[2]),sel=process.argv[3]||'#dl';
const types={'.mp4':'video/mp4','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.js':'text/javascript','.css':'text/css'};
(async()=>{
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:390,height:780}});const log=[];
 pg.on('pageerror',e=>log.push('PAGEERR '+e.message));pg.on('console',m=>{if(m.type()==='error')log.push(m.text().slice(0,200))});
 await pg.addInitScript(()=>{window.claude={use:async n=>n==='downloads'?{save:async o=>{window.__saved={name:o.filename,size:o.data.size,type:o.data.type}}}:null}});
 await pg.route('http://local.test/**',r=>{let p=new URL(r.request().url()).pathname;if(p==='/')p='/index.html';const f=path.join(dir,p);
   if(!fs.existsSync(f))return r.fulfill({status:404,body:'missing'});
   if(p==='/index.html')return r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+fs.readFileSync(f,'utf8')+'</body></html>'});
   const ct=types[path.extname(f)]||'application/octet-stream',buf=fs.readFileSync(f),rg=r.request().headers()['range'];
   if(rg){const m=/bytes=(\d+)-(\d*)/.exec(rg);const a=+m[1],b=m[2]?+m[2]:buf.length-1;
     return r.fulfill({status:206,contentType:ct,headers:{'Content-Range':`bytes ${a}-${b}/${buf.length}`,'Accept-Ranges':'bytes'},body:buf.slice(a,b+1)})}
   r.fulfill({status:200,contentType:ct,headers:{'Accept-Ranges':'bytes'},body:buf})});
 await pg.goto('http://local.test/');await pg.waitForFunction('window.READY===true',null,{timeout:20000});
 async function probe(label){
  await pg.evaluate(()=>{window.__saved=null});
  const bb=await pg.locator(sel).boundingBox();
  if(!bb){console.log(label.padEnd(22),'BUTTON NOT VISIBLE');return}
  const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
  const under=await pg.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.id||e.tagName):'nothing'},[cx,cy]);
  await pg.mouse.click(cx,cy);
  await pg.waitForFunction('window.__saved!==null',null,{timeout:25000}).catch(()=>{});
  const s=await pg.evaluate(()=>window.__saved);
  console.log(label.padEnd(22),'under:',String(under).padEnd(8),'saved:',s?`${s.name} ${s.size} ${s.type}`:'NOTHING');
 }
 await probe('1 start overlay');
 await pg.click('#playBtn');await pg.waitForTimeout(1200);
 const mid=await pg.evaluate(()=>({t:narr.currentTime,overlayHidden:overlay.hidden}));
 console.log('   playing at t =',mid.t.toFixed(2),'overlay hidden:',mid.overlayHidden);
 await probe('2 mid playback');
 console.log('   playback stopped by download:',await pg.evaluate(()=>narr.paused));
 await pg.click('#playBtn');await pg.waitForTimeout(600);
 console.log('   resume works:',await pg.evaluate(()=>!narr.paused));
 await pg.evaluate(()=>{narr.currentTime=DUR-0.5});
 await pg.waitForFunction('document.getElementById("overlay").hidden===false',null,{timeout:20000}).catch(()=>console.log('   end overlay never returned'));
 console.log('   end state, play button says:',await pg.evaluate(()=>playBtn.textContent.trim()));
 await probe('3 finished overlay');
 console.log(log.slice(0,6).join('\n')||'no page errors');await br.close()})();
