#!/bin/bash
cd /home/user/paul/ragnarok/web
export NODE_PATH=$(npm root -g 2>/dev/null):$PWD/node_modules
s=$1; e=$((s+480))
node render.js ../frames $s $e 24 2>&1 | grep -v flatShading | tail -2 >> ../work/render.log
echo "chunk $s done" >> ../work/render.log
