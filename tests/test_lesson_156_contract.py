import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-6.html",
    "en": ROOT / "lessons/a-1-5-6-en.html",
    "zh": ROOT / "lessons/a-1-5-6-zh.html",
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

class Lesson156ContractTests(unittest.TestCase):
    def test_catalog_identity_and_published_navigation_contract(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0015")
        self.assertEqual((lesson["code"], lesson["track_uid"], lesson["theme_uid"], lesson["module_uid"]),
                         ("1.5.6", "trk-a", "thm-a-01", "mod-a-01-05"))
        self.assertIn(lesson["status"], {"review", "published"})
        self.assertIn(lesson["content_state"], {"localized", "published"})
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0047"])
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(lesson["url_i18n"]["ru"], "lessons/a-1-5-6.html")
        self.assertEqual(lesson["url_i18n"]["en"], "lessons/a-1-5-6-en.html")
        self.assertEqual(lesson["url_i18n"]["zh"], "lessons/a-1-5-6-zh.html")
        previous = next(x for x in catalog["lessons"] if x["code"] == "1.5.5")
        next_lesson = next(x for x in catalog["lessons"] if x["code"] == "1.5.7")
        self.assertEqual(previous["status"], "published")
        self.assertEqual(next_lesson["status"], "planned")
        self.assertNotIn("a-1-5-7", "".join(p.read_text(encoding="utf-8") for p in PAGES.values()))

    def test_locales_have_equal_sections_assessment_and_assets(self):
        expected_sections = [f"section-{i}" for i in range(1, 9)] + ["practice"]
        answer_keys = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}">', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn("../styles/lesson-reference-111.css", source)
                self.assertIn("../styles/lesson-124.css", source)
                self.assertIn("../styles/lesson-156.css", source)
                self.assertIn("../scripts/lesson-layout.js", source)
                self.assertIn("../scripts/lesson-assessment.js", source)
                self.assertEqual(source.count("<svg "), 3)
                self.assertEqual(source.count('role="math"'), 2)
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
                ids = re.findall(r'<section id="([^"]+)"', source)
                self.assertEqual(ids, expected_sections)
                keys = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(keys), 7)
                self.assertEqual(set(keys), {"a", "b", "c", "d"})
                if answer_keys is None:
                    answer_keys = keys
                else:
                    self.assertEqual(keys, answer_keys)
                parser = StructureParser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [])
                canonical = f'https://dchai.ru/lessons/a-1-5-6{"-" + locale if locale != "ru" else ""}.html'
                self.assertIn(f'<link rel="canonical" href="{canonical}">', source)
                self.assertIn('<p>Understand AI. Build AI. Research AI.</p>', source)
                self.assertIn("© 2026 AI Research DCH School", source)

    def test_svg_theme_tokens_formulas_and_glossary_layout(self):
        css = (ROOT / "styles/lesson-156.css").read_text(encoding="utf-8")
        for token in ("--lds-surface", "--lds-line", "--lds-ink", "--lds-muted", "--lds-accent", "--lds-good"):
            self.assertIn(token, css)
        design = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        self.assertIn("--lds-ink", design)
        base = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", base)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", base)
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            svgs = re.findall(r"<svg\\b.*?</svg>", source, re.S)
            self.assertEqual(len(svgs), 3, locale)
            for svg in svgs:
                self.assertRegex(svg, r"<title id=")
                self.assertRegex(svg, r"<desc id=")
                self.assertNotRegex(svg, r'<text[^>]+(?:fill|style)=')
                self.assertNotRegex(svg, r'<(?:rect|path|line|circle)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}')
                self.assertRegex(svg, r'<text class="[^"]+"')
            self.assertNotRegex(source, r'<(?:rect|path|line|circle)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}')
            self.assertIn("Σᵢ₌₁ᵏ", source)
            self.assertIn("SD =", source)
            self.assertNotIn("<style", source)

    def test_internal_links_resolve_and_quiz_explanations_cover_distractors(self):
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            for href in re.findall(r'href="([^"]+)"', source):
                parts = urlsplit(href)
                if parts.scheme or href.startswith("#") or not parts.path:
                    continue
                target = (path.parent / parts.path).resolve()
                self.assertTrue(target.is_file(), f"{locale}: broken internal link {href}")
            explanations = re.findall(r'data-explanation="([^"]+)"', source)
            self.assertEqual(len(explanations), 7)
            self.assertTrue(all(len(x) > 90 for x in explanations))
            self.assertIn("lesson-156-figure", source)
            self.assertIn("lesson-156-figure", (ROOT / "styles/lesson-156.css").read_text(encoding="utf-8"))

if __name__ == "__main__":
    unittest.main()
