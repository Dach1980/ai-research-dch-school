import ast
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0174"
ROUTES = {
    "ru": "lessons/a-8-1-1-les-a-0174.html",
    "en": "lessons/a-8-1-1-les-a-0174-en.html",
    "zh": "lessons/a-8-1-1-les-a-0174-zh.html",
}


class Lesson811PDPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lesson = next((x for x in cls.catalog["lessons"] if x["uid"] == UID), None)
        cls.data = (ROOT / "lessons/data/xai-08-pdp.js").read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-pdp-lesson.js").read_text(encoding="utf-8")
        cls.python = (ROOT / "lessons/practice/a-8-1-1-partial-dependence.py").read_text(encoding="utf-8")

    def test_catalog_registration_and_review_gate(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson["code"], "8.1.1")
        self.assertEqual(self.lesson["theme_uid"], "thm-a-08")
        self.assertEqual(self.lesson["module_uid"], "mod-a-08-01")
        self.assertEqual(self.lesson["status"], "review")
        self.assertEqual(self.lesson["content_state"], "localized")
        self.assertEqual(self.lesson["prerequisite_uids"], ["les-a-0173"])
        self.assertEqual(set(self.lesson["url_i18n"]), {"ru", "en", "zh"})
        for locale, route in ROUTES.items():
            self.assertEqual(self.lesson["url_i18n"][locale], route)
            self.assertTrue((ROOT / route).is_file(), route)
        ids = [item["uid"] for item in self.catalog["lessons"]]
        self.assertEqual(len(ids), len(set(ids)))

    def test_canonical_dom_order_and_shared_components(self):
        ids = ["lesson-outcomes", "lesson-practice", "lesson-sources", "lesson-navigation", "lesson-glossary", "lesson-quiz"]
        for locale, route in ROUTES.items():
            source = (ROOT / route).read_text(encoding="utf-8")
            positions = [source.index('class="lesson-intro"')] + [source.index('id="' + item + '"') for item in ids]
            self.assertEqual(positions, sorted(positions), locale)
            for script in ("language-switcher.js", "theme-system.js", "lesson-glossary.js", "lesson-layout.js", "xai-pdp-lesson.js"):
                self.assertIn(script, source)
            self.assertIn('class="footer"', source)

    def test_seven_sections_and_three_figure_specs_per_locale(self):
        for token in ('["question"', '["definition"', '["grid"', '["two-way"', '["interpret"', '["correlation"', '["compare"'):
            self.assertEqual(self.data.count(token), 3, token)
        for token in ('"workflow"', '"reading"', '"correlation"'):
            self.assertEqual(self.data.count(token), 3, token)
        self.assertEqual(self.data.count('"reading"'), 3)
        self.assertEqual(self.data.count('"workflow"'), 3)
        self.assertEqual(self.data.count('"correlation"'), 3)

    def test_twelve_glossary_terms_and_twelve_quiz_questions_per_locale(self):
        self.assertEqual(self.data.count('glossary:['), 3)
        self.assertEqual(self.data.count('quiz:['), 3)
        self.assertEqual(self.data.count('["Partial Dependence Plot"'), 3)
        self.assertEqual(self.data.count('["ICE"'), 3)
        self.assertEqual(self.data.count('["ALE"'), 3)
        self.assertGreaterEqual(self.data.count('["'), 36)

    def test_renderer_uses_inline_accessible_theme_aware_svg(self):
        self.assertIn('function figure(kind)', self.renderer)
        self.assertIn('viewBox:"0 0 760 420"', self.renderer)
        self.assertIn('role:"img"', self.renderer)
        self.assertIn('pdp-svg', self.renderer)
        self.assertIn('var(--lds-ink)', self.renderer)
        self.assertIn('var(--lds-surface)', self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)

    def test_python_practice_syntax_and_supported_api(self):
        ast.parse(self.python)
        for token in ("RANDOM_STATE = 42", "RandomForestRegressor", "PartialDependenceDisplay.from_estimator", 'features=["area_m2"]', 'features=[("area_m2", "rooms")]', 'method="brute"', "train_test_split", "r2_score", "corr("):
            self.assertIn(token, self.python)

    def test_sources_and_status(self):
        for token in ("10.1214/aos/1013203451", "10.1080/10618600.2014.907095", "10.1111/rssb.12377", "scikit-learn.org/stable/modules/partial_dependence.html"):
            self.assertIn(token, self.data)
        self.assertEqual(self.lesson["status"], "review")
        self.assertEqual(self.lesson["content_state"], "localized")

    def test_previous_lesson_remains_published(self):
        previous = next(x for x in self.catalog["lessons"] if x["uid"] == "les-a-0173")
        self.assertEqual(previous["status"], "published")
        self.assertEqual(previous["url_i18n"]["ru"], "lessons/a-7-2-3-les-a-0173.html")


if __name__ == "__main__":
    unittest.main()
