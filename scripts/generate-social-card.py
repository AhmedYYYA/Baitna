#!/usr/bin/env python3
"""Render the BAITNA 1200×630 social preview from its approved SVG mark.
Arabic and English are typeset in separate runs to avoid RTL/LTR mixing.
Run: python3 scripts/generate-social-card.py
"""
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, features
import cairosvg

ROOT=Path(__file__).resolve().parents[1]
SVG=ROOT/"assets"/"baitna-mark.svg"
OUT=ROOT/"assets"/"baitna-share-cover-v2.jpg"
assert features.check("raqm"),"Pillow RAQM is required for Arabic typography"
AR=[
 "/usr/share/fonts/truetype/noto/NotoKufiArabic-Medium.ttf",
 "/usr/share/fonts/truetype/noto/NotoKufiArabic-Regular.ttf",
 "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
]
LATIN=[
 "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
 "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
 "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
]
def load_font(options,size):
 for filename in options:
  if Path(filename).is_file():
   return ImageFont.truetype(filename,size,layout_engine=ImageFont.Layout.RAQM)
 raise RuntimeError("Missing Arabic or Latin fonts")

W,H=1200,630
img=Image.new("RGB",(W,H),(246,242,234))
d=ImageDraw.Draw(img)
# Contrast the approved bronze doorway against a brown field from BAITNA's palette.
d.rectangle((0,0,520,H),fill=(43,30,21))
d.rectangle((520,0,523,H),fill=(141,107,73))
d.line([(595,524),(1112,524)],fill=(204,186,160),width=2)
# Approved two-plane SVG at large thumbnail-readable size, without any surrounding shape.
logo=Image.open(BytesIO(cairosvg.svg2png(url=str(SVG),output_width=466,output_height=466))).convert("RGBA")
img.paste(logo,(28,83),logo)
ar_name=load_font(AR,94)
ar_tag=load_font(AR,49)
latin_name=load_font(LATIN,49)
latin_tag=load_font(LATIN,35)
ink=(59,42,29)
right=1115
d.text((right,96),"بيتنا",font=ar_name,fill=ink,anchor="ra",direction="rtl",language="ar")
tagline="ويبقى للبيت أثر"
d.text((right,228),tagline,font=ar_tag,fill=ink,anchor="ra",direction="rtl",language="ar")
# Some fallback Kufi fonts display a square for the terminal full stop in RTL.
# Draw the dot after the Arabic sentence, to its left.
left=d.textbbox((right,228),tagline,font=ar_tag,anchor="ra",direction="rtl",language="ar")[0]
d.ellipse((left-16,292,left-10,298),fill=ink)
d.line([(780,352),(1114,352)],fill=(182,138,87),width=3)
d.text((right,395),"B A I T N A",font=latin_name,fill=ink,anchor="ra",direction="ltr",language="en")
d.text((right,470),"A Home That Endures.",font=latin_tag,fill=(116,83,55),anchor="ra",direction="ltr",language="en")
OUT.parent.mkdir(parents=True,exist_ok=True)
img.save(OUT,"JPEG",quality=90,optimize=True,progressive=True,subsampling=0)
assert Image.open(OUT).size==(W,H)
print("BAITNA share card:",W,H,OUT.stat().st_size,"bytes")
