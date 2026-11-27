import bpy, math, colorsys
s=bpy.context.scene
bpy.ops.wm.read_factory_settings(use_empty=True); s=bpy.context.scene
s.render.resolution_x,s.render.resolution_y=1080,1920
s.render.fps=30; s.frame_end=180
s.render.engine='BLENDER_WORKBENCH'
sh=s.display.shading; sh.light='STUDIO'; sh.color_type='OBJECT'; sh.show_shadows=True; sh.show_cavity=True
s.render.film_transparent=False
s.world=bpy.data.worlds.new("w"); s.world.color=(0.01,0.01,0.03)
N=9
for i in range(N):
  for j in range(N):
    bpy.ops.mesh.primitive_cube_add(size=0.9,location=(i-N/2+.5,j-N/2+.5,0))
    o=bpy.context.object; d=math.hypot(i-N/2+.5,j-N/2+.5)
    o.color=(*colorsys.hsv_to_rgb((d/7)%1,.85,1),1)
    for f in range(0,181,5):
      o.location.z=math.sin(f/30*math.pi*1.5-d*.9)*1.2
      o.rotation_euler.z=f/180*math.pi*2+d*.2
      o.keyframe_insert("location",index=2,frame=f); o.keyframe_insert("rotation_euler",index=2,frame=f)
bpy.ops.object.camera_add(location=(13,-13,13)); c=bpy.context.object; s.camera=c
t=c.constraints.new('TRACK_TO'); bpy.ops.object.empty_add(); t.target=bpy.context.object
c.data.lens=40
for f,a in((0,0),(180,math.pi/2)):
  s.frame_set(f); r=18; c.location=(r*math.cos(a-math.pi/4),r*math.sin(a-math.pi/4),14); c.keyframe_insert("location",frame=f)
s.render.image_settings.file_format='FFMPEG'; s.render.ffmpeg.format='MPEG4'; s.render.ffmpeg.codec='H264'
s.render.filepath='/home/user/paul/video/raw.mp4'
bpy.ops.render.render(animation=True)
