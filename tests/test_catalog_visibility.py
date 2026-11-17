"""Regression tests for automatic lesson discovery across Track A surfaces."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data/catalog/catalog-v3.json"
LOCALES = ("ru", "en", "zh")
VISIBLE_STATES = {
    ("published", "published"),
    ("review", "localized"),
}


class CatalogVisibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
        cls.lessons = cls.catalog["lessons"]
        cls.visible = [
            lesson for lesson in cls.lessons
            if (lesson["status"], lesson["content_state"]) in VISIBLE_STATES
        ]

    def test_611_is_registered_under_canonical_track_hierarchy(self):
        lesson = next(item for item in self.lessons if item["uid"] == "les-a-0147")
        self.assertEqual(lesson["track_uid"], "trk-a")
        self.assertEqual(lesson["code"], "6.1.1")
        self.assertEqual(lesson["theme_uid"], "thm-a-06")
        self.assertEqual(lesson["module_uid"], "mod-a-06-01")
        self.assertEqual((lesson["status"], lesson["content_state"]), ("review", "localized"))

    def test_611_has_all_three_production_pages(self):
        lesson = next(item for item in self.lessons if item["uid"] == "les-a-0147")
        self.assertEqual(set(lesson["url_i18n"]), set(LOCALES))
        for locale in LOCALES:
            with self.subTest(locale=locale):
                self.assertTrue((ROOT / lesson["url_i18n"][locale]).is_file())

    def test_every_catalog_ready_lesson_has_all_localized_pages(self):
        for lesson in self.visible:
            with self.subTest(uid=lesson["uid"], code=lesson["code"]):
                self.assertEqual(set(lesson.get("url_i18n", {})), set(LOCALES))
                for locale in LOCALES:
                    self.assertTrue((ROOT / lesson["url_i18n"][locale]).is_file())

    def test_track_and_lesson_catalog_pages_load_dynamic_catalog_consumers(self):
        loader = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        self.assertIn('item.status === "published" && item.content_state === "published"', loader)
        self.assertIn('item.status === "review" && item.content_state === "localized"', loader)
        for page in (
            "tracks/understanding-ai.html",
            "tracks/understanding-ai-en.html",
            "tracks/understanding-ai-zh.html",
            "lessons/index.html",
            "lessons/index-en.html",
            "lessons/index-zh.html",
        ):
            source = (ROOT / page).read_text(encoding="utf-8")
            with self.subTest(page=page):
                self.assertIn("data-lesson-catalog", source)
                self.assertIn("scripts/lesson-catalog.js", source)

    def test_planet_map_generates_planets_from_every_ready_catalog_lesson(self):
        loader = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        self.assertIn('x.status==="published"&&x.content_state==="published"', loader)
        self.assertIn('x.status==="review"&&x.content_state==="localized"', loader)
        self.assertIn("data.lessons", loader)
        self.assertIn("generatedPlanet", loader)
        for page in (
            "learning-map/index.html",
            "learning-map/index-en.html",
            "learning-map/index-zh.html",
        ):
            source = (ROOT / page).read_text(encoding="utf-8")
            with self.subTest(page=page):
                self.assertIn("planet-map-catalog.js", source)
                self.assertIn("data-planets-root", source)

    def test_incomplete_drafts_are_not_promoted_to_catalog_surfaces(self):
        self.assertFalse(any(item.get("code") == "6.1.2" for item in self.lessons))
        draft = ROOT / "drafts/lessons/a-6-1-2-ru.html"
        self.assertTrue(draft.is_file())


if __name__ == "__main__":
    unittest.main()
