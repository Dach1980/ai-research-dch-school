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
        cls.curriculum = json.loads((ROOT / "data/catalog/curriculum-canonical-v1.json").read_text(encoding="utf-8"))
        cls.lesson = next((x for x in cls.catalog["lessons"] if x["uid"] == UID), None)
        cls.data = (ROOT / "lessons/data/xai-08-pdp.js").read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-pdp-lesson.js").read_text(encoding="utf-8")
        cls.svg_renderer = (ROOT / "scripts/lesson-svg-renderer.js").read_text(encoding="utf-8")
        cls.python = (ROOT / "lessons/practice/a-8-1-1-partial-dependence.py").read_text(encoding="utf-8")

    def test_catalog_registration_and_review_gate(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson["code"], "8.1.1")
        self.assertEqual(self.lesson["theme_uid"], "thm-a-08")
        self.assertEqual(self.lesson["module_uid"], "mod-a-08-01")
        self.assertEqual(self.lesson["status"], "review")
        self.assertEqual(self.lesson["content_state"], "localized")
        canonical = next(x for x in self.curriculum["tracks"] if x["uid"] == "trk-a")["themes"][7]["modules"][0]["lessons"][0]
        self.assertEqual(canonical["uid"], UID)
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

    def test_ten_learning_outcomes_per_locale(self):
        block = self.data.split("const outcomes={", 1)[1].split("const content={", 1)[0]
        for locale, next_locale in (("ru", "en"), ("en", "zh"), ("zh", None)):
            localized = block.split(locale + ":[", 1)[1]
            if next_locale:
                localized = localized.split("\n" + next_locale + ":[", 1)[0]
            count = sum(1 for line in localized.splitlines() if line.strip().startswith('"'))
            self.assertEqual(count, 10, locale)

    def test_seven_sections_and_three_figure_specs_per_locale(self):
        for token in ('["question"', '["definition"', '["grid"', '["two-way"', '["interpret"', '["correlation"', '["compare"'):
            self.assertEqual(self.data.count(token), 3, token)
        for token in (',"workflow"],', ',"reading"],', ',"correlation"]'):
            self.assertEqual(self.data.count(token), 3, token)

    def test_twelve_glossary_terms_and_twelve_quiz_questions_per_locale(self):
        glossary_block = self.data.split("const glossary = {", 1)[1].split("const commonSources=", 1)[0]
        quiz_block = self.data.split("const sharedQuiz = {", 1)[1].split("const sections =", 1)[0]
        for block in (glossary_block, quiz_block):
            for locale, next_locale in (("ru", "en"), ("en", "zh"), ("zh", None)):
                localized = block.split(locale + ":[", 1)[1]
                if next_locale:
                    localized = localized.split("\n" + next_locale + ":[", 1)[0]
                self.assertEqual(localized.count('\n["'), 12, locale)
        self.assertIn("График частичной зависимости", self.data)
        self.assertIn("Partial Dependence Plot", self.data)
        self.assertIn("部分依赖图", self.data)
        self.assertIn("Накопленные локальные эффекты", self.data)
        self.assertIn("Accumulated Local Effects", self.data)
        self.assertIn("累积局部效应", self.data)
        self.assertGreaterEqual(self.data.count('["'), 36)
        self.assertIn('glossary:"Словарь терминов"', self.renderer)
        self.assertIn('glossary:"Key terms"', self.renderer)
        self.assertIn('glossary:"术语词典"', self.renderer)

    def test_renderer_uses_shared_accessible_theme_aware_svg(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertNotIn("createElementNS", self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)
        for diagram_type in ('type:"pdp-workflow"', 'type:"pdp-curve-reading"', 'type:"pdp-feature-dependence"'):
            self.assertIn(diagram_type, self.renderer)
        self.assertIn('"plot"', self.svg_renderer)
        self.assertIn('"scatter"', self.svg_renderer)
        self.assertIn('data-diagram-renderer', self.svg_renderer)
        self.assertIn('aria-labelledby', self.svg_renderer)
        self.assertIn('var(--lds-ink)', self.svg_renderer)
        self.assertIn('var(--lds-surface)', self.svg_renderer)

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
