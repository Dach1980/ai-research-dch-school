import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class CatalogV3OnlyTests(unittest.TestCase):
    def test_track_catalog_reads_v3_and_filters_published_content(self):
        script = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:3", script)
        self.assertIn('x.status === "published" && x.content_state === "published"', script)
        self.assertNotIn("loadLegacyProjection", script)
        self.assertNotIn("v3_target_codes", script)
        self.assertNotIn("legacy", script.lower())

    def test_homepage_map_reads_v3_and_filters_published_content(self):
        script = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:3", script)
        self.assertIn('x.status==="published"&&x.content_state==="published"', script)
        self.assertNotIn("loadLegacyProjection", script)
        self.assertNotIn("v3_target_codes", script)

    def test_interactive_map_reads_v3_and_filters_published_content(self):
        script = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:3", script)
        self.assertIn('x.status==="published"&&x.content_state==="published"', script)
        self.assertNotIn("loadLegacyProjection", script)
        self.assertNotIn("v3_target_codes", script)
        self.assertNotIn("legacy", script.lower())

    def test_published_lessons_have_single_codes_and_localized_routes(self):
        data = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        published = [x for x in data["lessons"] if x["status"] == "published" and x["content_state"] == "published"]
        self.assertTrue(published)
        for lesson in published:
            self.assertRegex(lesson["code"], r"^\d+\.\d+\.\d+$")
            self.assertNotIn("·", lesson["code"])
            self.assertNotIn(",", lesson["code"])
            self.assertIn("ru", lesson.get("url_i18n", {}))
            self.assertIn("en", lesson.get("url_i18n", {}))
            self.assertIn("zh", lesson.get("url_i18n", {}))
            self.assertEqual(set(lesson.get("title_i18n", {})), {"ru", "en", "zh"})
            self.assertGreaterEqual(lesson.get("duration_min", 0), 1)
            self.assertGreaterEqual(lesson.get("duration_max", 0), lesson["duration_min"])

    def test_all_three_localized_track_and_lesson_pages_keep_v3_scripts(self):
        for relative in [
            "tracks/understanding-ai.html", "tracks/understanding-ai-en.html",
            "tracks/understanding-ai-zh.html", "lessons/index.html",
            "lessons/index-en.html", "lessons/index-zh.html"
        ]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("data-lesson-catalog", page, relative)
            self.assertIn("lesson-catalog.js", page, relative)


if __name__ == "__main__":
    unittest.main()
