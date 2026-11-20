import ast
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0173"
LOCALES = ("ru", "en", "zh")
ROUTES = {
    "ru": "lessons/a-7-2-3-les-a-0173.html",
    "en": "lessons/a-7-2-3-les-a-0173-en.html",
    "zh": "lessons/a-7-2-3-les-a-0173-zh.html",
}


class Lesson723FaithfulnessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lesson = next((x for x in cls.catalog["lessons"] if x["uid"] == UID), None)
        cls.data = (ROOT / "lessons/data/xai-06-faithfulness.js").read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-faithfulness-lesson.js").read_text(encoding="utf-8")
        cls.python = (ROOT / "lessons/practice/a-7-2-3-faithfulness.py").read_text(encoding="utf-8")

    def test_catalog_registration_keeps_review_gate(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson["code"], "7.2.3")
        self.assertEqual(self.lesson["track_uid"], "trk-a")
        self.assertEqual(self.lesson["theme_uid"], "thm-a-07")
        self.assertEqual(self.lesson["module_uid"], "mod-a-07-02")
        self.assertEqual(self.lesson["status"], "review")
        self.assertEqual(self.lesson["content_state"], "localized")
        self.assertEqual(self.lesson["prerequisite_uids"], ["les-a-0172"])
        self.assertEqual(set(self.lesson["url_i18n"]), set(LOCALES))
        for locale, route in ROUTES.items():
            self.assertEqual(self.lesson["url_i18n"][locale], route)
            self.assertTrue((ROOT / route).is_file(), route)

    def test_canonical_dom_order_and_shared_shell(self):
        blocks = ["lesson-intro", "lesson-outcomes", "lesson-sections", "lesson-practice", "lesson-sources", "lesson-navigation", "lesson-glossary", "lesson-quiz"]
        for locale, route in ROUTES.items():
            source = (ROOT / route).read_text(encoding="utf-8")
            positions = [source.index('class="lesson-intro"')] + [source.index(f'id="{block}"') for block in blocks[1:]]
            self.assertEqual(positions, sorted(positions), locale)
            self.assertIn('class="footer"', source)
            self.assertIn("../scripts/lesson-svg-renderer.js", source)
            self.assertIn("../scripts/lesson-glossary.js", source)
            self.assertIn("../scripts/lesson-layout.js", source)

    def test_three_locale_content_has_equal_depth(self):
        required = ["Faithfulness", "Plausibility", "Interpretability", "Feature Deletion", "Feature Insertion", "Distribution Shift", "Out-of-Distribution", "Sanity Checks"]
        self.assertIn("Faithfulness", self.data)
        self.assertEqual(self.data.count("D(k) = S(f, X, y)"), 3)
        for token in required:
            self.assertIn(token.lower(), self.data.lower())
        self.assertIn('type:"faithfulness-"+kind', self.renderer)
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("renderGlossary", self.renderer)
        self.assertEqual(self.data.count('id:"plausibility"'), 3)
        self.assertEqual(self.data.count('id:"definitions"'), 3)
        self.assertEqual(self.data.count('id:"tests"'), 3)
        self.assertEqual(self.data.count('id:"pfi"'), 3)
        self.assertGreaterEqual(self.data.count('id:"limits"'), 3)
        self.assertEqual(self.data.count('id:"protocol"'), 3)
        self.assertEqual(self.data.count('id:"summary"'), 3)
        self.assertGreaterEqual(self.data.count('q:"'), 36)
        self.assertGreaterEqual(self.data.count('["'), 36)

    def test_glossary_quiz_and_sources_are_complete(self):
        self.assertGreaterEqual(self.data.count('["Faithfulness'), 1)
        self.assertGreaterEqual(self.data.count('["Plausibility'), 1)
        self.assertIn("Adebayo et al. (2018)", self.data)
        self.assertIn("https://doi.org/", self.data) if "https://doi.org/" in self.data else self.assertIn("proceedings.neurips.cc", self.data)
        self.assertIn("question.why.forEach", self.renderer)
        self.assertIn("Explanation Quality", self.data)

    def test_python_lab_is_reproducible_and_syntactically_valid(self):
        ast.parse(self.python)
        for token in ("random_state=RANDOM_STATE", "n_repeats=30", "permutation_importance(", "deletion_auc", "insertion_auc", "Randomization", "not causal interventions"):
            self.assertIn(token.lower(), self.python.lower())

    def test_renderer_uses_shared_svg_and_glossary_components(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)
        self.assertNotIn("createElementNS", self.renderer)
        self.assertNotIn("<svg", self.renderer)
        self.assertIn('pre.dataset.language="python"', self.renderer)

    def test_published_predecessor_is_unchanged_and_new_lesson_is_not_published(self):
        previous = next(x for x in self.catalog["lessons"] if x["uid"] == "les-a-0172")
        self.assertEqual(previous["status"], "published")
        self.assertEqual(previous["url_i18n"]["ru"], "lessons/a-7-2-2-les-a-0172.html")
        self.assertEqual(self.lesson["status"], "review")


if __name__ == "__main__":
    unittest.main()
