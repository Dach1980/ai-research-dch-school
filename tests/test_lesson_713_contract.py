import json
import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UID = "les-a-0170"
ROUTES = {
    "ru": "lessons/a-7-1-3-les-a-0170.html",
    "en": "lessons/a-7-1-3-les-a-0170-en.html",
    "zh": "lessons/a-7-1-3-les-a-0170-zh.html",
}

class Roots(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append((tag, set((a.get("class") or "").split()), a))

class Lesson713Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data_path = ROOT / "lessons/data/xai-03-intrinsic-posthoc.js"
        cls.renderer_path = ROOT / "scripts/xai-intrinsic-posthoc-lesson.js"
        cls.data = cls.data_path.read_text(encoding="utf-8")
        cls.renderer = cls.renderer_path.read_text(encoding="utf-8")
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))

    def test_three_locale_pages_use_canonical_shell_and_assets(self):
        for locale, route in ROUTES.items():
            page = (ROOT / route).read_text(encoding="utf-8")
            parser = Roots(); parser.feed(page)
            self.assertIn('<html lang="' + ("zh-CN" if locale == "zh" else locale) + '"', page)
            self.assertIn('id="lesson-intro"', page) if 'id="lesson-intro"' in page else self.assertIn('class="lesson-intro"', page)
            for root in ('id="lesson-outcomes"', 'id="lesson-sections"', 'id="lesson-practice"', 'id="lesson-sources"', 'id="lesson-navigation"', 'id="lesson-glossary"', 'id="lesson-quiz"'):
                self.assertIn(root, page)
            self.assertIn("data/xai-03-intrinsic-posthoc.js", page)
            self.assertIn("scripts/xai-intrinsic-posthoc-lesson.js", page)
            self.assertIn("scripts/lesson-layout.js", page)
            self.assertEqual(sum(1 for tag, classes, _ in parser.tags if tag == "header" and "site-header" in classes), 1)
            self.assertEqual(sum(1 for tag, classes, _ in parser.tags if tag == "footer" and "footer" in classes), 1)
            self.assertEqual(sum(1 for tag, classes, _ in parser.tags if tag == "nav" and "lesson-nav" in classes), 1)
            self.assertNotIn("language-switcher", page)

    def test_catalog_identity_review_state_and_previous_lesson(self):
        rows = [x for x in self.catalog["lessons"] if x.get("uid") == UID]
        self.assertEqual(len(rows), 1)
        item = rows[0]
        self.assertEqual(item["code"], "7.1.3")
        self.assertEqual(item["status"], "review")
        self.assertEqual(item["content_state"], "localized")
        self.assertEqual(item["prerequisite_uids"], ["les-a-0169"])
        self.assertEqual(item["url_i18n"], ROUTES)
        previous = next(x for x in self.catalog["lessons"] if x["uid"] == "les-a-0169")
        self.assertEqual(previous["status"], "published")
        self.assertEqual(previous["content_state"], "published")
        self.assertNotIn("les-a-0170", {x["uid"] for x in self.catalog["planets"]})

    def test_localized_content_has_six_sections_and_complete_outcomes(self):
        self.assertEqual(len(re.findall(r'"id": "(distinction|intrinsic|posthoc|fidelity|tradeoffs|lab)"', self.data)), 6)
        for locale in ("ru", "en", "zh"):
            self.assertIn('"' + locale + '": [', self.data)
        self.assertIn("Intrinsic interpretability", self.data)
        self.assertIn("内在可解释性", self.data)
        self.assertIn("Fidelity", self.data)
        self.assertIn("忠实度", self.data)

    def test_three_localized_diagrams_have_accessible_labels(self):
        self.assertEqual(self.data.count('<svg class="xai-svg"'), 3)
        self.assertEqual(self.data.count('role="img" aria-label='), 3)
        self.assertIn("两条路径", self.data)

    def test_python_lab_is_reproducible_and_has_no_claim_of_causality(self):
        self.assertEqual(self.data.count('class="language-python"'), 18)
        for token in ("make_friedman1", "random_state=42", "LinearRegression", "RandomForestRegressor", "permutation_importance", "mean_squared_error"):
            self.assertIn(token, self.data)
        for token in ("не причинный эффект", "not a causal effect", "不是因果效应"):
            self.assertIn(token, self.data)

    def test_glossary_and_quiz_have_ten_terms_and_ten_questions_per_locale(self):
        for locale in ("ru", "en", "zh"):
            block = self.data.split('"glossary": {', 1)[1].split('"quiz": {', 1)[0]
            match = re.search(r'"' + locale + r'": \[(.*?)\n\s*\]', block, re.S)
            self.assertIsNotNone(match)
            self.assertEqual(len(re.findall(r'\["', match.group(1))), 10)
        self.assertEqual(len(re.findall(r'"q": \{', self.data)), 10)
        self.assertIn("item.w", self.renderer)
        self.assertIn("aria-live", self.renderer)

    def test_canonical_dom_roots_are_in_contract_order(self):
        page = (ROOT / ROUTES["ru"]).read_text(encoding="utf-8")
        ordered = ['class="lesson-intro"', 'id="lesson-outcomes"', 'id="lesson-sections"', 'id="lesson-practice"', 'id="lesson-sources"', 'id="lesson-navigation"', 'id="lesson-glossary"', 'id="lesson-quiz"', 'class="footer"']
        positions = [page.index(x) for x in ordered]
        self.assertEqual(positions, sorted(positions))

    def test_javascript_syntax(self):
        for path in (self.data_path, self.renderer_path):
            result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)

if __name__ == "__main__":
    unittest.main()
