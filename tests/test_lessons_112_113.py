import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_ROUTES = {
    "a-1-1-2": ("a-1-1-2", "1.1.2", 1),
    "a-1-1-3": ("a-1-2-1-les-a-0002", "1.2.1", 2),
    "a-1-1-4": ("a-1-2-2-les-a-0052", "1.2.2", 2),
}


def page_path(legacy_key, suffix=""):
    canonical_slug, _, _ = LESSON_ROUTES[legacy_key]
    return ROOT / f"lessons/{canonical_slug}{suffix}.html"


class Lesson112113Tests(unittest.TestCase):
    def test_all_locales_exist_and_have_glossary_cards(self):
        for legacy_key, (_, code, module) in LESSON_ROUTES.items():
            for suffix in ("", "-en", "-zh"):
                path = page_path(legacy_key, suffix)
                self.assertTrue(path.is_file(), str(path))
                source = path.read_text(encoding="utf-8")
                self.assertIn('class="lesson-glossary"', source)
                self.assertIn('class="glossary-entry"', source)
                self.assertIn(f"THEME 1 · MODULE {module} · LESSON {code}", source)
                self.assertIn("lesson-visual-palette.css", (ROOT / "styles/main.css").read_text(encoding="utf-8"))

    def test_new_lessons_use_trackless_display_codes(self):
        for legacy_key, (_, code, _) in LESSON_ROUTES.items():
            for suffix in ("", "-en", "-zh"):
                source = page_path(legacy_key, suffix).read_text(encoding="utf-8")
                self.assertIn(code, source)
                self.assertNotRegex(source, r"LESSON A\.1\.[12]\.[23]")

    def test_diagrams_are_localized_for_each_lesson_language(self):
        expected = {
            "a-1-1-2": {
                "": ("Пять крупных этапов истории AI", "Предпосылки", "Символический AI"),
                "-en": ("AI history: five broad periods", "Foundations", "Symbolic AI"),
                "-zh": ("人工智能发展的五个主要阶段", "基础研究", "符号主义 AI"),
            },
            "a-1-1-4": {
                "": ("Два источника поведения системы", "Явное программирование", "Машинное обучение"),
                "-en": ("Two sources of system behaviour", "Explicit programming", "Machine learning"),
                "-zh": ("系统行为的两个来源", "显式编程", "机器学习"),
            },
        }
        for lesson, locales in expected.items():
            for suffix, labels in locales.items():
                source = page_path(lesson, suffix).read_text(encoding="utf-8")
                svg = re.search(r"<svg\b[\s\S]*?</svg>", source)
                self.assertIsNotNone(svg, f"{lesson}{suffix}")
                for label in labels:
                    self.assertIn(label, svg.group(0), f"{lesson}{suffix}: {label}")

    def test_new_112_113_headers_do_not_claim_reading_duration(self):
        for lesson in LESSON_ROUTES:
            for suffix in ("", "-en", "-zh"):
                source = page_path(lesson, suffix).read_text(encoding="utf-8")
                header = re.search(r'<div class="(?:lesson-meta|track-meta)">([\s\S]*?)</div>', source)
                self.assertIsNotNone(header)
                self.assertNotRegex(header.group(1), r"minutes?|минут|分钟")

    def test_lesson_122_has_expanded_case_study_and_source_aligned_quiz(self):
        expected = {
            "": ("Разбор предметной задачи", "Как оценивать результат", "Почему прогноз модели нельзя автоматически"),
            "-en": ("Case study: monitoring a pump bearing", "Evaluating a model", "Why should a model prediction"),
            "-zh": ("案例分析：水泵轴承温度监测", "如何评估模型", "为什么不能自动把模型预测"),
        }
        for suffix, phrases in expected.items():
            source = page_path("a-1-1-4", suffix).read_text(encoding="utf-8")
            for phrase in phrases:
                self.assertIn(phrase, source)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            self.assertIn("15.", source)
            self.assertIn("16.", source)
            self.assertNotRegex(source, r"60\s*[–-]\s*75\s*(?:minutes?|минут|分钟)")

    def test_reordered_lessons_share_planet_shell_footer_and_final_section_order(self):
        pages = {
            "a-1-1-2": {"": ("11.", "12."), "-en": ("11.", "12."), "-zh": ("11.", "12.")},
            "a-1-1-3": {"": ("13.", "14."), "-en": ("10.", "11."), "-zh": ("10.", "11.")},
            "a-1-1-4": {"": ("15.", "16."), "-en": ("15.", "16."), "-zh": ("15.", "16.")},
        }
        labels = {
            "": ("Словарь урока", "Самопроверка"),
            "-en": ("Lesson glossary", "Self-check"),
            "-zh": ("本课术语表", "自测"),
        }
        for legacy_key, locale_numbers in pages.items():
            code = LESSON_ROUTES[legacy_key][1]
            for suffix, (source_number, check_number) in locale_numbers.items():
                glossary, check = labels[suffix]
                page = page_path(legacy_key, suffix).read_text(encoding="utf-8")
                with self.subTest(page=f"{legacy_key}{suffix}"):
                    self.assertIn("LESSON " + code, page)
                    self.assertIn('class="lesson-planet-banner"', page)
                    self.assertIn('class="lesson-planet-sphere"', page)
                    self.assertIn('<header class="site-header">', page)
                    self.assertIn('<footer class="footer">', page)
                    self.assertIn('class="lesson-sources"', page)
                    self.assertIn('<nav class="lesson-nav"', page)
                    self.assertIn('../styles/lesson-reference-111.css', page)
                    self.assertIn('../styles/lesson-content-components.css', page)
                    self.assertNotIn('<style>', page)
                    positions = [
                        page.index('class="lesson-sources"'),
                        page.index('<nav class="lesson-nav"'),
                        page.index('class="lesson-glossary"'),
                        page.index('class="lesson-check"'),
                    ]
                    self.assertEqual(positions, sorted(positions))
                    source_block = page[page.index('class="lesson-sources"'):page.index('<nav class="lesson-nav"')]
                    check_block = page[page.index('class="lesson-check"'):]
                    self.assertIn(source_number, source_block)
                    self.assertIn(check_number + " ", check_block)
                    self.assertIn("Understand AI. Build AI. Research AI.", page)
                    self.assertIn("© 2026 AI Research DCH School", page)

    def test_112_113_114_pages_match_the_exact_111_shell_and_have_clean_section_numbers(self):
        expected = {
            "a-1-1-2": (4, {"": ("11.", "12."), "-en": ("11.", "12."), "-zh": ("11.", "12.")}),
            "a-1-1-3": (3, {"": ("13.", "14."), "-en": ("10.", "11."), "-zh": ("10.", "11.")}),
            "a-1-1-4": (8, {"": ("15.", "16."), "-en": ("15.", "16."), "-zh": ("15.", "16.")}),
        }
        for lesson, (expected_questions, locale_numbers) in expected.items():
            for suffix, (source_heading, check_heading) in locale_numbers.items():
                page = page_path(lesson, suffix).read_text(encoding="utf-8")
                with self.subTest(lesson=lesson, locale=suffix or "ru"):
                    self.assertIn('<section class="track-hero article-hero">', page)
                    self.assertIn('<article class="article-body">', page)
                    self.assertIn('class="lesson-planet-banner"', page)
                    self.assertIn('class="lesson-planet-art"', page)
                    self.assertIn('class="lesson-glossary"', page)
                    self.assertIn('class="lesson-check"', page)
                    self.assertIn('../styles/lesson-reference-111.css', page)
                    self.assertIn('../styles/lesson-content-components.css', page)
                    self.assertNotIn("<style>", page)
                    self.assertEqual(page.count('class="lesson-check-question"'), expected_questions)
                    source = page[page.index('class="lesson-sources"'):page.index('<nav class="lesson-nav"')]
                    check = page[page.index('class="lesson-check"'):]
                    self.assertIn(source_heading, source)
                    self.assertIn(check_heading + " ", check)
                    self.assertNotIn('class="planet"', page)
                    self.assertNotIn('class="locale-links"', page)

    def test_lesson_121_preserves_full_localized_glossary_and_practice_checks(self):
        for suffix in ("-en", "-zh"):
            page = page_path("a-1-1-3", suffix).read_text(encoding="utf-8")
            with self.subTest(locale=suffix):
                self.assertEqual(page.count('class="quiz"'), 5)
                self.assertGreaterEqual(page.count('class="glossary-entry"'), 15)
                self.assertIn('class="lesson-practice-checks"', page)
                self.assertIn("data-mode=\"single\"", page)
                self.assertIn("data-correct=", page)

    def test_section_numbers_are_sequential_for_lessons_112_113_114(self):
        expected = {
            "a-1-1-2": {"": list(range(1, 13)), "-en": list(range(1, 13)), "-zh": list(range(1, 13))},
            "a-1-1-3": {"": list(range(1, 15)), "-en": list(range(1, 12)), "-zh": list(range(1, 12))},
            "a-1-1-4": {"": list(range(1, 17)), "-en": list(range(1, 17)), "-zh": list(range(1, 17))},
        }
        for lesson, locales in expected.items():
            for suffix, numbers in locales.items():
                page = page_path(lesson, suffix).read_text(encoding="utf-8")
                actual = [int(value) for value in re.findall(r"<h2[^>]*>\s*(\d+)\.", page)]
                with self.subTest(lesson=lesson, locale=suffix or "ru"):
                    self.assertEqual(actual, numbers)

    def test_illustration_palette_is_semantic_and_theme_aware(self):
        palette = (ROOT / "styles/lesson-visual-palette.css").read_text(encoding="utf-8")
        theme = (ROOT / "styles/theme-system.css").read_text(encoding="utf-8")
        self.assertIn("--diagram-text", theme)
        self.assertIn("--diagram-surface", theme)
        self.assertIn("var(--diagram-text)", palette)
        self.assertIn("var(--diagram-box2)", palette)
        self.assertNotIn(".lesson-figure svg text{fill:#17233b", theme)

    def test_legacy_ai_ml_dl_diagrams_do_not_keep_dark_inline_box_fills(self):
        for suffix in ("", "-en", "-zh"):
            source = page_path("a-1-1-3", suffix).read_text(encoding="utf-8")
            self.assertNotIn('fill="#172b49"', source)
            self.assertNotIn('fill="#30294f"', source)
            self.assertNotIn('fill="#153f40"', source)


if __name__ == "__main__":
    unittest.main()
