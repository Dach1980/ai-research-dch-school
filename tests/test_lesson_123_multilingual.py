import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-2-3.html",
    "en": ROOT / "lessons/a-1-2-3-en.html",
    "zh": ROOT / "lessons/a-1-2-3-zh.html",
}
TITLES = {
    "ru": "Типы данных и представление признаков",
    "en": "Data Types and Feature Representation",
    "zh": "数据类型与特征表示",
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

class Lesson123Tests(unittest.TestCase):
    def test_localized_pages_and_internal_links(self):
        for locale, path in FILES.items():
            source = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{locale}">', source)
            self.assertIn(TITLES[locale], source)
            self.assertIn('rel="canonical"', source)
            self.assertIn("lesson-design-system.css", source)
            self.assertIn("lesson-123.css", source)
            self.assertEqual(source.count('class="lesson-123-figure"'), 6)
            self.assertEqual(source.count('<section id="section-'), 10)
            self.assertIn('class="lesson-123-table"', source)
            self.assertGreater(len(source), 20000)
            self.assertIn("lesson-assessment.js", source)
            self.assertEqual(source.count('class="lesson-check-question"'), 8)
            correct = re.findall(r'data-correct="([abc])"', source)
            self.assertEqual(len(set(correct)), 3, "correct answer positions should vary")
            self.assertEqual(source.count('class="glossary-entry"'), 10)
            self.assertIn('<div class="lesson-glossary">', source)
            glossary = source.split('<div class="lesson-glossary">', 1)[1].split('</div>', 1)[0]
            self.assertIn('<div class="glossary-entry">', glossary)
            design_css = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
            canonical_rule = re.search(r'\.lesson-glossary\s*>\s*\.glossary-entry\s*\{([^}]*)\}', design_css, re.S)
            self.assertIsNotNone(canonical_rule, "shared glossary layout contract is required")
            self.assertRegex(canonical_rule.group(1), r'display\s*:\s*flex')
            self.assertRegex(canonical_rule.group(1), r'flex-direction\s*:\s*column')
            self.assertNotRegex(canonical_rule.group(1), r'display\s*:\s*grid')
            self.assertEqual(source.count('class="lesson-outcomes"'), 1)
            self.assertIn('lesson-practice-task', source)
            self.assertIn('class="lesson-sources"', source)
            self.assertIn('class="lesson-nav"', source)
            parser = Links()
            parser.feed(source)
            for href in parser.hrefs:
                if href.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                target = (path.parent / href.split("#", 1)[0]).resolve()
                self.assertTrue(target.exists(), f"{path.name}: missing {href}")

    def test_catalog_and_sequence(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["code"] == "1.2.3")
        self.assertEqual(lesson["uid"], "les-a-0056")
        uids = [item["uid"] for item in catalog["lessons"]]
        self.assertEqual(len(uids), len(set(uids)), "catalogue UIDs must be unique")
        self.assertEqual(lesson["status"], "review")
        self.assertEqual(lesson["content_state"], "localized")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0004"])
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        next_lesson = next(item for item in catalog["lessons"] if item["code"] == "1.2.4")
        self.assertEqual(next_lesson["prerequisite_uids"], ["les-a-0056"])

if __name__ == "__main__":
    unittest.main()
