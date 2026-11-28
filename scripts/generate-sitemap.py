#!/usr/bin/env python3
"""Generate or check the public sitemap from explicitly open, published lessons."""
import argparse
import json
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://dchai.ru/"
LANGS = ("ru", "en", "zh-Hans")
SUFFIXES = ("", "-en", "-zh")

def loc(path):
    return DOMAIN + ("" if path == "index.html" else path)

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.noindex = False
        self.refresh = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link" and a.get("rel", "").lower() == "canonical":
            self.canonicals.append(a.get("href"))
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.noindex |= "noindex" in a.get("content", "").lower()
        if tag == "meta" and a.get("http-equiv", "").lower() == "refresh":
            self.refresh = True

def groups():
    catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
    result = [["index.html", "index-en.html", "index-zh.html"]]
    result += [[f"news/{name}{suffix}.html" for suffix in SUFFIXES]
               for name in ("index", "001-school-launch", "002-open-beta")]
    for item in catalog["lessons"]:
        if item.get("status") == "published" and item.get("access") == "open":
            result.append([item["url_i18n"][lang] for lang in ("ru", "en", "zh")])
    return result

def render():
    seen = set()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    warnings = []
    for group in groups():
        for path in group:
            if not isinstance(path, str) or not re.fullmatch(r"[-a-zA-Z0-9_/]+\.html", path) or path.startswith("/") or path in seen:
                raise ValueError(f"Unsafe or duplicate sitemap path: {path}")
            seen.add(path)
            file = ROOT / path
            if not file.resolve().is_relative_to(ROOT) or not file.is_file():
                raise ValueError(f"Missing sitemap target: {path}")
            h = Head()
            h.feed(file.read_text(encoding="utf-8"))
            if h.noindex or h.refresh:
                raise ValueError(f"Non-indexable sitemap target: {path}")
            if h.canonicals != [loc(path)]:
                warnings.append(f"{path}: canonical {h.canonicals!r}")
            lines += ["  <url>", f"    <loc>{loc(path)}</loc>"]
            lines += [f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{loc(other)}"/>'
                      for lang, other in zip(LANGS, group)]
            lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n", len(seen), warnings

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    output, count, warnings = render()
    for warning in warnings:
        print("SEO canonical follow-up:", warning)
    path = ROOT / "sitemap.xml"
    if args.check:
        if not path.is_file() or path.read_text(encoding="utf-8") != output:
            raise SystemExit("Stale sitemap: run python scripts/generate-sitemap.py and commit sitemap.xml")
    else:
        path.write_text(output, encoding="utf-8")
    print(f"Verified sitemap: {count} URLs, {len(warnings)} canonical warnings")

if __name__ == "__main__":
    main()
