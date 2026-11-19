/* ===== Ragnarok cast: the rest of the Aesir, Loki's family, the giants, and a few small sprites ===== */
KINDS.TR=KINDS.TY;
Object.assign(KINDS,{
  BA:{robe:'#f6e7a8',trim:'#e8b830',skin:'#fff',top:'#f2c53d',hair:'#f2c53d',locks:1,crown:'circlet',prop:'',sash:1},
  FG:{robe:'#6aa8d8',trim:'#e8b830',skin:'#fff',top:'#e2a85a',hair:'#e2a85a',locks:1,crown:'veil',prop:'',lash:1,sash:1,cape:'#3a5a8a'},
  HO:{robe:'#6a6a7a',trim:'#3a3a4a',skin:'#fff',top:'#5a4020',crown:'',prop:'spear',sash:1},
  HL:{robe:'#2a2536',trim:'#7a7a9a',skin:'#cfd6e8',top:'#14121c',hair:'#14121c',locks:1,crown:'',prop:'',cape:'#14121c',lash:1},
  HM:{robe:'#eef1f8',trim:'#ffd34d',skin:'#fff',beard:'#ffe9a0',hair:'#ffe9a0',locks:1,crown:'helm',prop:'horn',cape:'#6a8ad8',armor:1,plate:'#ffe9a0'},
  SU:{robe:'#2a1210',trim:'#ff5a1a',skin:'#ff9a4a',beard:'#ff5a1a',hair:'#ff7a2a',locks:1,crown:'horn',prop:'gsword',cape:'#7a1a08',armor:1,plate:'#4a1a10'},
  SI:{robe:'#7ab88a',trim:'#e8b830',skin:'#fff',top:'#8a5a2a',hair:'#8a5a2a',locks:1,crown:'flower',prop:'bowl',lash:1,sash:1},
  SS:{robe:'#4a3a6a',trim:'#6a52a8',skin:'#fff',crown:'hood',prop:'',fur:'#2a2040'},
  MK:{robe:'#7a5a34',trim:'#4a3420',skin:'#fff',crown:'hood',prop:'',fur:'#8a6a44'},
  VA:{robe:'#3f6a5c',trim:'#27382f',skin:'#fff',top:'#7a4a22',crown:'circlet',prop:'bow'},
  MO:{robe:'#b8322a',trim:'#7a1f1a',skin:'#fff',top:'#e2622a',crown:'circlet',prop:'hammer',belt:1},
  MG:{robe:'#c9822a',trim:'#7a4a1a',skin:'#fff',top:'#d9a22a',crown:'circlet',prop:'hammer',belt:1},
  OH:{robe:'#4a3a8a',trim:'#c9a23a',skin:'#fff',beard:'#dfe3ec',hair:'#dfe3ec',locks:1,cape:'#241c52',crown:'helm',prop:'gungnir',patch:1,sash:1,armor:1,plate:'#d9b24a'},
  VK:{robe:'#6a5a4a',trim:'#3a2a1a',skin:'#fff',beard:'#a0652a',crown:'viking',prop:'sword',armor:1,plate:'#8a7a5a'},
  LF:{robe:'#8a6a3a',trim:'#5a3a1a',skin:'#fff',top:'#7a4a22',crown:'',prop:''},
  LS:{robe:'#b0527a',trim:'#6a2a4a',skin:'#fff',top:'#c9822a',hair:'#c9822a',locks:1,crown:'',prop:'',lash:1},
  EN:{robe:'#7a3a2a',trim:'#e8b830',skin:'#ffd0a0',beard:'#ff5a1a',crown:'horn',prop:'',armor:1,plate:'#4a1a10',cape:'#5a1a0a'},
  SO:{robe:'#fff2b0',trim:'#ffd34d',skin:'#fff',top:'#ffd34d',hair:'#ffd34d',locks:1,crown:'laurel',prop:'',lash:1,sash:1},
  GY:{robe:'#9aa2b8',trim:'#6a7288',skin:'#e8ecf4',beard:'#cdd3e4',crown:'ice',prop:'',fur:'#eaf6ff'},
});
Object.assign(RUNES,{BA:[[.5,0,.5,1],[.5,.2,.15,.5],[.5,.2,.85,.5]],HM:[[.5,0,.5,1],[.2,.2,.8,.2],[.2,.8,.8,.8]],SU:[[.5,0,.15,.5],[.15,.5,.85,.5],[.85,.5,.5,1],[.5,1,.5,0]]});
{const _pr=drawPropN;drawPropN=function(g,type,x,y,t,K){
  if(type==='bowl'){g.save();g.translate(x,y);g.strokeStyle=OL;g.lineWidth=5;g.fillStyle='#b9bfcc';g.beginPath();g.moveTo(-26,-8);g.quadraticCurveTo(0,40,26,-8);g.closePath();g.fill();g.stroke();
    g.fillStyle='#8fe04a';g.beginPath();g.ellipse(0,-8,24,6,0,0,7);g.fill();g.stroke();g.restore();return true}
  if(type==='dart'){g.save();g.translate(x,y);g.rotate(-.6);ln(g,0,30,0,-64,7,OL);ln(g,0,30,0,-64,3.5,'#7ccf5a');g.fillStyle='#7ccf5a';g.beginPath();g.moveTo(-9,-62);g.lineTo(0,-84);g.lineTo(9,-62);g.closePath();g.fill();g.stroke();g.restore();return true}
  return _pr(g,type,x,y,t,K)}}
/* a rooster: Gullinkambi, Fjalar and the rust-red one in Hel's halls */
function drawRooster(g,c,t,ph){const C1=c.c1||'#e8b830',C2=c.c2||'#d8432f',crow=c.crow?Math.max(0,Math.sin(t*9+ph)):0;g.lineJoin=g.lineCap='round';g.strokeStyle=OL;g.lineWidth=7;
  g.translate(0,Math.sin(t*3+ph)*2);
  ln(g,112,292,108,332,7,'#e8a030');ln(g,146,292,150,332,7,'#e8a030');
  g.fillStyle=C1;[[196,240,236,168],[190,250,246,198],[186,262,240,230]].forEach(([a,b,cx,cy],i)=>{g.beginPath();g.moveTo(170,270);g.quadraticCurveTo(cx+8,cy,cx,cy-30+i*10);g.quadraticCurveTo(a,b-30,176,246);g.closePath();g.fill();g.stroke()});
  g.beginPath();g.ellipse(126,252,58,50,0,0,7);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.ellipse(108,236,22,10,-.5,0,7);g.fill();
  g.fillStyle=C1;g.beginPath();g.ellipse(100,176,34,40,-.3,0,7);g.fill();g.stroke();
  g.beginPath();g.ellipse(86,126,40,38,0,0,7);g.fill();g.stroke();
  g.fillStyle=C2;[[70,92],[88,84],[106,92]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,13,0,7);g.fill();g.stroke()});
  g.beginPath();g.ellipse(74,160,9,16,0,0,7);g.fill();g.stroke();
  g.fillStyle='#f2a830';const bo=10+crow*14;g.beginPath();g.moveTo(52,122);g.lineTo(14,122-bo*.4);g.lineTo(50,132);g.closePath();g.fill();g.stroke();
  g.beginPath();g.moveTo(50,134);g.lineTo(16,134+bo*.8);g.lineTo(54,142);g.closePath();g.fill();g.stroke();
  g.fillStyle='#fff';g.lineWidth=4;g.beginPath();g.arc(82,114,9,0,7);g.fill();g.stroke();g.fillStyle=OL;g.beginPath();g.arc(80,114,4,0,7);g.fill();
  ln(g,64,100,92,106,5)}
SPECIAL.RO=drawRooster;
