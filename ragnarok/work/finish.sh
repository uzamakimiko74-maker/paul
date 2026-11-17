#!/bin/bash
cd /home/user/paul/ragnarok
log=work/finish.log
echo "start $(date)" >> $log
# 1) wait for the fixed eclipse, then swap it in
until [ "$(ls clips/raw/eclipse_new 2>/dev/null | wc -l)" -ge 192 ]; do sleep 20; done
sleep 5
if [ ! -d clips/raw/eclipse_old ]; then mv clips/raw/eclipse clips/raw/eclipse_old && mv clips/raw/eclipse_new clips/raw/eclipse; fi
echo "eclipse swapped $(date)" >> $log
# 2) chapter 3 and 4 chunks (everything that only needs eclipse/naglfar/bifrost/yggdrasil)
grep -E '^(6000|6480|6960|7440|7920|8400)$' work/chunks_b.txt > work/chunks_b1.txt
python3 - <<'P'
b=[int(x) for x in open('/home/user/paul/ragnarok/work/chunks_b.txt').read().split()]
b1=[c for c in b if c<372*24]; b2=[c for c in b if c>=372*24]
open('/home/user/paul/ragnarok/work/chunks_b1.txt','w').write('\n'.join(map(str,b1))+'\n')
open('/home/user/paul/ragnarok/work/chunks_b2.txt','w').write('\n'.join(map(str,b2))+'\n')
P
cat work/chunks_b1.txt | xargs -P3 -n1 work/runchunk.sh
echo "b1 done $(date)" >> $log
# 3) wait for surtr + rebirth, then the last chunks
until grep -q surtr clips/raw/progress.txt && grep -q rebirth clips/raw/progress.txt; do sleep 20; done
cat work/chunks_b2.txt | xargs -P4 -n1 work/runchunk.sh
echo "b2 done $(date)" >> $log
# 4) top up anything missing, then encode
for pass in 1 2; do for s in $(seq 0 480 17279); do work/runchunk.sh $s; done; done
n=$(ls frames/*.jpg | wc -l); echo "frames $n" >> $log
ffmpeg -y -loglevel error -framerate 24 -i frames/%06d.jpg -i work/mix.wav -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out/ragnarok_long_form.mp4 && echo "encoded $(date)" >> $log
ffprobe -v error -show_entries format=duration,size -of csv=p=0 out/ragnarok_long_form.mp4 >> $log
echo FINISHED >> $log
