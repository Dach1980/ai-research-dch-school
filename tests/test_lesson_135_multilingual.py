import ast
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-3-5.html",
    "en": ROOT / "lessons/a-1-3-5-en.html",
    "zh": ROOT / "lessons/a-1-3-5-zh.html",
}
EXPECTED = {
    "ru": ("Кластеризация и снижение размерности", "Самостоятельное задание"),
    "en": ("Clustering and Dimensionality Reduction", "Independent task"),
    "zh": ("聚类与降维", "独立实践任务"),
}
class PageParser(HTMLParser):
    def error(self, message):
        raise AssertionError(message)

class Lesson135Tests(unittest.TestCase):
    def test_localized_pages_and_canonical_urls(self):
        for locale, path in FILES.items():
            html = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{locale}">', html)
            self.assertIn(EXPECTED[locale][0], html)
            self.assertIn('rel="canonical"', html)
            self.assertIn('name="robots" content="noindex,nofollow"', html)
            self.assertIn('class="lesson-planet-banner"', html)
            self.assertIn('class="lesson-nav"', html)
            self.assertNotIn("undefined", html)
            self.assertNotIn("{{", html)
            PageParser().feed(html)

    def test_three_accessible_localized_svg_figures(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(html.count('<figure class="lesson-figure lesson-135-figure">'), 3)
            self.assertEqual(html.count("<title id="), 3)
            self.assertEqual(html.count("<desc id="), 3)
            self.assertIn("overflow-x:auto", (ROOT / "styles/lesson-135.css").read_text(encoding="utf-8"))

    def test_definitions_glossary_sources_and_quiz(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertGreaterEqual(html.count('class="definition"'), 5)
            self.assertEqual(html.count('class="glossary-entry"'), 10)
            self.assertEqual(html.count('class="lesson-check-question"'), 8)
            self.assertEqual(html.count('class="lesson-check-feedback"'), 8)
            self.assertEqual(html.count("<li><a href="), 5)
            self.assertLess(html.index('class="lesson-sources"'), html.index('class="lesson-nav"'))
            self.assertLess(html.index('class="lesson-nav"'), html.index('class="lesson-glossary"'))
            self.assertLess(html.index('class="lesson-glossary"'), html.index('class="lesson-check"'))

    def test_quiz_answer_keys_and_explanations(self):
        expected = ["a", "a", "a", "a", "a", "a", "a,b,c", "a,b,c"]
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(re.findall(r'data-correct="([^"]+)"', html), expected)
            explanations = re.findall(r'data-explanation="([^"]+)"', html)
            self.assertEqual(len(explanations), 8)
            self.assertTrue(all(len(value) > 35 for value in explanations))

    def test_python_example_is_syntactically_valid_and_precedes_practice(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            match = re.search(r'<pre class="language-python"><code>(.*?)</code></pre>', html, re.S)
            self.assertIsNotNone(match)
            code = (match.group(1).replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&"))
            ast.parse(code)
            self.assertLess(html.index('<pre class="language-python">'), html.index("lesson-practice"))

    def test_catalog_uid_review_state_and_previous_navigation(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["code"] == "1.3.5")
        self.assertEqual(lesson["uid"], "les-a-0055")
        self.assertEqual(lesson["status"], "review")
        self.assertEqual(lesson["content_state"], "localized")
        self.assertEqual(lesson["url_i18n"], {
            "ru": "lessons/a-1-3-5.html",
            "en": "lessons/a-1-3-5-en.html",
            "zh": "lessons/a-1-3-5-zh.html",
        })
        for locale, path in FILES.items():
            html = path.read_text(encoding="utf-8")
            suffix = "" if locale == "ru" else "-en" if locale == "en" else "-zh"
            self.assertIn(f'href="a-1-3-4{suffix}.html"', html)
            self.assertNotIn(f'href="a-1-3-6{suffix}.html"', html)

    def test_mobile_css_and_theme_adaptation(self):
        css = (ROOT / "styles/lesson-135.css").read_text(encoding="utf-8")
        self.assertIn("@media(max-width:560px)", css)
        self.assertIn("width:900px", css)
        self.assertIn('html[data-theme="light"]', css)

if __name__ == "__main__":
    unittest.main()
