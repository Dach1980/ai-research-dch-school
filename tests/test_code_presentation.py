from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]

PYTHON_LESSONS = [
    "lessons/a-3-how-machines-learn-from-data.html",
    "lessons/a-3-how-machines-learn-from-data-en.html",
    "lessons/a-3-how-machines-learn-from-data-zh.html",
    "lessons/a-4-what-is-machine-learning-model.html",
    "lessons/a-4-what-is-machine-learning-model-en.html",
    "lessons/a-4-what-is-machine-learning-model-zh.html",
    "lessons/a-5-how-to-evaluate-a-model.html",
    "lessons/a-5-how-to-evaluate-a-model-en.html",
    "lessons/a-5-how-to-evaluate-a-model-zh.html",
]


class CodePresentationTests(unittest.TestCase):
    def test_python_examples_are_explicitly_labelled(self):
        for relative_path in PYTHON_LESSONS:
            source = (ROOT / relative_path).read_text(encoding="utf-8")
            self.assertIn("language-python", source, relative_path)
            self.assertIn("<pre", source, relative_path)

    def test_code_block_runtime_is_loaded_by_python_lessons(self):
        for relative_path in PYTHON_LESSONS:
            source = (ROOT / relative_path).read_text(encoding="utf-8")
            self.assertIn("../scripts/code-blocks.js", source)
            self.assertIn("../styles/main.css", source)

    def test_site_brand_uses_the_canonical_favicon_asset(self):
        pages = [
            "index.html",
            "lessons/a-3-how-machines-learn-from-data.html",
            "lessons/reader.html",
            "lessons/xai/01-what-and-why.html",
        ]
        for relative_path in pages:
            source = (ROOT / relative_path).read_text(encoding="utf-8")
            self.assertIn("assets/site-brand-icon.jpg", source)
            self.assertIn("assets/favicon.png", source)


if __name__ == "__main__":
    unittest.main()
