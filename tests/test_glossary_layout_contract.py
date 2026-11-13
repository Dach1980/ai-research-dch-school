import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESIGN_SYSTEM = ROOT / "styles/lesson-design-system.css"


class GlossaryLayoutContractTests(unittest.TestCase):
    def test_glossary_cards_are_flex_columns_not_nested_grids(self):
        css = DESIGN_SYSTEM.read_text(encoding="utf-8")
        outer = re.search(r"\.lesson-glossary\s*\{([^}]*)\}", css, re.S)
        legacy_grid = re.search(r"\.glossary-entry\s*\{[^}]*display\s*:\s*grid", css, re.S)
        canonical = re.search(
            r"\.lesson-glossary\s*>\s*\.glossary-entry\s*\{([^}]*)\}",
            css,
            re.S,
        )
        self.assertIsNotNone(outer, "outer glossary grid rule is required")
        self.assertRegex(outer.group(1), r"display\s*:\s*grid")
        self.assertIsNotNone(legacy_grid, "legacy base rule changed; review cascade")
        self.assertIsNotNone(canonical, "shared canonical glossary rule is required")
        self.assertLess(
            legacy_grid.start(),
            canonical.start(),
            "canonical rule must follow and override the legacy grid rule",
        )
        declarations = canonical.group(1)
        self.assertRegex(declarations, r"display\s*:\s*flex")
        self.assertRegex(declarations, r"flex-direction\s*:\s*column")
        self.assertNotRegex(declarations, r"display\s*:\s*grid")

    def test_lesson_123_uses_the_shared_glossary_stylesheet(self):
        for locale in ("", "-en", "-zh"):
            page = ROOT / f"lessons/a-1-2-3{locale}.html"
            source = page.read_text(encoding="utf-8")
            self.assertIn("lesson-design-system.css", source)
            self.assertIn('<div class="lesson-glossary">', source)
            self.assertEqual(source.count('<div class="glossary-entry">'), 10)


if __name__ == "__main__":
    unittest.main()
