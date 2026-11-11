import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {"ru": ROOT / "lessons/a-1-3-2.html", "en": ROOT / "lessons/a-1-3-2-en.html", "zh": ROOT / "lessons/a-1-3-2-zh.html"}

class Lesson132Tests(unittest.TestCase):
    def test_locales_and_shell(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                html = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}">', html)
                self.assertIn('1.3.2', html)
                for marker in ('rel="canonical"', 'lesson-planet-banner', 'lesson-sources', 'lesson-nav', 'lesson-glossary', 'lesson-check', '© 2026 AI Research DCH School'):
                    self.assertIn(marker, html)
                self.assertNotRegex(html, r'\{\{[A-Z_]+\}\}')
    def test_figures_glossary_and_assessment(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(len(re.findall(r'<figure class="lesson-figure">', html)), 3)
            self.assertEqual(len(re.findall(r'class="glossary-entry"', html)), 10)
            self.assertEqual(len(re.findall(r'class="lesson-check-question"', html)), 6)
            self.assertEqual(len(re.findall(r'data-mode="multi"', html)), 1)
            self.assertIn('data-correct="a,c"', html)
            self.assertIn('language-python', html)
            self.assertIn('self-supervised learning', html.lower())
    def test_sources_and_svg_accessibility(self):
        required = ('scikit-learn.org/stable/unsupervised_learning.html', 'scikit-learn.org/stable/modules/clustering.html', 'scikit-learn.org/stable/modules/unsupervised_reduction.html', 'developers.google.com/machine-learning/clustering')
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            for source in required: self.assertIn(source, html)
            self.assertEqual(len(re.findall(r'<desc id=', html)), 3)

if __name__ == "__main__":
    unittest.main()
