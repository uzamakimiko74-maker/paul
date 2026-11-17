const { chromium } = require('playwright');
(async()=>{
  const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p = await b.newPage({viewport:{width:640,height:360}});
  await p.setContent('<canvas id=c width=640 height=360></canvas>');
  const r = await p.evaluate(()=>{const c=document.getElementById('c');const gl=c.getContext('webgl');return gl?gl.getParameter(gl.VERSION)+' | '+(gl.getExtension('WEBGL_debug_renderer_info')?gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL):''):'no webgl'});
  console.log(r);
  await b.close();
})();
