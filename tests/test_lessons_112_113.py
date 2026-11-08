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
                self.assertIn("../styles/lesson-visual-palette.css", (ROOT / "styles/main.css").read_text(encoding="utf-8"))

    def test_new_lessons_use_trackless_display_codes(self):
        for lesson, code in (("1-1-2-history-of-ai", "1.1.2"), ("1-1-3-symbolic-ai-and-machine-learning", "1.1.3")):
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / f"lessons/{lesson}{suffix}.html").read_text(encoding="utf-8")
                self.assertIn(code, source)
                self.assertNotRegex(source, r"LESSON A\\.1\\.1\\.[23]")

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
