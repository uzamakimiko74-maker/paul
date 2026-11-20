const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const [,, dir, times, out, scale]=process.argv;fs.mkdirSync(out,{recursive:true});
const srv=http.createServer((q,r)=>{const f=path.join(dir,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}
 const ext=path.extname(f);r.writeHead(200,{'Content-Type':{'.html':'text/html','.jpg':'image/jpeg','.mp3':'audio/mpeg'}[ext]||'application/octet-stream'});r.end(d)})}).listen(0,async()=>{
 const port=srv.address().port;const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(`http://localhost:${port}/index.html`);await p.waitForFunction('window.READY===true',null,{timeout:20000}).catch(()=>errs.push('not ready'));
 for(const t of times.split(',')){const d=await p.evaluate(([t,s])=>{render(+t);const c=document.createElement('canvas');c.width=540*s;c.height=960*s;c.getContext('2d').drawImage(cv,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.85)},[t,+scale||.5]);
  fs.writeFileSync(path.join(out,(+t).toFixed(1).padStart(5,'0')+'.jpg'),Buffer.from(d.split(',')[1],'base64'))}
 console.log('errors:',JSON.stringify(errs));await b.close();srv.close()});
