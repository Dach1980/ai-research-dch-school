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
        self.in_footer = False

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

    def test_first_five_data_lessons_have_expected_publication_states(self):
        for code, (uid, slug) in TARGETS.items():
            with self.subTest(code=code):
                lesson = self.lessons[code]
                self.assertEqual(lesson["uid"], uid)
                expected_status = "published"
                expected_content_state = "published"
                self.assertEqual(lesson["status"], expected_status)
                self.assertEqual(lesson["content_state"], expected_content_state)
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
                self.assertEqual(nav.count('class="button'), 5)
                self.assertIn("learning-map/", nav)
                self.assertIn("understanding-ai", nav)
                self.assertIn("index", nav)

    def test_first_data_batch_uses_111_article_content_order_without_duplicate_practice(self):
        localized = {
            "": "После изучения урока вы сможете:",
            "-en": "After studying this lesson, you will be able to:",
            "-zh": "学习本课后，你将能够：",
        }
        for slug in ("a-1-2-1", "a-1-2-2", "a-1-2-4", "a-1-2-5", "a-1-2-6"):
            for suffix, intro in localized.items():
                page = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                article = page.split('<article class="article-body">', 1)[1].split("</article>", 1)[0]
                with self.subTest(slug=slug, locale=suffix or "ru"):
                    self.assertTrue(article.lstrip().startswith("<h2>"))
                    self.assertIn(intro, article)
                    self.assertNotIn("Содержание урока", article)
                    self.assertNotIn("Lesson content", article)
                    self.assertNotIn("课程内容", article)
                    self.assertNotIn('class="lesson-practice"', article)
                    self.assertEqual(article.count("<h2>Результаты обучения</h2>") + article.count("<h2>Learning outcomes</h2>") + article.count("<h2>学习目标</h2>"), 1)

    def test_assessment_questions_are_well_formed_and_keyed(self):
        for _, slug in TARGETS.values():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                html = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                parser = LessonStructureParser()
                parser.feed(html)
                self.assertEqual(parser.language, locale)
                expected_count = 7 if slug == "a-1-2-1" else 3
                self.assertEqual(len(parser.questions), expected_count, f"{slug}{suffix}")
                for question in parser.questions:
                    self.assertIn(question["mode"], ("single", "yesno", "multiple"))
                    self.assertIn(question["correct"], ("a", "b", "c", "d", "a,c,d"))
                    expected_inputs = 2 if question["mode"] == "yesno" else (4 if question["mode"] == "single" else 4)
                    self.assertEqual(question["inputs"], expected_inputs)

    def test_each_page_has_five_glossary_cards_and_three_sources(self):
        for _, slug in TARGETS.values():
            for locale in LOCALES:
                suffix = "" if locale == "ru" else f"-{locale}"
                html = (ROOT / "lessons" / f"{slug}{suffix}.html").read_text(encoding="utf-8")
                expected_terms = 14 if slug == "a-1-2-1" and locale == "ru" else (13 if slug == "a-1-2-1" else 5)
                expected_sources = 4 if slug == "a-1-2-1" else 3
                self.assertEqual(html.count('class="glossary-entry"'), expected_terms, f"{slug}{suffix}")
                source_block = html.split('class="lesson-sources"', 1)[1].split("</section>", 1)[0]
                self.assertEqual(source_block.count("<li>"), expected_sources, f"{slug}{suffix}")
                self.assertIn('rel="noopener noreferrer"', source_block)

    def test_lesson_121_has_definition_blocks_and_four_accessible_diagrams_in_all_locales(self):
        for locale, suffix in (("ru", ""), ("en", "-en"), ("zh", "-zh")):
            page = (ROOT / "lessons" / f"a-1-2-1{suffix}.html").read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertEqual(page.count('class="definition"'), 8)
                self.assertEqual(page.count('<figure class="lesson-figure">'), 4)
                self.assertEqual(page.count('<svg viewBox="0 0 820 205"'), 4)
                self.assertIn("Sampling bias" if locale == "en" else ("抽样偏差" if locale == "zh" else "Смещение выборки"), page)

if __name__ == "__main__":
    unittest.main()
