#!/usr/bin/env python3
"""
סידור תמונות וסרטונים לפי תאריך ומיקום.

מבנה התוצאה:
    <יעד>/
      2026/
        08 - אוגוסט/
          2026-08-14 - Tel Aviv/
            2026-08-14_18-32-05.jpg
      צילומי מסך/2026/08 - אוגוסט/...
      וואטסאפ/2026/08 - אוגוסט/...
      כפילויות/...
      ללא תאריך/...

ברירת המחדל היא מצב ניסיון: שום קובץ לא זז, רק מודפס מה היה קורה.
    python organize_photos.py <מקור> <יעד>            # ניסיון בלבד
    python organize_photos.py <מקור> <יעד> --apply    # העתקה בפועל (המקור נשאר)
    python organize_photos.py <מקור> <יעד> --apply --move   # העברה במקום העתקה

הקבצים לא נמחקים אף פעם. כפילויות זהות מועברות/מועתקות לתיקיית "כפילויות".
"""

import argparse
import csv
import hashlib
import os
import re
import shutil
import sys
import time
import json
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime

try:
    from PIL import Image, ExifTags
    try:
        from pillow_heif import register_heif_opener  # תמיכה ב-HEIC (אופציונלי)
        register_heif_opener()
    except ImportError:
        pass
except ImportError:
    Image = None

try:
    import reverse_geocoder  # המרת GPS לשם עיר, אופליין (אופציונלי)
except ImportError:
    reverse_geocoder = None

PHOTO_EXT = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".gif", ".dng", ".bmp"}
VIDEO_EXT = {".mp4", ".mov", ".3gp", ".mkv", ".webm", ".avi", ".m4v"}
MEDIA_EXT = PHOTO_EXT | VIDEO_EXT

HEB_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
              "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]

# שמות קבצים נפוצים באנדרואיד: IMG_20260814_183205, PXL_20260814_183205123,
# VID_20260814_183205, Screenshot_20260814-183205, IMG-20260814-WA0001, 20260814_183205
NAME_DT = re.compile(r"(20\d{2})[-_]?(\d{2})[-_]?(\d{2})[-_ ]?(\d{2})[-_.]?(\d{2})[-_.]?(\d{2})")
NAME_D = re.compile(r"(20\d{2})[-_]?(\d{2})[-_]?(\d{2})")

TAGS = {v: k for k, v in ExifTags.TAGS.items()} if Image else {}
GPS_IFD = 0x8825
EXIF_IFD = 0x8769


def category_of(path):
    n = os.path.basename(path).lower()
    p = path.lower()
    if "screenshot" in n or "screen_recording" in n or "screenshots" in p:
        return "צילומי מסך"
    if "-wa" in n or "whatsapp" in p:
        return "וואטסאפ"
    if os.path.splitext(n)[1] in VIDEO_EXT:
        return "סרטונים"
    return None  # תמונה רגילה -> תיקייה ראשית


def _dms(v, ref):
    try:
        d, m, s = (float(x) for x in v)
        val = d + m / 60 + s / 3600
        return -val if ref in ("S", "W") else val
    except Exception:
        return None


def read_exif(path):
    """מחזיר (datetime או None, (lat, lon) או None)."""
    if Image is None or os.path.splitext(path)[1].lower() not in PHOTO_EXT:
        return None, None
    try:
        with Image.open(path) as im:
            exif = im.getexif()
            if not exif:
                return None, None
            sub = exif.get_ifd(EXIF_IFD)
            raw = sub.get(TAGS["DateTimeOriginal"]) or sub.get(TAGS["DateTimeDigitized"]) \
                or exif.get(TAGS["DateTime"])
            dt = None
            if raw:
                try:
                    dt = datetime.strptime(str(raw).strip()[:19], "%Y:%m:%d %H:%M:%S")
                except ValueError:
                    dt = None
            gps = exif.get_ifd(GPS_IFD)
            loc = None
            if gps and 2 in gps and 4 in gps:
                lat = _dms(gps[2], gps.get(1, "N"))
                lon = _dms(gps[4], gps.get(3, "E"))
                if lat is not None and lon is not None and not (lat == 0 and lon == 0):
                    loc = (lat, lon)
            return dt, loc
    except Exception:
        return None, None


def date_from_name(name):
    m = NAME_DT.search(name)
    if m:
        try:
            return datetime(*map(int, m.groups()))
        except ValueError:
            pass
    m = NAME_D.search(name)
    if m:
        try:
            return datetime(*map(int, m.groups()))
        except ValueError:
            pass
    return None


def sha1(path, chunk=1 << 20):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        while True:
            b = f.read(chunk)
            if not b:
                break
            h.update(b)
    return h.hexdigest()


_place_cache = {}


def online_place(lat, lon):
    """שם עיר בעברית מ-OpenStreetMap. בקשה אחת לכל אזור של ~5 ק"מ, לפי מדיניות השירות."""
    key = (round(lat * 20) / 20, round(lon * 20) / 20)
    if key in _place_cache:
        return _place_cache[key]
    name = None
    try:
        q = urllib.parse.urlencode({"lat": key[0], "lon": key[1], "format": "json",
                                    "zoom": 10, "accept-language": "he"})
        req = urllib.request.Request("https://nominatim.openstreetmap.org/reverse?" + q,
                                     headers={"User-Agent": "photo-organizer-script/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            a = json.load(r).get("address", {})
        name = a.get("city") or a.get("town") or a.get("village") or a.get("municipality") \
            or a.get("county") or a.get("state") or a.get("country")
    except Exception:
        pass
    time.sleep(1.1)
    _place_cache[key] = name
    return name


def safe(s):
    return re.sub(r'[\\/:*?"<>|]+', "-", s).strip() or "לא ידוע"


def unique_path(path, taken):
    base, ext = os.path.splitext(path)
    i = 1
    cand = path
    while cand in taken or os.path.exists(cand):
        cand = f"{base}_{i}{ext}"
        i += 1
    taken.add(cand)
    return cand


def scan(src, dest):
    dest_abs = os.path.abspath(dest)
    for root, dirs, files in os.walk(src):
        if os.path.abspath(root).startswith(dest_abs):
            dirs[:] = []
            continue
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != ".thumbnails"]
        for f in files:
            if os.path.splitext(f)[1].lower() in MEDIA_EXT and not f.startswith("."):
                yield os.path.join(root, f)


def main():
    ap = argparse.ArgumentParser(description="סידור תמונות לפי תאריך ומיקום")
    ap.add_argument("paths", nargs="+", help="תיקיית מקור אחת או יותר, ואחרונה - תיקיית היעד")
    ap.add_argument("--apply", action="store_true", help="לבצע בפועל (בלי זה: ניסיון בלבד)")
    ap.add_argument("--move", action="store_true", help="להעביר במקום להעתיק")
    ap.add_argument("--no-location", action="store_true", help="לא להוסיף שם מקום לתיקיית היום")
    ap.add_argument("--online-places", action="store_true",
                    help="שמות ערים בעברית דרך OpenStreetMap (שולח קואורדינטות מעוגלות לשירות)")
    args = ap.parse_args()
    if len(args.paths) < 2:
        ap.error("צריך לפחות תיקיית מקור אחת ותיקיית יעד")
    sources, args.dest = args.paths[:-1], args.paths[-1]
    files = []
    for src in sources:
        if not os.path.isdir(src):
            sys.exit(f"תיקיית המקור לא קיימת: {src}")
        files.extend(scan(src, args.dest))
    print(f"נמצאו {len(files)} קבצי מדיה. קורא תאריכים ומיקומים...")

    items = []
    for i, p in enumerate(files, 1):
        dt, loc = read_exif(p)
        source = "exif" if dt else None
        if not dt:
            dt = date_from_name(os.path.basename(p))
            source = "name" if dt else None
        if not dt:
            dt = datetime.fromtimestamp(os.path.getmtime(p))
            source = "mtime"
        items.append({"path": p, "dt": dt, "loc": loc, "dt_src": source})
        if i % 500 == 0:
            print(f"  {i}/{len(files)}")

    # שם עיר לכל מיקום (בבת אחת, אופליין)
    place_of = {}
    if not args.no_location and reverse_geocoder:
        coords = [it["loc"] for it in items if it["loc"]]
        if coords:
            res = reverse_geocoder.search(coords, mode=1, verbose=False)
            k = 0
            for it in items:
                if it["loc"]:
                    place_of[id(it)] = res[k]["name"]
                    k += 1
    elif not args.no_location and args.online_places:
        locs = [it for it in items if it["loc"]]
        print(f"מאתר שמות מקומות עבור {len(locs)} תמונות עם GPS...")
        for it in locs:
            name = online_place(*it["loc"])
            if name:
                place_of[id(it)] = name
    elif not args.no_location and any(it["loc"] for it in items):
        print("טיפ: הוסף --online-places כדי לקבל שמות ערים בתיקיות.")

    # שם מקום ליום = העיר השכיחה ביותר באותו יום
    day_places = defaultdict(Counter)
    for it in items:
        if id(it) in place_of:
            day_places[it["dt"].date()][place_of[id(it)]] += 1

    seen_hash = {}
    taken = set()
    plan = []
    for it in sorted(items, key=lambda x: x["dt"]):
        p, dt = it["path"], it["dt"]
        ext = os.path.splitext(p)[1].lower()
        if ext == ".jpeg":
            ext = ".jpg"
        h = sha1(p)
        month = f"{dt.month:02d} - {HEB_MONTHS[dt.month - 1]}"
        cat = category_of(p)

        if h in seen_hash:
            folder = os.path.join(args.dest, "כפילויות")
            reason = "כפילות של " + os.path.basename(seen_hash[h])
        elif it["dt_src"] == "mtime" and cat is None:
            folder = os.path.join(args.dest, "ללא תאריך מדויק", str(dt.year), month)
            reason = "תאריך לפי זמן שינוי הקובץ"
        elif cat:
            folder = os.path.join(args.dest, cat, str(dt.year), month)
            reason = cat
        else:
            day = dt.strftime("%Y-%m-%d")
            places = day_places.get(dt.date())
            if places:
                top = [n for n, _ in places.most_common(2)]
                day += " - " + safe(" + ".join(top))
            folder = os.path.join(args.dest, str(dt.year), month, day)
            reason = "exif" if it["dt_src"] == "exif" else "תאריך משם הקובץ"
        seen_hash.setdefault(h, p)

        new_name = dt.strftime("%Y-%m-%d_%H-%M-%S") + ext
        target = unique_path(os.path.join(folder, new_name), taken)
        plan.append((p, target, reason, it["loc"]))

    # סיכום
    print()
    by_top = Counter(os.path.relpath(t, args.dest).split(os.sep)[0] for _, t, _, _ in plan)
    for k, v in sorted(by_top.items()):
        print(f"  {k}: {v}")
    for s, t, r, _ in plan[:15]:
        print(f"  {os.path.basename(s)}  ->  {os.path.relpath(t, args.dest)}")
    if len(plan) > 15:
        print(f"  ... ועוד {len(plan) - 15}")

    os.makedirs(args.dest, exist_ok=True)
    log = os.path.join(args.dest, "organize_log.csv")
    with open(log, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["מקור", "יעד", "סיבה", "קו רוחב", "קו אורך"])
        for s, t, r, loc in plan:
            w.writerow([s, t, r, *(loc or ("", ""))])

    if not args.apply:
        print(f"\nמצב ניסיון - שום קובץ לא הועבר. התוכנית המלאה: {log}")
        print("כדי לבצע בפועל הוסף --apply (ו---move כדי להעביר במקום להעתיק).")
        return

    op = shutil.move if args.move else shutil.copy2
    for i, (s, t, _, _) in enumerate(plan, 1):
        os.makedirs(os.path.dirname(t), exist_ok=True)
        op(s, t)
        if i % 500 == 0:
            print(f"  {i}/{len(plan)}")
    print(f"\nבוצע: {len(plan)} קבצים {'הועברו' if args.move else 'הועתקו'}. יומן: {log}")


if __name__ == "__main__":
    main()
