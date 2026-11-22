import ast
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0180"
ROUTES = {
    "ru": "lessons/a-9-2-1-les-a-0180.html",
    "en": "lessons/a-9-2-1-les-a-0180-en.html",
    "zh": "lessons/a-9-2-1-les-a-0180-zh.html",
}
EXPECTED_DIAGRAMS = [
    "neighborhood", "perturbations", "widths", "distanceWeights",
    "sampleSizes", "weightedFit", "coefficients", "fitComparison", "workflow",
]


class Lesson921LIMETests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lesson = next((item for item in cls.catalog["lessons"] if item["uid"] == UID), None)
        cls.data = (ROOT / "lessons/data/xai-09-lime-921.js").read_text(encoding="utf-8")
        cls.renderer = (ROOT / "scripts/xai-lime-921-lesson.js").read_text(encoding="utf-8")
        cls.practice = (ROOT / "lessons/practice/a-9-2-1-lime-neighborhood.py").read_text(encoding="utf-8")
        content_payload = cls.data.split("content:", 1)[1].split(",practiceCode:", 1)[0]
        cls.content = json.loads(content_payload)
        practice_payload = cls.data.split("practiceCode:", 1)[1].rsplit("};})();", 1)[0]
        cls.embedded_practice = json.loads(practice_payload)

    def test_catalog_identity_sequence_prerequisite_and_published_state(self):
        self.assertIsNotNone(self.lesson)
        self.assertEqual(self.lesson["code"], "9.2.1")
        self.assertEqual(self.lesson["status"], "published")
        self.assertEqual(self.lesson["content_state"], "published")
        self.assertEqual(self.lesson["prerequisite_uids"], ["les-a-0179"])
        self.assertEqual(self.lesson["module_uid"], "mod-a-09-02")
        self.assertEqual(self.lesson["theme_uid"], "thm-a-09")
        self.assertEqual(self.catalog["catalog_version"], "3.2.20-lesson-9-2-2-review")
        self.assertEqual(self.embedded_practice, self.practice)
        next_lesson = next(item for item in self.catalog["lessons"] if item["code"] == "9.2.2")
        self.assertEqual(next_lesson["status"], "review")
        self.assertEqual(next_lesson["prerequisite_uids"], [UID])

    def test_module_and_canonical_localized_routes(self):
        module = next(item for item in self.catalog["modules"] if item["uid"] == "mod-a-09-02")
        self.assertEqual(module["theme_uid"], "thm-a-09")
        self.assertEqual(module["number"], 2)
        self.assertEqual(set(self.lesson["url_i18n"]), {"ru", "en", "zh"})
        for locale, route in ROUTES.items():
            with self.subTest(locale=locale):
                self.assertEqual(self.lesson["url_i18n"][locale], route)
                page_path = ROOT / route
                self.assertTrue(page_path.is_file())
                page = page_path.read_text(encoding="utf-8")
                expected_lang = "zh-CN" if locale == "zh" else locale
                self.assertIn(f'<html lang="{expected_lang}">', page)
                self.assertIn('class="lesson-intro"', page)
                blocks = [
                    'class="lesson-intro"', 'id="lesson-outcomes"', 'id="lesson-sections"',
                    'id="lesson-practice"', 'id="lesson-sources"', 'id="lesson-navigation"',
                    'id="lesson-glossary"', 'id="lesson-quiz"', 'class="footer"',
                ]
                positions = [page.index(token) for token in blocks]
                self.assertEqual(positions, sorted(positions))
                for script in ("lesson-glossary.js", "lesson-svg-renderer.js",
                               "xai-09-lime-921.js", "xai-lime-921-lesson.js", "lesson-layout.js"):
                    self.assertIn(script, page)

    def test_three_locales_have_equivalent_structure_and_nine_semantic_diagrams(self):
        self.assertEqual(set(self.content), {"ru", "en", "zh"})
        reference_ids = None
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                content = self.content[locale]
                self.assertEqual(len(content["outcomes"]), 7)
                self.assertEqual(len(content["sections"]), 9)
                self.assertEqual(len(content["glossary"]), 10)
                self.assertEqual(len(content["quiz"]), 8)
                self.assertEqual(list(content["diagrams"]), EXPECTED_DIAGRAMS)
                section_ids = [section[0] for section in content["sections"]]
                diagram_ids = [section[3] for section in content["sections"]]
                self.assertEqual(diagram_ids, EXPECTED_DIAGRAMS)
                if reference_ids is None:
                    reference_ids = (section_ids, diagram_ids)
                else:
                    self.assertEqual((section_ids, diagram_ids), reference_ids)
                for key in EXPECTED_DIAGRAMS:
                    spec = content["diagrams"][key]
                    self.assertTrue(spec["title"])
                    self.assertTrue(spec["description"])
                    self.assertTrue(spec["caption"])
                    self.assertGreaterEqual(len(spec["columns"]), 2)
                    self.assertGreaterEqual(len(spec["rows"]), 2)
                    self.assertTrue(all(len(row) == len(spec["columns"]) for row in spec["rows"]))

    def test_kernel_width_math_and_shared_example_are_consistent(self):
        required = {
            "ru": ("kernel_width", "0,360", "0,801", "0,946", "0,017", "0,411",
                   "0,28", "85 000", "f(x₀)", "g(x₀)", "условн"),
            "en": ("kernel_width", "0.360", "0.801", "0.946", "0.017", "0.411",
                   "0.28", "85,000", "f(x₀)", "g(x₀)", "hypothetical"),
            "zh": ("kernel_width", "0.360", "0.801", "0.946", "0.017", "0.411",
                   "0.28", "85,000", "f(x₀)", "g(x₀)", "虚构"),
        }
        for locale, tokens in required.items():
            text = " ".join(
                [self.content[locale]["lead"]]
                + self.content[locale]["outcomes"]
                + [paragraph for section in self.content[locale]["sections"] for paragraph in section[2]]
                + [self.content[locale]["diagrams"][key]["caption"] for key in EXPECTED_DIAGRAMS]
            )
            for token in tokens:
                with self.subTest(locale=locale, token=token):
                    self.assertIn(token.lower(), text.lower())
        self.assertIn("sqrt", self.practice.lower())
        self.assertIn("kernel_width", self.practice)
        self.assertIn("num_samples", self.practice)

    def test_hypothetical_example_is_separate_from_executable_dataset(self):
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                all_text = " ".join(
                    [self.content[locale]["practice"]["intro"]]
                    + [paragraph for section in self.content[locale]["sections"] for paragraph in section[2]]
                ).lower()
                self.assertIn("breast cancer wisconsin", all_text)
                self.assertTrue(any(term in all_text for term in ("hypothetical", "вымышлен", "虚构")))
        self.assertIn("load_breast_cancer()", self.practice)
        self.assertIn("RandomForestClassifier", self.practice)
        self.assertIn("random_state=SEED", self.practice)
        self.assertIn("predict_fn=model.predict_proba", self.practice)

    def test_practice_code_is_valid_and_compares_one_parameter_at_a_time(self):
        ast.parse(self.practice)
        self.assertIn("kernel_width", self.practice)
        self.assertIn("num_samples", self.practice)
        self.assertIn("for width in (2.0, default_width, 7.0)", self.practice)
        self.assertIn("for sample_count in (500, 1500, 3000)", self.practice)
        self.assertIn("instance_index = 0", self.practice)
        self.assertIn("random_state=SEED", self.practice)
        self.assertIn("first_scalar(exp.local_pred, class_id)", self.practice)
        self.assertIn("first_scalar(exp.score, class_id)", self.practice)
        self.assertIn("exp.as_list(label=class_id)", self.practice)
        self.assertNotIn("classifier_fn=", self.practice)

    def test_renderer_uses_shared_svg_and_glossary_components(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("DCHLessonComponents.renderGlossary", self.renderer)
        self.assertIn('layout:"table"', self.renderer)
        self.assertIn("data.diagrams[diagramKey]", self.renderer)
        self.assertIn('make("div","xai-canonical-section-content")', self.renderer)
        self.assertIn("pre.dataset.language=language", self.renderer)
        self.assertIn('codeBlock("bash",data.practice.install)', self.renderer)
        self.assertIn('codeBlock("bash",data.practice.run)', self.renderer)
        self.assertIn('codeBlock("python",lesson.practiceCode)', self.renderer)
        self.assertNotIn("createElementNS", self.renderer)
        self.assertNotIn("lesson-nav", self.renderer)
        self.assertNotIn("language-switcher", self.renderer)

    def test_lesson_does_not_expand_into_next_lesson_scope(self):
        for locale in ("ru", "en", "zh"):
            text = " ".join(
                paragraph for section in self.content[locale]["sections"] for paragraph in section[2]
            ).lower()
            self.assertNotIn("confidence interval", text)
            self.assertNotIn("доверительн", text)
            self.assertNotIn("置信区间", text)
            self.assertIn("9.2.2", text)


if __name__ == "__main__":
    unittest.main()
