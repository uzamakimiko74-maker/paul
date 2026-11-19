import bpy, math, sys, random
NAME = sys.argv[sys.argv.index('--') + 1]
OUT = sys.argv[sys.argv.index('--') + 2]
random.seed(5)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = 72
sc.cycles.use_denoising = False
sc.cycles.max_bounces = 4
sc.render.resolution_x = 810
sc.render.resolution_y = 1440
sc.render.image_settings.file_format = 'JPEG'
sc.render.image_settings.quality = 92
sc.view_settings.view_transform = 'Standard'

def mat(color, rough=.6, emit=0, emit_col=None, metal=0):
    m = bpy.data.materials.new('m'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*(emit_col or color), 1)
        b.inputs['Emission Strength'].default_value = emit
    return m

def obj(prim, loc=(0, 0, 0), scale=(1, 1, 1), rot=(0, 0, 0), m=None, **kw):
    getattr(bpy.ops.mesh, prim)(location=loc, rotation=rot, **kw)
    o = bpy.context.active_object
    o.scale = scale
    if m: o.data.materials.append(m)
    return o

def sky(stops):
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    n = w.node_tree.nodes; l = w.node_tree.links; n.clear()
    tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ'); ramp = n.new('ShaderNodeValToRGB')
    bg = n.new('ShaderNodeBackground'); out = n.new('ShaderNodeOutputWorld')
    l.new(tc.outputs['Window'], sep.inputs[0]); l.new(sep.outputs['Y'], ramp.inputs[0])
    l.new(ramp.outputs[0], bg.inputs['Color']); l.new(bg.outputs[0], out.inputs[0])
    els = ramp.color_ramp.elements
    while len(els) < len(stops): els.new(.5)
    for e, (p, c) in zip(els, stops):
        e.position = p; e.color = (*c, 1)

def camera(z=3.2, d=-16, lens=30):
    cam = bpy.data.cameras.new('c'); cam.lens = lens
    co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
    co.location = (0, d, z); co.rotation_euler = (math.radians(90), 0, 0)

def sun(energy, rot, col=(1, 1, 1)):
    l = bpy.data.lights.new('s', 'SUN'); l.energy = energy; l.color = col
    o = bpy.data.objects.new('s', l); sc.collection.objects.link(o); o.rotation_euler = [math.radians(a) for a in rot]

def pointl(loc, energy, col, size=1):
    l = bpy.data.lights.new('p', 'POINT'); l.energy = energy; l.color = col; l.shadow_soft_size = size
    o = bpy.data.objects.new('p', l); sc.collection.objects.link(o); o.location = loc

def sea(col, rough=.18, z=0):
    return obj('primitive_plane_add', (0, 100, z), (300, 300, 1), m=mat(col, rough))

def torii(x, y, s=1, col=(.8, .08, .05), glow=0):
    m = mat(col, .5, emit=glow); k = mat((.03, .03, .03), .5)
    for dx in (-1.6, 1.6):
        obj('primitive_cylinder_add', (x + dx * s, y, 2.5 * s), (.3 * s, .3 * s, 2.5 * s), m=m, radius=1, depth=2, vertices=20)
    obj('primitive_cube_add', (x, y, 5.15 * s), (5.8 * s, .55 * s, .38 * s), m=m, size=1)
    obj('primitive_cube_add', (x, y, 5.45 * s), (6.4 * s, .7 * s, .3 * s), m=k, size=1)
    obj('primitive_cube_add', (x, y, 4.1 * s), (4.3 * s, .3 * s, .3 * s), m=m, size=1)

def mountain(x, y, R, H, col=(.18, .22, .4), snow=True):
    obj('primitive_cone_add', (x, y, H / 2), (1, 1, 1), m=mat(col, .9), radius1=R, radius2=R * .08, depth=H, vertices=40)
    if snow:
        h = H * .28
        obj('primitive_cone_add', (x, y - .2, H - h / 2 + .3), (1, 1, 1), m=mat((.95, .95, 1), .9), radius1=R * .08 + (R - R * .08) * .28, radius2=R * .08, depth=h, vertices=40)

def disc(x, y, z, r, col, strength):
    return obj('primitive_uv_sphere_add', (x, y, z), (r, r * .08, r), m=mat(col, 1, emit=strength), radius=1, segments=48, ring_count=24)

def rocks(n, xr, yr, zr, sr, col):
    for _ in range(n):
        s = random.uniform(*sr)
        o = obj('primitive_ico_sphere_add', (random.uniform(*xr), random.uniform(*yr), random.uniform(*zr)),
                (s, s * random.uniform(.7, 1.2), s * random.uniform(.8, 1.3)), m=mat(col, .95), radius=1, subdivisions=2)
        o.rotation_euler = (random.random(), random.random(), random.random())

if NAME == 'dawn':
    sky([(0, (.9, .45, .1)), (.35, (.95, .35, .35)), (.7, (.35, .22, .5)), (1, (.05, .07, .22))])
    camera(3.4)
    sun(3, (60, 0, 20), (1, .7, .5))
    sea((.55, .25, .12), .12)
    disc(0, 70, 9, 14, (1, .55, .2), 14)
    mountain(40, 120, 38, 40, (.12, .13, .3))
    torii(-3, 8, 1.4)
elif NAME == 'ebisu':
    sky([(0, (1, .82, .45)), (.4, (.55, .85, .85)), (1, (.18, .5, .8))])
    camera(3.0)
    sun(4, (55, 0, -25), (1, .9, .7))
    sea((.1, .5, .6), .1)
    disc(18, 70, 12, 9, (1, .9, .5), 10)
    mountain(-35, 110, 34, 36, (.2, .35, .55))
    boat = mat((.35, .17, .08), .8)
    obj('primitive_cube_add', (0, 12, .5), (3.6, 1.1, .6), (0, 0, 0), boat, size=1)
    obj('primitive_cube_add', (3.8, 12, .9), (1.4, .9, .35), (0, math.radians(-25), 0), boat, size=1)
    obj('primitive_cube_add', (-3.8, 12, .9), (1.4, .9, .35), (0, math.radians(25), 0), boat, size=1)
    obj('primitive_cylinder_add', (-.5, 12, 3.2), (.09, .09, 2.8), m=boat, radius=1, depth=2, vertices=12)
    obj('primitive_cube_add', (.9, 12, 3.4), (1.6, .05, 1.8), m=mat((.95, .9, .8), .9), size=1)
    torii(7, 40, 2.2)
elif NAME == 'susanoo':
    sky([(0, (.18, .12, .2)), (.45, (.3, .22, .4)), (.8, (.12, .12, .28)), (1, (.03, .03, .1))])
    camera(3.0)
    sun(1.2, (50, 0, 30), (.6, .6, 1))
    sea((.05, .1, .2), .08)
    for i in range(40):
        x = random.uniform(-40, 40); y = random.uniform(5, 90); s = random.uniform(1.2, 3.5)
        obj('primitive_cone_add', (x, y, s * .4), (1, 1, 1), m=mat((.08, .15, .3), .15), radius1=s, radius2=0, depth=s * 1.8, vertices=10)
    torii(0, 55, 3, glow=.4)
    pointl((0, 20, 14), 8000, (.7, .5, 1), 6)
elif NAME == 'tsukuyomi':
    sky([(0, (.07, .08, .2)), (.5, (.12, .16, .38)), (1, (.02, .02, .1))])
    camera(3.2)
    sun(1.0, (55, 0, 20), (.7, .8, 1))
    sea((.06, .1, .22), .06)
    disc(0, 90, 24, 17, (.85, .92, 1), 9)
    for i in range(28):
        side = random.choice([-1, 1]); x = side * random.uniform(5, 18); y = random.uniform(4, 40)
        h = random.uniform(10, 18)
        obj('primitive_cylinder_add', (x, y, h / 2), (.22, .22, h / 2), m=mat((.1, .25, .18), .6, emit=.15), radius=1, depth=2, vertices=10)
    mountain(0, 140, 40, 28, (.07, .09, .22), snow=False)
elif NAME == 'izanami':
    sky([(0, (.02, .0, .04)), (.4, (.14, .02, .2)), (.75, (.1, .3, .2)), (1, (.0, .02, .03))])
    camera(3.2)
    sun(.4, (60, 0, 0), (.5, .3, .8))
    obj('primitive_plane_add', (0, 100, 0), (300, 300, 1), m=mat((.03, .03, .05), .9), size=1)
    for i in range(9):
        torii(0, 6 + i * 9, 1.3 + i * .0, glow=2.0)
    for i in range(34):
        pointl((random.uniform(-14, 14), random.uniform(3, 70), random.uniform(.5, 7)), 200, (1, .55, .15), .5)
        obj('primitive_uv_sphere_add', (random.uniform(-14, 14), random.uniform(3, 70), random.uniform(.5, 8)), (.2, .2, .2), m=mat((.6, 1, .8), 1, emit=12), radius=1, segments=12, ring_count=8)
    rocks(30, (-30, 30), (8, 80), (0, 2), (1, 3), (.05, .04, .07))
elif NAME == 'amaterasu':
    sky([(0, (1, .9, .5)), (.5, (1, .95, .8)), (1, (1, .7, .3))])
    camera(3.5)
    sun(5, (50, 0, 10), (1, .95, .8))
    sea((1, .75, .35), .1)
    disc(0, 60, 11, 20, (1, 1, .85), 20)
    disc(0, 61, 11, 27, (1, .85, .4), 6)
    mountain(-45, 120, 34, 26, (.9, .55, .25), snow=False)
    mountain(50, 130, 40, 30, (.85, .5, .2), snow=False)
    torii(0, 14, 1.7)
elif NAME == 'cave':
    sky([(0, (.01, .01, .03)), (1, (.02, .02, .06))])
    camera(3.0, -14)
    pointl((0, 40, 6), 90000, (1, .7, .25), 3)
    sun(.6, (50, 0, 0), (.4, .35, .6))
    obj('primitive_plane_add', (0, 30, 0), (200, 200, 1), m=mat((.03, .03, .04), .9), size=1)
    rocks(26, (-14, 14), (14, 18), (0, 12), (2.8, 5.0), (.06, .05, .06))
    rocks(12, (-10, 10), (6, 9), (0, 3), (1, 2), (.07, .06, .06))
    obj('primitive_uv_sphere_add', (0, 40, 5), (6, .2, 6), m=mat((1, .85, .4), 1, emit=30), radius=1, segments=32, ring_count=16)
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
