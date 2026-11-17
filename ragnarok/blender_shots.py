"""Blender hero shots for the Ragnarok video.

Usage: blender -b --python blender_shots.py -- <shot> <outdir> [width height frames]
Shots: eclipse bifrost naglfar yggdrasil surtr rebirth
Renders a PNG sequence (EEVEE, software GL). Stills are encoded by build.py.
"""
import bpy, sys, math, random
import numpy as np
from mathutils import Vector, noise

argv = sys.argv[sys.argv.index("--") + 1:]
SHOT, OUT = argv[0], argv[1]
W = int(argv[2]) if len(argv) > 2 else 1280
H = int(argv[3]) if len(argv) > 3 else 720
NF_OVERRIDE = int(argv[4]) if len(argv) > 4 else None
FPS = 24
random.seed(7)


# ------------------------------------------------------------------ helpers
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 100
    sc.render.fps = FPS
    sc.render.image_settings.file_format = 'PNG'
    ee = sc.eevee
    ee.taa_render_samples = 10
    ee.use_bloom = True
    ee.bloom_intensity = 0.07
    ee.bloom_threshold = 1.6
    ee.bloom_radius = 4.0
    ee.use_gtao = True
    ee.use_ssr = False
    sc.view_settings.view_transform = 'Filmic'
    sc.view_settings.look = 'Medium High Contrast'
    return sc


def world(top, horizon, strength=1.0):
    sc = bpy.context.scene
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    bg = nt.nodes.new("ShaderNodeBackground")
    out = nt.nodes.new("ShaderNodeOutputWorld")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -0.1
    mr.inputs["From Max"].default_value = 0.85
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], ramp.inputs[0])
    nt.links.new(ramp.outputs[0], bg.inputs["Color"])
    nt.links.new(bg.outputs[0], out.inputs[0])
    ramp.color_ramp.elements[0].position = 0.05
    ramp.color_ramp.elements[0].color = horizon
    ramp.color_ramp.elements[1].position = 0.7
    ramp.color_ramp.elements[1].color = top
    bg.inputs["Strength"].default_value = strength
    return bg


def mat_emit(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = color
    e.inputs["Strength"].default_value = strength
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs[0], o.inputs[0])
    return m


def mat_pbr(name, color, rough=0.6, metal=0.0, emit=None, emit_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = color
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = emit
        b.inputs["Emission Strength"].default_value = emit_strength
    return m


def mat_height_ramp(name, stops, zmin, zmax, rough=0.9):
    """Principled material coloured by object-space Z."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = zmin
    mr.inputs["From Max"].default_value = zmax
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], ramp.inputs[0])
    nt.links.new(ramp.outputs[0], b.inputs["Base Color"])
    el = ramp.color_ramp.elements
    el[0].position, el[0].color = stops[0][0], stops[0][1]
    el[1].position, el[1].color = stops[-1][0], stops[-1][1]
    for pos, col in stops[1:-1]:
        e = el.new(pos)
        e.color = col
    return m, ramp


def add(obj_op, mat=None, **kw):
    obj_op(**kw)
    o = bpy.context.active_object
    if mat:
        o.data.materials.append(mat)
    return o


def sphere(loc, r, mat, seg=32):
    return add(bpy.ops.mesh.primitive_uv_sphere_add, mat, radius=r, location=loc, segments=seg, ring_count=seg // 2)


def cube(loc, size, mat, rot=(0, 0, 0)):
    o = add(bpy.ops.mesh.primitive_cube_add, mat, location=loc, rotation=rot)
    o.scale = size
    return o


def cyl(loc, r, depth, mat, rot=(0, 0, 0), v=16):
    return add(bpy.ops.mesh.primitive_cylinder_add, mat, radius=r, depth=depth, location=loc, rotation=rot, vertices=v)


def cone(loc, r1, r2, depth, mat, rot=(0, 0, 0), v=16):
    return add(bpy.ops.mesh.primitive_cone_add, mat, radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot, vertices=v)


def grid(nx, ny, sx, sy, heightfn, mat, name="G"):
    xs = np.linspace(-sx / 2, sx / 2, nx)
    ys = np.linspace(-sy / 2, sy / 2, ny)
    X, Y = np.meshgrid(xs, ys)
    Z = heightfn(X, Y)
    verts = np.stack([X, Y, Z], -1).reshape(-1, 3)
    faces = []
    for j in range(ny - 1):
        for i in range(nx - 1):
            a = j * nx + i
            faces.append((a, a + 1, a + nx + 1, a + nx))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts.tolist(), [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    for p in me.polygons:
        p.use_smooth = True
    if mat:
        me.materials.append(mat)
    return ob, X, Y


def set_verts_z(ob, X, Y, Z):
    arr = np.stack([X, Y, Z], -1).reshape(-1).astype(np.float32)
    ob.data.vertices.foreach_set("co", arr)
    ob.data.update()


def camera(loc, target, lens=35):
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.clip_end = 2000
    co = bpy.data.objects.new("Cam", cd)
    bpy.context.collection.objects.link(co)
    bpy.context.scene.camera = co
    co.location = loc
    look(co, target)
    return co


def look(obj, target):
    d = Vector(target) - obj.location
    obj.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def sun_light(energy, rot, color=(1, 1, 1)):
    ld = bpy.data.lights.new("Sun", 'SUN')
    ld.energy = energy
    ld.color = color
    lo = bpy.data.objects.new("Sun", ld)
    bpy.context.collection.objects.link(lo)
    lo.rotation_euler = rot
    return ld


def point_light(loc, energy, color=(1, 1, 1), r=1.0):
    ld = bpy.data.lights.new("P", 'POINT')
    ld.energy = energy
    ld.color = color
    ld.shadow_soft_size = r
    lo = bpy.data.objects.new("P", ld)
    bpy.context.collection.objects.link(lo)
    lo.location = loc
    return lo


def stars(n, radius, mat, size=(0.05, 0.16), upper=True):
    objs = []
    for _ in range(n):
        th = random.uniform(0, 2 * math.pi)
        ph = random.uniform(0.05, 1.3) if upper else random.uniform(-1.4, 1.4)
        p = Vector((math.cos(th) * math.cos(ph), math.sin(th) * math.cos(ph), math.sin(ph))) * radius
        s = sphere(p, random.uniform(*size), mat, seg=6)
        objs.append(s)
    return objs


def FR(NF):
    import os
    r = os.environ.get('FRAMES')
    if r:
        a, b, c = [int(v) for v in r.split(':')]
        return range(a, min(b, NF), c)
    return range(NF)


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def lerp(a, b, t):
    return a + (b - a) * t


def lerp3(a, b, t):
    return tuple(lerp(a[i], b[i], t) for i in range(3))


# ------------------------------------------------------------------ shots
def shot_eclipse():
    """Skoll swallows the sun: a vast shadow-wolf maw eclipses it."""
    sc = reset()
    NF = 8 * FPS
    bg = world((0.005, 0.01, 0.03, 1), (0.16, 0.06, 0.03, 1), 0.45)
    sunm = mat_emit("Sun", (1.0, 0.82, 0.45, 1), 9)
    cor = mat_emit("Corona", (1.0, 0.55, 0.15, 1), 6)
    black = mat_emit("Black", (0, 0, 0, 1), 0)
    starm = mat_emit("Star", (0.8, 0.9, 1, 1), 8)
    stars(260, 380, starm)
    sun = sphere((0, 300, 120), 34, sunm, 48)
    corona = add(bpy.ops.mesh.primitive_torus_add, cor, location=(0, 299, 120), rotation=(math.pi / 2, 0, 0),
                 major_radius=40, minor_radius=3.5, major_segments=64, minor_segments=12)
    shade = sphere((-180, 280, 120), 36.5, black, 48)  # moves in front of sun
    # jaws: two dark cones either side, closing
    # ridge silhouette
    def ridge(X, Y):
        return 14 * noise.noise(Vector((0, 0, 0))) + 22 * np.vectorize(lambda x, y: noise.noise(Vector((x * 0.012, y * 0.02, 0))))(X, Y) - 6
    ob, X, Y = grid(90, 24, 700, 120, ridge, black, "Ridge")
    ob.location = (0, 230, 8)
    cam = camera((0, 0, 70), (0, 300, 120), 34)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        k = ease((t - 0.18) / 0.6)
        shade.location.x = lerp(-190, 0, k)
        shade.location.z = 120 + math.sin(t * 5) * 1.5
        # corona flares as eclipse nears totality, then fades with the sun
        cs = lerp(1.0, 1.35, k)
        corona.scale = (cs, cs, cs)
        cor.node_tree.nodes["Emission"].inputs["Strength"].default_value = lerp(1.5, 7, k) * (1 - ease((t - 0.8) / 0.2))
        sunm.node_tree.nodes["Emission"].inputs["Strength"].default_value = 9 * (1 - ease((t - 0.62) / 0.3))
        bg.inputs["Strength"].default_value = 0.45 * (1 - 0.9 * ease((t - 0.3) / 0.6))
        cam.location = (math.sin(t * 2) * 3, -t * 18, 70 + t * 12)
        look(cam, (0, 300, 120))
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


def shot_bifrost():
    """The rainbow bridge breaks under the sons of Muspell."""
    sc = reset()
    NF = 8 * FPS
    bg = world((0.01, 0.005, 0.02, 1), (0.6, 0.1, 0.02, 1), 0.7)
    stars(120, 380, mat_emit("Star", (1, .9, .8, 1), 6))
    N = 46
    segs = []
    R, cz = 34, -6
    for i in range(N):
        a = math.pi * i / (N - 1)
        hue = i / (N - 1)
        col = [(1, 0.1, 0.1), (1, 0.5, 0.1), (1, 0.9, 0.2), (0.2, 0.9, 0.3), (0.2, 0.6, 1), (0.4, 0.3, 1), (0.8, 0.3, 1)]
        c = col[min(6, int(hue * 7))]
        m = mat_emit(f"R{i}", (c[0], c[1], c[2], 1), 1.6)
        pos = (-math.cos(a) * R, 0, math.sin(a) * R + cz)
        s = cube(pos, (1.6, 3.4, 0.5), m, rot=(0, -(a - math.pi / 2), 0))
        s.rotation_euler = (0, a - math.pi / 2, 0)
        segs.append((s, pos, a, random.uniform(-1, 1), random.uniform(0.6, 1.4)))
    # cliffs + fire pit below
    dark = mat_pbr("Rock", (0.02, 0.02, 0.025, 1), 0.9)
    for sx in (-1, 1):
        cube((sx * 40, 0, -14), (11, 14, 16), dark, rot=(0, 0, 0.2 * sx))
    lava = mat_emit("Lava", (1, 0.28, 0.04, 1), 5)
    def lv(X, Y):
        return np.vectorize(lambda x, y: 1.5 * noise.noise(Vector((x * 0.08, y * 0.08, 0))))(X, Y)
    pit, PX, PY = grid(60, 60, 220, 220, lv, lava, "Lava")
    pit.location = (0, 0, -34)
    point_light((0, -4, -20), 40000, (1, 0.35, 0.1), 6)
    # riders: glowing silhouettes with fire swords marching across
    rid_m = mat_emit("Rider", (1, 0.4, 0.1, 1), 12)
    blk = mat_emit("Blk", (0, 0, 0, 1), 0)
    riders = []
    for i in range(14):
        b = cube((0, 0, 0), (0.7, 0.5, 1.4), blk)
        sw = cube((0, 0, 0), (0.08, 0.08, 1.6), rid_m)
        riders.append((b, sw, i))
    cam = camera((0, -70, 6), (0, 0, 14), 30)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        crack = (t - 0.45) / 0.55
        for s, pos, a, rnd, sp in segs:
            if crack > 0:
                d = crack ** 1.6
                # break order from the middle outward
                k = max(0.0, crack * 1.3 - abs(a - math.pi / 2) * 0.35)
                fall = ease(k) * 70 * sp
                s.location = (pos[0] + rnd * 6 * k, pos[1] + rnd * 3 * k, pos[2] - fall * k)
                s.rotation_euler = (rnd * 4 * k, a - math.pi / 2 + rnd * 2 * k, rnd * 3 * k)
            else:
                s.location = pos
        for b, sw, i in riders:
            u = (t * 0.9 + i * 0.045) % 1.0
            a = math.pi * (1 - u) * 0.0 + math.pi * u
            x = -math.cos(a) * R
            z = math.sin(a) * R + cz + 1.3
            vis = 0 if (crack > 0 and i % 3 == 0 and crack > 0.35) else 1
            drop = (crack * 60) if (crack > 0.3 and i % 2 == 0) else 0
            b.location = (x, -1.5 + (i % 3) * 0.6, z - drop)
            sw.location = (x + 0.9, -1.5 + (i % 3) * 0.6, z + 0.6 - drop)
            b.hide_render = sw.hide_render = not vis
        bg.inputs["Strength"].default_value = 0.7 + 0.5 * math.sin(t * 20) * (1 if crack > 0 else 0) ** 2
        cam.location = (math.sin(t * 1.5) * 10 - 6, -70 + t * 14, 6 + t * 4)
        look(cam, (0, 0, 14 + t * 2))
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


def shot_naglfar():
    """Naglfar, built from the nails of the dead, breaks loose on the flood."""
    sc = reset()
    NF = 8 * FPS
    bg = world((0.006, 0.01, 0.025, 1), (0.16, 0.055, 0.04, 1), 0.7)
    sea_m = mat_pbr("Sea", (0.01, 0.03, 0.05, 1), 0.25, 0.1)
    ocean, X, Y = grid(120, 120, 400, 400, lambda x, y: 0 * x, sea_m, "Sea")
    bone = mat_pbr("Bone", (0.75, 0.78, 0.8, 1), 0.5, emit=(0.4, 0.7, 0.8, 1), emit_strength=0.7)
    sail_m = mat_pbr("Sail", (0.55, 0.6, 0.62, 1), 0.7, emit=(0.5, 0.8, 0.9, 1), emit_strength=0.5)
    # hull: slanted layered boxes
    parts = []
    for i in range(14):
        u = i / 13
        w = 1.5 + 4.5 * math.sin(math.pi * (0.1 + 0.8 * u)) ** 0.6
        cube((0, lerp(-17, 17, u), 1.8 + 4 * (abs(u - 0.5) * 2) ** 2.2), (w, 1.5, 1.6), bone)
    cone((0, 19.5, 7.5), 1.2, 0.1, 9, bone, rot=(math.radians(-60), 0, 0))
    cone((0, -19.5, 7), 1.0, 0.1, 7, bone, rot=(math.radians(55), 0, 0))
    cyl((0, 0, 12), 0.55, 20, bone)
    sail = cube((0, 0.2, 14.5), (7.2, 0.1, 5.2), sail_m)
    cyl((0, 0, 20), 0.2, 9, bone, rot=(0, math.pi / 2, 0))
    # giants: crowd of small dark nails along deck + Loki at the helm
    dark = mat_emit("Dk", (0, 0, 0, 1), 0)
    red = mat_emit("Eye", (1, 0.15, 0.05, 1), 20)
    for i in range(34):
        x = random.uniform(-3, 3); y = random.uniform(-12, 12)
        cube((x, y, 5.2 + 0.4 * abs(y) * 0.02), (0.4, 0.3, 1.1 + random.random()), dark)
    loki = cube((0, 15.5, 8.2), (0.5, 0.4, 1.5), dark)
    sphere((0, 15.5, 10.1), 0.4, red, 8)
    point_light((0, 0, 24), 18000, (0.5, 0.8, 1), 6)
    sun_light(0.8, (math.radians(70), 0, math.radians(30)), (1, 0.5, 0.35))
    cam = camera((-55, -60, 10), (0, 0, 8), 32)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        time = f / FPS
        Z = 2.4 * np.sin(X * 0.05 + time * 1.8) * np.cos(Y * 0.04 + time * 1.2) + 0.9 * np.sin(X * 0.14 - time * 2.6 + Y * 0.07)
        set_verts_z(ocean, X, Y, Z)
        # ship rides the swell
        for o in bpy.data.objects:
            pass
        ang = t * 2 * math.pi * 0.28
        cam.location = (math.cos(ang - 2.4) * 78, math.sin(ang - 2.4) * 78 - 10, 9 + 3 * math.sin(t * 3))
        look(cam, (0, 0, 9))
        flash = 1.0 + (6.0 if (f % 47) in (0, 1, 2) else 0.0)
        bg.inputs["Strength"].default_value = 0.7 * flash
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


def shot_yggdrasil():
    """The world tree shakes."""
    sc = reset()
    NF = 8 * FPS
    bg = world((0.003, 0.006, 0.02, 1), (0.015, 0.07, 0.09, 1), 0.5)
    stars(200, 380, mat_emit("St", (.8, .95, 1, 1), 6))
    bark = mat_pbr("Bark", (0.12, 0.07, 0.04, 1), 0.9)
    leaf = mat_emit("Leaf", (0.5, 1.0, 0.45, 1), 2.5)
    gold = mat_emit("Gold", (1.0, 0.8, 0.3, 1), 3.5)
    root = []
    tree_parts = []

    def branch(p0, p1, r0, r1, m):
        d = Vector(p1) - Vector(p0)
        mid = (Vector(p0) + Vector(p1)) / 2
        o = cone(mid, r0, r1, d.length, m, v=10)
        o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
        tree_parts.append(o)
        return o

    def grow(p, dirv, length, r, depth):
        end = Vector(p) + dirv * length
        branch(p, end, r, r * 0.68, bark)
        if depth == 0:
            for _ in range(4):
                lf = sphere(end + Vector((random.uniform(-3, 3), random.uniform(-3, 3), random.uniform(-2, 3))),
                            random.uniform(2.2, 4.2), leaf if random.random() < 0.8 else gold, 8)
                tree_parts.append(lf)
            return
        n = 3 if depth > 1 else 2
        for k in range(n):
            a = (k / n) * 2 * math.pi + random.uniform(-0.5, 0.5)
            spread = random.uniform(0.4, 0.75)
            nd = (dirv + Vector((math.cos(a) * spread, math.sin(a) * spread, 0.35))).normalized()
            grow(end, nd, length * random.uniform(0.66, 0.8), r * 0.68, depth - 1)

    grow((0, 0, 0), Vector((0, 0, 1)), 26, 3.4, 4)
    for k in range(7):
        a = k / 7 * 2 * math.pi
        branch((0, 0, 4), (math.cos(a) * 16, math.sin(a) * 16, -7), 2.0, 0.3, bark)
    # glowing mist ground
    mist = mat_emit("Mist", (0.05, 0.3, 0.33, 1), 0.12)
    gnd, GX, GY = grid(40, 40, 300, 300, lambda x, y: -8 + 0 * x, mist, "Gnd")
    point_light((0, 0, 30), 60000, (1, 0.85, 0.5), 8)
    # falling leaves
    falling = [sphere((random.uniform(-26, 26), random.uniform(-26, 26), random.uniform(25, 90)), 0.35, leaf, 6)
               for _ in range(90)]
    base = {o: o.location.copy() for o in tree_parts}
    cam = camera((0, -150, 30), (0, 0, 40), 30)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        shake = (0.35 + 1.1 * math.exp(-((t - 0.55) ** 2) / 0.04)) * 0.9
        jx = math.sin(f * 1.9) * shake
        jy = math.cos(f * 2.3) * shake * 0.6
        for o in tree_parts:
            h = max(0.0, base[o].z) / 60.0
            o.location = (base[o].x + jx * h, base[o].y + jy * h, base[o].z)
        for i, lf in enumerate(falling):
            lf.location.z = (lf.location.z - (0.4 + 0.35 * (i % 5)) * (1 + 1.8 * shake)) % 95 - 8
            lf.location.x += math.sin(f * 0.07 + i) * 0.1
        ang = lerp(-0.4, 0.5, t)
        cam.location = (math.sin(ang) * 150, -math.cos(ang) * 150, lerp(10, 55, ease(t)))
        look(cam, (0, 0, lerp(30, 40, t)))
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


def shot_surtr():
    """Surtr hurls fire across the world."""
    sc = reset()
    NF = 8 * FPS
    bg = world((0.02, 0.003, 0.0, 1), (0.5, 0.1, 0.015, 1), 0.7)
    lava_m, ramp = mat_height_ramp("Lava", [(0.0, (0.05, 0.0, 0.0, 1)), (0.5, (0.9, 0.18, 0.02, 1)), (1.0, (1, 0.8, 0.2, 1))], -3, 3, 0.5)
    b = lava_m.node_tree.nodes["Principled BSDF"]
    lava_m.node_tree.links.new(ramp.outputs[0], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 3.0

    def terr(X, Y, time=0):
        return np.vectorize(lambda x, y: 3 * noise.noise(Vector((x * 0.035, y * 0.035 + time * 0.1, 0))) + 1.2 * noise.noise(Vector((x * 0.1, y * 0.1, time * 0.2))))(X, Y)

    field, X, Y = grid(100, 100, 360, 360, terr, lava_m, "Lava")
    black = mat_emit("Blk", (0.0, 0.0, 0.0, 1), 0)
    fire = mat_emit("Fire", (1, 0.55, 0.1, 1), 18)
    white = mat_emit("WH", (1, 0.95, 0.7, 1), 40)
    # Surtr: towering silhouette
    body = [cyl((-3.2, 0, 14), 2.0, 28, black), cyl((3.2, 0, 14), 2.0, 28, black),
            cube((0, 0, 38), (7.5, 3.5, 11), black),
            cube((-10, 0, 41), (3, 3, 10), black, rot=(0, 0.35, 0)), cube((10, 0, 41), (3, 3, 10), black, rot=(0, -0.35, 0)),
            sphere((0, 0, 54), 4.2, black, 16)]
    for sx in (-1, 1):
        cone((sx * 3.6, 0, 58.2), 1.2, 0.05, 7, black, rot=(0, sx * 0.5, 0))
    sphere((-1.4, -3.4, 54.4), 0.55, white, 6); sphere((1.4, -3.4, 54.4), 0.55, white, 6)
    sword_pivot = bpy.data.objects.new("Piv", None)
    bpy.context.collection.objects.link(sword_pivot)
    sword_pivot.location = (13, -2, 48)
    sw = cube((0, 0, 14), (0.7, 0.35, 15), white)
    sw.parent = sword_pivot
    flame = cube((0, 0, 14), (1.8, 1.0, 15.5), fire)
    flame.parent = sword_pivot
    point_light((13, -6, 52), 90000, (1, 0.5, 0.15), 4)
    point_light((0, -30, 30), 60000, (1, 0.3, 0.05), 8)
    embers = [cube((random.uniform(-90, 90), random.uniform(-90, 30), random.uniform(0, 90)), (0.25, 0.25, 0.25), fire) for _ in range(220)]
    vel = [(random.uniform(-0.3, 0.3), random.uniform(-0.2, 0.2), random.uniform(0.5, 1.7)) for _ in embers]
    cam = camera((0, -135, 6), (0, 0, 40), 30)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        time = f / FPS
        set_verts_z(field, X, Y, terr(X, Y, time))
        sword_pivot.rotation_euler = (0, lerp(-0.2, 1.05, ease(t * 1.3)), 0)
        for e, v in zip(embers, vel):
            e.location.x += v[0]; e.location.y += v[1]; e.location.z += v[2]
            if e.location.z > 100:
                e.location.z = 0
        bg.inputs["Strength"].default_value = lerp(0.5, 1.4, ease(t))
        cam.location = (math.sin(t * 1.4) * 30, -135 + t * 22, lerp(4, 30, ease(t)))
        look(cam, (0, 0, lerp(42, 36, t)))
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


def shot_rebirth():
    """The earth rises green from the sea."""
    sc = reset()
    NF = 10 * FPS
    bg = world((0.18, 0.4, 0.75, 1), (1.0, 0.75, 0.45, 1), 1.0)
    hill_m, ramp = mat_height_ramp("Hill", [(0.0, (0.08, 0.2, 0.05, 1)), (0.5, (0.12, 0.45, 0.1, 1)), (0.85, (0.3, 0.6, 0.2, 1)), (1.0, (0.85, 0.85, 0.8, 1))], -2, 14, 0.85)

    def hills(X, Y):
        return np.vectorize(lambda x, y: 9 * noise.noise(Vector((x * 0.012, y * 0.012, 4))) + 4 * noise.noise(Vector((x * 0.04, y * 0.04, 9))) + 5.5)(X, Y)

    land, X, Y = grid(130, 130, 520, 520, hills, hill_m, "Land")
    water_m = mat_pbr("Water", (0.03, 0.2, 0.3, 1), 0.08, 0.2)
    water = add(bpy.ops.mesh.primitive_plane_add, water_m, size=2000, location=(0, 0, 1.2))
    sunm = mat_emit("Sun", (1, 0.9, 0.6, 1), 14)
    sphere((0, 900, 90), 38, sunm, 32)
    sun_light(4.0, (math.radians(70), 0, math.radians(180)), (1, 0.85, 0.6))
    # eagle
    dark = mat_emit("Eagle", (0.02, 0.02, 0.02, 1), 0)
    ebody = cube((0, 0, 0), (0.5, 1.4, 0.35), dark)
    wl = cube((0, 0, 0), (2.6, 0.5, 0.08), dark)
    wr = cube((0, 0, 0), (2.6, 0.5, 0.08), dark)
    cam = camera((0, -170, 28), (0, 0, 10), 30)
    for f in FR(NF):
        t = f / (NF - 1)
        sc.frame_set(f)
        # land rises out of the sea
        rise = ease(t / 0.45)
        land.location.z = lerp(-26, -2, rise)
        # green fades in
        ramp.color_ramp.elements[0].color = lerp3((0.04, 0.03, 0.03), (0.08, 0.2, 0.05), ease((t - 0.1) / 0.5)) + (1,)
        bg.inputs["Strength"].default_value = lerp(0.5, 1.1, ease(t / 0.5))
        # eagle circles overhead
        a = t * 5
        ex, ey, ez = math.cos(a) * 45, 60 + math.sin(a) * 40, 38 + math.sin(a * 2) * 4
        flap = math.sin(f * 0.6) * 0.5
        ebody.location = (ex, ey, ez)
        look(ebody, (ex - math.sin(a), ey + math.cos(a) * 0.4, ez))
        wl.location = (ex - 2.6, ey, ez + flap * 1.2); wr.location = (ex + 2.6, ey, ez + flap * 1.2)
        wl.rotation_euler = (0, flap * 0.7, 0); wr.rotation_euler = (0, -flap * 0.7, 0)
        # camera: slow push then pull back
        d = lerp(170, 110, ease(t * 1.6)) if t < 0.62 else lerp(110, 190, ease((t - 0.62) / 0.38))
        cam.location = (math.sin(t * 1.2) * 18, -d, lerp(18, 34, ease(t)))
        look(cam, (0, 0, 12))
        sc.render.filepath = f"{OUT}/f{f:04d}.png"
        bpy.ops.render.render(write_still=True)


SHOTS = dict(eclipse=shot_eclipse, bifrost=shot_bifrost, naglfar=shot_naglfar,
             yggdrasil=shot_yggdrasil, surtr=shot_surtr, rebirth=shot_rebirth)

if __name__ == "__main__":
    import os
    os.makedirs(OUT, exist_ok=True)
    SHOTS[SHOT]()
