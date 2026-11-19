/* cast_core.js: the cartoon character painter (round white heads, dot eyes, dark outlines) plus Norse worlds/props helpers.
   Extracted from the Egyptian-gods short. Load AFTER part_head.js and BEFORE part_cast.js. 24 sprite slots; wolf takes c.fur/c.dk/c.lt colour overrides. */
/* ---------- 2D cast: round white heads, dot eyes, told apart by clothes, crown and prop ---------- */
const OL='#1d1830';
const KINDS={
  TY:{robe:'#6f7686',trim:'#3d4250',skin:'#fff',beard:'#6a4226',plate:'#aab1c0',cape:'#c9622a',crown:'nasal',prop:'sword',armor:1,lefty:1,stump:1},
  FR:{robe:'#4c9a48',trim:'#e8b830',skin:'#fff',top:'#f2c53d',hair:'#f2c53d',locks:1,crown:'circlet',prop:'gsword',sash:1},
  VI:{robe:'#3f5a4c',trim:'#27382f',skin:'#fff',crown:'hood',prop:'',shoe:1,fur:'#7a6248'},
  OD:{robe:'#4a3a8a',trim:'#c9a23a',skin:'#fff',beard:'#dfe3ec',hair:'#dfe3ec',locks:1,cape:'#241c52',crown:'hat',prop:'gungnir',patch:1,sash:1},
  TH:{robe:'#b8322a',trim:'#7a1f1a',skin:'#fff',beard:'#e2622a',hair:'#e2622a',locks:1,cape:'#3a4f8a',fur:'#9a8a74',crown:'wing',prop:'hammer',belt:1},
  TB:{robe:'#fff7fb',trim:'#f2a7c8',skin:'#fff',beard:'#e2622a',crown:'veil',prop:'bouquet',blush:1,lace:1},
  GI:{robe:'#5d86b8',trim:'#3a5a86',skin:'#bfe2f6',beard:'#eaf6ff',crown:'ice',prop:'',fur:'#eaf6ff'},
  GE:{robe:'#e86aa0',trim:'#a83a6c',skin:'#fff',top:'#7a3f24',hair:'#7a3f24',locks:1,crown:'flower',prop:'',lash:1,sash:1},
  M:{robe:'#8d97ab',trim:'#5c6577',skin:'#fff',beard:'#c9a877',crown:'cap',prop:'spear',armor:1},
};

function ln(g,a,b,c,d,w,col){if(col)g.strokeStyle=col;g.lineWidth=w||6;g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()}
function boltPath(g,s){g.beginPath();g.moveTo(-7*s,-26*s);g.lineTo(9*s,-26*s);g.lineTo(-1*s,-3*s);g.lineTo(12*s,-3*s);g.lineTo(-9*s,30*s);g.lineTo(-1*s,3*s);g.lineTo(-14*s,3*s);g.closePath()}
function drawProp(g,type,x,y,t,K){if(drawPropN(g,type,x,y,t,K))return;
  g.save();g.translate(x,y);g.strokeStyle=OL;
  if(type==='bolt'){g.rotate(.25+Math.sin(t*3)*.06);g.shadowColor='#fff3a0';g.shadowBlur=14;g.fillStyle='#ffe45c';g.lineWidth=4;boltPath(g,1.5);g.fill();g.shadowBlur=0;g.stroke()}
  else if(type==='trident'||type==='bident'){g.rotate(.12);const c=type==='trident'?'#f2c53d':'#b9a5ff';
    ln(g,0,60,0,-62,9,OL);ln(g,0,60,0,-62,5,c);
    const pr=type==='trident'?[-15,0,15]:[-11,11];pr.forEach(dx=>{ln(g,dx,-52,dx,-86,8,OL);ln(g,dx,-52,dx,-86,4,c)});
    ln(g,pr[0],-52,pr[pr.length-1],-52,8,OL);ln(g,pr[0],-52,pr[pr.length-1],-52,4,c)}
  else if(type==='sword'){g.rotate(-.35);g.fillStyle='#dfe4ee';g.lineWidth=4;g.beginPath();g.moveTo(-6,-4);g.lineTo(-6,-58);g.lineTo(0,-70);g.lineTo(6,-58);g.lineTo(6,-4);g.closePath();g.fill();g.stroke();
    g.fillStyle='#e0b030';g.fillRect(-15,-6,30,8);g.strokeRect(-15,-6,30,8);g.fillStyle='#7a4a22';g.fillRect(-4,2,8,16);g.strokeRect(-4,2,8,16)}
  else if(type==='bow'){g.rotate(.15);g.lineWidth=9;g.strokeStyle=OL;g.beginPath();g.arc(-6,0,40,-1.15,1.15);g.stroke();g.lineWidth=5;g.strokeStyle='#e8b830';g.beginPath();g.arc(-6,0,40,-1.15,1.15);g.stroke();
    const bx=-6+Math.cos(1.15)*40,by=Math.sin(1.15)*40;ln(g,bx,-by,bx,by,2,'#fff')}
  else if(type==='spear'){ln(g,0,64,0,-80,8,OL);ln(g,0,64,0,-80,4,'#8a5a2b');g.fillStyle='#dfe4ee';g.lineWidth=4;g.beginPath();g.moveTo(-9,-78);g.lineTo(0,-104);g.lineTo(9,-78);g.closePath();g.fill();g.stroke()}
  else if(type==='lyre'){g.translate(4,-14);g.lineWidth=9;g.strokeStyle=OL;g.beginPath();g.moveTo(-18,-34);g.quadraticCurveTo(-34,10,0,26);g.quadraticCurveTo(34,10,18,-34);g.stroke();
    g.lineWidth=5;g.strokeStyle='#e8b830';g.beginPath();g.moveTo(-18,-34);g.quadraticCurveTo(-34,10,0,26);g.quadraticCurveTo(34,10,18,-34);g.stroke();
    ln(g,-22,-32,22,-32,7,OL);ln(g,-22,-32,22,-32,3,'#e8b830');[-10,-3,4,11].forEach((dx,i)=>ln(g,dx+Math.sin(t*30+i)*.8,-30,dx,18,1.6,'#fff'))}
  else if(type==='hammer'){g.rotate(.2);ln(g,0,40,0,-44,9,OL);ln(g,0,40,0,-44,5,'#8a5a2b');g.fillStyle='#aab1c0';g.lineWidth=4;g.fillRect(-24,-70,48,30);g.strokeRect(-24,-70,48,30)}
  else if(type==='ankh'){g.lineWidth=10;g.strokeStyle=OL;g.beginPath();g.ellipse(0,-44,11,15,0,0,7);g.stroke();ln(g,0,-28,0,24,10,OL);ln(g,-16,-18,16,-18,10,OL);
    g.lineWidth=5;g.strokeStyle='#e8b830';g.beginPath();g.ellipse(0,-44,11,15,0,0,7);g.stroke();ln(g,0,-28,0,24,5,'#e8b830');ln(g,-16,-18,16,-18,5,'#e8b830')}
  g.restore();
}
function drawGhost(g,ex,t,ph){
  const by=Math.sin(t*3+ph)*6;g.save();g.translate(0,by);
  g.fillStyle='rgba(200,255,238,.9)';g.strokeStyle='#2c8f7c';g.lineWidth=6;g.beginPath();g.moveTo(62,270);g.lineTo(62,160);g.arc(128,160,66,Math.PI,0);g.lineTo(194,270);
  for(let i=0;i<4;i++){const x=194-i*33;g.quadraticCurveTo(x-16.5,246+Math.sin(t*6+i+ph)*8,x-33,270)}g.closePath();g.fill();g.stroke();
  g.fillStyle='#17463e';[104,152].forEach(x=>{g.beginPath();g.ellipse(x,152,ex==='shocked'?10:7,ex==='shocked'?13:8,0,0,7);g.fill()});
  g.strokeStyle='#17463e';g.lineWidth=5;g.beginPath();
  if(ex==='shocked'){g.ellipse(128,196,10,15,0,0,7);g.fill()}
  else if(ex==='worried'){g.moveTo(110,192);g.quadraticCurveTo(119,182,128,192);g.quadraticCurveTo(137,202,146,192);g.stroke();ln(g,92,130,112,138,5);ln(g,164,130,144,138,5)}
  else{g.arc(128,184,12,.2,Math.PI-.2);g.stroke()}
  g.restore();
}
function drawFx(g,fx,t){drawFxN(g,fx,t);
  if(fx.includes('sweat')){g.fillStyle='#8fd8ff';g.strokeStyle='#1c6a8a';g.lineWidth=4;const y=74+((t*46)%34);g.beginPath();g.moveTo(206,y-16);g.quadraticCurveTo(222,y+8,206,y+16);g.quadraticCurveTo(190,y+8,206,y-16);g.closePath();g.fill();g.stroke()}
  if(fx.includes('steam')){[[46,0],[210,.5]].forEach(([x,o])=>{for(let i=0;i<3;i++){const u=((t*1.6+o+i/3)%1);g.fillStyle='rgba(236,236,246,'+(.9*(1-u))+')';g.beginPath();g.arc(x+Math.sin(u*6+i)*5,96-u*70,8+u*12,0,7);g.fill()}})}
  if(fx.includes('vein')){const pz=1+.18*Math.sin(t*18);g.save();g.translate(172,84);g.scale(pz,pz);g.strokeStyle='#e0261c';g.lineWidth=6;g.lineCap='round';
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([a,b])=>{g.beginPath();g.moveTo(a*12,b*4);g.lineTo(a*4,b*4);g.lineTo(a*4,b*12);g.stroke()});g.restore()}
  if(fx.includes('zzz')){g.fillStyle='#fff';g.strokeStyle=OL;g.lineJoin='round';[0,1,2].forEach(i=>{const u=((t*.7+i/3)%1),s=16+u*26;g.globalAlpha=1-u*.8;g.font='700 '+s+'px Fredoka, sans-serif';g.lineWidth=s/5;
    const x=186+u*34+Math.sin(u*5)*6,y=96-u*84;g.strokeText('Z',x,y);g.fillText('Z',x,y)});g.globalAlpha=1}
  if(fx.includes('stars')){for(let i=0;i<4;i++){const a=t*4+i*1.571,x=128+Math.cos(a)*62,y=54+Math.sin(a)*14,s=Math.sin(a)>0?1.15:.85;g.save();g.translate(x,y);g.rotate(t*5+i);g.scale(s,s);
    g.fillStyle='#ffe45c';g.strokeStyle=OL;g.lineWidth=3;g.beginPath();for(let k=0;k<10;k++){const r=k%2?5:12,b=k/10*6.283;g.lineTo(Math.cos(b)*r,Math.sin(b)*r)}g.closePath();g.fill();g.stroke();g.restore()}}
  if(fx.includes('notes')){[[40,0,'#ff6b9d'],[214,.4,'#6ec6ff'],[26,.7,'#ffe45c']].forEach(([x,o,c])=>{const u=((t*.8+o)%1),y=170-u*120;g.globalAlpha=1-u*.7;g.fillStyle=c;g.strokeStyle=OL;g.lineWidth=3;
    g.beginPath();g.ellipse(x+Math.sin(u*7)*8,y,9,7,-.4,0,7);g.fill();g.stroke();ln(g,x+Math.sin(u*7)*8+8,y,x+Math.sin(u*7)*8+8,y-28,4,OL)});g.globalAlpha=1}
  if(fx.includes('spark')){[[38,70],[218,60],[30,190],[226,170]].forEach(([x,y],i)=>{const s=.5+.5*Math.abs(Math.sin(t*5+i*1.3));g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#ffe45c';g.strokeStyle='#b8860b';g.lineWidth=2;
    g.beginPath();g.moveTo(0,-16);g.lineTo(4,-4);g.lineTo(16,0);g.lineTo(4,4);g.lineTo(0,16);g.lineTo(-4,4);g.lineTo(-16,0);g.lineTo(-4,-4);g.closePath();g.fill();g.stroke();g.restore()})}
}
function drawChar(g,c,t){
  const K=KINDS[c.k]||KINDS.M,ex=c.ex||'neutral',ph=c.ph||0,face=c.face||(ex==='point'||ex==='five'?'happy':ex==='lift'?'angry':ex==='drink'?'neutral':ex);
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,256,352);if(c.flip){g.translate(256,0);g.scale(-1,1)}
  g.lineJoin=g.lineCap='round';g.strokeStyle=OL;
  if(c.k==='G'){drawGhost(g,ex,t,ph);return}if(c.k==='W'){drawWolf(g,c,face,t,ph);return}if(c.k==='RV'){drawRaven(g,c,t,ph);return}
  const bob=Math.sin(t*5+ph)*2.5,jit=(face==='angry'||face==='worried'||face==='shocked')?Math.sin(t*40+ph)*1.6:0;
  if(!c.nosh){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(128,338,56,9,0,0,7);g.fill()}
  if(face==='dizzy'){g.translate(128,330);g.rotate(Math.sin(t*3)*.1);g.translate(-128,-330)}
  g.translate(jit,0);
  if(K.cape)drawCape(g,K,t,ph);
  // legs + sandals
  ln(g,112,266,108,318,11,OL);ln(g,144,266,148,318,11,OL);ln(g,112,266,108,318,5,K.skin);ln(g,144,266,148,318,5,K.skin);
  g.fillStyle=K.armor?'#3a3a48':'#8a5a2b';g.lineWidth=5;g.strokeStyle=OL;[[100,324],[156,324]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,19,10,0,0,7);g.fill();g.stroke()});if(K.shoe)drawBoot(g);
  g.translate(0,bob);
  // robe
  g.fillStyle=K.robe;g.lineWidth=7;g.beginPath();g.moveTo(82,276);g.quadraticCurveTo(78,196,104,186);g.lineTo(152,186);g.quadraticCurveTo(178,196,174,276);g.quadraticCurveTo(128,292,82,276);g.closePath();g.fill();g.stroke();
  g.save();g.clip();
  g.fillStyle='rgba(0,0,0,.1)';g.fillRect(150,180,40,120);
  if(K.sash){g.strokeStyle=K.trim;g.lineWidth=15;g.beginPath();g.moveTo(96,184);g.lineTo(172,268);g.stroke()}
  g.strokeStyle=K.trim;g.lineWidth=9;g.beginPath();g.moveTo(80,272);g.quadraticCurveTo(128,288,176,272);g.stroke();
  if(K.armor){g.fillStyle=K.plate||(c.k==='M'?'#aeb5c4':'#d9b24a');g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.moveTo(96,190);g.lineTo(160,190);g.lineTo(156,234);g.quadraticCurveTo(128,246,100,234);g.closePath();g.fill();g.stroke();
    ln(g,128,194,128,238,3,OL);g.fillStyle=K.trim;g.fillRect(70,244,116,10)}
  if(c.k==='T'){g.strokeStyle='#3a3d48';g.lineWidth=4;[[100,200,116,224],[116,224,104,246],[150,196,140,220],[140,220,158,250]].forEach(q=>ln(g,q[0],q[1],q[2],q[3],4))}
  if(c.k==='NO'){g.fillStyle='#e9dcc0';g.beginPath();g.ellipse(128,190,54,13,0,0,7);g.fill();g.fillStyle=K.trim;g.fillRect(70,240,116,11)}
  drawRobeN(g,c,K,t);g.restore();g.strokeStyle=OL;drawCollarN(g,c,K,t);g.strokeStyle=OL;
  if(K.sash){g.fillStyle='#ffe45c';g.lineWidth=4;g.beginPath();g.arc(102,194,8,0,7);g.fill();g.stroke()}
  // back hair / headdress
  if(K.locks){g.fillStyle=K.hair;g.lineWidth=6;[[68,118],[188,118],[74,146],[182,146]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,17,0,7);g.fill();g.stroke()})}
  if(K.crown==='nemes'){g.lineWidth=7;g.beginPath();g.moveTo(74,82);g.lineTo(50,206);g.lineTo(96,206);g.lineTo(128,150);g.lineTo(160,206);g.lineTo(206,206);g.lineTo(182,82);g.closePath();g.fillStyle='#e8b830';g.fill();g.stroke();
    g.save();g.clip();g.fillStyle='#1f8fb0';for(let y=88;y<210;y+=22)g.fillRect(40,y,180,10);g.restore()}
  drawBackHeadN(g,c,K,t);g.strokeStyle=OL;
  // head
  g.fillStyle=K.skin;g.strokeStyle=OL;g.lineWidth=7;g.beginPath();g.arc(128,128,62,0,7);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(102,92,16,9,-.6,0,7);g.fill();
  g.fillStyle='rgba(255,130,150,.42)';[[90,150],[166,150]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,12,7,0,0,7);g.fill()});
  if(K.top){g.fillStyle=K.top;g.lineWidth=6;g.beginPath();g.moveTo(68,112);g.quadraticCurveTo(74,62,128,62);g.quadraticCurveTo(182,62,188,112);g.quadraticCurveTo(160,84,128,96);g.quadraticCurveTo(96,84,68,112);g.closePath();g.fill();g.stroke()}
  if(K.beard){g.fillStyle=K.beard;g.lineWidth=6;g.beginPath();g.moveTo(70,142);g.quadraticCurveTo(76,210,128,226);g.quadraticCurveTo(180,210,186,142);g.quadraticCurveTo(128,172,70,142);g.closePath();g.fill();g.stroke();
    g.strokeStyle='rgba(0,0,0,.14)';[104,128,152].forEach(x=>ln(g,x,176,x,206,3));g.strokeStyle=OL}
  // face
  const ey=124,blink=((t+ph*1.7)%3.6)<.12;g.fillStyle=OL;g.strokeStyle=OL;
  const dot=(x,r)=>{g.fillStyle=OL;g.beginPath();g.arc(x,ey,r,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+r*.35,ey-r*.35,r*.34,0,7);g.fill();g.fillStyle=OL};
  const my=K.beard?160:162;
  if(face==='shocked'){[104,152].forEach(x=>{g.fillStyle='#fff';g.lineWidth=5;g.beginPath();g.arc(x,ey,16,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(x,ey,5.5,0,7);g.fill()});
    ln(g,88,96,112,90,6);ln(g,144,90,168,96,6);g.fillStyle=OL;g.beginPath();g.ellipse(128,my+6,11,16,0,0,7);g.fill();g.fillStyle='#ff7f9b';g.beginPath();g.ellipse(128,my+13,6,6,0,0,7);g.fill()}
  else if(face==='happy'){[104,152].forEach(x=>{g.lineWidth=7;g.beginPath();g.arc(x,ey+6,12,Math.PI*1.12,Math.PI*1.88);g.stroke()});
    g.fillStyle=OL;g.beginPath();g.arc(128,my-6,24,0,Math.PI);g.closePath();g.fill();g.fillStyle='#ff7f9b';g.beginPath();g.ellipse(128,my+12,11,6,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(112,my-6,32,6)}
  else if(face==='dizzy'){[104,152].forEach((x,i)=>{g.lineWidth=4;g.beginPath();for(let a=0;a<13;a+=.4){const r=a*1.15,b=a+t*8*(i?1:-1);g.lineTo(x+Math.cos(b)*r,ey+Math.sin(b)*r)}g.stroke()});
    g.lineWidth=6;g.beginPath();g.moveTo(106,my+2);for(let i=1;i<=6;i++)g.lineTo(106+i*7.3,my+2+(i%2?-6:6));g.stroke();
    g.fillStyle='#ff7f9b';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.ellipse(146,my+12,8,11,.3,0,7);g.fill();g.stroke()}
  else if(face==='sleep'){[104,152].forEach(x=>{g.lineWidth=6;g.beginPath();g.arc(x,ey-2,11,.15*Math.PI,.85*Math.PI);g.stroke()});
    g.fillStyle=OL;g.beginPath();g.ellipse(128,my+4,6+Math.sin(t*2.2)*2,7+Math.sin(t*2.2)*3,0,0,7);g.fill();
    g.fillStyle='rgba(160,220,255,.85)';g.strokeStyle='#1c6a8a';g.lineWidth=3;const r=9+Math.sin(t*2.2)*5;g.beginPath();g.arc(150,my-14,r,0,7);g.fill();g.stroke();g.strokeStyle=OL}
  else{
    if(blink){ln(g,94,ey,114,ey,6);ln(g,142,ey,162,ey,6)}else{dot(104,8);dot(152,8)}
    if(face==='angry'){ln(g,84,98,116,112,10);ln(g,140,112,172,98,10);g.fillStyle='#fff';g.lineWidth=5;g.beginPath();g.rect(106,my-8,44,22);g.fill();g.stroke();ln(g,121,my-8,121,my+14,3);ln(g,135,my-8,135,my+14,3);ln(g,106,my+3,150,my+3,3)}
    else if(face==='power'){ln(g,86,100,116,106,8);ln(g,140,106,170,100,8);g.fillStyle=OL;g.beginPath();g.moveTo(102,my-6);g.quadraticCurveTo(128,my+26,154,my-6);g.closePath();g.fill();g.fillStyle='#fff';g.fillRect(110,my-5,36,6)}
    else if(face==='smug'){g.fillStyle=K.skin;g.fillRect(90,ey-12,76,9);ln(g,92,ey-4,116,ey-4,6);ln(g,140,ey-4,164,ey-4,6);ln(g,88,102,116,100,7);ln(g,140,94,170,84,7);
      g.lineWidth=6;g.beginPath();g.moveTo(106,my);g.quadraticCurveTo(132,my+14,156,my-8);g.stroke()}
    else if(face==='worried'){ln(g,84,104,114,92,7);ln(g,142,92,172,104,7);g.lineWidth=6;g.beginPath();g.moveTo(108,my+4);g.quadraticCurveTo(118,my-6,128,my+4);g.quadraticCurveTo(138,my+14,148,my+4);g.stroke()}
    else{ln(g,88,100,114,98,6);ln(g,142,98,168,100,6);g.lineWidth=6;g.beginPath();g.moveTo(112,my);g.quadraticCurveTo(128,my+9,144,my);g.stroke()}
  }
  drawFaceN(g,c,K,t,face);
  // crown
  g.strokeStyle=OL;const cr=K.crown;drawCrownN(g,cr,K,t,c);
  if(cr==='bolt'||cr==='coral'||cr==='horn'){g.fillStyle=cr==='horn'?'#2a2242':'#ffd34d';g.lineWidth=6;g.beginPath();g.ellipse(128,74,46,12,0,0,7);g.fill();g.stroke()}
  if(cr==='bolt'){const f=1+.15*Math.abs(Math.sin(t*9));g.save();g.translate(128,40);g.scale(f,f);g.shadowColor='#fff3a0';g.shadowBlur=12;g.fillStyle='#ffe45c';g.lineWidth=4;boltPath(g,1);g.fill();g.shadowBlur=0;g.stroke();g.restore()}
  else if(cr==='coral'){g.fillStyle='#ff8f6b';g.lineWidth=5;[[100,54,-.3],[128,42,0],[156,54,.3]].forEach(([x,y,r])=>{g.save();g.translate(x,y);g.rotate(r);g.beginPath();g.ellipse(0,0,10,19,0,0,7);g.fill();g.stroke();g.restore()})}
  else if(cr==='horn'){g.fillStyle='#d8d4e0';g.lineWidth=5;[-1,1].forEach(s=>{g.save();g.translate(128+s*38,66);g.scale(s,1);g.beginPath();g.moveTo(-10,2);g.quadraticCurveTo(8,-20,22,-46);g.quadraticCurveTo(22,-12,8,6);g.closePath();g.fill();g.stroke();g.restore()});
    g.fillStyle='#8a5aff';g.beginPath();g.arc(128,72,7,0,7);g.fill();g.stroke()}
  else if(cr==='helm'||cr==='cap'||cr==='viking'){g.fillStyle=cr==='helm'?'#d9b24a':'#aab1c0';g.lineWidth=7;g.beginPath();g.arc(128,122,66,Math.PI,0);g.lineTo(194,132);g.lineTo(170,118);g.lineTo(86,118);g.lineTo(62,132);g.closePath();g.fill();g.stroke();
    if(cr==='helm'){g.fillStyle='#d9b24a';g.lineWidth=5;g.beginPath();g.rect(122,112,12,34);g.fill();g.stroke();
      g.fillStyle='#d8432f';g.lineWidth=5;g.beginPath();g.moveTo(96,62);g.quadraticCurveTo(128,-14+Math.sin(t*6)*3,176,50);g.quadraticCurveTo(150,40,128,58);g.closePath();g.fill();g.stroke()}
    if(cr==='viking'){g.fillStyle='#f4efe0';g.lineWidth=5;[-1,1].forEach(s=>{g.save();g.translate(128+s*60,96);g.scale(s,1);g.beginPath();g.moveTo(-8,8);g.quadraticCurveTo(26,0,28,-44);g.quadraticCurveTo(6,-20,-8,-14);g.closePath();g.fill();g.stroke();g.restore()})}
    if(cr==='cap'){g.fillStyle='#d8432f';g.beginPath();g.arc(128,56,9,0,7);g.fill();g.stroke()}}
  else if(cr==='laurel'){g.fillStyle='#7ccf5a';g.lineWidth=4;for(let i=0;i<5;i++)[-1,1].forEach(s=>{const a=-Math.PI/2+s*(.35+i*.3);g.save();g.translate(128+Math.cos(a)*62,128+Math.sin(a)*62);g.rotate(a+s*1.1);g.beginPath();g.ellipse(0,0,15,7,0,0,7);g.fill();g.stroke();g.restore()});
    const pl=1+.1*Math.sin(t*4);g.fillStyle='#ffe45c';g.shadowColor='#ffe9a0';g.shadowBlur=14;g.beginPath();g.arc(128,60,9*pl,0,7);g.fill();g.shadowBlur=0;g.stroke()}
  else if(cr==='rock'){g.fillStyle='#7d8090';g.lineWidth=6;g.beginPath();g.moveTo(72,92);g.lineTo(84,52);g.lineTo(108,66);g.lineTo(126,36);g.lineTo(150,62);g.lineTo(172,48);g.lineTo(184,92);g.quadraticCurveTo(128,60,72,92);g.closePath();g.fill();g.stroke()}
  else if(cr==='nemes'){g.fillStyle='#e8b830';g.lineWidth=6;g.beginPath();g.moveTo(68,104);g.quadraticCurveTo(128,40,188,104);g.quadraticCurveTo(128,76,68,104);g.closePath();g.fill();g.stroke();g.fillStyle='#1f8fb0';g.beginPath();g.arc(128,72,8,0,7);g.fill();g.stroke()}
  // arms (drawn over the head so raised hands read clearly)
  const s4=Math.sin(t*4+ph)*4,w12=Math.sin(t*12+ph)*9;let Lh,Rh;
  if(ex==='power'){Lh=[52,150+s4];Rh=[204,146-s4]}
  else if(ex==='angry'){Lh=[54,226];Rh=[202,226]}
  else if(ex==='shocked'){Lh=[50,172];Rh=[206,172]}
  else if(ex==='smug'){Lh=[94,244];Rh=[202,200]}
  else if(ex==='worried'){Lh=[114,238];Rh=[142,238]}
  else if(ex==='happy'){Lh=[52,158+w12];Rh=[204,158-w12]}
  else if(ex==='dizzy'){Lh=[62,252+s4];Rh=[194,250-s4]}
  else if(ex==='point'){Lh=[70,250];Rh=[212,150+s4]}
  else if(ex==='lift'){Lh=[66,86];Rh=[190,86]}
  else if(ex==='drink'){Lh=[98,214];Rh=[176,168]}
  else if(ex==='five'){Lh=[70,250];Rh=[208,92+s4]}
  else if(ex==='reach'){Lh=[70,250];Rh=[240,112]}
  else{Lh=[70,250+s4*.5];Rh=[186,250-s4*.5]}
  const prop=c.prop!==undefined?c.prop:K.prop;
  if(prop==='boulder'){g.fillStyle='#8b8fa0';g.strokeStyle=OL;g.lineWidth=7;g.beginPath();g.moveTo(66,60);g.lineTo(80,18);g.lineTo(124,4);g.lineTo(172,12);g.lineTo(196,48);g.lineTo(184,84);g.lineTo(82,86);g.closePath();g.fill();g.stroke();
    ln(g,100,34,120,54,4,'#5f6373');ln(g,150,26,164,56,4,'#5f6373');g.strokeStyle=OL}
  [[92,206,Lh],[164,206,Rh]].forEach(([sx,sy,h])=>{ln(g,sx,sy,h[0],h[1],19,OL);ln(g,sx,sy,h[0],h[1],12,K.robe)});
  if(prop&&prop!=='boulder'&&prop!=='none'){const hp=K.lefty?Lh:Rh;g.save();if(K.lefty){g.translate(hp[0],0);g.scale(-1,1);g.translate(-hp[0],0)}drawProp(g,prop,hp[0],hp[1],t,K);g.restore()}
  const stump=c.stump!==undefined?c.stump:K.stump;[Lh,Rh].forEach(h=>{if(stump&&h===Rh){drawStump(g,h);return}g.fillStyle=K.skin;g.strokeStyle=OL;g.lineWidth=5;g.beginPath();g.arc(h[0],h[1],11,0,7);g.fill();g.stroke()});
  if(c.fx)drawFx(g,c.fx,t);
}
const POOL=[];
for(let i=0;i<24;i++){const c=document.createElement('canvas');c.width=256;c.height=352;const g=c.getContext('2d');
  const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;tex.minFilter=THREE.LinearFilter;tex.generateMipmaps=false;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,alphaTest:.04}));sp.visible=false;scene.add(sp);POOL.push({sp,g,tex,key:''})}
function setCast(list,t,lt){
  POOL.forEach((p,i)=>{const c=list[i];if(!c||lt<(c.at||0)){p.sp.visible=false;return}
    c.ph=i*1.3;const key=[c.k,c.ex,c.face,c.prop,c.fx,c.flip?1:0,c.stump,c.eyes,Math.floor(t*12+i*.37)].join('|');
    if(key!==p.key){p.key=key;drawChar(p.g,c,t);p.tex.needsUpdate=true}
    const s=c.s||1,pop=c.pop===0?1:1+.2*Math.exp(-(lt-(c.at||0))*9),W=s*pop,H=1.375*s*pop;
    p.sp.visible=true;p.sp.scale.set(W,H,1);p.sp.position.set(c.x||0,(c.y||0)+H/2,c.z===undefined?.8:c.z);p.sp.material.rotation=c.rot||0})
}

const L=(c,o={})=>new THREE.MeshLambertMaterial(Object.assign({color:c},o));
const B=(c,o={})=>new THREE.MeshBasicMaterial(Object.assign({color:c},o));
function ctex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t}
function skyTex(top,mid,bot){return ctex(64,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,top);gr.addColorStop(.55,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,w,h)})}
function skyTexDetailed(top,mid,bot,cloudCol,n,seed){return ctex(160,384,(g,w,h)=>{
  const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,top);gr.addColorStop(.5,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,w,h);
  const r=rng(seed||17);
  for(let i=0;i<n;i++){const x=r()*w,y=r()*h*.72,rad=14+r()*32;
    const cg=g.createRadialGradient(x,y,0,x,y,rad);cg.addColorStop(0,cloudCol);cg.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=cg;g.beginPath();g.arc(x,y,rad,0,7);g.fill()}
})}
/* ---------- shared ground + particle helpers ---------- */
function groundTex(base,spots,dark){return ctex(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);const r=rng(3);
  for(let i=0;i<120;i++){g.fillStyle=spots[(r()*spots.length)|0];g.globalAlpha=.5+r()*.4;g.fillRect(r()*w,r()*h,10+r()*30,8+r()*22)}g.globalAlpha=1;
  if(dark){g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<40;i++)g.fillRect(r()*w,r()*h,3+r()*8,3+r()*8)}})}
function makeColumn(h,r,mat){const g=new THREE.Group();
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.08,h,16),mat);shaft.position.y=h/2;g.add(shaft);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(r*1.3,r*1.15,r*.5,16),mat);cap.position.y=h+r*.25;g.add(cap);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(r*1.3,r*1.3,r*.4,16),mat);base.position.y=r*.2;g.add(base);return g}
function makeFlame(colorA,colorB){const n=10,grp=new THREE.Group(),parts=[];
  for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),B(i%2?colorA:colorB,{transparent:true,opacity:.8}));grp.add(m);parts.push(m)}
  return{grp,parts}}
function animFlame(f,t,ph,baseY){f.parts.forEach((m,i)=>{const u=((t*1.6+i/f.parts.length+ph)%1);m.position.set(Math.sin(t*5+i*2)*.1*(1-u),baseY+u*1.1,Math.cos(t*4+i)*.08*(1-u));m.scale.setScalar(.4+(1-u)*.9);m.material.opacity=.85*(1-u)})}

/* ---------- Norse additions to the cast painter: runes, crowns, props, Fenrir, ravens ---------- */
const RUNES={TY:[[.5,0,.5,1],[.5,0,.15,.32],[.5,0,.85,.32]],FR:[[.5,0,.12,.5],[.12,.5,.5,1],[.5,1,.88,.5],[.88,.5,.5,0]],VI:[[.5,0,.5,1],[.5,.5,.14,.08],[.5,.5,.86,.08]],
  OD:[[.3,0,.3,1],[.3,0,.82,.3],[.3,.32,.82,.62]],TH:[[.3,0,.3,1],[.3,.24,.8,.5],[.8,.5,.3,.76]],
  X1:[[.3,0,.3,1],[.3,0,.78,.25],[.78,.25,.3,.5],[.3,.5,.82,1]],X2:[[.22,0,.22,1],[.78,0,.78,1],[.22,.32,.78,.66]],X3:[[.3,0,.3,1],[.3,0,.8,.22],[.3,.32,.8,.54]]};
const RUNE_KEYS=Object.keys(RUNES);
function runePath(g,key,x,y,size,col,lw){const r=RUNES[key]||RUNES.X1;g.save();g.lineCap=g.lineJoin='round';g.strokeStyle=col;g.lineWidth=lw||size*.14;g.beginPath();
  r.forEach(q=>{g.moveTo(x+(q[0]-.5)*size*.8,y+(q[1]-.5)*size);g.lineTo(x+(q[2]-.5)*size*.8,y+(q[3]-.5)*size)});g.stroke();g.restore()}
function heartPath(g,x,y,s){g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.5,y-s*.1,x-s*.7,y-s*1.1,x,y-s*.35);g.bezierCurveTo(x+s*.7,y-s*1.1,x+s*1.5,y-s*.1,x,y+s*.9);g.closePath()}
function drawFxN(g,fx,t){
  if(fx.includes('hearts')){[[40,0],[214,.35],[70,.7],[186,.15]].forEach(([x,o],i)=>{const u=((t*.75+o)%1),y=150-u*120,s=8+6*Math.sin(u*Math.PI);g.globalAlpha=1-u*.8;g.fillStyle=i%2?'#ff6b9d':'#ff3b6b';g.strokeStyle=OL;g.lineWidth=3;
    heartPath(g,x+Math.sin(u*6+i)*8,y,s);g.fill();g.stroke()});g.globalAlpha=1}
  if(fx.includes('runes')){for(let i=0;i<5;i++){const a=t*1.6+i*1.257,x=128+Math.cos(a)*92,y=110+Math.sin(a)*34,fr=Math.sin(a)>0;g.save();g.globalAlpha=fr?1:.45;g.shadowColor='#7fe9ff';g.shadowBlur=12;
    runePath(g,RUNE_KEYS[i],x,y,fr?30:22,'#c8f6ff',fr?5:3.5);g.restore()}}
  if(fx.includes('glow')){const pl=.5+.5*Math.sin(t*9);g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(128,246,4,128,246,70+pl*14);gr.addColorStop(0,'rgba(255,230,120,.95)');gr.addColorStop(1,'rgba(255,200,60,0)');g.fillStyle=gr;g.fillRect(40,160,176,170);g.restore()}
}
function drawPropN(g,type,x,y,t,K){
  if(type==='gungnir'){g.save();g.translate(x,y);g.rotate(.1);ln(g,0,70,0,-96,9,OL);ln(g,0,70,0,-96,5,'#8b93b8');[-30,-6,18,42].forEach(yy=>ln(g,-3,yy,3,yy+5,2,'#7fe9ff'));
    g.shadowColor='#ffe9a0';g.shadowBlur=14+6*Math.sin(t*6);g.fillStyle='#ffd34d';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.moveTo(-11,-94);g.lineTo(0,-128);g.lineTo(11,-94);g.lineTo(0,-84);g.closePath();g.fill();g.shadowBlur=0;g.stroke();g.restore();return true}
  if(type==='gsword'){g.save();g.translate(x,y);g.rotate(-.3);g.shadowColor='#fff3a0';g.shadowBlur=16+6*Math.sin(t*7);g.fillStyle='#ffe98a';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.moveTo(-7,-4);g.lineTo(-7,-62);g.lineTo(0,-78);g.lineTo(7,-62);g.lineTo(7,-4);g.closePath();g.fill();g.shadowBlur=0;g.stroke();
    ln(g,0,-10,0,-58,2,'#fff');g.fillStyle='#4c9a48';g.fillRect(-17,-6,34,8);g.strokeRect(-17,-6,34,8);g.fillStyle='#7a4a22';g.fillRect(-4,2,8,16);g.strokeRect(-4,2,8,16);g.restore();return true}
  if(type==='antler'){g.save();g.translate(x,y);g.rotate(-.15);const seg=[[0,30,0,-30],[0,-30,-10,-70],[0,-10,22,-34],[22,-34,26,-60],[-4,-44,-30,-58],[-30,-58,-34,-80],[-8,-62,8,-88]];
    seg.forEach(q=>ln(g,q[0],q[1],q[2],q[3],13,OL));seg.forEach(q=>ln(g,q[0],q[1],q[2],q[3],7,'#f1e3c2'));g.restore();return true}
  if(type==='hammer'){g.save();g.translate(x,y);g.rotate(.2+Math.sin(t*3)*.04);ln(g,0,42,0,-40,11,OL);ln(g,0,42,0,-40,6,'#7a4a22');[8,20,32].forEach(yy=>ln(g,-4,yy,4,yy+4,2,'#3a2412'));
    g.fillStyle='#9aa3b6';g.strokeStyle=OL;g.lineWidth=5;g.beginPath();g.moveTo(-34,-80);g.lineTo(34,-80);g.lineTo(38,-70);g.lineTo(38,-46);g.lineTo(34,-36);g.lineTo(-34,-36);g.lineTo(-38,-46);g.lineTo(-38,-70);g.closePath();g.fill();g.stroke();
    g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-30,-76,60,8);g.fillStyle='#ffd34d';g.fillRect(-6,-80,12,44);g.strokeRect(-6,-80,12,44);g.shadowColor='#bfe0ff';g.shadowBlur=10;runePath(g,'TH',-21,-58,20,'#e8f6ff',3);runePath(g,'TH',21,-58,20,'#e8f6ff',3);g.restore();return true}
  if(type==='horn'){g.save();g.translate(x,y);g.lineJoin='round';g.fillStyle='#f1e3c2';g.strokeStyle=OL;g.lineWidth=5;g.beginPath();g.moveTo(-52,-6);g.quadraticCurveTo(-6,10,34,-34);g.quadraticCurveTo(52,-62,50,-92);g.quadraticCurveTo(22,-52,-18,-42);g.quadraticCurveTo(-40,-38,-58,-40);g.closePath();g.fill();g.stroke();
    g.fillStyle='#ffd34d';g.beginPath();g.ellipse(-55,-23,8,18,0,0,7);g.fill();g.stroke();g.fillStyle='#e8b830';g.beginPath();g.moveTo(44,-74);g.lineTo(50,-92);g.lineTo(54,-72);g.closePath();g.fill();g.stroke();ln(g,2,-30,14,-14,5,'#e8b830');g.restore();return true}
  if(type==='bouquet'){g.save();g.translate(x,y);ln(g,0,10,0,34,9,OL);ln(g,0,10,0,34,5,'#4c9a48');[[-14,-6,'#ff6b9d'],[12,-8,'#ffd34d'],[0,-22,'#fff'],[-2,2,'#c79bff'],[18,8,'#ff8f6b'],[-18,10,'#6ec6ff']].forEach(([a,b,c])=>{g.fillStyle=c;g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.arc(a,b,11,0,7);g.fill();g.stroke();g.fillStyle='#e8b830';g.beginPath();g.arc(a,b,3.5,0,7);g.fill()});g.restore();return true}
  return false}
function drawCape(g,K,t,ph){const w=Math.sin(t*3+ph)*5;g.fillStyle=K.cape;g.strokeStyle=OL;g.lineWidth=7;g.beginPath();g.moveTo(90,192);g.lineTo(166,192);g.quadraticCurveTo(204,250,198+w,306);g.quadraticCurveTo(164,318,128,306);g.quadraticCurveTo(92,318,58+w,306);g.quadraticCurveTo(52,250,90,192);g.closePath();g.fill();g.stroke()}
function drawBoot(g){g.save();g.lineJoin='round';g.strokeStyle=OL;g.lineWidth=6;
  g.fillStyle='#7a5232';g.beginPath();g.moveTo(138,270);g.lineTo(176,270);g.lineTo(178,300);g.quadraticCurveTo(226,300,230,326);g.lineTo(136,326);g.closePath();g.fill();g.stroke();
  g.save();g.clip();[['#9a6a3e',140,276,22,18],['#5e3d22',166,292,26,16],['#b0844e',196,306,22,14],['#6a4628',142,304,20,16]].forEach(([c,a,b,w,h])=>{g.fillStyle=c;g.fillRect(a,b,w,h);g.setLineDash([4,4]);g.lineWidth=2;g.strokeStyle='#f1e3c2';g.strokeRect(a+2,b+2,w-4,h-4);g.setLineDash([])});g.restore();
  g.strokeStyle=OL;g.lineWidth=6;g.fillStyle='#2e2016';g.beginPath();g.rect(132,324,102,14);g.fill();g.stroke();g.fillStyle='#b9bfcc';[146,170,194,218].forEach(x=>{g.beginPath();g.arc(x,331,3,0,7);g.fill()});g.restore()}
function drawStump(g,h){g.fillStyle='#f4efe0';g.strokeStyle=OL;g.lineWidth=5;g.beginPath();g.arc(h[0],h[1],12,0,7);g.fill();g.stroke();ln(g,h[0]-9,h[1]-5,h[0]+9,h[1]+1,2.5,'#b9b09a');ln(g,h[0]-9,h[1]+3,h[0]+7,h[1]+9,2.5,'#b9b09a');g.strokeStyle=OL}
function drawRobeN(g,c,K,t){
  if(K.belt){g.fillStyle='#6a3f1e';g.fillRect(70,238,116,16);g.fillStyle='#ffd34d';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.rect(112,232,32,28);g.fill();g.stroke();runePath(g,'TH',128,246,18,'#7a4a12',3)}
  if(K.mail){g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=2;for(let y=200;y<270;y+=10)for(let x=84+(y%20?5:0);x<176;x+=10){g.beginPath();g.arc(x,y,4,0,Math.PI);g.stroke()}}
  if(K.lace){g.fillStyle='#fff';for(let x=80;x<180;x+=12){g.beginPath();g.arc(x,276,7,0,7);g.fill()}g.strokeStyle='#f2a7c8';g.lineWidth=3;[210,236].forEach(y=>{g.beginPath();g.moveTo(84,y);g.quadraticCurveTo(128,y+12,172,y);g.stroke()})}
}
function drawCollarN(g,c,K,t){if(!K.fur)return;g.fillStyle=K.fur;g.strokeStyle=OL;g.lineWidth=5;[[90,196,13],[106,190,14],[128,188,15],[150,190,14],[166,196,13]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke()});
  g.fillStyle=K.fur;g.beginPath();g.ellipse(128,192,40,10,0,0,7);g.fill()}
function drawBackHeadN(g,c,K,t){
  if(K.crown==='hood'){g.fillStyle=K.trim;g.strokeStyle=OL;g.lineWidth=7;g.beginPath();g.arc(128,126,76,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(74,182);g.quadraticCurveTo(128,214,182,182);g.lineTo(176,206);g.quadraticCurveTo(128,226,80,206);g.closePath();g.fill();g.stroke()}
  if(K.crown==='veil'){g.fillStyle='rgba(255,255,255,.82)';g.strokeStyle=OL;g.lineWidth=6;g.beginPath();g.moveTo(66,96);g.quadraticCurveTo(128,30,190,96);g.quadraticCurveTo(222,190,206+Math.sin(t*3)*4,268);g.quadraticCurveTo(128,244,50+Math.sin(t*3)*4,268);g.quadraticCurveTo(34,190,66,96);g.closePath();g.fill();g.stroke()}
}
function drawFaceN(g,c,K,t,face){
  const patch=K.patch&&c.eyes!==2;
  if(patch){g.fillStyle=K.skin;g.beginPath();g.arc(152,124,19,0,7);g.fill();ln(g,70,96,190,138,5,'#1a1626');g.fillStyle='#1a1626';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.ellipse(152,124,17,15,.2,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.ellipse(147,118,6,3,-.5,0,7);g.fill()}
  if(K.blush){g.fillStyle='rgba(255,90,130,.6)';[[88,152],[168,152]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,15,9,0,0,7);g.fill()})}
  if(K.lash&&face!=='shocked'){[[90,116,82,108],[166,116,174,108]].forEach(q=>ln(g,q[0],q[1],q[2],q[3],4,OL))}
  g.strokeStyle=OL;g.fillStyle=OL}
function drawCrownN(g,cr,K,t,c){
  g.strokeStyle=OL;
  if(cr==='nasal'){g.fillStyle='#aab1c0';g.lineWidth=7;g.beginPath();g.arc(128,106,66,Math.PI,0);g.lineTo(194,108);g.lineTo(62,108);g.closePath();g.fill();g.stroke();
    g.fillStyle='#7d8496';g.lineWidth=5;g.beginPath();g.rect(60,90,136,17);g.fill();g.stroke();g.beginPath();g.rect(121,90,14,52);g.fill();g.stroke();
    g.fillStyle='#e8ecf4';[72,96,160,184].forEach(x=>{g.beginPath();g.arc(x,98.5,3.5,0,7);g.fill()});g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.ellipse(100,66,16,8,-.6,0,7);g.fill();
    g.fillStyle='#c9622a';g.lineWidth=4;g.beginPath();g.moveTo(120,42);g.lineTo(128,16);g.lineTo(136,42);g.closePath();g.fill();g.stroke()}
  else if(cr==='circlet'){g.fillStyle='#ffd34d';g.lineWidth=6;g.beginPath();g.ellipse(128,76,48,11,0,0,7);g.fill();g.stroke();
    [[96,58,-.5],[112,46,-.2],[128,40,0],[144,46,.2],[160,58,.5]].forEach(([x,y,r],i)=>{g.save();g.translate(x,y);g.rotate(r+Math.sin(t*2.4+i)*.06);g.fillStyle=i%2?'#f2c53d':'#ffe27a';g.lineWidth=4;g.beginPath();g.ellipse(0,0,7,17,0,0,7);g.fill();g.stroke();ln(g,0,-10,0,10,1.6,'#b8860b');g.restore()});
    g.fillStyle='#4fd66a';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.arc(128,77,7,0,7);g.fill();g.stroke()}
  else if(cr==='hood'){g.fillStyle=K.trim;g.lineWidth=7;g.beginPath();g.moveTo(54,150);g.quadraticCurveTo(48,52,128,50);g.quadraticCurveTo(208,52,202,150);g.quadraticCurveTo(190,96,128,92);g.quadraticCurveTo(66,96,54,150);g.closePath();g.fill();g.stroke();
    g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(70,112);g.quadraticCurveTo(128,84,186,112);g.quadraticCurveTo(128,100,70,112);g.fill();
    g.fillStyle='#7ccf5a';g.lineWidth=4;g.strokeStyle=OL;g.save();g.translate(176,70);g.rotate(.7);g.beginPath();g.ellipse(0,0,13,6,0,0,7);g.fill();g.stroke();g.restore()}
  else if(cr==='hat'){g.fillStyle='#565c7a';g.lineWidth=7;g.beginPath();g.moveTo(84,82);g.quadraticCurveTo(104,30,118,10);g.quadraticCurveTo(134,-2,158,6);g.quadraticCurveTo(146,18,150,34);g.quadraticCurveTo(160,60,172,82);g.closePath();g.fill();g.stroke();
    g.save();g.translate(128,82);g.rotate(-.06);g.beginPath();g.ellipse(0,0,92,17,0,0,7);g.fill();g.stroke();g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(0,6,80,8,0,0,Math.PI);g.fill();g.restore();
    g.fillStyle='#c9a23a';g.lineWidth=4;g.beginPath();g.moveTo(88,70);g.quadraticCurveTo(128,82,168,70);g.lineTo(165,60);g.quadraticCurveTo(128,72,92,60);g.closePath();g.fill();g.stroke()}
  else if(cr==='wing'){const fl=Math.sin(t*5)*.06;[-1,1].forEach(s=>{g.save();g.translate(128+s*56,72);g.scale(s,1);g.rotate(-.25+fl);g.fillStyle='#f6f8ff';g.lineWidth=5;
      [[0,0,54,-46,.9],[4,8,48,-22,.75],[6,16,38,-2,.6]].forEach(([a,b,cx,cy])=>{g.beginPath();g.moveTo(a-6,b+6);g.quadraticCurveTo(cx*.5,cy-14,cx,cy);g.quadraticCurveTo(cx*.6,cy+18,a+2,b+16);g.closePath();g.fill();g.stroke()});g.restore()});
    g.fillStyle='#c4cbdb';g.lineWidth=7;g.beginPath();g.arc(128,106,66,Math.PI,0);g.lineTo(194,108);g.lineTo(62,108);g.closePath();g.fill();g.stroke();
    g.fillStyle='#ffd34d';g.lineWidth=5;g.beginPath();g.rect(60,90,136,17);g.fill();g.stroke();g.beginPath();g.rect(120,42,16,50);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(98,66,15,8,-.6,0,7);g.fill();
    g.fillStyle='#ff5a3b';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.arc(128,98.5,7,0,7);g.fill();g.stroke()}
  else if(cr==='veil'){g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(66,104);g.quadraticCurveTo(128,36,190,104);g.quadraticCurveTo(128,84,66,104);g.fill();
    [[84,84,'#ff6b9d'],[106,72,'#ffd34d'],[128,68,'#fff'],[150,72,'#c79bff'],[172,84,'#ff6b9d']].forEach(([x,y,col])=>{g.fillStyle=col;g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.arc(x,y,11,0,7);g.fill();g.stroke();g.fillStyle='#e8b830';g.beginPath();g.arc(x,y,3.5,0,7);g.fill()})}
  else if(cr==='ice'){g.fillStyle='#dff4ff';g.lineWidth=6;g.beginPath();g.moveTo(70,96);g.lineTo(78,44);g.lineTo(100,72);g.lineTo(112,24);g.lineTo(130,66);g.lineTo(150,20);g.lineTo(160,70);g.lineTo(180,42);g.lineTo(186,96);g.quadraticCurveTo(128,66,70,96);g.closePath();g.fill();g.stroke();
    ln(g,112,36,116,60,3,'#9fd6f2');ln(g,150,32,150,58,3,'#9fd6f2');g.strokeStyle=OL}
  else if(cr==='flower'){[[86,84,'#ffd34d'],[108,72,'#fff'],[128,68,'#ffd34d'],[148,72,'#fff'],[170,84,'#ffd34d']].forEach(([x,y,col])=>{g.fillStyle=col;g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.arc(x,y,10,0,7);g.fill();g.stroke();g.fillStyle='#ff8f6b';g.beginPath();g.arc(x,y,3.5,0,7);g.fill()})}
}
/* Fenrir: one sprite, several faces */
function drawWolf(g,c,face,t,ph){
  const FUR=c.fur||'#4b5370',DK=c.dk||'#343a52',LT=c.lt||'#9aa1b8',bob=Math.sin(t*4+ph)*2.5,jit=(face==='angry'||face==='open'||face==='shocked')?Math.sin(t*40)*1.5:0;
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(128,338,84,10,0,0,7);g.fill();
  if(face==='dizzy'){g.translate(128,330);g.rotate(Math.sin(t*3)*.08);g.translate(-128,-330)}
  g.translate(jit,0);g.strokeStyle=OL;g.lineWidth=7;g.lineJoin=g.lineCap='round';
  // tail
  g.fillStyle=FUR;g.beginPath();g.moveTo(186,300);g.quadraticCurveTo(246,290+Math.sin(t*6+ph)*8,236,236);g.quadraticCurveTo(222,268,180,270);g.closePath();g.fill();g.stroke();
  // body
  g.beginPath();g.moveTo(56,330);g.quadraticCurveTo(44,214,104,190);g.lineTo(152,190);g.quadraticCurveTo(212,214,200,330);g.closePath();g.fill();g.stroke();
  g.fillStyle=LT;g.beginPath();g.moveTo(98,328);g.quadraticCurveTo(92,236,128,224);g.quadraticCurveTo(164,236,158,328);g.closePath();g.fill();
  g.fillStyle=FUR;g.lineWidth=6;[[88,326],[168,326]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,26,13,0,0,7);g.fill();g.stroke();[-9,0,9].forEach(d=>ln(g,x+d,y+2,x+d,y+11,3,OL))});
  g.translate(0,bob);
  // broken chain
  g.strokeStyle='#c9cfdd';g.lineWidth=6;[[96,206],[112,212],[128,214],[144,212],[160,206]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,9,6,0,0,7);g.stroke()});ln(g,164,210,176,232,5,'#c9cfdd');g.beginPath();g.ellipse(180,240,6,8,.4,0,7);g.stroke();
  g.strokeStyle=OL;g.lineWidth=7;
  // ears
  [-1,1].forEach(s=>{g.save();g.translate(128+s*46,74);g.scale(s,1);g.fillStyle=FUR;g.beginPath();g.moveTo(-22,8);g.lineTo(14,-62);g.lineTo(30,18);g.closePath();g.fill();g.stroke();g.fillStyle='#c98a9a';g.beginPath();g.moveTo(-6,6);g.lineTo(12,-36);g.lineTo(20,12);g.closePath();g.fill();g.restore()});
  // head with cheek tufts
  g.fillStyle=FUR;g.beginPath();g.moveTo(128,56);g.quadraticCurveTo(196,56,202,112);g.lineTo(226,128);g.lineTo(204,140);g.lineTo(218,164);g.lineTo(190,166);g.quadraticCurveTo(164,206,128,206);g.quadraticCurveTo(92,206,66,166);g.lineTo(38,164);g.lineTo(52,140);g.lineTo(30,128);g.lineTo(54,112);g.quadraticCurveTo(60,56,128,56);g.closePath();g.fill();g.stroke();
  g.fillStyle=DK;g.beginPath();g.moveTo(104,60);g.lineTo(128,96);g.lineTo(152,60);g.quadraticCurveTo(128,52,104,60);g.fill();
  const open=face==='open',my=open?150:160;
  // muzzle
  g.fillStyle=LT;g.lineWidth=6;g.beginPath();g.ellipse(128,my,46,open?26:32,0,0,7);g.fill();g.stroke();
  // eyes
  const ey=112;
  if(face==='dizzy'){[98,158].forEach((x,i)=>{g.lineWidth=4;g.beginPath();for(let a=0;a<13;a+=.4){const r=a*1.2,b=a+t*8*(i?1:-1);g.lineTo(x+Math.cos(b)*r,ey+Math.sin(b)*r)}g.stroke()})}
  else if(face==='happy'||face==='chew'){[98,158].forEach(x=>{g.lineWidth=7;g.beginPath();g.arc(x,ey+6,14,Math.PI*1.12,Math.PI*1.88);g.stroke()})}
  else if(face==='shocked'){[98,158].forEach(x=>{g.fillStyle='#fff';g.lineWidth=5;g.beginPath();g.arc(x,ey,18,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(x,ey,5,0,7);g.fill()})}
  else{[98,158].forEach((x,i)=>{g.fillStyle='#ffd34d';g.lineWidth=5;g.beginPath();g.ellipse(x,ey,17,12,i?-.25:.25,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.ellipse(x,ey,4,10,0,0,7);g.fill()});
    const br=(face==='angry'||open)?14:5;ln(g,74,ey-22-br*.2,118,ey-16+br,10,OL);ln(g,138,ey-16+br,182,ey-22-br*.2,10,OL)}
  // nose
  g.fillStyle='#15121f';g.strokeStyle=OL;g.lineWidth=4;g.beginPath();g.moveTo(112,my-22);g.lineTo(144,my-22);g.quadraticCurveTo(140,my-2,128,my-2);g.quadraticCurveTo(116,my-2,112,my-22);g.closePath();g.fill();
  const fang=(x,y,s,up)=>{g.fillStyle='#fff';g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.moveTo(x-6*s,y);g.lineTo(x,y+(up?-17:17)*s);g.lineTo(x+6*s,y);g.closePath();g.fill();g.stroke()};
  if(open){const jo=58+Math.sin(t*10)*3;g.fillStyle='#7a1626';g.strokeStyle=OL;g.lineWidth=7;g.beginPath();g.moveTo(84,my+8);g.quadraticCurveTo(128,my+26,172,my+8);g.quadraticCurveTo(184,my+jo,128,my+jo+18);g.quadraticCurveTo(72,my+jo,84,my+8);g.closePath();g.fill();g.stroke();
    g.fillStyle='#ff7f9b';g.beginPath();g.ellipse(128,my+jo-2,26,16,0,0,7);g.fill();ln(g,128,my+jo-14,128,my+jo+8,3,'#c9506a');
    [-34,-18,18,34].forEach((d,i)=>fang(128+d,my+12+(Math.abs(d)>20?-2:4),i==0||i==3?1.3:1));[-26,-9,9,26].forEach(d=>fang(128+d,my+jo+(Math.abs(d)>20?-6:6),1,1));
    g.fillStyle=LT;g.strokeStyle=OL;g.lineWidth=6;g.beginPath();g.moveTo(80,my+jo+2);g.quadraticCurveTo(128,my+jo+44,176,my+jo+2);g.quadraticCurveTo(128,my+jo+30,80,my+jo+2);g.closePath();g.fill();g.stroke()}
  else if(face==='angry'){g.fillStyle='#7a1626';g.lineWidth=6;g.beginPath();g.moveTo(92,my+4);g.quadraticCurveTo(128,my-4,164,my+4);g.quadraticCurveTo(160,my+30,128,my+32);g.quadraticCurveTo(96,my+30,92,my+4);g.closePath();g.fill();g.stroke();
    [-26,-9,9,26].forEach(d=>fang(128+d,my+3,1));[-18,0,18].forEach(d=>fang(128+d,my+31,.8,1))}
  else if(face==='chew'){const ch=Math.sin(t*16)*4;g.lineWidth=6;g.beginPath();g.moveTo(96,my+10+ch);g.quadraticCurveTo(128,my+24-ch,160,my+10+ch);g.stroke();g.fillStyle=LT;[[84,my+6],[172,my+6]].forEach(([x,y])=>{g.beginPath();g.arc(x,y+ch*.5,14,0,7);g.fill();g.stroke()})}
  else if(face==='happy'){g.lineWidth=6;g.beginPath();g.moveTo(96,my+6);g.quadraticCurveTo(128,my+30,160,my+6);g.stroke();g.fillStyle='#ff7f9b';g.lineWidth=4;g.beginPath();g.moveTo(118,my+18);g.lineTo(138,my+18);g.quadraticCurveTo(140,my+44,128,my+46);g.quadraticCurveTo(116,my+44,118,my+18);g.closePath();g.fill();g.stroke();fang(104,my+9,.9);fang(152,my+9,.9)}
  else if(face==='shocked'){g.fillStyle=OL;g.beginPath();g.ellipse(128,my+16,10,13,0,0,7);g.fill()}
  else if(face==='dizzy'){g.lineWidth=6;g.beginPath();g.moveTo(100,my+12);for(let i=1;i<=6;i++)g.lineTo(100+i*9.3,my+12+(i%2?-6:6));g.stroke();g.fillStyle='#ff7f9b';g.lineWidth=4;g.beginPath();g.ellipse(150,my+26,9,14,.3,0,7);g.fill();g.stroke()}
  else{g.lineWidth=6;g.beginPath();g.moveTo(100,my+10);g.quadraticCurveTo(128,my+18,156,my+10);g.stroke();fang(108,my+11,.9);fang(148,my+11,.9)}
  if(c.fx)drawFx(g,c.fx,t);
}
function drawRaven(g,c,t,ph){
  const fly=c.ex==='fly',fl=fly?Math.sin(t*16+ph):0,by=fly?Math.sin(t*8+ph)*8:Math.sin(t*3+ph)*2;g.translate(0,by);g.lineJoin=g.lineCap='round';g.strokeStyle=OL;g.lineWidth=8;
  const BL='#23203a';
  if(fly){[-1,1].forEach(s=>{g.save();g.translate(128+s*30,200);g.scale(s,1);g.rotate(-.5*fl-.2);g.fillStyle=BL;g.beginPath();g.moveTo(-10,0);g.quadraticCurveTo(50,-70,112,-30);g.lineTo(88,-10);g.lineTo(100,10);g.lineTo(70,10);g.lineTo(76,30);g.quadraticCurveTo(30,34,-10,20);g.closePath();g.fill();g.stroke();g.restore()})}
  else{ln(g,112,270,106,300,7,'#e8b830');ln(g,144,270,150,300,7,'#e8b830')}
  g.fillStyle=BL;g.beginPath();g.ellipse(128,216,54,60,0,0,7);g.fill();g.stroke();
  g.beginPath();g.moveTo(104,262);g.lineTo(88,318);g.lineTo(128,296);g.lineTo(168,318);g.lineTo(152,262);g.closePath();g.fill();g.stroke();
  g.beginPath();g.arc(128,150,46,0,7);g.fill();g.stroke();g.fillStyle='rgba(120,130,255,.28)';g.beginPath();g.ellipse(108,128,16,9,-.6,0,7);g.fill();
  g.fillStyle='#e8b830';g.lineWidth=6;g.beginPath();g.moveTo(108,158);g.lineTo(148,158);g.lineTo(128,198);g.closePath();g.fill();g.stroke();
  const sh=c.face==='shocked';[106,150].forEach(x=>{g.fillStyle='#fff';g.lineWidth=4;g.beginPath();g.arc(x,140,sh?15:12,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(x+(sh?0:2),142,sh?4:6,0,7);g.fill()});
  if(!fly){[-1,1].forEach(s=>{g.fillStyle='#2f2b4c';g.lineWidth=6;g.beginPath();g.moveTo(128+s*46,196);g.quadraticCurveTo(128+s*70,240,128+s*40,272);g.quadraticCurveTo(128+s*34,230,128+s*46,196);g.fill();g.stroke()})}
}

const SPECIAL={};
{const _dc=drawChar;drawChar=function(g,c,t){const f=SPECIAL[c.k];if(!f)return _dc(g,c,t);
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,256,352);g.shadowBlur=0;g.globalAlpha=1;if(c.flip){g.translate(256,0);g.scale(-1,1)}g.lineJoin=g.lineCap='round';g.strokeStyle=OL;
  f(g,c,t,c.ph||0);if(c.fx){g.setTransform(1,0,0,1,0,0);if(c.flip){g.translate(256,0);g.scale(-1,1)}drawFx(g,c.fx,t)}}}
/* ---------- second wave: Loki, Iolaus, disguises, Jormungandr, extra props ---------- */
Object.assign(KINDS,{
  LO:{robe:'#2f7a4a',trim:'#e8b830',skin:'#fff',top:'#1a1626',hair:'#1a1626',locks:1,crown:'viking',cape:'#1a3a2a',prop:'',sash:1},
  IO:{robe:'#b0523a',trim:'#e8b830',skin:'#fff',top:'#7a4a22',crown:'',prop:'torch'},
  PB:{robe:'#2f9fc0',trim:'#e8b830',skin:'#fff',beard:'#bfe8ff',crown:'bull',prop:'none'},
  AL:{robe:'#f2c53d',trim:'#fff',skin:'#fff',top:'#f2c53d',crown:'lion',prop:'none',sash:1},
});
Object.assign(RUNES,{FE:[[.1,1,.3,0],[.3,0,.5,.6],[.5,.6,.7,0],[.7,0,.9,1]],JO:[[.5,0,.12,.5],[.12,.5,.5,1],[.5,1,.88,.5],[.88,.5,.5,0]]});
{const _pr=drawPropN;drawPropN=function(g,type,x,y,t,K){
  g.save();g.translate(x,y);g.strokeStyle=OL;g.lineJoin=g.lineCap='round';let ok=true;
  if(type==='rod'){ln(g,0,30,30,-112,8,OL);ln(g,0,30,30,-112,4,'#8a5a2b');ln(g,30,-112,34+Math.sin(t*3)*3,96,2,'#fff')}
  else if(type==='meat'){g.rotate(-.5);ln(g,0,10,0,44,11,OL);ln(g,0,10,0,44,6,'#fff');g.fillStyle='#fff';g.lineWidth=3;[[-6,46],[6,46]].forEach(([a,b])=>{g.beginPath();g.arc(a,b,7,0,7);g.fill();g.stroke()});g.fillStyle='#c8553a';g.lineWidth=5;g.beginPath();g.ellipse(0,-14,24,30,0,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(-8,-24,6,10,-.4,0,7);g.fill()}
  else if(type==='tendon'){for(let i=0;i<4;i++){const w=Math.sin(t*6+i)*6;[[OL,9],['#ff9db8',5]].forEach(([col,lw])=>{g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(-9+i*6,-6);g.bezierCurveTo(-20+i*10+w,24,10-i*6-w,50,-8+i*7+w,84);g.stroke()})}}
  else ok=false;
  g.restore();return ok||_pr(g,type,x,y,t,K)}}
{const _fx=drawFxN;drawFxN=function(g,fx,t){_fx(g,fx,t);
  if(fx.includes('poison')){g.save();g.globalAlpha=.3;g.fillStyle='#7fe04a';g.beginPath();g.arc(128,128,60,0,7);g.fill();g.restore();
    [[44,0],[212,.3],[70,.6],[190,.8]].forEach(([x,o],i)=>{const u=((t*.9+o)%1),y=190-u*150;g.globalAlpha=1-u*.8;g.fillStyle='#9fe04a';g.strokeStyle='#3a7a1a';g.lineWidth=3;g.beginPath();g.arc(x+Math.sin(u*6+i)*8,y,6+4*Math.sin(u*Math.PI),0,7);g.fill();g.stroke()});g.globalAlpha=1}}}
/* Jormungandr: a great serpent head on a rising neck (c.head: head only) */
function drawSerpent(g,c,t,ph){const face=c.face||c.ex||'neutral',C1=c.c1||'#5aa84a',BE=c.c2||'#e8e0a0',EYE=c.eye||'#ffe45c',w=c.head?0:Math.sin(t*3+ph)*8;
  if(face==='angry'||face==='open')g.translate(Math.sin(t*40)*1.5,0);
  if(!c.head){g.lineCap='butt';[[OL,86],[C1,72]].forEach(([col,lw])=>{g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(128,356);g.bezierCurveTo(128+w*2,300,128-w*2,240,128+w,170);g.stroke()});
    g.strokeStyle=BE;g.lineWidth=32;g.beginPath();g.moveTo(128,356);g.bezierCurveTo(128+w*2,300,128-w*2,240,128+w,190);g.stroke();g.strokeStyle='rgba(0,0,0,.16)';for(let y=214;y<350;y+=22)ln(g,113,y,143,y,3)}
  g.lineCap=g.lineJoin='round';g.translate(w,0);
  g.fillStyle='#e0a030';g.strokeStyle=OL;g.lineWidth=5;[-2,-1,0,1,2].forEach(i=>{g.beginPath();g.moveTo(128+i*26-12,66+Math.abs(i)*9);g.lineTo(128+i*30,22+Math.abs(i)*15);g.lineTo(128+i*26+12,66+Math.abs(i)*9);g.closePath();g.fill();g.stroke()});
  g.fillStyle=C1;g.lineWidth=7;g.beginPath();g.ellipse(128,122,86,68,0,0,7);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(96,82,18,9,-.6,0,7);g.fill();
  const open=face==='open',my=open?140:150;g.fillStyle='#8fd27a';g.beginPath();g.ellipse(128,my,58,open?26:34,0,0,7);g.fill();
  const ey=98;
  if(face==='dizzy'){[92,164].forEach((x,i)=>{g.lineWidth=4;g.beginPath();for(let a=0;a<13;a+=.4){const r=a*1.25,b=a+t*8*(i?1:-1);g.lineTo(x+Math.cos(b)*r,ey+Math.sin(b)*r)}g.stroke()})}
  else if(face==='happy'){[92,164].forEach(x=>{g.lineWidth=7;g.beginPath();g.arc(x,ey+6,14,Math.PI*1.12,Math.PI*1.88);g.stroke()})}
  else if(face==='shocked'){[92,164].forEach(x=>{g.fillStyle='#fff';g.lineWidth=5;g.beginPath();g.arc(x,ey,18,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(x,ey,5,0,7);g.fill()})}
  else{[92,164].forEach((x,i)=>{g.fillStyle=EYE;g.lineWidth=5;g.beginPath();g.ellipse(x,ey,18,13,i?-.25:.25,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.ellipse(x,ey,4,11,0,0,7);g.fill()});
    const br=(face==='angry'||face==='power'||open)?14:4;ln(g,68,ey-24-br*.2,114,ey-17+br,10,OL);ln(g,142,ey-17+br,188,ey-24-br*.2,10,OL)}
  g.fillStyle=OL;[116,140].forEach(x=>{g.beginPath();g.ellipse(x,my-16,3.5,5,0,0,7);g.fill()});
  const fang=(x,y,s,up)=>{g.fillStyle='#fff';g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.moveTo(x-6*s,y);g.lineTo(x,y+(up?-18:18)*s);g.lineTo(x+6*s,y);g.closePath();g.fill();g.stroke()};
  g.strokeStyle=OL;
  if(open){const jo=56+Math.sin(t*10)*3;g.fillStyle='#7a1626';g.lineWidth=7;g.beginPath();g.moveTo(80,my+6);g.quadraticCurveTo(128,my+22,176,my+6);g.quadraticCurveTo(188,my+jo,128,my+jo+16);g.quadraticCurveTo(68,my+jo,80,my+6);g.closePath();g.fill();g.stroke();
    ln(g,128,my+24,128,my+jo-6,7,'#ff7f9b');ln(g,128,my+jo-6,116,my+jo+6,5,'#ff7f9b');ln(g,128,my+jo-6,140,my+jo+6,5,'#ff7f9b');[-32,32].forEach(d=>fang(128+d,my+10,1.4));g.strokeStyle=OL}
  else if(face==='angry'||face==='power'){g.lineWidth=6;g.beginPath();g.moveTo(88,my+10);g.quadraticCurveTo(128,my-2,168,my+10);g.stroke();[-30,-10,10,30].forEach(d=>fang(128+d,my+7-Math.abs(d)*.05,.9))}
  else if(face==='dizzy'){g.lineWidth=6;g.beginPath();g.moveTo(96,my+10);for(let i=1;i<=6;i++)g.lineTo(96+i*10.6,my+10+(i%2?-6:6));g.stroke();ln(g,150,my+12,156,my+40,6,'#ff7f9b')}
  else if(face==='shocked'){g.fillStyle=OL;g.beginPath();g.ellipse(128,my+12,10,13,0,0,7);g.fill()}
  else{g.lineWidth=6;g.beginPath();g.moveTo(92,my+4);g.quadraticCurveTo(128,my+(face==='happy'?26:14),164,my+4);g.stroke();fang(104,my+8,.9);fang(152,my+8,.9);if(Math.sin(t*5+ph)>.3){ln(g,128,my+14,128,my+34,4,'#ff3b4d')}}
  g.strokeStyle=OL}
SPECIAL.JO=drawSerpent;
/* ================= Norse worlds, thrones and props ================= */
const PH=(c,o={})=>new THREE.MeshPhongMaterial(Object.assign({color:c,shininess:70,specular:0x888888},o));
const FL=(c)=>new THREE.MeshLambertMaterial({color:c,flatShading:true});
const PROPS={};
const LABELS=[];
function labelTex(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;tex.minFilter=THREE.LinearFilter;tex.generateMipmaps=false;
  const run=()=>{g.clearRect(0,0,w,h);paint(g,w,h);tex.needsUpdate=true};LABELS.push(run);run();return tex}
function mesh(parent,geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);parent.add(m);return m}
function world(){const g=new THREE.Group();g.visible=false;scene.add(g);return g}
function dome(parent,tex){return mesh(parent,new THREE.SphereGeometry(60,24,14,0,6.3,0,Math.PI/1.6),B(0xffffff,{map:tex,side:THREE.BackSide}))}
function glowTex(c0,c1){return ctex(128,128,(g,w,h)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,c0);gr.addColorStop(.35,c1);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)})}
function glowSp(parent,tex,s,x,y,z,op){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:op===undefined?1:op}));sp.scale.set(s,s,1);sp.position.set(x,y,z);parent.add(sp);return sp}
function nightTex(top,mid,bot,o){return ctex(512,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,top);gr.addColorStop(.55,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,w,h);const r=rng(o.seed||5);
  for(let i=0;i<(o.stars||0);i++){g.fillStyle='rgba(255,255,255,'+(.3+r()*.7)+')';g.beginPath();g.arc(r()*w,r()*h*.8,.6+r()*1.4,0,7);g.fill()}
  if(o.neb)for(let i=0;i<o.neb;i++){const x=r()*w,y=h*(.3+r()*.5),rad=40+r()*70,cg=g.createRadialGradient(x,y,0,x,y,rad);cg.addColorStop(0,o.nebCol[i%o.nebCol.length]);cg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=cg;g.beginPath();g.arc(x,y,rad,0,7);g.fill()}
  if(o.aurora){g.globalCompositeOperation='lighter';for(let b=0;b<3;b++)for(let x=0;x<w;x+=4){const y=h*(.4+b*.075)+Math.sin(x/w*6.283*(2+b)+b*2)*h*.045,hh=h*(.17+.05*Math.sin(x/w*6.283*5+b)),c=o.aurora[b%o.aurora.length];
    const ag=g.createLinearGradient(0,y,0,y+hh);ag.addColorStop(0,'rgba('+c+',0)');ag.addColorStop(.72,'rgba('+c+',.36)');ag.addColorStop(1,'rgba('+c+',0)');g.fillStyle=ag;g.fillRect(x,y,4,hh)}g.globalCompositeOperation='source-over'}})}
function runeTex(key,col){return ctex(64,96,(g,w,h)=>{g.shadowColor=col;g.shadowBlur=10;runePath(g,key,32,48,62,col,7);runePath(g,key,32,48,62,'#fff',3)})}
function runeStone(parent,key,col,x,z,h,ry){const s=new THREE.Group();s.position.set(x,0,z);s.rotation.y=ry||0;parent.add(s);
  const b=mesh(s,new THREE.BoxGeometry(h*.5,h,h*.2),FL(0x7a7f90),0,h/2,0);b.rotation.z=(R()-.5)*.12;mesh(s,new THREE.ConeGeometry(h*.31,h*.3,4),FL(0x7a7f90),0,h*1.12,0).rotation.y=Math.PI/4;
  const p=mesh(s,new THREE.PlaneGeometry(h*.36,h*.54),B(0xffffff,{map:runeTex(key,col),transparent:true,depthWrite:false}),0,h*.55,h*.105);return{s,p}}
function makeBolt(scale){const sh=new THREE.Shape();sh.moveTo(-.045,.18);sh.lineTo(.05,.18);sh.lineTo(-.01,.02);sh.lineTo(.06,.02);sh.lineTo(-.05,-.2);sh.lineTo(0,-.02);sh.lineTo(-.09,-.02);sh.closePath();
  const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.025,bevelEnabled:false}),new THREE.MeshPhongMaterial({color:0xffe066,emissive:0xffcf4d,emissiveIntensity:.7,shininess:90}));m.scale.setScalar(scale||1);return m}
/* a Norse high seat: tall carved posts and a pointed gable; each god hangs his own motif on it */
function highSeat(grp,main,dk,glow){const t=new THREE.Group();grp.add(t);
  mesh(t,new THREE.BoxGeometry(2.9,.3,2.4),dk,0,.15,-1.9);mesh(t,new THREE.BoxGeometry(2.3,.4,2),main,0,.5,-1.8);mesh(t,new THREE.BoxGeometry(2.3,2.7,.36),main,0,1.75,-2.6);
  const gb=mesh(t,new THREE.CylinderGeometry(1.33,1.33,.36,3,1,false,Math.PI),main,0,3.43,-2.6);gb.rotation.x=Math.PI/2;gb.scale.z=.5;
  mesh(t,new THREE.BoxGeometry(1.6,2,.08),dk,0,1.9,-2.38);
  [-1.1,1.1].forEach(x=>{mesh(t,new THREE.BoxGeometry(.3,.9,2),main,x,.95,-1.8);mesh(t,new THREE.SphereGeometry(.2,12,10),dk,x,1.42,-.86)});
  [-1.34,1.34].forEach(x=>{mesh(t,new THREE.CylinderGeometry(.15,.2,4.2,10),dk,x,2.1,-2.6);[1.1,2.2,3.3].forEach(y=>mesh(t,new THREE.TorusGeometry(.19,.045,6,14),main,x,y,-2.6).rotation.x=Math.PI/2)});
  const crest=mesh(t,new THREE.SphereGeometry(.2,16,14),new THREE.MeshPhongMaterial({color:glow,emissive:glow,emissiveIntensity:.6}),0,4.28,-2.6);
  return{t,crest,tops:[[-1.34,4.2,-2.6],[1.34,4.2,-2.6]]}}
function snowCone(parent,x,z,r,h,col){mesh(parent,new THREE.ConeGeometry(r,h,7),FL(col),x,h/2-.5,z);mesh(parent,new THREE.ConeGeometry(r*.36,h*.36,7),FL(0xffffff),x,h*.82-.5,z)}
function pine(parent,x,z,s,cols){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);parent.add(g);mesh(g,new THREE.CylinderGeometry(.12,.16,.9,6),L(0x4a3320),0,.45,0);
  [[.95,1.3,1.2],[.75,1.1,1.95],[.5,.9,2.6]].forEach(([r,h,y],i)=>mesh(g,new THREE.ConeGeometry(r,h,7),FL(cols[i%cols.length]),0,y,0));return g}
