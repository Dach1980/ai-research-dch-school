import ast
import html
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-4-4.html",
    "en": ROOT / "lessons/a-1-4-4-en.html",
    "zh": ROOT / "lessons/a-1-4-4-zh.html",
}
TITLES = {
    "ru": "Обобщающая способность модели",
    "en": "Model Generalization",
    "zh": "模型的泛化能力",
}

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.hrefs.append(href)

class Lesson144Tests(unittest.TestCase):
    def test_localized_html_and_local_links(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                self.assertTrue(path.is_file())
                source = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}">', source)
                self.assertIn(TITLES[locale], source)
                self.assertIn('rel="canonical"', source)
                self.assertIn("lesson-144.css", source)
                self.assertIn("lesson-design-system.css", source)
                self.assertIn("theme-system.js", source)
                self.assertIn("language-switcher.js", source)
                parser = Links()
                parser.feed(source)
                parser.close()
                for href in parser.hrefs:
                    if href.startswith(("http://", "https://", "mailto:", "#")):
                        continue
                    target = (path.parent / href.split("#", 1)[0]).resolve()
                    self.assertTrue(target.exists(), f"{path.name}: missing {href}")

    def test_equal_core_structure_all_locales(self):
        for locale, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="formula"'), 4)
            self.assertEqual(source.count('class="lesson-144-figure"'), 4)
            self.assertEqual(source.count("<title id="), 4)
            self.assertEqual(source.count("<desc id="), 4)
            self.assertEqual(source.count('class="glossary-entry"'), 10)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            self.assertEqual(source.count('class="lesson-check-feedback"'), 8)
            self.assertEqual(source.count('class="lesson-outcomes"'), 1)
            self.assertIn('class="lesson-nav"', source)
            self.assertIn('class="lesson-sources"', source)
            self.assertIn('class="lesson-problem lesson-practice-task"', source)
            self.assertLess(source.index('class="lesson-sources"'), source.index('class="lesson-nav"'))
            self.assertLess(source.index('class="lesson-nav"'), source.index('class="lesson-glossary"'))
            self.assertLess(source.index('class="lesson-glossary"'), source.index('class="lesson-check"'))
            self.assertIn('class="language-python"', source)
            self.assertIn("Pipeline", source)
            localized_leakage = {"ru": "утечка данных", "en": "data leakage", "zh": "数据泄漏"}
            self.assertIn(localized_leakage[locale], source.lower())
            for svg in re.findall(r"<svg.*?</svg>", source, re.S):
                self.assertIn('role="img"', svg)
                self.assertIn("<title", svg)
                self.assertIn("<desc", svg)

    def test_python_example_parses_and_catalog_is_published(self):
        for locale, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            match = re.search(r'<pre class="language-python"><code>(.*?)</code></pre>', source, re.S)
            self.assertIsNotNone(match)
            ast.parse(html.unescape(match.group(1)))
            suffix = "" if locale == "ru" else "-en" if locale == "en" else "-zh"
            self.assertIn(f'href="a-1-4-3{suffix}.html"', source)

        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0013")
        self.assertEqual(lesson["code"], "1.4.4")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0012"])
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})

if __name__ == "__main__":
    unittest.main()
