#!/usr/bin/env python3
"""Structural quality gate for newly authored canonical Track A lesson pages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
LESSONS = sorted((ROOT / "lessons").glob("*-les-a-*.html"))
ERRORS = []
# Published lessons migrated from the legacy catalogue predate the canonical
# shell contract. Their locale links are removed at runtime by the shared
# language-switcher; strict source checks begin with the new UID sequence.
STRICT_UID_MIN = 147

class Audit(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
            "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.counts = {"header": 0, "footer": 0, "lesson_nav": 0,
                       "locale_links": 0, "language_switcher": 0}
        self.nested_glossary = False
        self.footer_has_container = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set((attrs.get("class") or "").split())
        ancestors = [entry[1] for entry in self.stack]
        if tag == "header" and "site-header" in classes:
            self.counts["header"] += 1
        if tag == "footer" and "footer" in classes:
            self.counts["footer"] += 1
        if "lesson-nav" in classes:
            self.counts["lesson_nav"] += 1
        if "locale-links" in classes:
            self.counts["locale_links"] += 1
        if "language-switcher" in classes:
            self.counts["language_switcher"] += 1
        if "lesson-glossary" in classes and any("lesson-glossary" in c for c in ancestors):
            self.nested_glossary = True
        if "container" in classes and any("footer" in c for c in ancestors):
            self.footer_has_container = True
        if tag not in self.VOID:
            self.stack.append((tag, classes))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

for path in LESSONS:
    match = re.search(r"-les-a-(\d+)\.html$", path.name)
    if not match:
        continue
    uid = int(match.group(1))
    if uid < STRICT_UID_MIN:
        continue
    source = path.read_text(encoding="utf-8")
    parser = Audit()
    parser.feed(source)
    issues = []
    for key, label in (("header", "site-header"), ("footer", "footer"), ("lesson_nav", "lesson-nav")):
        if parser.counts[key] != 1:
            issues.append(f"expected exactly one {label}, got {parser.counts[key]}")
    if parser.counts["locale_links"]:
        issues.append("legacy in-content locale-links must not be present in canonical source")
    if parser.nested_glossary:
        issues.append("nested .lesson-glossary grid detected")
    if not parser.footer_has_container:
        issues.append("footer must contain its shared .container wrapper")
    for required in ("scripts/main.js", "scripts/lesson-layout.js", "scripts/language-switcher.js"):
        if required not in source:
            issues.append(f"missing shared script: {required}")
    if issues:
        ERRORS.append((path.relative_to(ROOT), issues))

if ERRORS:
    for path, issues in ERRORS:
        for issue in issues:
            print(f"FAIL {path}: {issue}")
    sys.exit(1)

strict_count = sum(1 for p in LESSONS if (m := re.search(r"-les-a-(\d+)\.html$", p.name)) and int(m.group(1)) >= STRICT_UID_MIN)
print(f"Lesson Quality Gate v1: PASS ({strict_count} canonical lesson HTML files checked; legacy baseline excluded)")
