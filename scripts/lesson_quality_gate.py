#!/usr/bin/env python3
"""Structural quality gate for newly authored canonical lesson pages."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
LESSONS = sorted((ROOT / "lessons").glob("*-les-a-*.html"))
ERRORS = []

class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.counts = {"header": 0, "footer": 0, "lesson_nav": 0, "locale_links": 0, "language_switcher": 0}
        self.glossary_depth = 0
        self.nested_glossary = False
        self.nav_in_main = False
        self.footer_has_container = False
        self.main_depth = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); classes = set(a.get("class", "").split())
        if tag == "header" and "site-header" in classes: self.counts["header"] += 1
        if tag == "footer" and "footer" in classes: self.counts["footer"] += 1
        if "language-switcher" in classes: self.counts["language_switcher"] += 1
        if "locale-links" in classes: self.counts["locale_links"] += 1
        if tag == "main": self.main_depth += 1
        if "lesson-nav" in classes: self.counts["lesson_nav"] += 1
        if "lesson-glossary" in classes:
            if self.glossary_depth: self.nested_glossary = True
            self.glossary_depth += 1
        if tag == "div" and "container" in classes and self.stack and self.stack[-1] == "footer": self.footer_has_container = True
        self.stack.append("footer" if tag == "footer" else tag)
    def handle_endtag(self, tag):
        if tag == "main": self.main_depth = max(0, self.main_depth - 1)
        if tag == "div" and self.glossary_depth: self.glossary_depth -= 1
        if tag in self.stack:
            i = len(self.stack) - 1 - self.stack[::-1].index(tag)
            self.stack = self.stack[:i]

for path in LESSONS:
    source = path.read_text(encoding="utf-8")
    # Only enforce the new canonical shell contract on files carrying canonical UID slugs.
    if "-les-a-" not in path.name: continue
    parser = Audit()
    parser.feed(source)
    issues = []
    if parser.counts["header"] != 1: issues.append(f"expected one site-header, got {parser.counts['header']}")
    if parser.counts["footer"] != 1: issues.append(f"expected one footer, got {parser.counts['footer']}")
    if parser.counts["lesson_nav"] != 1: issues.append(f"expected one lesson-nav, got {parser.counts['lesson_nav']}")
    if parser.counts["locale_links"]: issues.append("legacy in-content locale-links must not be present")
    if parser.nested_glossary: issues.append("nested .lesson-glossary grid detected")
    for required in ('scripts/main.js', 'scripts/lesson-layout.js', 'scripts/language-switcher.js'):
        if required not in source: issues.append(f"missing shared script: {required}")
    if issues: ERRORS.append((path.relative_to(ROOT), issues))

if ERRORS:
    for path, issues in ERRORS:
        for issue in issues: print(f"FAIL {path}: {issue}")
    sys.exit(1)
print(f"Lesson Quality Gate v1: PASS ({len(LESSONS)} canonical lesson HTML files scanned)")
