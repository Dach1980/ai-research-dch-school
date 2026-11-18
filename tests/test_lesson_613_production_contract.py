from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-6-1-3.html",
    "en": ROOT / "lessons/a-6-1-3-en.html",
    "zh": ROOT / "lessons/a-6-1-3-zh.html",
}

class Lesson613ProductionContractTests(unittest.TestCase):
    def test_three_locales_have_equal_learning_structure(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">', html)
            self.assertEqual(html.count('<section id="section-'), 9)
            self.assertEqual(html.count('class="lesson-check-question"'), 7)
            self.assertEqual(html.count('class="glossary-entry"'), 9)
            self.assertEqual(html.count('class="lesson-figure"'), 1)
            self.assertEqual(html.count('class="formula"'), 7)
            self.assertGreaterEqual(html.count('class="definition"'), 5)
            self.assertEqual(html.count('class="lesson-check-button"'), 7)
            self.assertEqual(html.count('class="lesson-check-feedback"'), 7)
            self.assertIn('class="lesson-sources"', html)
            self.assertIn('class="lesson-nav"', html)
            self.assertIn('scripts/language-switcher.js', html)
            self.assertIn('scripts/lesson-assessment.js', html)
            self.assertIn('scripts/lesson-layout.js', html)
            self.assertIn('role="math"', html)
            self.assertIn('aria-live="polite"', html)
            self.assertIn('name="robots" content="index,follow"', html)
            self.assertNotIn('noindex,nofollow', html)
            self.assertNotIn('href="undefined"', html)
            self.assertNotIn('TODO', html)
            self.assertIn('class="lesson-comparison-table"', html)
            self.assertIn('class="lesson-problem"', html)
            self.assertIn('Linearity in parameters', html)
            self.assertIn('href="a-6-1-3.html"', html)
            self.assertIn('href="a-6-1-3-en.html"', html)
            self.assertIn('href="a-6-1-3-zh.html"', html)

    def test_localized_switchers_and_previous_lesson_are_correct(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            suffix = "" if lang == "ru" else "-en" if lang == "en" else "-zh"
            self.assertIn(f'href="../lessons/a-6-1-2-les-a-0148{suffix}.html"', html)
            self.assertNotIn('href="../lessons/a-6-1-4', html)
            self.assertNotIn('href="a-6-1-4', html)
            self.assertNotIn("../../", html)

    def test_canonical_urls_and_locale_metadata(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            suffix = "" if lang == "ru" else "-en" if lang == "en" else "-zh"
            self.assertIn(f'rel="canonical" href="https://dchai.ru/lessons/a-6-1-3{suffix}.html"', html)

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
            self.assertIn('51,55' if lang == 'ru' else '51.55', html)
            self.assertIn('0.45', html)
            self.assertIn('4.5', html)

if __name__ == "__main__":
    unittest.main()
