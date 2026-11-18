from __future__ import annotations

import json
import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = {
    "ru": "lessons/a-7-1-2-les-a-0169.html",
    "en": "lessons/a-7-1-2-les-a-0169-en.html",
    "zh": "lessons/a-7-1-2-les-a-0169-zh.html",
}


class ShellAudit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set((attrs.get("class") or "").split())
        self.tags.append((tag, attrs, classes))
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}:
            self.stack.append((tag, classes))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


class Lesson712ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data_path = ROOT / "lessons/data/xai-02-local-global.js"
        cls.script_path = ROOT / "scripts/xai-local-global-lesson.js"
        cls.data = cls.data_path.read_text(encoding="utf-8")
        cls.script = cls.script_path.read_text(encoding="utf-8")

    def test_three_canonical_shells_and_local_assets(self):
        for locale, relative in LOCALES.items():
            with self.subTest(locale=locale):
                page = (ROOT / relative).read_text(encoding="utf-8")
                parser = ShellAudit()
                parser.feed(page)
                self.assertRegex(page, rf'<html lang="{locale}')
                self.assertIn("scripts/main.js", page)
                self.assertIn("scripts/language-switcher.js", page)
                self.assertIn("scripts/lesson-layout.js", page)
                self.assertIn("scripts/xai-local-global-lesson.js", page)
                self.assertIn("data/xai-02-local-global.js", page)
                self.assertEqual(sum(1 for tag, _, classes in parser.tags if tag == "header" and "site-header" in classes), 1)
                self.assertEqual(sum(1 for tag, _, classes in parser.tags if tag == "footer" and "footer" in classes), 1)
                self.assertEqual(sum(1 for tag, _, classes in parser.tags if "lesson-nav" in classes), 1)
                footer = next((i for i, (tag, _, classes) in enumerate(parser.tags) if tag == "footer" and "footer" in classes), None)
                self.assertIsNotNone(footer)
                self.assertTrue(any("container" in classes for _, _, classes in parser.tags[footer + 1:]))

    def test_eight_complete_sections_and_localized_outcomes(self):
        ids = re.findall(r'id:"([a-z-]+)",\s*title:\{ru:', self.data)
        self.assertEqual(ids, ["scope", "local", "global", "aggregation", "method-choice", "lab", "limits", "summary"])
        for locale in ("ru", "en", "zh"):
            self.assertIn(f"{locale}:", self.data)
        self.assertIn("lesson.outcomes[locale]", self.script)
        self.assertIn("local explanation", self.data.lower())
        self.assertIn("global explanation", self.data.lower())
        self.assertIn("局部解释", self.data)
        self.assertIn("全局解释", self.data)

    def test_original_diagrams_have_accessible_labels_and_locale_parity(self):
        self.assertEqual(len(re.findall(r'<svg class="xai-svg"', self.data)), 9)
        self.assertEqual(len(re.findall(r'<svg class="xai-svg"[^>]+aria-label=', self.data)), 9)
        self.assertIn("Противоположные локальные эффекты", self.data)
        self.assertIn("Opposing local effects", self.data)
        self.assertIn("方向相反的局部效应", self.data)

    def test_lab_has_six_python_blocks_per_locale_and_reproducible_seed(self):
        self.assertEqual(len(re.findall(r'<pre><code class="language-python">', self.data)), 15)
        for required in ("default_rng(42)", "RandomForestRegressor", "permutation_importance", "PartialDependenceDisplay", "kind=\"both\""):
            self.assertIn(required, self.data)
        self.assertIn("not SHAP", self.data)
        self.assertIn("не SHAP", self.data)
        self.assertIn("不是 SHAP", self.data)

    def test_eight_localized_quiz_questions_with_explanations(self):
        self.assertEqual(len(re.findall(r'question:\{ru:', self.data)), 8)
        self.assertEqual(len(re.findall(r'answer:\d', self.data)), 8)
        self.assertIn("item.why", self.script)
        self.assertIn("aria-live", self.script)
        self.assertIn("dch-xai-local-global-712-", self.script)

    def test_javascript_syntax(self):
        for path in (self.data_path, self.script_path):
            result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_catalog_identity_and_locale_urls(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        matches = [item for item in catalog["lessons"] if item.get("uid") == "les-a-0169"]
        self.assertEqual(len(matches), 1)
        lesson = matches[0]
        self.assertEqual(lesson["code"], "7.1.2")
        self.assertEqual(lesson["track_uid"], "trk-a")
        self.assertEqual(lesson["theme_uid"], "thm-a-07")
        self.assertEqual(lesson["module_uid"], "mod-a-07-01")
        self.assertIn(lesson["status"], {"review", "published"})
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        for locale, path in LOCALES.items():
            self.assertEqual(lesson["url_i18n"][locale], path)
            self.assertTrue((ROOT / path).is_file())


if __name__ == "__main__":
    unittest.main()
