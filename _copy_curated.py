"""Copy curated image subset from _extracted/word/media/ to site/img/"""
import os, shutil

SRC = r"C:/Stuff/!Startup/cynthia-portfolio/cynthia portfolio/_extracted/word/media"
DST = r"C:/Stuff/!Startup/cynthia-portfolio/img"
RESUME_SRC = r"C:/Stuff/!Startup/cynthia-portfolio/cynthia portfolio/CYNTHIA RESUME-1.pdf"
RESUME_DST = r"C:/Stuff/!Startup/cynthia-portfolio/CynthiaWang_Resume.pdf"

JPG_IDS = {5,20,26,30,36,46,48,49,53,77,78,88,90,97,98,100,107,108,114,118,122,124,129,130,137,149,150,152,157,164,170,176,181,199,206,209,211,212,215,218,219,220,233,235,239,246,247,252,254,282,307,309,314,317,332,336,337,338,342,349,350,351,353,354,355,356}

CURATED = {
    # WEB (8)
    'web': [121, 143, 226, 158, 144, 171, 91, 41],
    # GAME (25)
    'game_featured': [132, 106, 180],
    'game_assets': [117, 37, 54, 113, 86, 217, 208, 251, 312, 352],
    'game_grid': [125, 92, 315, 200, 245, 311, 291, 89, 326, 156, 193, 197],
    # UX (20)
    'ux_featured': [355, 71, 187],
    'ux_album': [317, 166, 281],
    'ux_poster': [271],
    'ux_grid': [69, 20, 286, 95, 45, 344, 259, 16, 22, 320, 127, 305, 174],
    # PHOTO (22)
    'photo_featured': [282, 283, 191],
    'photo_portraits': [209, 330, 247, 211, 252, 354],
    'photo_arch': [85, 244, 318, 73, 316, 10],
    'photo_land': [72, 255, 82, 302, 347, 329, 284],
    'photo_bw': [138, 235],
}

os.makedirs(DST, exist_ok=True)

all_ids = set()
for bucket, ids in CURATED.items():
    for i in ids:
        all_ids.add(i)

copied = 0
missing = []
for i in sorted(all_ids):
    ext = 'jpg' if i in JPG_IDS else 'png'
    src_path = os.path.join(SRC, f"image{i}.{ext}")
    dst_path = os.path.join(DST, f"image{i}.{ext}")
    # try swap ext if missing
    if not os.path.exists(src_path):
        alt = 'png' if ext == 'jpg' else 'jpg'
        alt_path = os.path.join(SRC, f"image{i}.{alt}")
        if os.path.exists(alt_path):
            ext = alt
            src_path = alt_path
            dst_path = os.path.join(DST, f"image{i}.{ext}")
        else:
            missing.append(i)
            continue
    shutil.copy2(src_path, dst_path)
    copied += 1

# Copy resume
shutil.copy2(RESUME_SRC, RESUME_DST)

total_size = sum(os.path.getsize(os.path.join(DST,f)) for f in os.listdir(DST))
print(f"Copied {copied} images. Total: {total_size/1024/1024:.1f} MB")
if missing:
    print(f"MISSING: {missing}")
print(f"Resume copied to {RESUME_DST}")
