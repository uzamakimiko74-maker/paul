#!/bin/bash
# Cut a long film into chapter-aligned parts that each fit the 15 MB artifact-file limit.
# usage: encode_parts.sh <frames_dir> <mix.wav> <fps> "<name:startFrame:numFrames:audioStartSec:audioSec:videoKbps> ..."
# example (12:05 film, 3 parts): encode_parts.sh frames work/mix.wav 24 "part1:0:7290:0:303.75:290 part2:7290:5607:303.75:233.625:400 part3:12897:4517:537.375:188.2:520"
# Budget: (14 MB*8 - audio kbps*sec) / sec  ->  keep each part <= 14.0 MB. 854x480 H.264 Main + AAC 64k holds up for flat cartoon art.
F=$1; A=$2; FPS=$3; shift 3
for spec in $1; do IFS=: read n f0 nf a0 at vb <<< "$spec"
 ffmpeg -y -loglevel error -framerate $FPS -start_number $f0 -i $F/%06d.jpg -ss $a0 -t $at -i $A -frames:v $nf -vf "scale=854:480:flags=lanczos" \
  -c:v libx264 -preset slow -profile:v main -level 3.1 -crf 27 -maxrate ${vb}k -bufsize $((vb*2))k -pix_fmt yuv420p -g 48 \
  -c:a aac -b:a 64k -ar 44100 -ac 2 -movflags +faststart $n.mp4 &
done; wait; ls -la *.mp4
