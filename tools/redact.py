"""Blur a report screenshot for the portfolio.

Everything is blurred by default. Only words on the SAFE list (interface labels such as
page names, filter names, chart titles and column headers) are restored sharp, so a word
the text recogniser misses simply stays blurred. Logos and brand graphics are covered with
flat boxes you pass in as `covers`. Always run leak_test() on the output and look at it
before publishing.

Needs: Python 3, Pillow, pytesseract and the Tesseract OCR engine.

Example:
    from redact import redact, leak_test
    redact("raw.png", "assets/projects/name.webp", covers=[(35, 16, 210, 66, (255, 255, 255))])
    print(leak_test("assets/projects/name.webp"))   # expect [] or only gibberish
Never commit the raw screenshots.
"""
import re, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont
import pytesseract
from pytesseract import Output

# Interface labels that may stay sharp. Everything else is blurred.
SAFE = set("""execution performance opportunity quota customer 360 geography time period segment account type view by clear filters reset
region territory id name rep week ending month parent site of care status all multiple selections avg calls per day target reach call
frequency programs speaker total sites reached shipped doses growth vs prev r3m ordering trend channel freq program summary engagement
overview info overall soc actuals goals perf variance previous to date weekly monthly quarterly welcome select go and share volume mix
class today tomorrow active onboarded pmfs pmf search contacts phone email contracting details orders locations order number calibration
dose site timezone shipped at cancelled click send operations alternate planning refresh last address city state zip code days since
billing entity run batch size distance mi year actual goal versus""".split())
def norm(w): return re.sub(r"[^a-z0-9]", "", w.lower())
def safe_word(w):
    n = norm(w)
    return n == "" or n in SAFE or n in {"&", "%"}

def redact(src, dst, covers=(), blur=11):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    big = im.resize((W * 2, H * 2), Image.LANCZOS)
    d = pytesseract.image_to_data(big, output_type=Output.DICT, config="--psm 11")
    d2 = pytesseract.image_to_data(big, output_type=Output.DICT, config="--psm 3")
    out = im.filter(ImageFilter.GaussianBlur(blur))
    restored = []
    # line-level rule: restore whitelisted words only on lines that are mostly interface labels
    for D in (d2,):
        lines = {}
        for i, w in enumerate(D["text"]):
            if not w.strip() or float(D["conf"][i]) < 55: continue
            key = (D["block_num"][i], D["par_num"][i], D["line_num"][i])
            lines.setdefault(key, []).append(i)
        for key, idx in lines.items():
            words = [D["text"][i] for i in idx]
            ok = [safe_word(w) for w in words]
            if sum(ok) / len(ok) < 0.6: continue
            for i, good in zip(idx, ok):
                if not good or not norm(D["text"][i]): continue
                x, y, w, h = [v // 2 for v in (D["left"][i], D["top"][i], D["width"][i], D["height"][i])]
                box = (max(0, x - 2), max(0, y - 2), min(W, x + w + 2), min(H, y + h + 2))
                out.paste(im.crop(box), box[:2]); restored.append(D["text"][i])
    # second pass: standalone interface words (whitelisted, 4+ letters, confident)
    for i, w in enumerate(d["text"]):
        n = norm(w)
        if len(n) < 4 or n not in SAFE or float(d["conf"][i]) < 70: continue
        x, y, ww, hh = [v // 2 for v in (d["left"][i], d["top"][i], d["width"][i], d["height"][i])]
        box = (max(0, x - 1), max(0, y - 1), min(W, x + ww + 1), min(H, y + hh + 1))
        out.paste(im.crop(box), box[:2]); restored.append(w)
    # cover logos and brand graphics with flat panels
    dr = ImageDraw.Draw(out)
    for (x0, y0, x1, y1, col) in covers:
        dr.rectangle((x0, y0, x1, y1), fill=col)
    # stamp
    try: f = ImageFont.truetype("/tmp/SGu-SemiBold.ttf", 15)
    except Exception: f = None
    label = "Real report  |  data blurred"
    tw = dr.textlength(label, font=f) if f else 200
    dr.rectangle((W - tw - 26, H - 34, W - 8, H - 8), fill=(22, 33, 44))
    dr.text((W - tw - 17, H - 30), label, fill=(255, 255, 255), font=f)
    out.save(dst, "WEBP", quality=82)
    return restored

def leak_test(path):
    im = Image.open(path).convert("RGB"); W, H = im.size
    t = pytesseract.image_to_string(im.resize((W * 2, H * 2)), config="--psm 11")
    bad = []
    for tok in re.findall(r"[A-Za-z0-9@.\-]+", t):
        n = norm(tok)
        if not n or n in SAFE or n in {"real", "report", "data", "blurred"}: continue
        if re.search(r"\d", n) and len(n) >= 2: bad.append(tok)
        elif len(n) >= 4: bad.append(tok)
    return bad
