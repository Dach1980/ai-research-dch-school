import ast
import html
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-4-2.html",
    "en": ROOT / "lessons/a-1-4-2-en.html",
    "zh": ROOT / "lessons/a-1-4-2-zh.html",
}
TITLES = {
    "ru": "Обучение модели и функция потерь",
    "en": "Model Training and the Loss Function",
    "zh": "模型训练与损失函数",
}

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.links.append(href)
    def error(self, message):
        raise AssertionError(message)

class Lesson142Tests(unittest.TestCase):
    def test_locales_html_indexing_and_canonical_urls(self):
        for lang, path in FILES.items():
            self.assertTrue(path.exists(), path)
            source = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">', source)
            self.assertIn(TITLES[lang], source)
            self.assertIn('rel="canonical"', source)
            self.assertIn('aria-label="' + ("Язык урока" if lang == "ru" else "Lesson language" if lang == "en" else "课程语言") + '"', source)
            self.assertNotIn('content="noindex,nofollow"', source)
            self.assertNotIn("{{", source)
            self.assertNotIn("undefined", source)
            parser = Parser()
            parser.feed(source)
            parser.close()
            for href in parser.links:
                if href.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                target = (path.parent / href.split("#", 1)[0]).resolve()
                self.assertTrue(target.exists(), f"{path.name}: missing {href}")

    def test_parallel_structure_definitions_formulas_svg_quiz_and_glossary(self):
        for path in FILES.values():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="definition"'), 10)
            self.assertEqual(source.count('class="definition-term"'), 10)
            self.assertEqual(source.count('class="definition-text"'), 10)
            self.assertEqual(source.count('class="formula"'), 4)
            self.assertEqual(source.count('class="lesson-figure lesson-142-figure"'), 4)
            self.assertEqual(source.count("<title id="), 4)
            self.assertEqual(source.count("<desc id="), 4)
            self.assertEqual(source.count('class="glossary-entry"'), 10)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            self.assertEqual(source.count('class="lesson-check-feedback"'), 8)
            self.assertEqual(source.count('class="lesson-problem"'), 2)
            self.assertEqual(source.count('class="lesson-practice-task"'), 1)
            self.assertLess(source.index('class="lesson-sources"'), source.index('class="lesson-nav"'))
            self.assertLess(source.index('class="lesson-nav"'), source.index('class="lesson-glossary"'))
            self.assertLess(source.index('class="lesson-glossary"'), source.index('class="lesson-check"'))
            for svg in re.findall(r"<svg.*?</svg>", source, re.S):
                self.assertIn('role="img"', svg)
                self.assertIn("<title", svg)
                self.assertIn("<desc", svg)

    def test_python_example_parses_and_navigation_is_sequential(self):
        for lang, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            match = re.search(r'<pre class="language-python"><code>(.*?)</code></pre>', source, re.S)
            self.assertIsNotNone(match)
            code = html.unescape(match.group(1))
            ast.parse(code)
            suffix = "" if lang == "ru" else "-en" if lang == "en" else "-zh"
            self.assertIn(f'href="a-1-4-1{suffix}.html"', source)
            self.assertNotIn(f'href="a-1-4-3{suffix}.html"', source)

        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0011")
        self.assertEqual(lesson["code"], "1.4.2")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})

if __name__ == "__main__":
    unittest.main()
