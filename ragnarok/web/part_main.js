/* ===== Ragnarok worlds: flat-shaded low-poly sets, same look as the short ===== */
const WORLDS={},HEMI={},WCFG={};
function plane(p,w,h,mat,x,y,z,rx){const m=mesh(p,new THREE.PlaneGeometry(w,h),mat,x,y,z);m.rotation.x=rx||0;return m}
function ground(p,tex,size,y){tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(size/24,size/24);return plane(p,size,size,L(0xffffff,{map:tex}),0,y||0,0,-Math.PI/2)}
function addW(name,hem,fn){const g=world();WORLDS[name]=g;HEMI[name]=hem;WCFG[name]={};fn(g,WCFG[name]);return g}
function pts(n,color,size,seed){const geo=new THREE.BufferGeometry(),arr=new Float32Array(n*3);geo.setAttribute('position',new THREE.BufferAttribute(arr,3));
  const p=new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.9,depthWrite:false}));p.frustumCulled=false;
  const r=rng(seed||n),sd=[];for(let i=0;i<n;i++)sd.push([r(),r(),r()]);p.userData={arr,sd,n};return p}
function snowStep(p,t,sx,sy,sz,sp,wind,cx,cy,cz){const{arr,sd,n}=p.userData;for(let i=0;i<n;i++){const s=sd[i];
  arr[i*3]=cx+(s[0]-.5)*sx+Math.sin(t*.7+s[2]*9)*.5+((t*wind*(.4+s[1]))%sx);arr[i*3]=cx+(((s[0]*sx+t*wind*(.4+s[1]*.6))%sx+sx)%sx)-sx/2+Math.sin(t*.7+s[2]*9)*.4;
  arr[i*3+1]=cy+(((s[1]*sy-t*sp*(.5+s[2]*.7))%sy)+sy)%sy;arr[i*3+2]=cz+(s[2]-.5)*sz}p.geometry.attributes.position.needsUpdate=true}
function emberStep(p,t,sx,sy,sz,sp,cx,cy,cz){const{arr,sd,n}=p.userData;for(let i=0;i<n;i++){const s=sd[i],u=((t*sp*(.3+s[1]*.7)+s[2]*7)%1);
  arr[i*3]=cx+(s[0]-.5)*sx+Math.sin(t*1.3+s[2]*20)*1.2;arr[i*3+1]=cy+u*sy;arr[i*3+2]=cz+(s[1]-.5)*sz}p.geometry.attributes.position.needsUpdate=true}
const FILM=(c)=>FL(c);
function lavaTex(){return ctex(256,256,(g,w,h)=>{g.fillStyle='#2a0a04';g.fillRect(0,0,w,h);const r=rng(21);g.lineCap='round';
  for(let i=0;i<46;i++){let x=r()*w,y=r()*h;g.strokeStyle=['#ff7a1a','#ffb02a','#ff4a10'][i%3];g.lineWidth=2+r()*4;g.beginPath();g.moveTo(x,y);
    for(let k=0;k<4;k++)g.lineTo(x+=(r()-.5)*60,y+=(r()-.5)*60);g.stroke()}
  g.fillStyle='rgba(255,180,40,.25)';for(let i=0;i<30;i++){g.beginPath();g.arc(r()*w,r()*h,4+r()*10,0,7);g.fill()}})}

addW('void',[0x8890c0,.55],(g,c)=>{dome(g,nightTex('#000000','#03040a','#0a0c1a',{stars:340,seed:3}));
  glowSp(g,glowTex('rgba(120,140,255,.55)','rgba(60,70,160,.22)'),46,0,7,-30,.4)});

addW('dusk',[0xb8b0e0,.85],(g,c)=>{dome(g,nightTex('#0a0e2c','#3a2a5c','#e0785a',{stars:150,seed:5,aurora:['90,255,190','130,160,255','200,120,255']}));
  ground(g,groundTex('#1c2438',['#242e48','#141a2c','#2e3a5a'],1),170);
  for(let i=0;i<18;i++){snowCone(g,(i-9)*8+R()*4,-24-R()*16,5+R()*5,11+R()*10,0x4a5a82)}
  for(let i=0;i<22;i++){const x=(R()-.5)*76;if(Math.abs(x)<8)continue;pine(g,x,-3-R()*24,1.2+R()*1.3,[0x1d3a3a,0x24484a,0x2c5a56])}
  c.runes=[['OD','#ffd34d',-9,-5,3.2,.3],['TH','#7fe9ff',9.5,-6,3.6,-.3],['TY','#ff9a5a',-3,-14,3.6,.1]].map(a=>runeStone(g,...a));
  glowSp(g,glowTex('rgba(255,200,140,.7)','rgba(255,120,80,.25)'),36,0,5,-45,.6)});

addW('hall',[0xffe0b0,.95],(g,c)=>{dome(g,nightTex('#1a0f08','#3a2410','#7a4a20',{stars:0,seed:2}));
  ground(g,groundTex('#6a4a2a',['#7a5a34','#5a3a1e','#8a6a40'],1),90);
  mesh(g,new THREE.BoxGeometry(70,18,1),FL(0x4a2e18),0,9,-15);
  [[-22,'#d8432f'],[-12,'#e8b830'],[12,'#e8b830'],[22,'#d8432f']].forEach(([x,col])=>{plane(g,4,9,B(col),x,10,-14.4)});
  [-19,-12,12,19].forEach(x=>{const cl=makeColumn(11,1,PH(0xd8b25a));cl.position.set(x,0,-9);g.add(cl)});
  [-26,26].forEach(x=>{const cl=makeColumn(13,1.2,PH(0xc29a48));cl.position.set(x,0,3);g.add(cl)});
  const hs=highSeat(g,L(0x8a5a2a),L(0x4a2a12),0xffd34d);hs.t.position.set(0,0,-4);hs.t.scale.setScalar(1.3);
  c.fl=[];[-19,-12,12,19].forEach((x,i)=>{const f=makeFlame('#ffd24a','#ff7a1a');f.grp.position.set(x,11.4,-9);f.grp.scale.setScalar(1.6);g.add(f.grp);c.fl.push(f)});
  glowSp(g,glowTex('rgba(255,210,120,.8)','rgba(255,150,60,.3)'),34,0,8,-10,.5)});

addW('cave',[0x70a090,.8],(g,c)=>{dome(g,nightTex('#020806','#06140f','#0a2418',{stars:0,seed:4}));
  ground(g,groundTex('#1a1f1c',['#242a26','#10140f','#2c332e'],1),100);
  for(let i=0;i<22;i++){const x=(i-11)*5+R()*3,z=-3-R()*20;mesh(g,new THREE.ConeGeometry(2+R()*3,6+R()*10,5),FL(0x2a302c),x,3,z)}
  for(let i=0;i<20;i++){const x=(R()-.5)*60,z=-2-R()*18;const m=mesh(g,new THREE.ConeGeometry(1+R()*1.6,5+R()*7,5),FL(0x20261f),x,15,z);m.rotation.x=Math.PI}
  glowSp(g,glowTex('rgba(120,255,160,.8)','rgba(60,200,120,.3)'),22,0,4,-8,.55);
  glowSp(g,glowTex('rgba(120,255,160,.5)','rgba(60,200,120,.2)'),30,-14,7,-14,.4)});

addW('winter',[0xc0d0f0,1],(g,c)=>{dome(g,nightTex('#202a3e','#5a6a88','#b0bcd0',{stars:0,seed:8}));
  ground(g,groundTex('#e8eef8',['#d0dcf0','#f4f8ff','#c0cee6'],0),170);
  for(let i=0;i<36;i++){const x=(R()-.5)*90;if(Math.abs(x)<5&&R()<.7)continue;pine(g,x,-4-R()*34,1.2+R()*1.6,[0x2a4a50,0x34585a,0x3e686a])}
  c.win=[];[[-10,-6],[-3,-10],[7,-7],[14,-12],[-17,-12],[0,-18]].forEach(([x,z])=>{const hs=new THREE.Group();hs.position.set(x,0,z);g.add(hs);
    mesh(hs,new THREE.BoxGeometry(4,2.8,3.4),FL(0x6a4a30),0,1.4,0);const rf=mesh(hs,new THREE.ConeGeometry(3.4,2.2,4),FL(0xe8eef8),0,3.9,0);rf.rotation.y=Math.PI/4;
    const w=plane(hs,1,1,B(0xffd34d),0,1.5,1.72);c.win.push(w)});
  glowSp(g,glowTex('rgba(255,255,255,.9)','rgba(200,220,255,.3)'),16,9,17,-44,.8);
  c.snow=pts(900,0xffffff,.14,5);g.add(c.snow)});

addW('doom',[0xff9a80,.85],(g,c)=>{dome(g,nightTex('#10020a','#4a0c14','#e0502a',{stars:70,seed:6}));
  ground(g,groundTex('#1c0e10',['#2a1214','#12080a','#34161a'],1),170);
  c.mt=[];for(let i=0;i<20;i++){const m=mesh(g,new THREE.ConeGeometry(5+R()*5,11+R()*14,4+(R()*3|0)),FL(i%2?0x1a0c18:0x24101e),(i-10)*8+R()*4,5,-18-R()*24);m.rotation.y=R()*3;m.userData.by=m.position.y;c.mt.push(m)}
  c.sun=glowSp(g,glowTex('#fff3b0','rgba(255,160,60,.35)'),17,-15,16,-38,1);c.moon=glowSp(g,glowTex('#e8f0ff','rgba(150,170,255,.3)'),13,17,14,-40,.9);
  c.sea=plane(g,200,60,B(0x1a0a20),0,.05,-48,-Math.PI/2);
  c.em=pts(260,0xff8a3a,.16,9);g.add(c.em)});

addW('plain',[0xe0a080,.9],(g,c)=>{dome(g,nightTex('#0a0c1c','#3a2a4c','#c8683a',{stars:90,seed:7}));
  ground(g,groundTex('#3a3024',['#4a3c2c','#2c241a','#5a4a34'],1),240);
  const bm=new THREE.BoxGeometry(.8,1.9,.5),r2=rng(31);
  [[-1,0x1a2038],[1,0x38161a]].forEach(([sd,col])=>{for(let i=0;i<90;i++){const x=sd*(14+r2()*40),z=-12-r2()*26;mesh(g,bm,FL(col),x,.95,z);if(i%3==0){const sp=mesh(g,new THREE.CylinderGeometry(.04,.04,3,4),B(0x8a8a9a),x+.6,1.6,z)}}
    for(let k=0;k<5;k++){const x=sd*(18+k*9),z=-14-k*4;mesh(g,new THREE.CylinderGeometry(.07,.07,6,5),B(0x3a2a1a),x,3,z);const fl=plane(g,2.4,1.5,B(sd<0?0xe8b830:0xd8432f),x+1.2*sd,5.2,z)}});
  for(let i=0;i<14;i++)mesh(g,new THREE.ConeGeometry(6+R()*5,10+R()*10,5),FL(0x1c1226),(i-7)*14+R()*5,5,-64-R()*10);
  c.em=pts(140,0xffa04a,.14,3);g.add(c.em)});

addW('fire',[0xffb070,1.05],(g,c)=>{dome(g,nightTex('#1a0300','#8a2008','#ff8a22',{stars:0,seed:9}));
  ground(g,lavaTex(),170);
  c.fl=[];for(let i=0;i<22;i++){const f=makeFlame('#ffd24a','#ff4a10');f.grp.position.set((R()-.5)*70,0,-5-R()*30);f.grp.scale.setScalar(3+R()*4);g.add(f.grp);c.fl.push(f)}
  glowSp(g,glowTex('rgba(255,200,80,.9)','rgba(255,90,20,.35)'),52,0,10,-30,.7);
  c.em=pts(320,0xffc060,.17,12);g.add(c.em)});

addW('green',[0xffffff,1.2],(g,c)=>{dome(g,nightTex('#4aa4ff','#a8dcff','#fff0c8',{stars:0,seed:10}));
  ground(g,groundTex('#4aa83a',['#58b845','#3a8a2c','#6ac84e'],0),170);
  for(let i=0;i<14;i++){const h=mesh(g,new THREE.SphereGeometry(7+R()*7,14,8,0,6.3,0,Math.PI/2),FL(i%2?0x3a9a3a:0x4cb04a),(i-7)*9+R()*4,0,-14-R()*30);h.scale.y=.55}
  for(let i=0;i<22;i++){const x=(R()-.5)*60;if(Math.abs(x)<6)continue;pine(g,x,-2-R()*20,1+R()*1.3,[0x2a8a3a,0x3aa84a,0x4cc058])}
  for(let i=0;i<50;i++){mesh(g,new THREE.SphereGeometry(.22,6,5),B([0xffe45c,0xff6b9d,0xffffff,0xc79bff][i%4]),(R()-.5)*50,.2,2+R()*-12)}
  plane(g,180,40,B(0x4aa0e0),0,.03,-56,-Math.PI/2);
  glowSp(g,glowTex('rgba(255,240,180,.95)','rgba(255,220,120,.35)'),30,-14,20,-60,.75)});

addW('gimle',[0xfff0c0,1.25],(g,c)=>{dome(g,nightTex('#ffe9a0','#ffd060','#fff6d8',{stars:0,seed:11}));
  ground(g,groundTex('#f2d98a',['#ffe9a0','#e0c070','#fff2c0'],0),120);
  mesh(g,new THREE.BoxGeometry(40,10,2),PH(0xffd34d,{emissive:0xaa7a10,emissiveIntensity:.5}),0,5,-16);
  const rf=mesh(g,new THREE.ConeGeometry(30,11,4),PH(0xffd34d,{emissive:0xcc9a10,emissiveIntensity:.7}),0,15.5,-16);rf.rotation.y=Math.PI/4;rf.scale.z=.35;
  [-16,-9,-3,3,9,16].forEach(x=>{const cl=makeColumn(9.5,.9,PH(0xfff6d8));cl.position.set(x,0,-12);g.add(cl)});
  glowSp(g,glowTex('rgba(255,255,220,.9)','rgba(255,230,140,.4)'),60,0,14,-20,.6)});

/* ===== Blender interludes: PNG sequences rendered in Blender, shown as the scene background ===== */
const BLN={eclipse:192,bifrost:192,naglfar:192,yggdrasil:192,surtr:192,rebirth:240};
const blC=document.createElement('canvas');blC.width=VW;blC.height=VH;const blG=blC.getContext('2d');
const blTex=new THREE.CanvasTexture(blC);blTex.encoding=THREE.sRGBEncoding;blTex.minFilter=THREE.LinearFilter;blTex.generateMipmaps=false;
const IMG=new Map();let BLS=null;
function loadImg(u){if(IMG.has(u))return IMG.get(u);const p=new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('img '+u));i.src=u});IMG.set(u,p);return p}
const blUrl=(n,i)=>'/clips/raw/'+n+'/f'+String(i).padStart(4,'0')+'.png';
function shotSpan(si){const s=SHOTS[si],b=SHOTS[si+1]?SHOTS[si+1].a:TL.total;return[s.a,b]}
async function prep(t){BLS=null;const si=shotAt(t),s=SHOTS[si];if(!s.bl)return;const[a,b]=shotSpan(si);const p=clamp((t-a)/(b-a)),n=BLN[s.bl];
  const f=clamp((s.blFrom||0)+p*((s.blTo||1)-(s.blFrom||0)))*(n-1),i0=Math.floor(f),i1=Math.min(n-1,i0+1);
  const A=await loadImg(blUrl(s.bl,i0)),C=await loadImg(blUrl(s.bl,i1));BLS={A,C,k:f-i0};
  if(IMG.size>14){[...IMG.keys()].slice(0,IMG.size-10).forEach(k=>IMG.delete(k))}}

/* ===== shots ===== */
const SHOTS=[];
function shotAt(t){let lo=0,hi=SHOTS.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(SHOTS[m].a<=t)lo=m;else hi=m-1}return lo}
let DARKEN=0;
function update(t){
  curT=t;const si=shotAt(t),s=SHOTS[si],[a0,b0]=shotSpan(si),lt=t-a0,dur=b0-a0,p=clamp(lt/dur),k=p*p*(3-2*p),w=s.w;
  for(const n in WORLDS)WORLDS[n].visible=n===w&&!s.bl;
  const hm=HEMI[w]||[0xffffff,1];hemi.color.set(hm[0]);hemi.intensity=hm[1]*(s.dim?.55:1);sunL.intensity=s.dim?.4:.9;
  if(s.bl&&BLS){blG.drawImage(BLS.A,0,0,VW,VH);if(BLS.k>.02){blG.globalAlpha=BLS.k;blG.drawImage(BLS.C,0,0,VW,VH);blG.globalAlpha=1}blTex.needsUpdate=true;scene.background=blTex}else scene.background=null;
  const kk=s.lin?p:k;
  cam.position.set(lerp(s.p0[0],s.p1[0],kk),lerp(s.p0[1],s.p1[1],kk),lerp(s.p0[2],s.p1[2],kk));
  cam.lookAt(lerp(s.l0[0],s.l1[0],kk),lerp(s.l0[1],s.l1[1],kk),lerp(s.l0[2],s.l1[2],kk));
  const sh=typeof s.shake==='function'?s.shake(lt,p):(s.shake||0);if(sh){cam.position.x+=Math.sin(t*58)*sh;cam.position.y+=Math.cos(t*44)*sh}
  const c=WCFG[w]||{};
  if(c.fl)c.fl.forEach((f,i)=>animFlame(f,t,i*.37,0));
  if(c.snow){snowStep(c.snow,t,80,28,60,s.snowSp||3.2,s.wind||6,cam.position.x,0,cam.position.z-18)}
  if(c.em){if(w==='fire')emberStep(c.em,t,70,26,40,.5,0,0,-12);else if(w==='doom')emberStep(c.em,t,80,24,50,.25,0,0,-14);else emberStep(c.em,t,70,14,30,.2,0,0,-10)}
  if(c.win){const nl=s.lights?s.lights(lt,p):6;c.win.forEach((q,i)=>q.visible=i<nl)}
  if(c.mt){const fall=s.fall?s.fall(lt,p):0;c.mt.forEach((m,i)=>{m.position.y=m.userData.by-fall*(6+(i%4)*3.5);m.rotation.z=fall*((i%3)-1)*.4})}
  if(c.sun){const e=s.eclipse?s.eclipse(lt,p):0;c.sun.visible=!(e>.99);c.sun.material.opacity=1-e;c.moon.material.opacity=.9*(1-e)}
  if(c.sea){c.sea.position.y=.05+(s.flood?s.flood(lt,p):0)}
  const cast=typeof s.cast==='function'?s.cast(lt,p,t,dur):(s.cast||[]);setCast(cast,t,lt);
  DARKEN=s.darken?s.darken(lt,p):0;
  return si}

/* ===== HUD: flashes, chapter cards, stamps, bursts and one-word captions (2D, same look as the short) ===== */
function txt(g,s,x,y,size,fill,o){o=o||{};g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);if(o.sc)g.scale(o.sc,o.sc);g.globalAlpha*=(o.a===undefined?1:o.a);
  g.font='700 '+Math.round(size)+'px '+FONT;g.textAlign=o.align||'center';g.textBaseline='middle';g.lineJoin='round';
  g.lineWidth=size*(o.sw||.18);g.strokeStyle=o.stroke||'#14102a';g.fillStyle='rgba(0,0,0,.35)';g.strokeText(s,0,size*.06);g.strokeText(s,0,0);g.fillStyle=fill;g.fillText(s,0,0);g.restore()}
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function shield(g,r,col,spin){const dk='#14102a';g.save();g.rotate(spin||0);
  g.beginPath();g.arc(0,0,r,0,7);g.fillStyle=col;g.fill();
  g.fillStyle='rgba(255,255,255,.28)';[0,2].forEach(i=>{g.beginPath();g.moveTo(0,0);g.arc(0,0,r,i*Math.PI/2,(i+1)*Math.PI/2);g.closePath();g.fill()});
  g.fillStyle='rgba(0,0,0,.18)';[1,3].forEach(i=>{g.beginPath();g.moveTo(0,0);g.arc(0,0,r,i*Math.PI/2,(i+1)*Math.PI/2);g.closePath();g.fill()});
  g.beginPath();g.arc(0,0,r*.94,0,7);g.lineWidth=r*.13;g.strokeStyle='#c9cfdd';g.stroke();g.beginPath();g.arc(0,0,r,0,7);g.lineWidth=r*.06;g.strokeStyle=dk;g.stroke();
  g.fillStyle=dk;for(let i=0;i<12;i++){g.beginPath();g.arc(Math.cos(i/12*6.283)*r*.93,Math.sin(i/12*6.283)*r*.93,r*.028,0,7);g.fill()}
  g.restore()}
function plate(g,s,x,y,size,col,o){o=o||{};g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);if(o.sc)g.scale(o.sc,o.sc);g.globalAlpha*=(o.a===undefined?1:o.a);
  g.font='700 '+Math.round(size)+'px '+FONT;const bw=g.measureText(s).width+size*.9;rrect(g,-bw/2,-size*.75,bw,size*1.5,size*.22);g.fillStyle='rgba(20,16,42,.88)';g.fill();g.lineWidth=size*.1;g.strokeStyle=col;g.stroke();
  g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(s,0,size*.05);g.restore()}
function burstTxt(g,s,x,y,W,u,col){const n=s.length,sc=(1+1.2*Math.exp(-u*16))*W*(n>6?.11:.09),a=clamp((.8-u)*5);g.save();g.globalAlpha=a;g.translate(x,y);g.rotate(.14);
  g.beginPath();for(let i=0;i<24;i++){const r=(i%2?.72:1.15)*sc,b=i/24*6.283;g.lineTo(Math.cos(b)*r,Math.sin(b)*r*.8)}g.closePath();g.fillStyle=col||'#ffe45c';g.fill();g.lineWidth=sc*.07;g.lineJoin='round';g.strokeStyle='#14102a';g.stroke();
  g.restore();txt(g,s,x,y,sc*(n>6?.3:n>5?.4:.55),'#ff3b2f',{a,rot:.14})}
const EMPH=new Set('dies die dead death swallow whole fire burns winter wolf sun ship battle kills world fate doom lose begun exact prophecy gone both nine serpent venom chain chains snaps frees fall falls fallen end ragnarök ragnarok ride tears loki odin thor fenrir surtr everybody dart mistletoe weeps earthquakes thrashes collapses broken'.split(' '));
function capIdx(t){let lo=0,hi=WORDS.length-1,r=-1;while(lo<=hi){const m=(lo+hi)>>1;if(WORDS[m].a<=t){r=m;lo=m+1}else hi=m-1}
  if(r<0)return -1;const q=WORDS[r],n=WORDS[r+1],end=(n&&n.a-q.b<.45)?n.a:q.b+.22;return t<end?r:-1}
function drawHUD(g,W,H,t){
  const si=shotAt(t),s=SHOTS[si],[a0,b0]=shotSpan(si),lt=t-a0;g.save();
  if(DARKEN>0){g.fillStyle='rgba(2,2,12,'+DARKEN+')';g.fillRect(0,0,W,H)}
  const vg=g.createRadialGradient(W/2,H/2,H*.34,W/2,H/2,H*.82);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(8,6,20,.45)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  // flashes
  let fa=0,fc='#fff';const fls=(s.flash||[]).concat(s.cut?[[0,s.cut[0],s.cut[1]]]:[]);
  fls.forEach(([d,c,amp])=>{const u=lt-d;if(u>=0&&u<.3){const v=amp*(1-u/.3);if(v>fa){fa=v;fc=c}}});
  if(fa>0){g.globalAlpha=fa;g.fillStyle=fc;g.fillRect(0,0,W,H);g.globalAlpha=1}
  // chapter card
  if(s.card){const sec=TL.secs[s.card-1],a=clamp(lt*4)*clamp((b0-a0-lt)*4);g.save();g.globalAlpha=a;g.fillStyle='rgba(6,6,20,.55)';g.fillRect(0,0,W,H);
    g.translate(W/2,H*.47);const sc=1+.35*Math.exp(-lt*5);g.save();g.scale(sc,sc);txt(g,'CHAPTER '+(s.card-1),0,-H*.2,H*.075,'#ffd34d',{sw:.14});g.restore();
    const title=CH[s.card-1];txt(g,title,0,0,Math.min(H*.17,W*.9/(title.length*.55)),'#fff',{sc:sc,sw:.14});
    g.save();g.shadowColor='#7fe9ff';g.shadowBlur=H*.03;runePath(g,s.rune||'OD',0,H*.2,H*.12,'#14102a',H*.03);runePath(g,s.rune||'OD',0,H*.2,H*.12,'#bff6ff',H*.015);g.restore();g.restore()}
  // chapter tag
  if(!s.card&&s.sec>=2&&s.tag!==false){const a=clamp(lt*2)*.9,label=(s.sec-1)+' · '+CH[s.sec-1];g.save();g.globalAlpha=a;g.font='700 '+Math.round(H*.036)+'px '+FONT;const bw=g.measureText(label).width+H*.1;
    rrect(g,H*.035,H*.04,bw,H*.07,H*.018);g.fillStyle='rgba(20,16,42,.78)';g.fill();g.lineWidth=H*.004;g.strokeStyle='#ffd34d';g.stroke();
    g.save();g.shadowColor='#ffd34d';g.shadowBlur=H*.01;runePath(g,'OD',H*.035+H*.04,H*.075,H*.04,'#ffd34d',H*.005);g.restore();
    g.fillStyle='#fff';g.textAlign='left';g.textBaseline='middle';g.fillText(label,H*.035+H*.08,H*.077);g.restore()}
  // stamps & bursts
  (s.stamp||[]).forEach(([d,text,col,x,y,sz])=>{const u=lt-d;if(u<0)return;const out=s.stampOut?clamp((s.stampOut-u)*4):1;if(out<=0)return;const sc=1+2.2*Math.exp(-u*14);plate(g,text,W*(x||.5),H*(y||.2),H*(sz||.075),col||'#ff5a4d',{sc,rot:-.05,a:out})});
  (s.burst||[]).forEach(([d,text,x,y,col])=>{const u=lt-d;if(u>=0&&u<.85)burstTxt(g,text,W*(x||.5),H*(y||.35),W,u,col)});
  if(s.hud)s.hud(g,W,H,t,lt,clamp(lt/(b0-a0)));
  // captions: one word at a time, on the narration's own timings
  const ci=capIdx(t);if(ci>=0&&!s.nocap){const q=WORDS[ci],word=q.w.replace(/[.,;:!?"“”]+$/g,'').replace(/^[“"]/,'').toUpperCase();let fs=H*.135;g.font='700 '+Math.round(fs)+'px '+FONT;const mw=g.measureText(word).width;if(mw>W*.86)fs*=W*.86/mw;
    const key=EMPH.has(q.w.toLowerCase().replace(/[^a-zà-ÿ]/g,''));txt(g,word,W/2,H*.86,fs,key?'#ffd34d':'#fff',{sc:1+.3*Math.exp(-(t-q.a)*22)})}
  g.restore()}

/* ===== driver API ===== */
const rec=document.createElement('canvas');rec.width=VW;rec.height=VH;const recG=rec.getContext('2d');
async function renderFrame(t,q){await prep(t);update(t);renderer.render(scene,cam);recG.clearRect(0,0,VW,VH);recG.drawImage(glc,0,0);drawHUD(recG,VW,VH,t);return rec.toDataURL('image/jpeg',q||.9)}
async function renderClean(t,q){await prep(t);update(t);renderer.render(scene,cam);recG.clearRect(0,0,VW,VH);recG.drawImage(glc,0,0);return rec.toDataURL('image/jpeg',q||.95)}
window.renderClean=renderClean;window.renderFrame=renderFrame;window.TOTAL=TL.total;
window.ready=document.fonts.load('700 40px Fredoka').then(()=>document.fonts.ready).then(()=>true);
