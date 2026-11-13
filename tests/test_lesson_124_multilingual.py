import ast
import html
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-2-4.html",
    "en": ROOT / "lessons/a-1-2-4-en.html",
    "zh": ROOT / "lessons/a-1-2-4-zh.html",
}


class StructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.p_depth = 0
        self.nested_paragraph = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "p":
            if self.p_depth:
                self.nested_paragraph = True
            self.p_depth += 1

    def handle_endtag(self, tag):
        if tag == "p" and self.p_depth:
            self.p_depth -= 1


class Lesson124Tests(unittest.TestCase):
    def test_locale_shell_links_and_semantic_html(self):
        for locale, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{locale}">', source)
            self.assertIn("lesson-124.css", source)
            self.assertIn("lesson-design-system.css", source)
            parser = StructureParser()
            parser.feed(source)
            self.assertFalse(parser.nested_paragraph, f"{locale}: nested paragraph")
            for href in parser.links:
                if href.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                target = (path.parent / href.split("#", 1)[0]).resolve()
                self.assertTrue(target.exists(), f"{path.name}: missing {href}")
            self.assertIn("a-1-2-3", source)
            self.assertIn("a-1-2-5", source)

    def test_equal_learning_structure_in_all_locales(self):
        for locale, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(len(re.findall(r'<section id="section-\d+">', source)), 10)
            self.assertEqual(source.count('class="lesson-124-figure"'), 4)
            self.assertEqual(source.count("<title id="), 4)
            self.assertEqual(source.count("<desc id="), 4)
            self.assertEqual(source.count('class="glossary-entry"'), 10)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            self.assertEqual(source.count('class="lesson-check-button"'), 8)
            self.assertEqual(source.count('class="lesson-check-feedback"'), 8)
            self.assertIn('class="lesson-124-table"', source)
            self.assertIn('class="language-python"', source)
            answers = re.findall(r'data-correct="([abc])"', source)
            self.assertEqual(len(answers), 8)
            self.assertEqual(set(answers), {"a", "b", "c"})
            glossary = source.split('<section class="lesson-glossary">', 1)[1].split("</section>", 1)[0]
            self.assertEqual(glossary.count('<article class="glossary-entry">'), 10)
            self.assertNotRegex(glossary, r'<article class="glossary-entry">\s*<div')
            lesson_css = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
            card_rule = re.search(r"\.lesson-glossary>\.glossary-entry\{([^}]*)\}", lesson_css)
            self.assertIsNotNone(card_rule)
            self.assertRegex(card_rule.group(1), r"display:flex;flex-direction:column")
            self.assertNotRegex(card_rule.group(1), r"display:grid")

    def test_python_example_is_syntactically_valid(self):
        for path in FILES.values():
            source = path.read_text(encoding="utf-8")
            match = re.search(
                r'<pre class="language-python"><code>(.*?)</code></pre>',
                source,
                re.S,
            )
            self.assertIsNotNone(match, path.name)
            ast.parse(html.unescape(match.group(1)))


if __name__ == "__main__":
    unittest.main()
