import ast
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0181"
ROUTES = {
    "ru": "lessons/a-9-2-2-les-a-0181.html",
    "en": "lessons/a-9-2-2-les-a-0181-en.html",
    "zh": "lessons/a-9-2-2-les-a-0181-zh.html",
}
DIAGRAMS = ("matrix", "sources", "metrics")


class Lesson922LIMETests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lesson = next((x for x in cls.catalog["lessons"] if x["uid"] == UID), None)
        raw = (ROOT / "lessons/data/xai-09-lime-922.js").read_text(encoding="utf-8")
        payload = raw.split("window.DCH_LIME_922=", 1)[1].split(";\n})();", 1)[0]
        cls.data = json.loads(payload)
        cls.renderer = (ROOT / "scripts/xai-lime-922-lesson.js").read_text(encoding="utf-8")
        cls.practice = (ROOT / "lessons/practice/a-9-2-2-lime-stability.py").read_text(encoding="utf-8")

    def test_catalog_identity_prerequisite_and_review_state(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson["code"], "9.2.2")
        self.assertEqual(self.lesson["status"], "review")
        self.assertEqual(self.lesson["content_state"], "localized")
        self.assertEqual(self.lesson["prerequisite_uids"], ["les-a-0180"])
        self.assertEqual(self.lesson["module_uid"], "mod-a-09-02")
        self.assertEqual(self.lesson["theme_uid"], "thm-a-09")
        self.assertEqual(self.catalog["catalog_version"], "3.2.20-lesson-9-2-2-review")
        self.assertEqual(len({x["uid"] for x in self.catalog["lessons"]}), len(self.catalog["lessons"]))
        module_codes = [x["code"] for x in self.catalog["lessons"] if x["module_uid"] == self.lesson["module_uid"]]
        self.assertEqual(len(module_codes), len(set(module_codes)))

    def test_three_locales_have_equivalent_structure(self):
        self.assertEqual(set(self.data["content"]), {"ru", "en", "zh"})
        reference = None
        for locale, content in self.data["content"].items():
            with self.subTest(locale=locale):
                self.assertEqual(len(content["outcomes"]), 7)
                self.assertEqual(len(content["sections"]), 8)
                self.assertEqual(len(content["glossary"]), 12)
                self.assertEqual(len(content["quiz"]), 12)
                self.assertEqual(len(content["sources"]), 8)
                self.assertEqual(set(content["diagrams"]), set(DIAGRAMS))
                self.assertEqual([x[3] for x in content["sections"] if x[3]], list(DIAGRAMS))
                for key in DIAGRAMS:
                    diagram = content["diagrams"][key]
                    self.assertTrue(diagram["title"])
                    self.assertTrue(diagram["description"])
                    self.assertTrue(diagram["caption"])
                    self.assertGreaterEqual(len(diagram["columns"]), 2)
                    self.assertGreaterEqual(len(diagram["rows"]), 2)
                    self.assertTrue(all(len(row) == len(diagram["columns"]) for row in diagram["rows"]))
                structure = (
                    [x[0] for x in content["sections"]],
                    [x[3] for x in content["sections"]],
                    len(content["outcomes"]), len(content["glossary"]),
                    len(content["quiz"]), len(content["sources"]),
                )
                if reference is None:
                    reference = structure
                else:
                    self.assertEqual(structure, reference)
                for question in content["quiz"]:
                    self.assertEqual(len(question[1]), 4)
                    self.assertIn(question[2], range(4))
                    self.assertTrue(question[3])

    def test_practice_is_complete_reproducible_and_syntax_valid(self):
        ast.parse(self.practice)
        for token in (
            "load_breast_cancer()", "RandomForestClassifier", "random_state=SEED",
            "LimeTabularExplainer", "REPEATS = 10", "NUM_SAMPLES = 2000",
            "pairwise_jaccard", "pairwise_spearman", "kernel_width",
            "spearmanr", "train_test_split", "data support",
        ):
            self.assertIn(token, self.practice)
        for locale in ("ru", "en", "zh"):
            practice = self.data["content"][locale]["practice"]
            self.assertIn("lime==0.2.0.1", practice["install"])
            self.assertIn("a-9-2-2-lime-stability.py", practice["run"])
            self.assertEqual(len(practice["steps"]), 6)
        self.assertEqual(self.data["practiceCode"], self.practice)

    def test_shell_and_canonical_dom_order_for_all_locales(self):
        blocks = [
            'class="lesson-intro"', 'id="lesson-outcomes"', 'id="lesson-sections"',
            'id="lesson-practice"', 'id="lesson-sources"', 'id="lesson-navigation"',
            'id="lesson-glossary"', 'id="lesson-quiz"', 'class="footer"',
        ]
        for locale, route in ROUTES.items():
            with self.subTest(locale=locale):
                page = (ROOT / route).read_text(encoding="utf-8")
                positions = [page.index(token) for token in blocks]
                self.assertEqual(positions, sorted(positions))
                self.assertIn('class="lesson-nav" id="lesson-navigation"', page)
                self.assertIn("xai-09-lime-922.js", page)
                self.assertIn("xai-lime-922-lesson.js", page)
                self.assertIn("lesson-svg-renderer.js", page)
                self.assertIn("code-blocks.js", page)
                self.assertIn("lesson-layout.js", page)
                self.assertIn("https://dchai.ru/" + route, page)

    def test_renderer_uses_shared_components_and_no_local_shell_ownership(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)
        self.assertIn('layout:"table"', self.renderer)
        self.assertIn('codeBlock("bash",data.practice.install)', self.renderer)
        self.assertIn('codeBlock("bash",data.practice.run)', self.renderer)
        self.assertIn('codeBlock("python",lesson.practiceCode)', self.renderer)
        self.assertNotIn("createElementNS", self.renderer)
        self.assertNotIn("lesson-nav", self.renderer)
        self.assertNotIn("language-switcher", self.renderer)

    def test_accepted_921_remains_published_and_is_prerequisite(self):
        accepted = next(x for x in self.catalog["lessons"] if x["uid"] == "les-a-0180")
        self.assertEqual(accepted["status"], "published")
        self.assertEqual(accepted["content_state"], "published")
        self.assertEqual(accepted["url_i18n"]["ru"], "lessons/a-9-2-1-les-a-0180.html")
        self.assertEqual(self.lesson["prerequisite_uids"], [accepted["uid"]])


if __name__ == "__main__":
    unittest.main()
