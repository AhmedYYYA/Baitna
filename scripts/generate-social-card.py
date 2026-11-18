#!/usr/bin/env python3
"""Render the BAITNA 1200×630 social card from the approved SVG logo."""
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cairosvg
ROOT=Path(__file__).resolve().parents[1]
SVG=ROOT/"assets"/"baitna-mark.svg"
OUT=ROOT/"assets"/"baitna-share-cover.jpg"
AR=["/usr/share/fonts/truetype/noto/NotoKufiArabic-Regular.ttf","/usr/share/fonts/truetype/noto/NotoKufiArabic-Medium.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
EN=["/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf","/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"]
def font(options,size):
    for f in options:
        if Path(f).exists():return ImageFont.truetype(str(f),size,layout_engine=ImageFont.Layout.RAQM)
    raise RuntimeError("Missing fonts; install fonts-noto-core/fonts-liberation")
W,H=1200,630
im=Image.new("RGB",(W,H),(246,242,234))
pixels=im.load()
for y in range(H):
    for x in range(W):
        k=x/W*.43+y/H*.16
        pixels[x,y]=(min(255,int(246+3*k)),min(255,int(242+k)),234)
d=ImageDraw.Draw(im)
d.line([(78,535),(1120,535)],fill="#DBCCBA",width=2)
d.line([(408,125),(408,494)],fill="#D4C2AD",width=2)
logo=Image.open(BytesIO(cairosvg.svg2png(url=str(SVG),output_width=255,output_height=255))).convert("RGBA")
im.paste(logo,(95,181),logo)
kufi=font(AR,75);arabic=font(AR,46);english=font(EN,44);english_tag=font(EN,31)
right=1115
d.text((right,107),"بيتنا",fill="#34271D",font=kufi,anchor="ra",direction="rtl",language="ar")
tag="ويبقى للبيت أثر"
d.text((right,210),tag,fill="#34271D",font=arabic,anchor="ra",direction="rtl",language="ar")
left=d.textbbox((right,210),tag,font=arabic,anchor="ra",direction="rtl",language="ar")[0]
# Place the Arabic period on the left; the current fallback font lacks that glyph.
d.ellipse((left-11,262,left-5,268),fill="#34271D")
d.line([(765,317),(1115,317)],fill="#B68A57",width=2)
d.text((1115,349),"B A I T N A",fill="#6B5140",font=english,anchor="ra",direction="ltr",language="en")
d.text((1115,418),"A Home That Endures.",fill="#946D45",font=english_tag,anchor="ra",direction="ltr",language="en")
OUT.parent.mkdir(parents=True,exist_ok=True)
im.save(OUT,"JPEG",quality=84,subsampling=0,optimize=True,progressive=True)
print("BAITNA social card",W,H,OUT.stat().st_size)
