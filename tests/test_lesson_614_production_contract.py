from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-6-1-4.html",
    "en": ROOT / "lessons/a-6-1-4-en.html",
    "zh": ROOT / "lessons/a-6-1-4-zh.html",
}

class Lesson614ProductionContractTests(unittest.TestCase):
    def test_three_locales_have_equal_learning_structure(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            with self.subTest(lang=lang):
                self.assertIn(f'<html lang="{lang}">', html)
                self.assertEqual(html.count('<section id="section-'), 9)
                self.assertEqual(html.count('class="lesson-check-question"'), 7)
                self.assertEqual(html.count('class="glossary-entry"'), 9)
                self.assertEqual(html.count('class="lesson-figure"'), 1)
                self.assertEqual(html.count('class="formula"'), 5)
                self.assertGreaterEqual(html.count('class="definition"'), 7)
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
                self.assertIn('aria-labelledby="tree-title tree-desc"', html)
                self.assertIn('<title id="tree-title">', html)
                self.assertIn('<desc id="tree-desc">', html)
                self.assertIn('src="../scripts/lesson-layout.js"', html)
                self.assertIn('href="../lessons/a-6-1-3', html)
                self.assertNotIn('a-6-1-5', html)

    def test_canonical_urls_and_localized_switchers(self):
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            suffix = "" if lang == "ru" else "-en" if lang == "en" else "-zh"
            self.assertIn(f'rel="canonical" href="https://dchai.ru/lessons/a-6-1-4{suffix}.html"', html)
            for target, target_suffix in (("ru", ""), ("en", "-en"), ("zh", "-zh")):
                self.assertIn(f'href="a-6-1-4{target_suffix}.html"', html)
            self.assertNotIn("../../", html)

    def test_key_tree_concepts_and_split_criteria_are_explained(self):
        expected = {
            "ru": ("Индекс Джини", "Информационный выигрыш", "Переобучение", "Обрезка дерева"),
            "en": ("Gini impurity", "Information gain", "Overfitting", "Pruning"),
            "zh": ("基尼指数", "信息增益", "过拟合", "剪枝"),
        }
        for lang, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            for token in expected[lang]:
                self.assertIn(token, html)
            self.assertIn("0,125" if lang == "ru" else "0.125", html)
            self.assertIn("0,375" if lang == "ru" else "0.375", html)
            self.assertIn("4,0" if lang == "ru" else "4.0", html)
            self.assertIn("70", html)

    def test_quiz_keys_and_explanations_are_complete(self):
        for path in PAGES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(html.count('data-mode="single"'), 7)
            self.assertEqual(html.count('data-correct='), 7)
            self.assertEqual(html.count('data-explanation='), 7)

if __name__ == "__main__":
    unittest.main()
