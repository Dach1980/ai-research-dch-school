import ast
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0175"
ROUTES = {
    "ru": "lessons/a-8-1-2-les-a-0175.html",
    "en": "lessons/a-8-1-2-les-a-0175-en.html",
    "zh": "lessons/a-8-1-2-les-a-0175-zh.html",
}

class Lesson812ICETests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lesson = next(x for x in cls.catalog["lessons"] if x["uid"] == UID)
        cls.data_source = (ROOT / "lessons/data/xai-08-ice.js").read_text(encoding="utf-8")
        match = re.search(r"const content=(\{.*\});\nconst practiceCode=", cls.data_source, re.S)
        if not match:
            raise AssertionError("Could not extract localized ICE data")
        cls.data = json.loads(match.group(1))
        code_match = re.search(r"const practiceCode=(.*);\nwindow\.DCH_ICE_812", cls.data_source, re.S)
        cls.python = json.loads(code_match.group(1)) if code_match else ""
        cls.renderer = (ROOT / "scripts/xai-ice-lesson.js").read_text(encoding="utf-8")

    def test_catalog_registration_and_publication(self):
        self.assertEqual(self.lesson["code"], "8.1.2")
        self.assertEqual(self.lesson["status"], "published")
        self.assertEqual(self.lesson["content_state"], "published")
        self.assertEqual(self.lesson["prerequisite_uids"], ["les-a-0174"])
        self.assertEqual(set(self.lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(len([x["uid"] for x in self.catalog["lessons"]]), len(set(x["uid"] for x in self.catalog["lessons"])))

    def test_canonical_pages_and_locale_assets(self):
        for locale, route in ROUTES.items():
            page = (ROOT / route).read_text(encoding="utf-8")
            self.assertIn('class="lesson-intro"', page)
            ids = ['id="lesson-outcomes"', 'id="lesson-sections"', 'id="lesson-practice"', 'id="lesson-sources"', 'id="lesson-navigation"', 'id="lesson-glossary"', 'id="lesson-quiz"']
            positions = [page.index('class="lesson-intro"')] + [page.index(x) for x in ids]
            self.assertEqual(positions, sorted(positions), locale)
            for script in ("language-switcher.js", "theme-system.js", "lesson-glossary.js", "lesson-svg-renderer.js", "xai-ice-lesson.js", "lesson-layout.js"):
                self.assertIn(script, page)
            self.assertIn('class="footer"', page)
            self.assertEqual(self.lesson["url_i18n"][locale], route)

    def test_localization_parity_and_content_depth(self):
        for locale in ("ru", "en", "zh"):
            content = self.data[locale]
            self.assertEqual(len(content["outcomes"]), 10)
            self.assertEqual(len(content["sections"]), 8)
            self.assertEqual(len(content["glossary"]), 12)
            self.assertEqual(len(content["quiz"]), 12)
            self.assertEqual(len(content["sources"]), 5)
            self.assertEqual(len(content["practice"]), 4)
        self.assertEqual([x[0] for x in self.data["ru"]["sections"]], [x[0] for x in self.data["en"]["sections"]])
        self.assertEqual([x[0] for x in self.data["en"]["sections"]], [x[0] for x in self.data["zh"]["sections"]])

    def test_ice_math_and_pdp_relation(self):
        self.assertIn("ICEᵢⱼ(z) = f(z, xᵢ,₋ⱼ)", self.data_source)
        self.assertIn("PDⱼ(z) = (1/n) Σᵢ ICEᵢⱼ(z)", self.data_source)
        self.assertIn("cICEᵢⱼ(z) = ICEᵢⱼ(z) − ICEᵢⱼ(z₀)", self.data_source)

    def test_three_shared_svg_diagrams_and_unique_ids(self):
        self.assertIn("DCHLessonSVG.render", self.renderer)
        self.assertIn("let diagramSequence=0", self.renderer)
        self.assertIn('diagram("one")', self.renderer)
        self.assertIn('?"family":"center"', self.renderer)
        self.assertIn('?"family":"center"', self.renderer)
        self.assertNotIn("createElementNS", self.renderer)

    def test_python_lab_syntax_and_ice_calculation(self):
        ast.parse(self.python)
        for token in ("RandomForestRegressor", 'kind="both"', "ice[row_idx]", "centered = ice - ice[:, [baseline_idx]]", "SEED = 42"):
            self.assertIn(token, self.python)

if __name__ == "__main__":
    unittest.main()
