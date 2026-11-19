import ast
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ('ru', 'en', 'zh')
UID = 'les-a-0172'

class Lesson722Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / 'data/catalog/catalog-v3.json').read_text(encoding='utf-8'))
        cls.lesson = next((x for x in cls.catalog['lessons'] if x['uid'] == UID), None)

    def test_catalog_uid_status_and_locales(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson['code'], '7.2.2')
        self.assertEqual(self.lesson['status'], 'review')
        self.assertEqual(self.lesson['content_state'], 'localized')
        self.assertEqual(set(self.lesson['url_i18n']), set(LOCALES))
        self.assertEqual(self.lesson['prerequisite_uids'], ['les-a-0171'])
        for locale, route in self.lesson['url_i18n'].items():
            self.assertTrue((ROOT / route).is_file(), f'missing {locale}: {route}')

    def test_locale_pages_have_canonical_dom_order(self):
        blocks = ['lesson-intro', 'lesson-outcomes', 'lesson-sections', 'lesson-practice', 'lesson-sources', 'lesson-navigation', 'lesson-glossary', 'lesson-quiz']
        for locale, route in self.lesson['url_i18n'].items():
            source = (ROOT / route).read_text(encoding='utf-8')
            positions = [source.index('class="lesson-intro"')] + [source.index(f'id="{block}"') for block in blocks[1:]]
            self.assertEqual(positions, sorted(positions), locale)
            self.assertIn('class="footer"', source)
            self.assertIn('xai-05-permutation-importance.js', source)
            self.assertIn('xai-permutation-importance-lesson.js', source)

    def test_localised_content_and_depth(self):
        data = (ROOT / 'lessons/data/xai-05-permutation-importance.js').read_text(encoding='utf-8')
        for token in ('Permutation Feature Importance', 'correlated features', '相关特征', 'n_repeats', 'max_samples', 'causal'):
            self.assertIn(token.lower(), data.lower())
        for section in ('question', 'definition', 'metric', 'repeats', 'correlation', 'limits', 'compare'):
            self.assertIn('["' + section + '"', data)
        self.assertIn('outcomes:', data)

    def test_semantic_outcomes_use_shared_card_styles(self):
        renderer = (ROOT / 'scripts/xai-permutation-importance-lesson.js').read_text(encoding='utf-8')
        design = (ROOT / 'styles/lesson-design-system.css').read_text(encoding='utf-8')
        self.assertIn('document.createElement("ul")', renderer)
        self.assertIn('.outcomes', design)
        self.assertIn('counter-reset', design)
        self.assertEqual(len(self.lesson['learning_outcomes']), 5)

    def test_python_lab_syntax_and_parameters(self):
        source = (ROOT / 'lessons/practice/a-7-2-2-permutation-importance.py').read_text(encoding='utf-8')
        ast.parse(source)
        for token in ('permutation_importance(', 'scoring="r2"', 'n_repeats=30', 'random_state=11', 'n_jobs=-1', 'max_samples=1.0', 'feature_importances_', 'signal_proxy', 'group_drops'):
            self.assertIn(token, source)
        self.assertIn('not a causal effect', source)

    def test_svg_accessibility_and_review_navigation(self):
        renderer = (ROOT / 'scripts/xai-permutation-importance-lesson.js').read_text(encoding='utf-8')
        self.assertIn('role="img"', renderer)
        self.assertIn('aria-labelledby', renderer)
        self.assertIn('class="button is-disabled"', renderer)
        self.assertIn('aria-disabled="true"', renderer)
        self.assertIn('a-7-2-1-les-a-0171', renderer)
        self.assertNotIn('a-7-2-3-les-a-0173', renderer)

if __name__ == '__main__':
    unittest.main()