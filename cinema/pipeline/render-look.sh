#!/usr/bin/env bash
# Primer corte. Escala y recorta jea-cover.jpg. No retoca el rostro.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/media/photo/nsy-001-balcony.jpg"
FONT="$ROOT/fonts/PlayfairDisplay-Regular.ttf"
OUT="$ROOT/media/video/nsy-001-look.mp4"
DUR=36
test -f "$SRC"
test -f "$FONT"

ALPHA="if(lt(t\,2.2)\,0\,if(lt(t\,4.2)\,(t-2.2)/2\,if(lt(t\,8.2)\,1\,if(lt(t\,11)\,(11-t)/2.8\,if(lt(t\,28)\,0\,if(lt(t\,30)\,(t-28)/2\,if(lt(t\,33)\,1\,if(lt(t\,35.5)\,(35.5-t)/2.5\,0))))))))"

ffmpeg -y -loglevel error \
  -loop 1 -framerate 24 -i "$SRC" \
  -vf "scale=1920:-2,crop=1920:1080:0:min(70*t/${DUR}\,ih-oh),format=yuv420p,fade=t=in:st=0:d=2.8:color=black,fade=t=out:st=32:d=4:color=black,drawtext=fontfile=${FONT}:text='NOW\,':fontsize=54:fontcolor=0xE8E0D0:x=(w-text_w)/2:y=h-150:alpha='${ALPHA}',drawtext=fontfile=${FONT}:text='SEE YOURSELF':fontsize=54:fontcolor=0xE8E0D0:x=(w-text_w)/2:y=h-86:alpha='${ALPHA}'" \
  -t "$DUR" -r 24 -an \
  -c:v libx264 -preset medium -tune stillimage -crf 20 -pix_fmt yuv420p -movflags +faststart \
  "$OUT"

ffprobe -v error -show_entries format=duration:stream=width,height,codec_name,nb_frames -of default=nw=1 "$OUT"
