import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Lesson112113Tests(unittest.TestCase):
    def test_all_locales_exist_and_have_glossary_cards(self):
        for lesson in ("1-1-2-history-of-ai", "1-1-3-symbolic-ai-and-machine-learning"):
            for suffix in ("", "-en", "-zh"):
                path = ROOT / f"lessons/{lesson}{suffix}.html"
                self.assertTrue(path.is_file(), str(path))
                source = path.read_text(encoding="utf-8")
                self.assertIn('class="lesson-glossary"', source)
                self.assertIn('class="glossary-entry"', source)
                self.assertIn("THEME 1 · MODULE 1 · LESSON", source)
                self.assertIn("lesson-visual-palette.css", (ROOT / "styles/main.css").read_text(encoding="utf-8"))

    def test_new_lessons_use_trackless_display_codes(self):
        for lesson, code in (("1-1-2-history-of-ai", "1.1.2"), ("1-1-3-symbolic-ai-and-machine-learning", "1.1.3")):
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / f"lessons/{lesson}{suffix}.html").read_text(encoding="utf-8")
                self.assertIn(code, source)
                self.assertNotRegex(source, r"LESSON A\.1\.1\.[23]")


    def test_diagrams_are_localized_for_each_lesson_language(self):
        expected = {
            "1-1-2-history-of-ai": {
                "": ("Пять крупных этапов истории AI", "Предпосылки", "Символический AI"),
                "-en": ("AI history: five broad periods", "Foundations", "Symbolic AI"),
                "-zh": ("人工智能发展的五个主要阶段", "基础研究", "符号主义 AI"),
            },
            "1-1-3-symbolic-ai-and-machine-learning": {
                "": ("Два источника поведения системы", "Явное программирование", "Машинное обучение"),
                "-en": ("Two sources of system behaviour", "Explicit programming", "Machine learning"),
                "-zh": ("系统行为的两个来源", "显式编程", "机器学习"),
            },
        }
        for lesson, locales in expected.items():
            for suffix, labels in locales.items():
                source = (ROOT / f"lessons/{lesson}{suffix}.html").read_text(encoding="utf-8")
                svg = re.search(r"<svg\b[\s\S]*?</svg>", source)
                self.assertIsNotNone(svg, f"{lesson}{suffix}")
                for label in labels:
                    self.assertIn(label, svg.group(0), f"{lesson}{suffix}: {label}")

    def test_new_112_113_headers_do_not_claim_reading_duration(self):
        for lesson in ("1-1-2-history-of-ai", "1-1-3-symbolic-ai-and-machine-learning"):
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / f"lessons/{lesson}{suffix}.html").read_text(encoding="utf-8")
                header = re.search(r'<div class="lesson-meta">([\s\S]*?)</div>', source)
                self.assertIsNotNone(header)
                self.assertNotRegex(header.group(1), r"minutes?|минут|分钟")

    def test_lesson_113_has_expanded_case_study_and_source_aligned_quiz(self):
        expected = {
            "": ("Разбор предметной задачи", "Как оценивать результат", "Почему нельзя автоматически"),
            "-en": ("Case study: monitoring a pump bearing", "Evaluating a model", "Why should a model prediction"),
            "-zh": ("案例分析：水泵轴承温度监测", "如何评估模型", "为什么不能自动把模型预测"),
        }
        for suffix, phrases in expected.items():
            source = (ROOT / f"lessons/1-1-3-symbolic-ai-and-machine-learning{suffix}.html").read_text(encoding="utf-8")
            for phrase in phrases:
                self.assertIn(phrase, source)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            self.assertIn("15.", source)
            self.assertIn("16.", source)
            self.assertNotRegex(source, r"60\s*[–-]\s*75\s*(?:minutes?|минут|分钟)")

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
            source = (ROOT / f"lessons/a-2-ai-ml-deep-learning{suffix}.html").read_text(encoding="utf-8")
            self.assertNotIn('fill="#172b49"', source)
            self.assertNotIn('fill="#30294f"', source)
            self.assertNotIn('fill="#153f40"', source)


if __name__ == "__main__":
    unittest.main()
