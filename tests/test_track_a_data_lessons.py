from __future__ import annotations

import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data/catalog/catalog-v3.json"
TARGETS = {
    "1.2.1": ("les-a-0003", "a-1-2-1"),
    "1.2.2": ("les-a-0004", "a-1-2-2"),
    "1.2.4": ("les-a-0050", "a-1-2-4"),
    "1.2.5": ("les-a-0005", "a-1-2-5"),
    "1.2.6": ("les-a-0006", "a-1-2-6"),
}
LOCALES = ("ru", "en", "zh")


class LessonStructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.questions = []
        self.current_question = None
        self.footer_brand_link = False
        self.language = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == "html":
            self.language = attrs.get("lang")
        if tag == "article" and "lesson-check-question" in attrs.get("class", ""):
            self.current_question = {"mode": attrs.get("data-mode"), "correct": attrs.get("data-correct"), "inputs": 0}
            self.questions.append(self.current_question)
        if tag == "input" and attrs.get("type") == "checkbox" and self.current_question is not None:
            self.current_question["inputs"] += 1
        if tag == "footer":
            self.in_footer = True
        if tag == "a" and "brand" in attrs.get("class", "") and self.in_footer:
            self.footer_brand_link = True

    def handle_endtag(self, tag):
        if tag == "article" and self.current_question is not None:
            self.current_question = None
        if tag == "footer":
            self.in_footer = False


class TrackADataLessonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
        cls.lessons = {lesson["code"]: lesson for lesson in cls.catalog["lessons"]}

    def test_all_five_lessons_registered_for_review(self):
        for code, (uid, slug) in TARGETS.items():
            with self.subTest(code=code):
                lesson = self.lessons[code]
                self.assertEqual(lesson["uid"], uid)
                self.assertEqual(lesson["status"], "review")
                self.assertEqual(lesson["content_state"], "localized")
                self.assertEqual(set(lesson["url_i18n"]), set(LOCALES))
                self.assertEqual(set(lesson["title_i18n"]), set(LOCALES))
                self.assertGreaterEqual(len(lesson["learning_outcomes"]), 3)
                self.assertEqual(lesson["url_i18n"]["ru"], f"lessons/{slug}.html")
                self.assertEqual(lesson["url_i18n"]["en"], f"lessons/{slug}-en.html")
                self.assertEqual(lesson["url_i18n"]["zh"], f"lessons/{slug}-zh.html")

    def test_all_fifteen_pages_exist_and_follow_canonical_locale_names(self):
        for code, (_, slug) in TARGETS.items():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                path = ROOT / "lessons" / f"{slug}{suffix}.html"
                with self.subTest(code=code, locale=locale):
                    self.assertTrue(path.is_file(), str(path))
                    html = path.read_text(encoding="utf-8")
                    self.assertIn(f'<html lang="{locale}"', html)
                    self.assertIn(f'lessons/{slug}{suffix}.html', html)
                    self.assertNotIn('data-correct="undefined"', html)
                    self.assertNotIn('data-explanation="undefined"', html)
                    self.assertIn("Understand AI. Build AI. Research AI.", html)
                    self.assertIn("© 2026 AI Research DCH School", html)

    def test_conclusion_order_and_navigation(self):
        for _, slug in TARGETS.values():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                html = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                positions = [
                    html.index('class="lesson-sources"'),
                    html.index('class="lesson-nav"'),
                    html.index('class="lesson-glossary"'),
                    html.index('class="lesson-check"'),
                    html.index("<footer"),
                ]
                self.assertEqual(positions, sorted(positions), f"{slug}{suffix}")
                nav = html.split('class="lesson-nav"', 1)[1].split("</nav>", 1)[0]
                self.assertEqual(nav.count('class="button'), 3)
                self.assertIn("learning-map/", nav)
                self.assertIn("understanding-ai", nav)
                self.assertIn("index", nav)

    def test_assessment_questions_are_well_formed_and_keyed(self):
        for _, slug in TARGETS.values():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                html = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                parser = LessonStructureParser()
                parser.feed(html)
                self.assertEqual(parser.language, locale)
                self.assertEqual(len(parser.questions), 3, f"{slug}{suffix}")
                for question in parser.questions:
                    self.assertIn(question["mode"], ("single", "yesno"))
                    self.assertIn(question["correct"], ("a", "b", "c", "d"))
                    expected_inputs = 2 if question["mode"] == "yesno" else 4
                    self.assertEqual(question["inputs"], expected_inputs)

    def test_each_page_has_five_glossary_cards_and_three_sources(self):
        for _, slug in TARGETS.values():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                html = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                self.assertEqual(html.count('class="glossary-entry"'), 5, f"{slug}{suffix}")
                source_block = html.split('class="lesson-sources"', 1)[1].split("</section>", 1)[0]
                self.assertEqual(source_block.count("<li>"), 3, f"{slug}{suffix}")
                self.assertIn('rel="noopener noreferrer"', source_block)


if __name__ == "__main__":
    unittest.main()
