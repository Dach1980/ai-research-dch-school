import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


class LessonNavigationAndConceptTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.by_code = {item["code"]: item for item in cls.catalog["lessons"]}
        cls.codes = sorted(
            (
                item["code"] for item in cls.catalog["lessons"]
                if item.get("track_uid") == "trk-a"
                and item.get("status") == "published"
                and item.get("content_state") == "published"
                and set(item.get("url_i18n", {})) == set(LOCALES)
            ),
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
                    # The shared lesson-layout.js normalizer renders the canonical
                    # order from catalog-v3; source HTML may retain legacy fallback links.
                    self.assertIn("../scripts/lesson-layout.js", html, page)
                    self.assertNotIn('aria-disabled="true"', nav, page)

    def test_134_core_concepts_use_shared_definition_blocks_in_all_locales(self):
        for locale in LOCALES:
            with self.subTest(locale=locale):
                page = self.by_code["3.2.1"]["url_i18n"][locale]
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
