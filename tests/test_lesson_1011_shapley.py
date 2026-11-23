import ast
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0182"
ROUTES = {
    "ru": "lessons/a-10-1-1-les-a-0182.html",
    "en": "lessons/a-10-1-1-les-a-0182-en.html",
    "zh": "lessons/a-10-1-1-les-a-0182-zh.html",
}
DIAGRAMS = ("coalitions", "marginal", "permutations", "weights", "axioms")


class Lesson1011ShapleyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        raw = (ROOT / "lessons/data/xai-10-shap-1011.js").read_text(encoding="utf-8")
        payload = raw.split("window.DCH_SHAP_1011=", 1)[1].split(";\n})();", 1)[0]
        cls.data = json.loads(payload)
        cls.renderer = (ROOT / "scripts/xai-shap-1011-lesson.js").read_text(encoding="utf-8")
        cls.practice = (ROOT / "lessons/practice/a-10-1-1-shapley-values.py").read_text(encoding="utf-8")

    def test_catalog_identity_and_review_state(self):
        lesson = next(x for x in self.catalog["lessons"] if x["uid"] == UID)
        self.assertEqual(lesson["code"], "10.1.1")
        self.assertEqual(lesson["status"], "review")
        self.assertEqual(lesson["content_state"], "localized")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0181"])
        self.assertEqual(lesson["module_uid"], "mod-a-10-01")
        self.assertEqual(lesson["theme_uid"], "thm-a-10")
        self.assertEqual(len({x["uid"] for x in self.catalog["lessons"]}), len(self.catalog["lessons"]))
        self.assertEqual(len([x for x in self.catalog["lessons"] if x["module_uid"] == "mod-a-10-01"]), 1)

    def test_three_locales_are_equivalent(self):
        self.assertEqual(set(self.data["content"]), {"ru", "en", "zh"})
        expected = None
        for locale, content in self.data["content"].items():
            with self.subTest(locale=locale):
                self.assertEqual(len(content["outcomes"]), 7)
                self.assertEqual(len(content["sections"]), 9)
                self.assertEqual(len(content["sources"]), 8)
                self.assertEqual(len(content["glossary"]), 14)
                self.assertEqual(len(content["quiz"]), 10)
                active = [x[3] for x in content["sections"] if x[3]]
                self.assertEqual(active, list(DIAGRAMS))
                self.assertEqual(set(content["diagrams"]), {"game", *DIAGRAMS})
                for key in DIAGRAMS:
                    spec = content["diagrams"][key]
                    self.assertTrue(spec["title"] and spec["description"] and spec["caption"])
                    self.assertIn(spec["layout"], {"causal-flow", "comparison-table", "experiment-flow"})
                shape = (len(content["outcomes"]), len(content["sections"]), len(content["sources"]),
                         len(content["glossary"]), len(content["quiz"]), active)
                if expected is None:
                    expected = shape
                else:
                    self.assertEqual(shape, expected)
                for q in content["quiz"]:
                    self.assertEqual(len(q[1]), 4)
                    self.assertIn(q[2], range(4))
                    self.assertTrue(q[3])

    def test_all_localized_routes_use_canonical_shell(self):
        for locale, route in ROUTES.items():
            page = (ROOT / route).read_text(encoding="utf-8")
            self.assertIn('id="lesson-navigation"', page)
            self.assertIn('id="lesson-glossary"', page)
            self.assertIn('id="lesson-quiz"', page)
            self.assertIn("xai-10-shap-1011.js", page)
            self.assertIn("xai-shap-1011-lesson.js", page)
            self.assertNotIn("locale-links", page)
            self.assertNotIn("language-switcher", page)

    def test_practice_has_two_independent_algorithms_and_axiom_checks(self):
        ast.parse(self.practice)
        self.assertIn("def shapley_by_coalitions", self.practice)
        self.assertIn("def shapley_by_permutations", self.practice)
        self.assertIn("permutations(players)", self.practice)
        self.assertIn("factorial(size)", self.practice)
        self.assertIn("Efficiency", self.practice)
        self.assertIn("Symmetry", self.practice)
        self.assertIn("Dummy", self.practice)

    def test_renderer_uses_shared_typed_svg_and_glossary(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)
        self.assertNotIn("lesson-navigation", self.renderer)
        self.assertNotIn("innerHTML", self.renderer)


if __name__ == "__main__":
    unittest.main()
