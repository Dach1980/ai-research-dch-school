import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-7.html",
    "en": ROOT / "lessons/a-1-5-7-en.html",
    "zh": ROOT / "lessons/a-1-5-7-zh.html",
}
class Parser(HTMLParser):
    VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors = [], []
    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in self.VOID: return
        if not self.stack: self.errors.append("unexpected closing: "+tag)
        elif self.stack[-1] == tag: self.stack.pop()
        elif tag in self.stack:
            self.errors.append("misnested: "+tag)
            self.stack = self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
        else: self.errors.append("closing without opener: "+tag)

class Lesson157ContractTests(unittest.TestCase):
    def test_catalog_identity_and_prerequisite(self):
        catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0048")
        self.assertEqual((lesson["code"],lesson["track_uid"],lesson["theme_uid"],lesson["module_uid"]),("1.5.7","trk-a","thm-a-01","mod-a-01-05"))
        self.assertEqual(lesson["prerequisite_uids"],["les-a-0015"])
        self.assertEqual(set(lesson["url_i18n"]),{"ru","en","zh"})
        self.assertEqual(set(lesson["title_i18n"]),{"ru","en","zh"})
        self.assertEqual(lesson["status"],"review")
        previous=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0015")
        self.assertEqual(previous["status"],"published")
        for loc,path in PAGES.items():
            self.assertTrue(path.is_file(),loc)
            self.assertEqual(lesson["url_i18n"][loc],str(path.relative_to(ROOT)))

    def test_locale_structure_and_assessment_parity(self):
        expected_ids=[f"section-{i}" for i in range(1,9)]+["practice"]
        keys=None
        for loc,path in PAGES.items():
            source=path.read_text(encoding="utf-8")
            with self.subTest(locale=loc):
                self.assertIn(f'<html lang="{loc}">',source)
                self.assertEqual(re.findall(r'<section id="([^"]+)"',source),expected_ids)
                self.assertEqual(source.count('class="glossary-entry"'),5)
                self.assertEqual(source.count('class="lesson-check-question"'),6)
                self.assertEqual(source.count('class="lesson-check-button"'),6)
                self.assertEqual(source.count('class="lesson-check-feedback"'),6)
                self.assertEqual(source.count('data-explanation="'),6)
                self.assertEqual(source.count('role="math"'),4)
                self.assertEqual(source.count("<svg "),2)
                self.assertEqual(len(re.findall(r'<li><a href="https://',source)),3)
                self.assertIn("../styles/lesson-157.css",source)
                self.assertIn("../styles/lesson-124.css",source)
                self.assertIn("../scripts/lesson-layout.js",source)
                self.assertIn("../scripts/lesson-assessment.js",source)
                answers=re.findall(r'data-correct="([a-d])"',source)
                self.assertEqual(len(answers),6)
                self.assertEqual(set(answers),set("abcd"))
                if keys is None: keys=answers
                else: self.assertEqual(answers,keys)
                parser=Parser();parser.feed(source)
                self.assertEqual(parser.errors,[])
                self.assertEqual(parser.stack,[])
                for href in re.findall(r'href="([^"]+)"',source):
                    parts=urlsplit(href)
                    if parts.scheme or href.startswith("#") or not parts.path: continue
                    target=(path.parent/parts.path).resolve()
                    self.assertTrue(target.is_file(),f"{loc}: broken link {href}")
                canonical=f'https://dchai.ru/lessons/a-1-5-7{"-"+loc if loc!="ru" else ""}.html'
                self.assertIn(f'<link rel="canonical" href="{canonical}">',source)

    def test_svg_theme_and_formula_contract(self):
        css=(ROOT/"styles/lesson-157.css").read_text(encoding="utf-8")
        for token in ("--lds-surface","--lds-line","--lds-ink","--lds-muted","--lds-accent","--lds-good"):
            self.assertIn(token,css)
        for loc,path in PAGES.items():
            source=path.read_text(encoding="utf-8")
            svgs=re.findall(r"<svg\b.*?</svg>",source,re.S)
            self.assertEqual(len(svgs),2,loc)
            for svg in svgs:
                self.assertRegex(svg,r"<title id=")
                self.assertRegex(svg,r"<desc id=")
                self.assertRegex(svg,r'<text class="[^"]+"')
                self.assertNotRegex(svg,r'<text[^>]+(?:fill|style)=')
                self.assertNotRegex(svg,r'<(?:rect|path|line|circle)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}')
            for formula in ("MAE =","MSE =","RMSE =","R² ="):
                self.assertIn(formula,source)
        base=(ROOT/"styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid",base)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column",base)

if __name__=="__main__":
    unittest.main()
