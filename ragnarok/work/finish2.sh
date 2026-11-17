#!/bin/bash
cd /home/user/paul/ragnarok
log=work/finish2.log; echo "start $(date)" > $log
until grep -q rebirth clips/raw/progress.txt; do sleep 15; done
if [ ! -d clips/raw/eclipse_old ]; then mv clips/raw/eclipse clips/raw/eclipse_old && mv clips/raw/eclipse_new clips/raw/eclipse; fi
echo "blender ready $(date)" >> $log
TOTAL=$(python3 -c "import json;print(int(json.load(open('work/timeline.json'))['total']*24)+1)")
rm -rf frames; mkdir -p frames
seq 0 480 $((TOTAL-1)) | xargs -P4 -n1 work/runchunk.sh
echo "chunks done $(date)" >> $log
for pass in 1 2; do for s in $(seq 0 480 $((TOTAL-1))); do work/runchunk.sh $s; done; done
echo "frames $(ls frames/*.jpg | wc -l) of $TOTAL" >> $log
ffmpeg -y -loglevel error -framerate 24 -i frames/%06d.jpg -i work/mix.wav -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/ragnarok_long_form.mp4 && echo "encoded $(date)" >> $log
ffprobe -v error -show_entries format=duration,size -of csv=p=0 out/ragnarok_long_form.mp4 >> $log
echo FINISHED >> $log
