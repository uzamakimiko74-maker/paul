/* ===== Ragnarok long-form: setup (16:9, deterministic: everything is a pure function of the clock t) ===== */
const $=id=>document.getElementById(id);
const glc=$('gl'),hud=$('hud'),hudCtx=hud.getContext('2d');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,k)=>a+(b-a)*k;
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const eout=x=>1-Math.pow(1-clamp(x),3);
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(7);
const FONT='Fredoka, "Trebuchet MS", sans-serif';
const VW=1280,VH=720;
const renderer=new THREE.WebGLRenderer({canvas:glc,antialias:true,preserveDrawingBuffer:true});
renderer.outputEncoding=THREE.sRGBEncoding;renderer.setPixelRatio(1);renderer.setSize(VW,VH,false);
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(50,VW/VH,.1,400);scene.add(cam);
const hemi=new THREE.HemisphereLight(0xffffff,0x555577,1);scene.add(hemi);
const sunL=new THREE.DirectionalLight(0xffffff,.9);sunL.position.set(5,10,6);scene.add(sunL);
let curT=1;
