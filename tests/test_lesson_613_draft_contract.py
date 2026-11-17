from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = {"ru": ROOT / "drafts/lessons/a-6-1-3-ru.html", "en": ROOT / "drafts/lessons/a-6-1-3-en.html", "zh": ROOT / "drafts/lessons/a-6-1-3-zh.html"}

class Lesson613DraftContractTests(unittest.TestCase):
    def test_three_locales_have_equal_learning_structure(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">', html)
            self.assertEqual(len(re.findall(r'<section id="section-\\d+">', html)), 9)
            self.assertEqual(html.count('class="lesson-check-question"'), 7)
            self.assertEqual(html.count('class="glossary-entry"'), 8)
            self.assertEqual(html.count('class="lesson-figure"'), 1)
            self.assertEqual(html.count('class="formula"'), 5)
            self.assertGreaterEqual(html.count('class="definition"'), 5)
            self.assertEqual(html.count('class="lesson-check-button"'), 7)
            self.assertEqual(html.count('class="lesson-check-feedback"'), 7)
            self.assertIn('class="lesson-sources"', html)
            self.assertIn('class="lesson-nav"', html)
            self.assertIn('scripts/language-switcher.js', html)
            self.assertIn('scripts/lesson-assessment.js', html)
            self.assertIn('role="math"', html)
            self.assertIn('aria-live="polite"', html)
            self.assertNotIn('href="undefined"', html)
            self.assertNotIn('TODO', html)

    def test_locale_switchers_and_previous_lesson_are_localized(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            for target in ("a-6-1-3-ru.html", "a-6-1-3-en.html", "a-6-1-3-zh.html"):
                self.assertIn(f'href="{target}"', html)
            suffix = "" if lang == "ru" else "-en" if lang == "en" else "-zh"
            self.assertIn(f'href="../../lessons/a-6-1-2-les-a-0148{suffix}.html"', html)
            self.assertNotIn('href="../../lessons/a-6-1-4', html)
            self.assertNotIn('href="a-6-1-4', html)

    def test_formula_definition_and_svg_accessibility_contract(self):
        for path in PAGES.values():
            html = path.read_text(encoding="utf-8")
            self.assertIn('class="formula-label"', html)
            self.assertIn('class="formula-expression"', html)
            self.assertIn('class="definition-term"', html)
            self.assertIn('class="definition-text"', html)
            self.assertIn('<title id="coef-title">', html)
            self.assertIn('<desc id="coef-desc">', html)
            self.assertIn('aria-labelledby="coef-title coef-desc"', html)

    def test_worked_example_and_code_are_consistent(self):
        for path in PAGES.values():
            html = path.read_text(encoding="utf-8")
            self.assertIn('def predict(area_m2, distance_km):', html)
            self.assertIn('area_effect = 0.45 * (area_m2 - 50)', html)
            self.assertIn('distance_effect = -1.2 * (distance_km - 1.5)', html)
            self.assertIn('60.7', html)
            self.assertIn('60.1', html)

if __name__ == "__main__":
    unittest.main()
