import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESIGN_SYSTEM = ROOT / "styles/lesson-design-system.css"


class GlossaryLayoutContractTests(unittest.TestCase):
    def test_glossary_uses_a_responsive_nested_grid_with_vertical_cards(self):
        css = DESIGN_SYSTEM.read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:block", css)
        self.assertIn(".lesson-glossary > .glossary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))", css)
        self.assertIn(".lesson-glossary > .glossary-grid > .glossary-entry{", css)
        self.assertIn("display:flex;", css)
        self.assertIn("flex-direction:column;", css)
        self.assertIn("@media(max-width:650px){.lesson-glossary > .glossary-grid{grid-template-columns:1fr}}", css)
        self.assertIn(".glossary-entry{position:relative;display:grid;", css)

    def test_lesson_123_uses_the_shared_glossary_stylesheet(self):
        for locale in ("", "-en", "-zh"):
            page = ROOT / f"lessons/a-1-2-3{locale}.html"
            source = page.read_text(encoding="utf-8")
            self.assertIn("lesson-design-system.css", source)
            self.assertIn('<div class="lesson-glossary">', source)
            self.assertEqual(source.count('<div class="glossary-entry">'), 10)


if __name__ == "__main__":
    unittest.main()
