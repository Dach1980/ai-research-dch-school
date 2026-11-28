#!/usr/bin/env python3
"""Deterministic metadata enrichment for the public release; never changes lesson bodies."""
import argparse
from html import escape, unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

DOMAIN = "https://dchai.ru/"
LANGS = ("ru", "en", "zh-Hans")
KEYS = ("ru", "en", "zh")
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
TAG = re.compile(r'<(?:link|meta)\b(?:[^>"\x27]|"[^"]*"|\x27[^\x27]*\x27)*>', re.I)
HEAD = re.compile(r"(<head\b[^>]*>)(.*?)(</head\s*>)", re.I | re.S)
TITLE = re.compile(r"<title\b[^>]*>(.*?)</title\s*>", re.I | re.S)
MARK = re.compile(r"<!-- DCH SEO GENERATED START -->.*?<!-- DCH SEO GENERATED END -->\s*", re.S)
OG = {"og:type", "og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:site_name", "og:locale", "og:locale:alternate"}

class Attr(HTMLParser):
    def __init__(self, value):
        super().__init__()
        self.attrs = {}
        self.feed(value)
    def handle_starttag(self, tag, attrs):
        self.attrs = dict(attrs)

def tags(head):
    return [(m, Attr(m.group()).attrs) for m in TAG.finditer(head)]

def clean_text(value):
    return " ".join(unescape(value).split())

def path_url(path):
    if not re.fullmatch(r"[-a-zA-Z0-9_/]+\.html", path) or path.startswith("/"):
        raise ValueError(f"Unsafe page {path}")
    return DOMAIN + path

def pages(root):
    catalog = json.loads((root / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
    seen = set()
    groups = []
    for item in catalog["tracks"]:
        if item.get("status") == "active":
            groups.append(("track", item, KEYS))
    groups.append(("track", {"url_i18n": {"ru": "tracks/mathematical-research-foundations.html"}}, ("ru",)))
    for item in catalog["lessons"]:
        if item.get("status") == "published" and item.get("access") == "open":
            groups.append(("lesson", item, KEYS))
    for kind, item, keys in groups:
        paths = {key: item["url_i18n"][key] for key in keys}
        for key, path in paths.items():
            path_url(path)
            if path in seen:
                raise ValueError(f"Duplicate SEO page {path}")
            seen.add(path)
            yield kind, item, key, path, paths

def enrich(source, kind, item, key, path, paths):
    match = HEAD.search(source)
    if not match:
        raise ValueError(f"Missing head: {path}")
    original_head = match.group(2)
    head = MARK.sub("", original_head)
    t = TITLE.search(head)
    if not t or not clean_text(t.group(1)):
        raise ValueError(f"Missing title: {path}")
    title = clean_text(t.group(1))
    desc = ""
    for _, a in tags(original_head):
        if a.get("name", "").lower() == "description":
            desc = clean_text(a.get("content", ""))
            if desc:
                break
    if not desc:
        label = item.get("title_i18n", {}).get(key) or title
        if kind == "lesson":
            desc = {"ru": f"{label} — открытый урок AI Research DCH School.",
                    "en": f"{label} — an open lesson from AI Research DCH School.",
                    "zh": f"{label} — AI Research DCH School 开放课程。"}[key]
        else:
            desc = {"ru": f"{label} — образовательное направление AI Research DCH School.",
                    "en": f"{label} — a learning track from AI Research DCH School.",
                    "zh": f"{label} — AI Research DCH School 学习方向。"}[key]
    def keep(m):
        a = Attr(m.group()).attrs
        rel = a.get("rel", "").lower().split()
        if "canonical" in rel or ("alternate" in rel and a.get("hreflang")):
            return ""
        if a.get("name", "").lower() == "description" or a.get("property", "").lower() in OG:
            return ""
        if a.get("http-equiv", "").lower() == "refresh" or (a.get("name", "").lower() == "robots" and "noindex" in a.get("content", "").lower()):
            raise ValueError(f"Non-indexable page {path}")
        return m.group()
    head = TAG.sub(keep, head)
    # Normalize only trailing whitespace for repeatable output.
    head = head.rstrip()
    u = path_url(path)
    e = lambda x: escape(x, quote=True)
    loc = dict(zip(KEYS, LANGS))
    lines = ["<!-- DCH SEO GENERATED START -->",
             f'<link rel="canonical" href="{u}">',
             f'<meta name="description" content="{e(desc)}">']
    if len(paths) > 1:
        lines.extend(f'<link rel="alternate" hreflang="{loc[k]}" href="{path_url(p)}">' for k,p in paths.items())
    data = {"og:type": "article" if kind == "lesson" else "website",
            "og:title": title, "og:description": desc, "og:url": u,
            "og:site_name": "AI Research DCH School",
            "og:image": DOMAIN + "assets/site-brand-icon.jpg", "og:image:alt": "AI Research DCH School"}
    lines.extend(f'<meta property="{k}" content="{e(v)}">' for k,v in data.items())
    if not re.search(r'application/ld\+json', head, re.I):
        schema = {"@context": "https://schema.org", "@type": "LearningResource" if kind == "lesson" else "CollectionPage",
                  "name": title, "description": desc, "url": u, "inLanguage": loc[key],
                  "provider": {"@type": "Organization", "name": "AI Research DCH School", "url": DOMAIN}}
        if kind == "lesson":
            schema["isAccessibleForFree"] = True
        lines.append('<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c") + "</script>")
    lines.append("<!-- DCH SEO GENERATED END -->")
    result = source[:match.start(2)] + head + "\n" + "\n".join(lines) + "\n" + source[match.end(2):]
    return result

def verify(root, generated):
    sitemap = ET.parse(root / "sitemap.xml")
    nodes = {}
    for node in sitemap.findall("s:url", NS):
        url = node.findtext("s:loc", namespaces=NS)
        if url in nodes:
            raise ValueError(f"Duplicate sitemap URL {url}")
        nodes[url] = {x.get("hreflang"): x.get("href") for x in node.findall("x:link", NS)}
    for path, (html, paths) in generated.items():
        u = path_url(path)
        expected = {dict(zip(KEYS, LANGS))[key]: path_url(p) for key,p in paths.items()} if len(paths) > 1 else {}
        if u not in nodes or nodes[u] != expected:
            raise ValueError(f"Sitemap locale mismatch {path}")
        head = HEAD.search(html).group(2)
        attrs = [a for _, a in tags(head)]
        canonical = [a.get("href") for a in attrs if a.get("rel") == "canonical"]
        alternate = {a["hreflang"]: a.get("href") for a in attrs if a.get("rel") == "alternate" and a.get("hreflang")}
        if canonical != [u] or alternate != expected:
            raise ValueError(f"Invalid metadata {path}")
        if sum(a.get("name") == "description" for a in attrs) != 1:
            raise ValueError(f"Invalid description {path}")
    print(f"SEO release verified: {len(generated)} lesson/track pages, {len(nodes)} sitemap URLs")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    generated = {}
    for kind, item, key, path, paths in pages(root):
        f = root / path
        if f.is_symlink() or not f.resolve().is_relative_to(root) or not f.is_file():
            raise ValueError(f"Unsafe or missing page {path}")
        original = f.read_text(encoding="utf-8")
        enriched = enrich(original, kind, item, key, path, paths)
        if enrich(enriched, kind, item, key, path, paths) != enriched:
            raise ValueError(f"Non-idempotent SEO {path}")
        if original[HEAD.search(original).end():] != enriched[HEAD.search(enriched).end():]:
            raise ValueError(f"Body changed {path}")
        generated[path] = (enriched, paths)
    verify(root, generated)
    if not args.check_only:
        for path, (html, _) in generated.items():
            (root / path).write_text(html, encoding="utf-8")

if __name__ == "__main__":
    main()
