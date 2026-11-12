import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-3-4.html",
    "en": ROOT / "lessons/a-1-3-4-en.html",
    "zh": ROOT / "lessons/a-1-3-4-zh.html",
}
TITLES = {
    "ru": "Классификация и регрессия",
    "en": "Classification and Regression",
    "zh": "分类与回归",
}


class Lesson134Tests(unittest.TestCase):
    def test_locales_are_complete_and_indexable(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                html = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}">', html)
                self.assertIn(TITLES[locale], html)
                self.assertIn('rel="canonical"', html)
                self.assertNotIn('name="robots" content="noindex,nofollow"', html)
                self.assertNotIn(">undefined<", html)
                self.assertNotIn("{{", html)
                self.assertIn("lesson-planet-banner", html)
                self.assertIn("lesson-assessment.js", html)

    def test_content_structure_and_localization_parity(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(len(re.findall(r'<figure class="lesson-figure lesson-134-figure">', html)), 1)
            self.assertEqual(html.count("<title id="), 1)
            self.assertEqual(html.count("<desc id="), 1)
            self.assertEqual(len(re.findall(r'class="glossary-entry"', html)), 8)
            self.assertEqual(len(re.findall(r'class="lesson-check-question"', html)), 6)
            self.assertIn("Regression", html)
            self.assertIn("Classification", html)
            self.assertIn("Multilabel", html) if 'lang="en"' in html else None
            self.assertIn("lesson-134.css", html)
            self.assertIn("data-mode=\"single\"", html)
            self.assertEqual(re.findall(r'data-correct="([abc])"', html), ["a", "a", "c", "b", "a", "a"])

    def test_source_navigation_glossary_quiz_order(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertLess(html.index('class="lesson-sources"'), html.index('class="lesson-nav"'))
            self.assertLess(html.index('class="lesson-nav"'), html.index('class="lesson-glossary"'))
            self.assertLess(html.index('class="lesson-glossary"'), html.index('class="lesson-check"'))
            self.assertIn("scikit-learn.org/stable/supervised_learning.html", html)
            self.assertIn("developers.google.com/machine-learning/crash-course/classification", html)

    def test_responsive_svg_keeps_labels_readable(self):
        css = (ROOT / "styles/lesson-134.css").read_text(encoding="utf-8")
        self.assertIn("@media(max-width:560px)", css)
        self.assertIn("width:900px", css)
        self.assertIn("overflow-x:auto", css)

    def test_catalog_publication_and_all_existing_lesson_statuses(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        published = [item for item in catalog["lessons"] if item.get("url_i18n")]
        self.assertGreaterEqual(len(published), 13)
        for lesson in published:
            self.assertEqual(lesson["status"], "published", lesson["code"])
            self.assertEqual(lesson["content_state"], "published", lesson["code"])
            self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        lesson = {item["code"]: item for item in catalog["lessons"]}["1.3.4"]
        self.assertEqual(lesson["uid"], "les-a-0054")
        self.assertEqual(lesson["url_i18n"]["ru"], "lessons/a-1-3-4.html")
        self.assertEqual(lesson["url_i18n"]["en"], "lessons/a-1-3-4-en.html")
        self.assertEqual(lesson["url_i18n"]["zh"], "lessons/a-1-3-4-zh.html")

    def test_lesson_133_links_to_134_in_every_locale(self):
        for suffix in ("", "-en", "-zh"):
            html = (ROOT / f"lessons/a-1-3-3{suffix}.html").read_text(encoding="utf-8")
            self.assertIn(f'href="a-1-3-4{suffix}.html"', html)


if __name__ == "__main__":
    unittest.main()
