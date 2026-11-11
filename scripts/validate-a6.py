#!/usr/bin/env python3
"""Validate the A.6 RU/EN/ZH lesson pages and shared SVG geometry."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": "lessons/a-6-generalization-and-overfitting.html",
    "en": "lessons/a-6-generalization-and-overfitting-en.html",
    "zh": "lessons/a-6-generalization-and-overfitting-zh.html",
}
SVG_RE = re.compile(r"<svg\b[\s\S]*?</svg>", re.I)

def normalize(svg):
    svg = re.sub(r"<text\b[^>]*>[\s\S]*?</text>", "<text/>", svg, flags=re.I)
    svg = re.sub(r"<title\b[^>]*>[\s\S]*?</title>", "<title/>", svg, flags=re.I)
    svg = re.sub(r'\s+aria-label="[^"]*"', "", svg, flags=re.I)
    return re.sub(r">\s+<", "><", svg).strip()

def main():
    errors, pages, diagrams = [], {}, {}
    for locale, relative in PAGES.items():
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"Missing page: {relative}")
            continue
        page = path.read_text(encoding="utf-8")
        pages[locale] = page
        if f'<html lang="{locale}">' not in page:
            errors.append(f"{locale}: html lang mismatch")
        if "scripts/language-switcher.js" not in page:
            errors.append(f"{locale}: language switcher missing")
        if "TRACK A · COMPOSITE SOURCE ·" not in page:
            errors.append(f"{locale}: lesson identifier missing")
        svgs = SVG_RE.findall(page)
        if len(svgs) != 6:
            errors.append(f"{locale}: expected 6 SVG diagrams, found {len(svgs)}")
        diagrams[locale] = [normalize(x) for x in svgs]
        required = {
            "ru": ["обобщающей способностью", "недообучение", "переобучение", "регуляризац", "early stopping", "cross-validation"],
            "en": ["generalization", "underfitting", "overfitting", "regularization", "early stopping", "cross-validation"],
            "zh": ["泛化能力", "欠拟合", "过拟合", "正则化", "提前停止", "交叉验证"],
        }[locale]
        for term in required:
            if term.casefold() not in page.casefold():
                errors.append(f"{locale}: missing term {term}")
        for href in re.findall(r'href="([^"]+)"', page):
            if href.startswith(("http:", "https:", "#", "mailto:", "tel:")):
                continue
            target = (path.parent / href.split("#", 1)[0]).resolve()
            if href.endswith(".html") and not target.is_file():
                errors.append(f"{locale}: broken link {href}")

    if len(diagrams) == 3 and not (diagrams["ru"] == diagrams["en"] == diagrams["zh"]):
        errors.append("SVG geometry/structure differs between RU/EN/ZH")

    if len(pages) == 3:
        def visible(source):
            source = re.sub(r"<style\b[\s\S]*?</style>|<script\b[\s\S]*?</script>", " ", source, flags=re.I)
            return re.sub(r"<[^>]+>", " ", source)
        ru = len(re.findall(r"\b[\w]+\b", visible(pages["ru"]), flags=re.UNICODE))
        en = len(re.findall(r"\b[\w]+\b", visible(pages["en"]), flags=re.UNICODE))
        zh = len(re.findall(r"[\u3400-\u9fff]", visible(pages["zh"])))
        if en < ru * 0.55:
            errors.append(f"English lesson too short: {en}/{ru} words")
        if zh < 500:
            errors.append(f"Chinese lesson too short: {zh} CJK characters")

    if errors:
        print("A.6 validation failed:")
        print("\n".join("- " + error for error in errors))
        return 1
    print(f"A.6 RU/EN/ZH passed: 6 shared SVGs; EN/RU={en/ru:.0%}; ZH={zh} CJK chars")
    return 0

if __name__ == "__main__":
    sys.exit(main())
