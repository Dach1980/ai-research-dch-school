import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-5.html",
    "en": ROOT / "lessons/a-1-5-5-en.html",
    "zh": ROOT / "lessons/a-1-5-5-zh.html",
}

class StructureParser(HTMLParser):
    VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors = [], []
    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        return
    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append("unexpected closing tag: " + tag)
        elif self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.errors.append("misnested closing tag: " + tag)
            self.stack = self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
        else:
            self.errors.append("closing tag without opener: " + tag)

class Lesson155ContractTests(unittest.TestCase):
    def test_catalog_identity_prerequisites_and_localized_routes(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0047")
        self.assertEqual((lesson["code"], lesson["track_uid"], lesson["theme_uid"], lesson["module_uid"]),
                         ("1.5.5", "trk-a", "thm-a-01", "mod-a-01-05"))
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0046"])
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(lesson["url_i18n"]["ru"], "lessons/a-1-5-5.html")
        self.assertEqual(lesson["url_i18n"]["en"], "lessons/a-1-5-5-en.html")
        self.assertEqual(lesson["url_i18n"]["zh"], "lessons/a-1-5-5-zh.html")

    def test_locales_have_equal_structure_quiz_and_visual_components(self):
        expected_sections = ["section-1","section-2","section-3","section-4","section-5","section-6","section-7","practice"]
        expected_keys = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn('../styles/lesson-reference-111.css', source)
                self.assertIn('../styles/lesson-124.css', source)
                self.assertIn('../styles/lesson-155.css', source)
                self.assertIn('../scripts/lesson-layout.js', source)
                self.assertIn('../scripts/lesson-assessment.js', source)
                self.assertEqual(source.count("<svg "), 3)
                self.assertEqual(source.count('role="math"'), 3)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                self.assertEqual(source.count('class="glossary-entry"'), 5)
                self.assertEqual(source.count('class="lesson-check-question"'), 7)
                self.assertEqual(source.count('class="lesson-check-button"'), 7)
                self.assertEqual(source.count('class="lesson-check-feedback"'), 7)
                self.assertEqual(source.count('type="checkbox"'), 28)
                self.assertEqual(source.count('data-explanation="'), 7)
                self.assertIn('data-mode="single"', source)
                self.assertIn('aria-live="polite"', source)
                self.assertIn('<nav class="lesson-nav"', source)
                sections = re.findall(r'<section id="([^"]+)"', source)
                self.assertEqual(sections, expected_sections)
                keys = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(keys), 7)
                if expected_keys is None:
                    expected_keys = keys
                else:
                    self.assertEqual(keys, expected_keys)
                parser = StructureParser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [])
                canonical = f'https://dchai.ru/lessons/a-1-5-5{"-" + locale if locale != "ru" else ""}.html'
                self.assertIn(f'<link rel="canonical" href="{canonical}">', source)

    def test_examples_formulas_and_concepts_are_present(self):
        tokens = {
            "ru": ["Accuracy равна 98%", "Recall положительного класса равен нулю", "TP = 160", "FP = 196", "44,9%", "SMOTE", "prevalence"],
            "en": ["Accuracy is 98%", "positive-class Recall is zero", "TP = 160", "FP = 196", "44.9%", "SMOTE", "prevalence"],
            "zh": ["Accuracy 为 98%", "正类 Recall 为零", "TP = 160", "FP = 196", "44.9%", "SMOTE", "prevalence"],
        }
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            for token in tokens[locale]:
                self.assertIn(token.lower(), source.lower())
            self.assertIn("lesson-155-figure", source)
            self.assertIn("π = N₊ / (N₊ + N₋)", source)
            self.assertIn("Precision = (TPR", source)
            self.assertIn("L = w₊", source)

    def test_theme_aware_svg_formula_and_glossary_styles(self):
        css = (ROOT / "styles/lesson-155.css").read_text(encoding="utf-8")
        for token in ("--lds-surface","--lds-line","--lds-ink","--lds-muted","--lds-accent","--lds-good"):
            self.assertIn(token, css)
        base = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", base)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", base)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertNotRegex(source, r'<text[^>]+(?:fill|style)=')
            self.assertNotRegex(source, r'<(?:rect|path)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}')
            self.assertNotIn("<style", source)

    def test_all_internal_links_resolve_and_quiz_keys_are_balanced(self):
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            keys = re.findall(r'data-correct="([a-d])"', source)
            self.assertEqual(set(keys), {"a","b","c","d"})
            self.assertGreaterEqual(len(set(keys)), 3)
            for href in re.findall(r'href="([^"]+)"', source):
                parts = urlsplit(href)
                if parts.scheme or href.startswith("#") or not parts.path:
                    continue
                target = (path.parent / parts.path).resolve()
                self.assertTrue(target.is_file(), f"{locale}: broken internal link {href}")

if __name__ == "__main__":
    unittest.main()
