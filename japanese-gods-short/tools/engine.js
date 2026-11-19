
/* ===== Japanese gods ranked: pure function of the narration clock t ===== */
const $=id=>document.getElementById(id);
const cv=$('cv'),g=cv.getContext('2d'),narr=$('narr');
const DUR=93.8,K0=540,H0=960;
const FONT="'Fredoka','Arial Rounded MT Bold','Trebuchet MS','DejaVu Sans',Arial,sans-serif";
Object.assign(KINDS,{
 EB:{robe:'#d9473a',trim:'#f3cf55',skin:'#fff',prop:'fish',sash:1},
 SU:{robe:'#3d63d6',trim:'#1b2a73',skin:'#fff',prop:'sword',sash:1},
 TS:{robe:'#aab8ff',trim:'#5a64c4',skin:'#eef0ff',top:'#15152f',prop:'moon',sash:1},
 IZ:{robe:'#42224d',trim:'#9b3bd1',skin:'#dcebe0',top:'#0f0716',crown:'horn',prop:'',sash:1},
 AM:{robe:'#fff0c4',trim:'#f0b830',skin:'#fff',top:'#2a1608',crown:'laurel',prop:'mirror',sash:1}});
/* extra props */
const _dp=drawProp;
drawProp=function(g,type,x,y,t,K){
 if(type==='fish'){g.save();g.translate(x+22,y+8);g.rotate(-.25+Math.sin(t*6)*.12);g.fillStyle='#ff7a6b';g.strokeStyle=OL;g.lineWidth=5;
  g.beginPath();g.ellipse(0,0,44,24,0,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(-38,0);g.lineTo(-68,-22);g.lineTo(-68,22);g.closePath();g.fill();g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(26,-6,7,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(28,-6,3,0,7);g.fill();
  g.strokeStyle='#ffd1c9';g.lineWidth=3;g.beginPath();g.arc(8,0,18,-1,1);g.stroke();g.restore();return}
 if(type==='mirror'){g.save();g.translate(x,y-34);g.rotate(.1);ln(g,0,26,0,66,12,OL);ln(g,0,26,0,66,7,'#b08a2a');
  g.fillStyle='#e8c95a';g.lineWidth=6;g.beginPath();g.arc(0,0,38,0,7);g.fill();g.stroke();g.fillStyle='#e6f6ff';g.beginPath();g.arc(0,0,28,0,7);g.fill();
  const gl=(t*1.6)%1;g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.moveTo(-26+gl*30,-8);g.lineTo(-14+gl*30,-8);g.lineTo(-30+gl*30,18);g.lineTo(-40+gl*30,18);g.closePath();g.fill();g.restore();return}
 if(type==='moon'){g.save();g.translate(x,y-26);g.rotate(.15);g.shadowColor='#fff7c0';g.shadowBlur=16;g.fillStyle='#fff6b8';g.strokeStyle=OL;g.lineWidth=5;
  g.beginPath();g.arc(0,0,34,-Math.PI*.5,Math.PI*.5,false);g.arc(12,0,28,Math.PI*.5,-Math.PI*.5,true);g.closePath();g.fill();g.shadowBlur=0;g.stroke();g.restore();return}
 _dp(g,type,x,y,t,K)};
function decorate(gs,c,t){
 const bob=Math.sin(t*5+(c.ph||0))*2.5;gs.save();gs.setTransform(1,0,0,1,0,0);if(c.flip){gs.translate(256,0);gs.scale(-1,1)}
 gs.translate(0,bob);gs.lineJoin=gs.lineCap='round';gs.strokeStyle=OL;
 if(c.k==='EB'){gs.fillStyle='#231a33';gs.lineWidth=6;gs.beginPath();gs.moveTo(80,92);gs.quadraticCurveTo(82,40,110,26);gs.quadraticCurveTo(150,8,180,34);gs.quadraticCurveTo(170,62,176,92);gs.quadraticCurveTo(128,72,80,92);gs.closePath();gs.fill();gs.stroke();ln(gs,84,86,174,86,7,'#f3cf55')}
 if(c.k==='SU'){gs.fillStyle='#1f1630';gs.lineWidth=5;for(let i=0;i<7;i++){const a=Math.PI*(1.12+i*.126),a2=a+.08;const x0=128+Math.cos(a)*60,y0=128+Math.sin(a)*60,x1=128+Math.cos(a+.06)*100,y1=128+Math.sin(a+.06)*100,x2=128+Math.cos(a2+.1)*60,y2=128+Math.sin(a2+.1)*60;gs.beginPath();gs.moveTo(x0,y0);gs.lineTo(x1,y1);gs.lineTo(x2,y2);gs.closePath();gs.fill();gs.stroke()}
  gs.strokeStyle='#d8352b';gs.lineWidth=9;gs.beginPath();gs.moveTo(70,100);gs.quadraticCurveTo(128,82,186,100);gs.stroke();ln(gs,184,100,214,112,6,'#d8352b');ln(gs,184,100,210,92,6,'#d8352b')}
 if(c.k==='TS'){gs.fillStyle='#fff3a8';gs.lineWidth=4;gs.beginPath();gs.arc(128,86,12,0,7);gs.fill();gs.stroke();gs.fillStyle='#15152f';gs.beginPath();gs.arc(133,83,10,0,7);gs.fill();
  ln(gs,66,126,52,260,20,OL);ln(gs,66,126,52,260,13,'#15152f');ln(gs,190,126,204,260,20,OL);ln(gs,190,126,204,260,13,'#15152f')}
 if(c.k==='IZ'){ln(gs,66,120,46,262,22,OL);ln(gs,66,120,46,262,15,'#0f0716');ln(gs,190,120,210,262,22,OL);ln(gs,190,120,210,262,15,'#0f0716');
  gs.fillStyle='#ff3b3b';gs.beginPath();gs.arc(128,92,5,0,7);gs.fill()}
 if(c.k==='AM'){[[84,96],[172,96]].forEach(([x,y])=>{gs.fillStyle='#ffd34d';gs.lineWidth=3;gs.beginPath();for(let k=0;k<10;k++){const r=k%2?4:10,b=k/10*6.283;gs.lineTo(x+Math.cos(b)*r,y+Math.sin(b)*r)}gs.closePath();gs.fill();gs.stroke()})}
 gs.restore()}
/* ===== assets ===== */
const IMGN=['dawn','ebisu','susanoo','tsukuyomi','izanami','amaterasu','cave'],IMG={};let nLoaded=0;
IMGN.forEach(n=>{const im=new Image();im.onload=()=>{if(++nLoaded===IMGN.length){window.READY=true;render(window.T0||0)}};im.src='bg/'+n+'.jpg';IMG[n]=im});
const SC=[];for(let i=0;i<14;i++){const c=document.createElement('canvas');c.width=256;c.height=352;SC.push({c,g:c.getContext('2d')})}
let slot=0,K=1;
function sprite(c,t,x,foot,s,a,rot){const S=SC[slot++%SC.length];drawChar(S.g,c,t);decorate(S.g,c,t);
 g.save();g.globalAlpha=a===undefined?1:a;g.translate(x,foot);if(rot)g.rotate(rot);g.drawImage(S.c,-128*s,-332*s,256*s,352*s);g.restore()}
function bg(n,z,px,py){const im=IMG[n],w=K0*z,h=H0*z;g.drawImage(im,(K0-w)/2+px,(H0-h)/2+py,w,h)}
function rr(x,y,w,h,r,fill,stroke,lw){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
 if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||4;g.stroke()}}
function txt(s,x,y,size,fill,o){o=o||{};g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);if(o.sc)g.scale(o.sc,o.sc);g.globalAlpha*=(o.a===undefined?1:o.a);
 g.font='700 '+size+'px '+FONT;g.textAlign=o.align||'left';g.lineJoin='round';
 if(o.stroke!==null){g.strokeStyle=o.stroke||'#1d1830';g.lineWidth=o.sw||size/4.5;g.strokeText(s,0,0,o.maxw)}
 g.fillStyle=fill;g.fillText(s,0,0,o.maxw);g.restore()}
const clamp01=x=>Math.min(1,Math.max(0,x));
/* ===== timeline from real word times ===== */
const clean=s=>s.toLowerCase().replace(/[^a-z']/g,'');
const PS=[];WORDS.forEach((w,i)=>{if(i===0||w.a-WORDS[i-1].b>.28)PS.push(w.a)});
function pulse(t){let p=-9;for(const s of PS){if(s<=t)p=s;else break}return .035*Math.exp(-(t-p)*8)}
function wordT(key,after,nth){let n=nth||0;for(const w of WORDS){if(w.a>=(after||0)-.01&&clean(w.w)===key){if(n--===0)return w.a}}return (after||0)+1}
const NUMI=[];WORDS.forEach((w,i)=>{if(w.w==='Number')NUMI.push(i)});
const T_LINE=wordT('these',0),OUT_A=wordT('who',60)-.05;
const DEF=[
 {r:5,name:'EBISU',sub:'GOD OF LUCK',pow:2,col:'#27b5c4',bg:'ebisu',k:'EB',base:'happy',
  cues:[['bones','worried','sweat'],['adrift','shocked',''],['smiling','happy','spark'],['lucky','power',''],['pray','happy','spark'],['vibes','smug','']],
  pops:[['bones','BORN WITHOUT BONES'],['seven','1 OF THE 7 LUCKY GODS']]},
 {r:4,name:'SUSANOO',sub:'STORM GOD',pow:5.5,col:'#6f8bff',bg:'susanoo',k:'SU',base:'power',
  cues:[['serpent','angry','vein'],['drunk','smug',''],['smart','smug',''],['kusanagi','lift',''],['wrecked','angry','vein steam'],['thrown','dizzy','stars'],['smart','worried','sweat']],
  pops:[['serpent','8-HEADED SERPENT'],['kusanagi','KUSANAGI SWORD'],['wrecked','WRECKED HEAVEN']],times:{serpent:['serpent'],drunk:['drunk'],wrecked:['wrecked']}},
 {r:3,name:'TSUKUYOMI',sub:'MOON GOD',pow:7,col:'#9aa8ff',bg:'tsukuyomi',k:'TS',base:'power',
  cues:[['cold','neutral',''],['petty','smug',''],['killed','angry','steam'],['sun','worried','sweat'],['never','smug','']],
  pops:[['killed','BAD TABLE MANNERS?!'],['never','DAY & NIGHT NEVER MEET']],times:{sun:['sun'],meet:['meet']}},
 {r:2,name:'IZANAMI',sub:'QUEEN OF THE UNDERWORLD',pow:8.5,col:'#b04cff',bg:'izanami',k:'IZ',base:'power',
  cues:[['vowed','angry','vein'],['replied','shocked',''],['drama','smug',''],['body','power','steam'],['dead','power','steam']],
  pops:[['thousand','-1,000 PEOPLE / DAY','#ff5a5a'],['fifteen','+1,500 BORN / DAY','#6ee08a'],['dead','THE DEAD NEVER RETURN']],times:{thousand:['thousand'],fifteen:['fifteen']}},
 {r:1,name:'AMATERASU',sub:'SUN GODDESS',pow:10,col:'#ffc933',bg:'amaterasu',k:'AM',base:'power',
  cues:[['hid','worried',''],['dark','sleep',''],['mirror','neutral',''],['dance','happy','notes'],['lure','happy','spark'],['emperors','smug',''],['throne','power','spark'],['hers','happy','spark']],
  pops:[['dark','THE WORLD WENT DARK'],['mirror','A MIRROR + A DANCE PARTY'],['ancestor','ANCESTOR OF EMPERORS']],times:{hid:['hid'],lure:['lure'],mirror:['mirror']}}];
DEF.forEach((d,i)=>{d.a=WORDS[NUMI[i]].a-.06;d.b=i<4?WORDS[NUMI[i+1]].a-.06:OUT_A;d.ws=WORDS.filter(w=>w.a>=d.a&&w.a<d.b);
 let from=0;d.cue=d.cues.map(([k,ex,fx])=>{for(let j=from;j<d.ws.length;j++)if(clean(d.ws[j].w)===k){from=j+1;return{t:d.ws[j].a,ex,fx}}return{t:d.a+99,ex,fx}});
 d.pp=d.pops.map(([k,text,col])=>{const w=d.ws.find(w=>clean(w.w)===k);return{t:w?w.a:d.a+99,text,col}});d.pp.sort((a,b)=>a.t-b.t);d.pp.forEach((p,i)=>{p.dur=Math.min(2.2,(d.pp[i+1]?d.pp[i+1].t-p.t-.08:9))});
 d.t={};Object.keys(d.times||{}).forEach(k=>{const w=d.ws.find(w=>clean(w.w)===d.times[k][0]);d.t[k]=w?w.a:d.a+99})});
function exAt(d,t){let e={ex:d.base,fx:''};for(const c of d.cue)if(t>=c.t)e=c;return e}
/* ===== shared gag drawing ===== */
function fishShape(x,y,rot,s,col){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle=col||'#ff9a6b';g.strokeStyle=OL;g.lineWidth=4;
 g.beginPath();g.ellipse(0,0,22,12,0,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(-18,0);g.lineTo(-34,-11);g.lineTo(-34,11);g.closePath();g.fill();g.stroke();
 g.fillStyle='#fff';g.beginPath();g.arc(12,-3,3.5,0,7);g.fill();g.restore()}
function bolt(x,seed,a){const r=rng(seed);g.save();g.globalAlpha=a;g.strokeStyle='#fff';g.shadowColor='#bfa8ff';g.shadowBlur=24;g.lineWidth=7;g.lineJoin='round';g.beginPath();let px=x,py=0;g.moveTo(px,py);
 for(let i=0;i<9;i++){px+=(r()-.5)*70;py+=90;g.lineTo(px,py)}g.stroke();g.lineWidth=3;g.strokeStyle='#d8c8ff';g.stroke();g.restore()}
function serpent(d,t){const t0=d.t.serpent,dz=t>d.t.drunk;const u=eout((t-t0)/.7);if(u<=0)return;
 g.save();for(let i=0;i<8;i++){const bx=270+(i-3.5)*34,by=620,sway=Math.sin(t*(dz?5:3)+i*1.3)*(dz?30:16)*u;
  const hx=270+(i-3.5)*66+sway,hy=620-(210+Math.sin(i*2.1)*40)*u;
  g.strokeStyle=OL;g.lineWidth=26;g.lineCap='round';g.beginPath();g.moveTo(bx,620);g.quadraticCurveTo(bx+sway*.2,(620+hy)/2,hx,hy);g.stroke();
  g.strokeStyle=i%2?'#3fae5a':'#2f9a4d';g.lineWidth=18;g.stroke();
  g.fillStyle='#46c26a';g.strokeStyle=OL;g.lineWidth=5;g.beginPath();g.ellipse(hx,hy,24,19,0,0,7);g.fill();g.stroke();
  if(dz){g.strokeStyle=OL;g.lineWidth=3;[-9,9].forEach(o=>{ln(g,hx+o-4,hy-6,hx+o+4,hy+2,3);ln(g,hx+o+4,hy-6,hx+o-4,hy+2,3)});g.fillStyle='#ff6b9d';g.beginPath();g.ellipse(hx+4,hy+14,5,9,0,0,7);g.fill()}
  else{g.fillStyle='#ffe45c';[-9,9].forEach(o=>{g.beginPath();g.ellipse(hx+o,hy-3,6,7,0,0,7);g.fill()});g.fillStyle=OL;[-9,9].forEach(o=>g.fillRect(hx+o-1.5,hy-8,3,10))}}
 g.restore()}
function rays(cx,cy,t,a,len){g.save();g.translate(cx,cy);g.rotate(t*.12);for(let i=0;i<16;i++){g.rotate(Math.PI*2/16);const gr=g.createLinearGradient(0,0,len,0);gr.addColorStop(0,'rgba(255,240,170,'+(.55*a)+')');gr.addColorStop(1,'rgba(255,220,120,0)');
 g.fillStyle=gr;g.beginPath();g.moveTo(0,-14);g.lineTo(len,-34);g.lineTo(len,34);g.lineTo(0,14);g.closePath();g.fill()}g.restore()}
function confetti(t,a0){const cols=['#ffd34d','#6ec6ff','#ff6b9d','#8be28b','#c79bff'];for(let i=0;i<46;i++){const r=rng(i*7+3);const x=r()*540,sp=140+r()*160,y=((t-a0)*sp+r()*960)%1000-30;g.save();g.translate(x+Math.sin(t*3+i)*14,y);g.rotate(t*4+i);g.fillStyle=cols[i%5];g.fillRect(-5,-3,10,6);g.restore()}}
function ghosts(d,t){const t0=d.t.thousand;if(t<t0)return;const n=Math.min(7,Math.floor((t-t0)*2.8)+1);
 const P=[[60,420],[480,440],[90,560],[450,580],[70,700],[470,720],[270,330]];
 for(let i=0;i<n;i++){const age=t-t0-i/2.8,s=.34*(.6+.4*eout(age/.3));sprite({k:'G',ex:i%2?'shocked':'worried',ph:i*1.7},t,P[i][0]+Math.sin(t*1.3+i)*10,P[i][1]+Math.sin(t*2+i*2)*14,s,.85)}}
/* ===== HUD pieces ===== */
function rankCard(d,t){const lt=t-d.a,k=eout(lt/.5);g.save();g.translate(lerp(-360,0,k),0);
 g.save();g.translate(96,112);g.rotate(-.06+Math.sin(t*2)*.01);rr(-70,-70,140,140,26,d.col,'#1d1830',8);txt('#'+d.r,0,34,92,'#fff',{align:'center',maxw:128});g.restore();
 rr(180,52,330,104,18,'rgba(15,10,35,.8)',d.col,5);txt(d.name,345,110,52,'#fff',{align:'center',maxw:300});txt(d.sub,345,140,22,d.col,{align:'center',maxw:300,sw:4});
 txt('POWER',40,200,23,'#ffe45c',{sw:5});rr(150,178,350,30,15,'rgba(15,10,35,.8)','#1d1830',4);
 const f=d.pow/10*ease((lt-.9)/1.3);if(f>0){const gr=g.createLinearGradient(150,0,500,0);gr.addColorStop(0,'#ffd34d');gr.addColorStop(1,d.col);rr(153,181,Math.max(24,344*f),24,12,gr)}
 const sh=ease((lt-.9)/1.3)*d.pow;txt(sh.toFixed(1)+'/10',493,201,22,'#fff',{align:'right',sw:5});g.restore()}
function popups(d,t){d.pp.forEach(p=>{const lt=t-p.t;if(lt<0||lt>p.dur)return;const a=Math.min(lt/.15,(p.dur-lt)/.25,1),sc=.7+.3*eout(lt/.25);
 g.save();g.globalAlpha=a;g.translate(270,318);g.scale(sc,sc);g.font='700 36px '+FONT;const w=Math.min(500,g.measureText(p.text).width+44);
 rr(-w/2,-34,w,64,18,'rgba(15,10,35,.86)',p.col||d.col,5);txt(p.text,0,12,36,p.col||'#fff',{align:'center',maxw:w-30,sw:0,stroke:null});g.restore()})}
function flash(t,a0,k){const x=t-a0;if(x>=0&&x<.3){g.fillStyle='rgba(255,252,230,'+(k*(1-x/.3))+')';g.fillRect(0,0,K0,H0)}}
function lightning(t,sec){const per=2.1;const i=Math.floor((t-sec.a)/per),ph=(t-sec.a)-i*per;if(ph<.22&&t>sec.a+.9){const a=1-ph/.22;g.fillStyle='rgba(210,200,255,'+(.42*a)+')';g.fillRect(0,0,K0,H0);bolt(80+((i*173)%380),i*11+5,a)}}
function rain(t){g.save();g.strokeStyle='rgba(190,205,255,.35)';g.lineWidth=2.5;for(let i=0;i<46;i++){const x=(i*97)%580-20,y=((i*53)+t*980)%1020-30;g.beginPath();g.moveTo(x,y);g.lineTo(x-9,y+40);g.stroke()}g.restore()}
function waves(t){for(let i=0;i<3;i++){g.strokeStyle='rgba(255,255,255,'+(.4-i*.09)+')';g.lineWidth=6-i;g.beginPath();for(let x=-10;x<=550;x+=10){const y=790+i*36+Math.sin(x*.028+t*2.1+i*1.7)*9;x<0?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()}
 for(let i=0;i<2;i++){const per=2.6,u=((t+i*1.3)%per)/per,x=-30+u*600,y=760-210*Math.sin(Math.PI*u),rot=Math.cos(Math.PI*u)*-.9;fishShape(x,y,rot,1.15,i?'#ffd34d':'#ff8f6b')}}
function wipe(d,t){const x=t-(d.t.meet-1.2);if(x<-.2||x>3)return;const a=Math.min(1,(x+.2)/.4)*(x>2.3?(3-x)/.7:1);g.save();g.globalAlpha=a;
 let gr=g.createLinearGradient(0,0,270,0);gr.addColorStop(0,'rgba(255,200,90,.55)');gr.addColorStop(1,'rgba(255,200,90,0)');g.fillStyle=gr;g.fillRect(0,0,270,H0);
 gr=g.createLinearGradient(270,0,540,0);gr.addColorStop(0,'rgba(20,30,90,0)');gr.addColorStop(1,'rgba(20,30,90,.6)');g.fillStyle=gr;g.fillRect(270,0,270,H0);
 g.fillStyle='#fff';g.fillRect(268,0,4,H0);g.fillStyle='#ffd34d';g.beginPath();g.arc(120,300,34,0,7);g.fill();g.strokeStyle=OL;g.lineWidth=5;g.stroke();
 g.fillStyle='#fff3a8';g.beginPath();g.arc(430,300,30,-1.57,1.57);g.arc(442,300,24,1.57,-1.57,true);g.closePath();g.fill();g.stroke();g.restore()}
/* ===== scenes ===== */
function hook(t){bg('cave',1.05+.06*t/6+pulse(t),Math.sin(t*1.3)*5,0);
 const gl=g.createRadialGradient(270,560,10,270,560,260);gl.addColorStop(0,'rgba(255,200,90,.35)');gl.addColorStop(1,'rgba(255,200,90,0)');g.fillStyle=gl;g.fillRect(0,300,K0,600);
 const wob=Math.sin(t*3)*.03;sprite({k:'AM',ex:t<4.2?'sleep':'worried',fx:t<4.2?'zzz':'sweat'},t,270,720,1.05*(1+pulse(t)),.95,wob);
 const p=eout(t/.35),sh=t<.5?0:Math.sin(t*38)*1.2;g.save();g.translate(sh,0);
 txt('ONE GODDESS',270,125,60,'#ffd34d',{align:'center',sc:p,maxw:480});txt('PLUNGED THE WORLD',270,205,54,'#fff',{align:'center',sc:p,maxw:500});
 txt('INTO DARKNESS',270,300,84,'#ff5a3c',{align:'center',sc:p,maxw:500});g.restore();
 if(t<.12){g.fillStyle='rgba(0,0,0,'+(1-t/.12)+')';g.fillRect(0,0,K0,H0)}}
const LU=[['happy','EB'],['power','SU'],['smug','TS'],['angry','IZ'],['happy','AM']];
function lineupRow(t,t0,foot,s,fxq){for(let i=0;i<5;i++){const at=t0+i*.34,lt=t-at;if(lt<0)continue;const d=DEF[i],pop=1+.3*Math.exp(-lt*9),big=i===4?1.18:1;
 const x=62+i*104.2,bounce=fxq?Math.abs(Math.sin(t*4+i))*12*clamp01((t-fxq)/.3):0;
 sprite({k:d.k,ex:fxq&&i===4?'power':LU[i][0],fx:i===4?'spark':''},t,x,foot-bounce,s*pop*big);
 if(fxq){txt('?',x,foot-266*s*big-12-Math.sin(t*5+i)*6,54,'#ffd34d',{align:'center',a:clamp01((t-fxq)/.3)})}
 const a=clamp01(lt/.2);rr(x-50,foot+14,100,34,12,'rgba(15,10,35,.85)',d.col,3);txt('#'+d.r+' '+d.name,x,foot+37,15,'#fff',{align:'center',maxw:92,sw:0,stroke:null})}}
function lineup(t){bg('dawn',1.04+.08*(t-T_LINE)/4+pulse(t),0,0);flash(t,T_LINE,.5);
 const p=eout((t-T_LINE)/.4);txt("JAPAN'S 5 MOST",270,130,64,'#fff',{align:'center',sc:p,maxw:500});txt('POWERFUL GODS',270,210,64,'#ffd34d',{align:'center',sc:p,maxw:500});
 lineupRow(t,T_LINE+.3,640,.52)}
function outro(t){const lt=t-OUT_A;bg('dawn',1.1+.04*lt/3.7+pulse(t),Math.sin(t)*5,0);flash(t,OUT_A,.5);
 const p=eout(lt/.4);txt('WHO DID I',270,130,62,'#fff',{align:'center',sc:p});txt('RANK WRONG?',270,215,76,'#ffd34d',{align:'center',sc:p,maxw:500});
 lineupRow(t,OUT_A+.1,480,.52,OUT_A+.6);
 const tc=wordT('comment',OUT_A),ts=wordT('subscribe',OUT_A);
 if(t>=tc){const a=eout((t-tc)/.3);g.save();g.globalAlpha=a;g.translate(270,578);g.scale(.8+.2*a,.8+.2*a);rr(-190,-40,380,80,26,'#fff','#1d1830',6);
  g.fillStyle='#fff';g.beginPath();g.moveTo(-30,38);g.lineTo(-10,66);g.lineTo(10,38);g.fill();txt('COMMENT YOUR PICK',0,12,34,'#1d1830',{align:'center',stroke:null,maxw:350});g.restore()}
 if(t>=ts-.4){const a=eout((t-ts+.4)/.3),pr=t>ts+.35;g.save();g.globalAlpha=a;g.translate(270,676+(pr?4:0));g.scale(pr?.96:1,pr?.96:1);
  rr(-170,-40,340,80,40,pr?'#6a6a78':'#ff2d2d','#1d1830',6);
  if(pr){g.strokeStyle='#fff';g.lineWidth=9;g.beginPath();g.moveTo(-148,2);g.lineTo(-130,20);g.lineTo(-100,-14);g.stroke();txt('SUBSCRIBED',26,14,36,'#fff',{align:'center',stroke:null,maxw:220})}
  else{g.fillStyle='#fff';g.beginPath();g.moveTo(-120,-16);g.lineTo(-120,16);g.lineTo(-92,0);g.closePath();g.fill();txt('SUBSCRIBE',20,14,40,'#fff',{align:'center',stroke:null,maxw:230})}g.restore()}}
function section(d,t){const lt=t-d.a,u=lt/(d.b-d.a);let z=1.06+.12*u+pulse(t),px=Math.sin(t*.6)*6;
 if(d.k==='SU'&&t>d.t.wrecked&&t<d.t.wrecked+.7){px+=Math.sin(t*60)*10}
 bg(d.bg,z,px,0);
 let dark=0;
 if(d.k==='SU'){serpent(d,t);rain(t)}
  if(d.k==='AM'){dark=clamp01((t-d.t.hid)/.6)*(1-ease((t-d.t.lure)/1.1));rays(270,470,t,1-dark*.8,560);g.fillStyle='rgba(5,3,15,'+(.78*dark)+')';g.fillRect(0,0,K0,H0)}
 const e=exAt(d,t),gs=1.28*(.55+.45*eout(lt/.4))*(1+pulse(t)*.9);
 let gx=270,rot=0;if(d.k==='EB'){const ad=d.cue[1].t;if(t>ad&&t<ad+1.8){rot=Math.sin(t*3)*.12;gx+=Math.sin(t*1.5)*30}}
 if(d.k==='SU'&&t>d.cue[5].t&&t<d.cue[5].t+1){rot=Math.sin(t*14)*.1}
 sprite({k:d.k,ex:e.ex,fx:e.fx},t,gx,700,gs,1-.5*dark,rot);
 if(d.k==='EB')waves(t);
 if(d.k==='SU'){lightning(t,d)}
 if(d.k==='TS')wipe(d,t);
 if(d.k==='IZ')ghosts(d,t);
 if(d.k==='AM'&&t>wordT('dance',d.a)&&t<d.t.lure+1.3)confetti(t,wordT('dance',d.a));
 flash(t,d.a,.6);rankCard(d,t);popups(d,t)}
/* ===== captions ===== */
function capIdx(t){let r=-1;for(let i=0;i<WORDS.length;i++){const q=WORDS[i],n=WORDS[i+1];if(t<q.a)break;const end=(n&&n.a-q.b<.3)?n.a:q.b+.14;if(t<end)r=i}return r}
function captions(t){const i=capIdx(t);if(i<0)return;const w=WORDS[i];const s=w.w.replace(/[.,?:]+$/,'').toUpperCase();const pop=1+.18*Math.exp(-(t-w.a)*14);
 txt(s,270,778,76,w.k?'#ffe14d':'#ffffff',{align:'center',sc:pop,maxw:500,sw:15})}
function render(t){K=cv.width/K0;g.setTransform(K,0,0,K,0,0);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';slot=0;
 g.fillStyle='#000';g.fillRect(0,0,K0,H0);if(!window.READY)return;
 if(t<T_LINE)hook(t);else if(t<DEF[0].a)lineup(t);else if(t>=OUT_A)outro(t);else{let d=DEF[0];for(const x of DEF)if(t>=x.a)d=x;section(d,t)}
 captions(t)}
window.render=render;window.DUR=DUR;
/* ===== simple player (live preview) ===== */
let playing=false;function loop(){if(!playing)return;render(narr.currentTime);if(!narr.ended)requestAnimationFrame(loop);else{playing=false;$('overlay').hidden=false;$('playBtn').textContent='▶ Replay'}}
function fit(){const w=Math.min(innerWidth,innerHeight*9/16);$('stage').style.width=w+'px'}
addEventListener('resize',fit);fit();
$('playBtn').onclick=()=>{narr.currentTime=0;narr.play();$('overlay').hidden=true;playing=true;loop()};
cv.width=1080;cv.height=1920;
