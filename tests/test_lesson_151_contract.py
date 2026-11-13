import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-1.html",
    "en": ROOT / "lessons/a-1-5-1-en.html",
    "zh": ROOT / "lessons/a-1-5-1-zh.html",
}


class Lesson151PublicationContractTests(unittest.TestCase):
    def test_catalog_identity_and_localized_urls(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["uid"] == "les-a-0043")
        self.assertEqual(lesson["code"], "1.5.1")
        self.assertEqual(lesson["status"], "review")
        self.assertEqual(lesson["content_state"], "localized")
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0014"])

    def test_three_complete_locales_have_equal_component_counts(self):
        expected = {"glossary-entry": 5, "lesson-check-question": 7, "lesson-sources": 1, "lesson-nav": 1}
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn('class="lesson-planet-art"', source)
                self.assertIn('../styles/lesson-reference-111.css', source)
                self.assertIn('../styles/lesson-124.css', source)
                self.assertIn('../scripts/lesson-layout.js', source)
                self.assertIn('../scripts/lesson-assessment.js', source)
                for component, count in expected.items():
                    self.assertEqual(source.count(f'class="{component}"'), count, component)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                self.assertEqual(source.count('<svg '), 1)
                self.assertIn('aria-labelledby="lesson151-title lesson151-desc"', source)
                self.assertIn('<tspan ', source)
                self.assertNotIn('<style>', source)

    def test_glossary_uses_grid_outer_and_flex_column_entries(self):
        css = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", css)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", css)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="glossary-entry"'), 5)

    def test_questions_are_localized_and_have_feedback_contract(self):
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertEqual(source.count('class="lesson-check-button"'), 7)
                self.assertEqual(source.count('class="lesson-check-feedback"'), 7)
                self.assertEqual(source.count('data-explanation="'), 7)
                self.assertEqual(source.count('type="checkbox"'), 26)
                self.assertIn('data-mode="yesno"', source)
                self.assertIn('aria-live="polite"', source)

    def test_navigation_is_catalog_driven_and_does_not_link_to_unpublished_lessons(self):
        script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")
        self.assertIn('item.track_uid==="trk-a"&&item.status==="published"', script)
        self.assertIn('nav.replaceChildren(fragment)', script)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertIn('<nav class="lesson-nav"', source)
            self.assertNotIn('a-1-5-2.html', source)
            self.assertNotIn('a-1-5-6.html', source)

    def test_topic_boundary_and_sources_are_present(self):
        curriculum = (ROOT / "docs/education/TRACK_A_CURRICULUM.md").read_text(encoding="utf-8")
        self.assertIn("Граница содержания урока 1.5.1", curriculum)
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            self.assertIn("baseline", source.lower())
            self.assertIn("evaluation", source.lower())
            self.assertIn({"ru": "независим", "en": "independent", "zh": "独立"}[locale], source.lower())


if __name__ == "__main__":
    unittest.main()
