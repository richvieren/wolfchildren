#!/bin/bash
# snap.sh — snapshot the built pages section by section, at 390 and 1280 wide.
# Steppa method: build one section, snapshot it, a human reviews the PNG.
#
#   ./snap.sh                     every section of every page
#   ./snap.sh hero                only sections whose file name contains "hero"
#   ./snap.sh --page              the full page instead of sections
#
# Output: snapshots/<page>--<nn>-<section>--{390,1280}.png and a contact sheet
# snapshots/<page>--contact.png. Uses headless Chrome; the 390 capture goes
# through an iframe wrapper because headless Chrome will not open a window
# narrower than about 500 px.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8765
OUT="$ROOT/snapshots"
FILTER="${1:-}"
mkdir -p "$OUT"

node "$ROOT/build.mjs" --sections >/dev/null

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/dev/null 2>&1 &
HTTPD=$!
trap 'kill $HTTPD 2>/dev/null || true' EXIT
until curl -s -o /dev/null "http://127.0.0.1:$PORT/"; do sleep 0.2; done

shoot() { # url name
  local url="$1" name="$2" wrap="$OUT/.wrap-$name.html"
  printf '<!doctype html><html><body style="margin:0;background:#fff"><iframe src="%s" style="display:block;width:390px;height:6000px;border:0"></iframe></body></html>' "$url" > "$wrap"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=600,6000 --screenshot="$OUT/.raw-$name-390.png" "file://$wrap" 2>/dev/null
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,6000 --screenshot="$OUT/.raw-$name-1280.png" "$url" 2>/dev/null
  python3 - "$OUT" "$name" <<'EOF'
import sys; from PIL import Image
out,name=sys.argv[1],sys.argv[2]
def trim(im):
    w,h=im.size; px=im.load(); bg=(0xDF,0xD7,0xC3); last=0
    for y in range(h-1,-1,-1):
        if any(sum(abs(a-b) for a,b in zip(px[x,y][:3],bg))>12 for x in range(0,w,max(1,w//48))): last=y; break
    return im.crop((0,0,w,min(h,last+48)))
m=Image.open(f"{out}/.raw-{name}-390.png").convert("RGB").crop((0,0,390,6000)); trim(m).save(f"{out}/{name}--390.png")
d=Image.open(f"{out}/.raw-{name}-1280.png").convert("RGB"); trim(d).save(f"{out}/{name}--1280.png")
EOF
  rm -f "$wrap" "$OUT/.raw-$name-390.png" "$OUT/.raw-$name-1280.png"
  echo "  $name  →  $(python3 -c "from PIL import Image;a=Image.open('$OUT/$name--390.png');b=Image.open('$OUT/$name--1280.png');print(f'390×{a.height}  1280×{b.height}')")"
}

if [ "$FILTER" = "--page" ]; then
  for f in "$ROOT"/src/pages/*.mjs; do
    slug="$(basename "$f" .mjs)"
    shoot "http://127.0.0.1:$PORT/readings/$slug/" "$slug--page"
  done
  exit 0
fi

for f in "$OUT"/sections/*.html; do
  name="$(basename "$f" .html)"
  [ -n "$FILTER" ] && [[ "$name" != *"$FILTER"* ]] && continue
  shoot "http://127.0.0.1:$PORT/snapshots/sections/$name.html" "$name"
done

# contact sheet per page: every section at 1280, stacked, labelled
python3 - "$OUT" <<'EOF'
import sys,glob,os; from PIL import Image, ImageDraw
out=sys.argv[1]
pages={}
for f in sorted(glob.glob(f"{out}/*--1280.png")):
    n=os.path.basename(f)[:-len("--1280.png")]
    if "--page" in n: continue
    pages.setdefault(n.split("--")[0],[]).append((n,f))
for slug,items in pages.items():
    ims=[(n,Image.open(f).convert("RGB")) for n,f in items]
    W=640; rows=[]; H=0
    for n,im in ims:
        h=round(im.height*W/im.width); rows.append((n,im.resize((W,h)))); H+=h+28
    sheet=Image.new("RGB",(W,H),(255,255,255)); d=ImageDraw.Draw(sheet); y=0
    for n,im in rows:
        d.text((8,y+6),n,fill=(0,0,0)); y+=28; sheet.paste(im,(0,y)); y+=im.height
    sheet.save(f"{out}/{slug}--contact.png"); print(f"  contact sheet: snapshots/{slug}--contact.png ({len(rows)} sections)")
EOF
ls -la "$OUT"/*.png | awk '{print $6, $7, $8, $9}' | sed "s|$OUT/||"
