// Draws thumbnails with the page's own painter, hagoromo and Blender backgrounds.
const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const srv=http.createServer((q,r)=>{const f=path.join('build',decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}
 r.writeHead(200,{'Content-Type':{'.html':'text/html','.jpg':'image/jpeg','.mp3':'audio/mpeg','.png':'image/png'}[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(0,async()=>{
 const b=await chromium.launch();const p=await b.newPage();await p.goto(`http://localhost:${srv.address().port}/index.html`);await p.waitForFunction('window.READY===true');
 const draw=(layout)=>{
  const V=layout==='v',LW=V?540:960,LH=V?960:540,W=V?1080:1280,H=V?1920:720,S=W/LW;
  cv.width=W;cv.height=H;K=S;g.setTransform(S,0,0,S,0,0);g.imageSmoothingQuality='high';slot=0;
  g.fillStyle='#000';g.fillRect(0,0,LW,LH);
  const T=1.3;
  // background: the Blender dawn, cropped to the frame
  if(V){bg('dawn',1.12,0,-20)}else{const im=IMG.dawn,w=LW*1.04,h=w*im.height/im.width;g.drawImage(im,-(w-LW)/2,-h*.30,w,h)}
  const hx=V?270:704,hf=V?722:512,hs=V?1.68:1.52,hy=hf-204*hs;
  // sunburst behind her, brighter than the film's so she pops at small sizes
  g.save();g.globalAlpha=.9;rays(hx,hy,T,1,V?760:620);g.restore();
  // legibility wash behind the words
  const wash=V?g.createLinearGradient(0,0,0,300):g.createLinearGradient(0,0,520,0);
  wash.addColorStop(0,'rgba(12,6,34,.82)');wash.addColorStop(1,'rgba(12,6,34,0)');g.fillStyle=wash;g.fillRect(0,0,V?LW:520,V?300:LH);

  // the four rivals
  const rv=[['EB','happy'],['SU','power'],['TS','smug'],['IZ','angry']],tags=['#5','#4','#3','#2'];
  rv.forEach(([k,ex],i)=>{
   const rs=V?.56:.44,x=V?72+i*132:62+i*104,f=V?936:524;
   sprite({k,ex,fx:'',ph:i},T,x,f,rs);
   const bx=x,by=f-266*rs-14;g.save();g.translate(bx,by);rr(-24,-17,48,32,10,'rgba(15,10,35,.9)','#ffd34d',3);txt(tags[i],0,7,V?22:17,'#fff',{align:'center',sw:0,stroke:null});g.restore()});
  halo(hx,hy,hs,T,1);
  sprite({k:'AM',ex:'power',fx:'spark',hs:.62},T,hx,hf,hs);
  // the words
  g.save();
  if(V){
   txt('RANKING',270,104,78,'#ffffff',{align:'center',maxw:500,sw:16});
   txt("JAPAN'S GODS",270,206,92,'#ffd34d',{align:'center',maxw:512,sw:18});
  }else{
   txt('RANKING',36,132,92,'#ffffff',{maxw:440,sw:15});
   txt("JAPAN'S",36,252,128,'#ffd34d',{maxw:440,sw:20});
   txt('GODS',36,370,150,'#ffd34d',{maxw:440,sw:22});
  }
  g.restore();
  // the hook: who is #1
  g.save();g.translate(V?446:864,V?330:112);g.rotate(-.1);
  rr(-86,-30,172,60,16,'#e32a2a','#ffffff',6);txt("WHO'S #1?",0,13,V?34:32,'#fff',{align:'center',maxw:152,sw:0,stroke:null});g.restore();
  return cv.toDataURL('image/png');
 };
 for(const [name,l] of [['thumbnail-vertical-1080x1920','v'],['thumbnail-landscape-1280x720','h']]){
  const d=await p.evaluate(`(${draw.toString()})('${l}')`);fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(d.split(',')[1],'base64'))}
 console.log(fs.readdirSync(out).join('\n'));await b.close();srv.close()});
