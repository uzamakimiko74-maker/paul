const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const [,, dir, out, fps]=process.argv;fs.mkdirSync(out,{recursive:true});const FPS=+fps||30;
const srv=http.createServer((q,r)=>{const f=path.join(dir,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}
 const ext=path.extname(f);r.writeHead(200,{'Content-Type':{'.html':'text/html','.jpg':'image/jpeg','.mp3':'audio/mpeg'}[ext]||'application/octet-stream'});r.end(d)})}).listen(0,async()=>{
 const b=await chromium.launch();const p=await b.newPage();await p.goto(`http://localhost:${srv.address().port}/index.html`);await p.waitForFunction('window.READY===true');
 const N=Math.ceil(93.8*FPS);const t0=Date.now();
 for(let i=0;i<N;i++){const d=await p.evaluate(t=>{render(t);return cv.toDataURL('image/jpeg',.9)},i/FPS);fs.writeFileSync(path.join(out,'f'+String(i).padStart(5,'0')+'.jpg'),Buffer.from(d.split(',')[1],'base64'));
  if(i%100===0)fs.writeFileSync(path.join(out,'..','progress.txt'),i+'/'+N+' '+((Date.now()-t0)/1000|0)+'s')}
 fs.writeFileSync(path.join(out,'..','progress.txt'),'DONE '+N);await b.close();srv.close()});
