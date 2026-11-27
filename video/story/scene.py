import bpy, math, json, random, os
from mathutils import Vector
D='/home/user/paul/video/story/'
TL=json.load(open(D+'timeline.json'));L=TL['lines'];FPS=30;TEST=os.environ.get('TEST')
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene
s.render.resolution_x,s.render.resolution_y=(270,480) if TEST else (1080,1920)
s.render.engine='BLENDER_WORKBENCH';s.render.fps=FPS;s.frame_start=1;s.frame_end=int(TL['total']*FPS)
sh=s.display.shading;sh.light='STUDIO';sh.color_type='OBJECT';sh.show_shadows=False;sh.show_cavity=False
sh.show_object_outline=True;sh.object_outline_color=(0,0,0);s.display.render_aa='5'
s.world=bpy.data.worlds.new('w')
def box(loc,size,col,parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=size;o.color=(*col,1)
    if parent:o.parent=parent
    return o
def char(hair,coat):
    r=bpy.data.objects.new('c',None);s.collection.objects.link(r)
    P=lambda l,z,c:box(l,z,c,r);K=(0,0,0)
    P((-.3,0,.35),(.4,.45,.7),(.15,.15,.25));P((.3,0,.35),(.4,.45,.7),(.15,.15,.25))
    P((0,0,1.3),(1.3,.8,1.2),coat);P((0,0,2.4),(1,1,1),(.95,.75,.6));P((0,0,3.0),(1.1,1.1,.35),hair)
    eyes=[P((x,-.52,2.5),(.14,.05,.26),K) for x in(-.25,.25)];brows=[P((x,-.52,2.85),(.3,.05,.07),K) for x in(-.25,.25)]
    return r,eyes,brows,P((0,-.52,2.1),(.4,.05,.08),K)
def expr(c,e):
    r,eyes,brows,mo=c;a=0;bz=2.85;ez=.26
    if e=='ok':mo.scale=(.4,.05,.08);mo.location.z=2.1
    elif e=='shock':mo.scale=(.2,.05,.3);mo.location.z=2.0;bz=3.0;ez=.5
    else:mo.scale=(.35,.05,.07);mo.location.z=1.95;a=.45
    brows[0].rotation_euler.y=-a;brows[1].rotation_euler.y=a
    for b in brows:b.location.z=bz
    for e_ in eyes:e_.scale.z=ez
hero=char((0,.7,.7),(1,.8,0));pip=char((1,.4,.7),(1,.8,0));pip[0].scale=(.6,.6,.6)
stairs=[];houses=[];rnd=random.Random(3)
for k in range(-4,10):
    top=1.2*(k+1);stairs.append(box((0,3*k,(top-8)/2),(16,3,top+8),(.8,.5,.25)))
    for x in(-5.5,5.5):
        if k==3 and x<0:continue
        base=rnd.choice([(.95,.5,.15),(.9,.65,.2),(.85,.35,.2)]);cz=top+1.2
        h=box((x,3*k+.5,cz),(3,2,2.4),base);houses.append((h,base));box((x,3*k+.5,cz+1.4),(3.4,2.4,.4),(.45,.12,.1))
hk=3;hz=1.2*(hk+1);hh=box((-3,3*hk+.5,hz+1.3),(3.2,2,2.6),(.9,.55,.2));houses.append((hh,(.9,.55,.2)))
box((-3,3*hk+.5,hz+2.9),(3.6,2.4,.4),(.45,.12,.1));box((-3,3*hk-.52,hz+.8),(.9,.05,1.6),(.35,.2,.1))
bpy.ops.object.text_add(location=(-3,3*hk-.58,hz+.6),rotation=(math.pi/2,0,0));num=bpy.context.object
num.data.body='4';num.data.size=.9;num.data.align_x='CENTER';num.color=(1,1,1,1)
bpy.ops.mesh.primitive_cylinder_add(radius=1.4,depth=14,location=(0,27,19));bpy.context.object.color=(.8,.78,.7,1)
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.4,location=(0,27,27.2));lamp=bpy.context.object
floor=box((0,0,-8.5),(160,160,1),(.15,.2,.25));water=box((0,20,0),(140,140,1),(.2,.45,.6))
door=box((0,-17,-4.5),(9,1.2,7),(.1,.08,.15));slit=box((0,-17.7,-3),(6,.2,1),(1,.9,.5))
snow=[(rnd.uniform(-25,25),rnd.uniform(-20,40),rnd.uniform(0,35),box((0,0,0),(.15,.15,.15),(1,1,1))) for _ in range(70)]
bpy.ops.object.camera_add();cam=bpy.context.object;s.camera=cam;cam.data.lens=26;cam.data.clip_end=400
sunl=None
PRE={'aerial':('C',(-30,-40,38),(30,-40,38),(0,0,0)),'aerial2':('C',(0,-62,30),(0,-36,22),(0,0,0)),
'lowT':('T',(0,-14,-15),(0,-14,-10),(0,0,0)),'hc':('H',(1.5,-4,2.4),(.5,-3,2.4),(0,0,2.3)),
'hw':('H',(6,-10,3),(4,-9,2.5),(0,0,1.5)),'ots':('H',(.8,3,3.6),(.8,2.5,3.3),(0,-10,0)),
'door':('D',(0,-3.2,0),(.3,-2.6,0),(0,0,0)),'pip':('P',(-1,-4,2.5),(0,-3.5,2.4),(0,0,1.8)),
'water':('W',(4,-10,1.5),(6,-9,1),(0,10,1)),'bottom':('B',(0,-14,6),(0,-9,3),(0,0,0)),
'lamp':('T',(4,-6,0),(3,-5,0),(0,0,1.5))}
SH=[[('aerial',1),('aerial2',1),('lowT',1),('water',1)],
[('aerial2',1),('water',1),('lowT',1),('aerial',1.3)],
[('hw',1),('pip',1),('door',1),('hc',1),('pip',1),('hw',1)],
[('water',1),('lowT',1),('lamp',1.2),('hc',1),('lamp',1),('ots',1)],
[('hc',1),('water',1),('ots',1),('lowT',1)],
[('hw',1),('ots',1),('hw',1),('hc',1),('ots',1)],
[('bottom',1.2),('hc',1),('bottom',1.3),('ots',1)],
[('hw',1),('aerial',1),('lamp',1),('door',3)]]
HE=['ok','ok','ok','shock','shock','sad','shock','sad']
VW=[1.2,1.5,1.8,2,2,-7,-7,-7,-7];VM=[0,0,0,.5,.5,1,1,1,1]
lerp=lambda a,b,u:a+(b-a)*u
def c3(cs,m):
    a,b,u=(cs[0],cs[1],m*2) if m<.5 else (cs[1],cs[2],m*2-1)
    return tuple(lerp(x,y,u) for x,y in zip(a,b))
BG=[(.3,.15,.05),(.3,.38,.36),(.01,.03,.18)];ST=[(.8,.5,.25),(.5,.58,.55),(.1,.15,.4)];WA=[(.2,.45,.6),(.35,.5,.5),(.02,.06,.3)]
def upd(sc,*a):
    t=(sc.frame_current-1)/FPS;i=len(L)-1
    for j,l in enumerate(L):
        if t<l['end']:i=j;break
    l=L[i];u=min(1,max(0,(t-l['start'])/(l['end']-l['start'])))
    wl=lerp(VW[i],VW[i+1],u);m=lerp(VM[i],VM[i+1],u)
    s.world.color=c3(BG,m);water.location.z=wl-.5;water.color=(*c3(WA,m),1)
    for o in stairs:o.color=(*c3(ST,m),1)
    cold=(.2,.25,.45)
    for h,b in houses:h.color=(*[lerp(x,y,min(1,m*1.2)) for x,y in zip(b,cold)],1)
    sw=[w for _,w in SH[i]];tot=sum(sw);p=u*tot;acc=0;idx=0
    for idx,w in enumerate(sw):
        if p<acc+w or idx==len(sw)-1:break
        acc+=w
    v=min(1,(p-acc)/sw[idx]);name=SH[i][idx][0]
    kf=lerp(3,-4,u) if i==5 else (-4 if i==6 else (lerp(-4,3,min(1,u/.6)) if i==7 else 3))
    run=i in(5,7) and u<(.6 if i==7 else 1)
    hero[0].location=(1.5,3*kf,1.2*(kf+1)+(abs(math.sin(t*11))*.3 if run else 0));expr(hero,HE[i])
    pip[0].location=(-3,3*hk-1.1,hz);expr(pip,'sad' if i in(3,4,7) else 'ok')
    lastflip=(i==7 and idx==len(sw)-1);num.data.body='1' if lastflip else '4'
    lamp.color=(1,.1,.1,1) if i==7 else ((1,1,.9,1) if (i!=3 or int(t*4)%2==0) else (.25,.25,.25,1))
    br=1+.05*math.sin(t*3) if i>=6 else 1;door.scale=(9*br,1.2,7*br);slit.scale=(6,.2,lerp(.3,1.6,u) if i==6 else (1.6 if i==7 else .3))
    A={'C':Vector((0,12,6)),'H':hero[0].location,'T':Vector((0,27,27)),'D':Vector((-3,3*hk,hz+.8)),
       'P':pip[0].location,'W':Vector((0,0,wl)),'B':Vector((0,-17,-4))}
    n,o0,o1,lk=PRE[name][0],PRE[name][1],PRE[name][2],PRE[name][3];An=A[n]
    cp=An+Vector(o0)*(1-v)+Vector(o1)*v;cam.location=cp
    cam.rotation_euler=(An+Vector(lk)-cp).to_track_quat('-Z','Y').to_euler()
    for x,y,z0,o in snow:o.location=(x,y,(z0-t*5)%35-4)
bpy.app.handlers.frame_change_pre.append(upd)
if TEST:
    for f in[20,110,230,420,640,900,1250,1500,1790]:
        s.frame_set(f);s.render.filepath=D+f't{f}.png';bpy.ops.render.render(write_still=True)
else:
    s.render.image_settings.file_format='FFMPEG';s.render.ffmpeg.format='MPEG4';s.render.ffmpeg.codec='H264'
    s.render.ffmpeg.constant_rate_factor='HIGH';s.render.filepath=D+'raw.mp4';bpy.ops.render.render(animation=True)
