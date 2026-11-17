#!/bin/bash
# render all hero shots (two at a time), then encode each to an mp4
cd /home/user/paul/ragnarok
r(){ blender -b --python blender_shots.py -- $1 clips/raw/$1 1280 720 > clips/raw/$1.log 2>&1 && ffmpeg -y -loglevel error -framerate 24 -i clips/raw/$1/f%04d.png -c:v libx264 -crf 15 -pix_fmt yuv420p clips/$1.mp4 && echo done $1 >> clips/raw/progress.txt; }
( r eclipse; r naglfar; r surtr ) &
( r bifrost; r yggdrasil; r rebirth ) &
wait
