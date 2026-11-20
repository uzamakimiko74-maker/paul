const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const srv=http.createServer((q,r)=>{const f=path.join('build',decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}
 r.writeHead(200,{'Content-Type':{'.html':'text/html','.jpg':'image/jpeg','.mp3':'audio/mpeg','.png':'image/png'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(0,async()=>{
 const b=await chromium.launch();const p=await b.newPage();await p.goto(`http://localhost:${srv.address().port}/index.html`);
 await p.waitForFunction('window.READY===true');
 console.log(await p.evaluate(()=>{
  const g=[];for(let i=0;i<CUTS.length;i++){const d=((CUTS[i+1]?CUTS[i+1].t:DUR)-CUTS[i].t);g.push(d)}
  const want=DEF.reduce((n,d)=>n+(d.cams||[]).length,0)+3;
  const srt=[...g].sort((a,b)=>a-b);
  return `shots ${CUTS.length} of ${want} expected\nfirst cut ${CUTS[0].t.toFixed(2)}  last ${CUTS[CUTS.length-1].t.toFixed(2)}\n`
   +`shot length: min ${srt[0].toFixed(2)}s  median ${srt[srt.length>>1].toFixed(2)}s  max ${srt[srt.length-1].toFixed(2)}s\n`
   +`over 3s: ${g.map((d,i)=>[d,CUTS[i].t]).filter(x=>x[0]>3).map(x=>x[1].toFixed(1)+'s/'+x[0].toFixed(1)).join(' ')||'none'}\n`
   +`under 0.5s: ${g.filter(d=>d<0.5).length}`;
 }));await b.close();srv.close()});
