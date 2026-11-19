import bpy, math, sys
OUT = sys.argv[sys.argv.index('--') + 1]
NF  = int(sys.argv[sys.argv.index('--') + 2])     # frames in the loop
ONE = len(sys.argv) > sys.argv.index('--') + 3    # render a single frame only

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 48; sc.cycles.use_denoising = False
sc.cycles.max_bounces = 3; sc.cycles.transparent_max_bounces = 12
sc.render.resolution_x = 920; sc.render.resolution_y = 520
sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Standard'

# ---- ribbon geometry: a looping flutter, exact over NF frames ----
NU, NV = 150, 7
SPAN, YBASE, YARC = 8.4, -0.95, 3.0

def width(u):                      # narrow behind her, flared out, tapering to a point at the tips
    e = abs(2 * (u - .5))
    taper = min(1.0, (1 - e) / .09)
    return (.40 + 1.30 * e ** 1.5) * taper

def build(f):
    ph = 2 * math.pi * f / NF
    vs, fs = [], []
    for i in range(NU + 1):
        u = i / NU
        e = abs(2 * (u - .5))
        cx = (u - .5) * SPAN
        cy = YBASE + YARC * (2 * (u - .5)) ** 2
        cy += .30 * math.sin(3 * 2 * math.pi * u + ph) * (.15 + .85 * e)
        cz = 1.25 * math.sin(1.5 * 2 * math.pi * u + ph) * (.25 + .75 * e)
        th = .52 * math.sin(1.2 * 2 * math.pi * u + ph) + .20 * math.sin(3 * 2 * math.pi * u + ph * 2)
        hw = width(u) / 2
        for j in range(NV + 1):
            v = j / NV - .5
            # scalloped trailing edge, so it reads as feathered silk
            sca = 1 + .12 * math.sin(5 * 2 * math.pi * u + ph) * (v + .5)
            d = v * width(u) * sca
            vs.append((cx, cy + d * math.cos(th), cz + d * math.sin(th)))
    for i in range(NU):
        for j in range(NV):
            a = i * (NV + 1) + j
            fs.append((a, a + NV + 1, a + NV + 2, a + 1))
    me = bpy.data.meshes.new('h'); me.from_pydata(vs, [], fs); me.update()
    for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new('h', me); sc.collection.objects.link(ob)
    ob.data.materials.append(silk)
    return ob

# ---- silk material: pale, iridescent, translucent ----
silk = bpy.data.materials.new('silk'); silk.use_nodes = True
nt = silk.node_tree; n, l = nt.nodes, nt.links
b = n['Principled BSDF']
b.inputs['Roughness'].default_value = .40
try: b.inputs['Specular IOR Level'].default_value = .25
except Exception: pass
b.inputs['Alpha'].default_value = .93
b.inputs['Emission Strength'].default_value = .35
try: b.inputs['Sheen Weight'].default_value = .8
except Exception: pass
tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ'); ramp = n.new('ShaderNodeValToRGB')
l.new(tc.outputs['Generated'], sep.inputs[0]); l.new(sep.outputs['X'], ramp.inputs[0])
l.new(ramp.outputs['Color'], b.inputs['Base Color'])
l.new(ramp.outputs['Color'], b.inputs['Emission Color'])
STOPS = [(0.00, (.10, .52, 1, 1)), (.20, (.62, .90, 1, 1)), (.40, (1, .60, .06, 1)),
         (.60, (1, .66, .10, 1)), (.80, (1, .70, .80, 1)), (1.00, (.95, .16, .52, 1))]
cr = ramp.color_ramp
cr.elements[0].position, cr.elements[1].position = STOPS[0][0], STOPS[-1][0]
for p, _c in STOPS[1:-1]:
    cr.elements.new(p)
for el in cr.elements:                      # assign by nearest stop, after the ramp has settled
    el.color = min(STOPS, key=lambda st: abs(st[0] - el.position))[1]

cam = bpy.data.cameras.new('c'); cam.type = 'ORTHO'; cam.ortho_scale = 10.4
co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0, 0, 12); co.rotation_euler = (0, 0, 0)

def light(loc, e, col, size=4):
    L = bpy.data.lights.new('l', 'AREA'); L.energy = e; L.color = col; L.size = size
    o = bpy.data.objects.new('l', L); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (math.atan2(math.hypot(loc[0], loc[1]), loc[2]), 0, math.atan2(loc[1], loc[0]) + math.pi / 2)
light((3, 4, 9), 650, (1, .95, .85)); light((-5, -2, 7), 380, (.72, .86, 1)); light((0, 0, -8), 300, (1, .88, .94))
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Strength'].default_value = .25

for f in ([0] if ONE else range(NF)):
    ob = build(f)
    sc.render.filepath = OUT % f if '%' in OUT else OUT
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(ob, do_unlink=True)
