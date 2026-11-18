import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESIGN_SYSTEM = ROOT / "styles/lesson-design-system.css"


class GlossaryLayoutContractTests(unittest.TestCase):
    def test_glossary_uses_a_responsive_nested_grid_with_vertical_cards(self):
        css = DESIGN_SYSTEM.read_text(encoding="utf-8")
        outer = re.search(r"\.lesson-glossary\\s*\\{([^}]*)\\}", css, re.S)
        legacy_grid = re.search(r"\\.glossary-entry\\s*\\{[^}]*display\\s*:\\s*grid", css, re.S)
        canonical = re.search(
            r"\.lesson-glossary\\s*>\\s*\\.glossary-grid\\s*>\\s*\\.glossary-entry\\s*\\{([^}]*)\\}",
            css,
            re.S,
        )
        grid = re.search(r"\.lesson-glossary\\s*>\\s*\\.glossary-grid\\s*\\{([^}]*)\\}", css, re.S)
        self.assertIsNotNone(outer, "glossary wrapper rule is required")
        self.assertRegex(outer.group(1), r"display\\s*:\\s*block")
        self.assertIsNotNone(legacy_grid, "legacy base rule changed; review cascade")
        self.assertIsNotNone(grid, "nested glossary grid is required")
        self.assertRegex(grid.group(1), r"display\\s*:\\s*grid")
        self.assertRegex(grid.group(1), r"grid-template-columns\\s*:\\s*repeat\\(2")
        self.assertIsNotNone(canonical, "nested glossary cards need a canonical rule")
        self.assertRegex(canonical.group(1), r"display\\s*:\\s*flex")
        self.assertRegex(canonical.group(1), r"flex-direction\\s*:\\s*column")
        self.assertNotRegex(canonical.group(1), r"display\\s*:\\s*grid")
        self.assertIn("@media(max-width:650px){.lesson-glossary > .glossary-grid{grid-template-columns:1fr}}", css)

    def test_lesson_123_uses_the_shared_glossary_stylesheet(self):
        for locale in ("", "-en", "-zh"):
            page = ROOT / f"lessons/a-1-2-3{locale}.html"
            source = page.read_text(encoding="utf-8")
            self.assertIn("lesson-design-system.css", source)
            self.assertIn('<div class="lesson-glossary">', source)
            self.assertEqual(source.count('<div class="glossary-entry">'), 10)


if __name__ == "__main__":
    unittest.main()
