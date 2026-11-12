import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")
CODES = ("1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.2.1", "1.2.2", "1.2.4", "1.2.5", "1.2.6", "1.3.1", "1.3.2", "1.3.3", "1.3.4")


class LessonNavigationAndConceptTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.by_code = {item["code"]: item for item in cls.catalog["lessons"]}
        cls.codes = sorted(
            (code for code in CODES if code in cls.by_code and cls.by_code[code].get("status") == "published"),
            key=lambda code: tuple(int(part) for part in code.split(".")),
        )

    def test_every_published_localized_lesson_has_sequential_navigation(self):
        for locale in LOCALES:
            for index, code in enumerate(self.codes):
                with self.subTest(locale=locale, code=code):
                    page = self.by_code[code]["url_i18n"][locale]
                    html = (ROOT / page).read_text(encoding="utf-8")
                    nav_match = re.search(r'<nav class="lesson-nav"[^>]*>(.*?)</nav>', html, re.S)
                    self.assertIsNotNone(nav_match, page)
                    nav = nav_match.group(1)
                    if index:
                        previous = self.by_code[self.codes[index - 1]]["url_i18n"][locale].split("/")[-1]
                        self.assertIn(f'href="{previous}"', nav, page)
                    else:
                        self.assertNotIn('aria-disabled="true"', nav, page)
                    if index < len(self.codes) - 1:
                        following = self.by_code[self.codes[index + 1]]["url_i18n"][locale].split("/")[-1]
                        self.assertIn(f'href="{following}"', nav, page)
                    else:
                        self.assertIn('aria-disabled="true"', nav, page)

    def test_134_core_concepts_use_shared_highlight_style_in_all_locales(self):
        for locale in LOCALES:
            with self.subTest(locale=locale):
                page = self.by_code["1.3.4"]["url_i18n"][locale]
                html = (ROOT / page).read_text(encoding="utf-8")
                self.assertIn("../styles/lesson-design-system.css", html)
                self.assertGreaterEqual(html.count('class="definition"'), 8)
                self.assertNotIn("**", html)
                self.assertNotIn("concept-term", html)
        css = (ROOT / "styles/lesson-reference-111.css").read_text(encoding="utf-8")
        self.assertIn(".article-body .definition", css)

    def test_future_lesson_prompt_requires_concept_and_navigation_standards(self):
        prompt = (ROOT / "docs/education/LESSON_PRODUCTION_PROMPT_TEMPLATE.md").read_text(encoding="utf-8")
        self.assertIn('class="definition"', prompt)
        self.assertIn("LESSON_DESIGN_SYSTEM.md", prompt)
        self.assertIn("предыдущего и следующего", prompt)
        self.assertIn("planned", prompt)


if __name__ == "__main__":
    unittest.main()
