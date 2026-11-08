import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class HierarchicalCatalogUITests(unittest.TestCase):
    def test_track_lesson_catalog_reads_hierarchical_v2(self):
        script = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        page = (ROOT / "tracks/understanding-ai.html").read_text(encoding="utf-8")
        self.assertIn("schemaVersion: 2", script)
        self.assertIn("data.themes", script)
        self.assertIn("data.modules", script)
        self.assertNotIn("lessons.json", script)
        self.assertLess(page.index("catalog-compat.js"), page.index("lesson-catalog.js"))

    def test_knowledge_map_reads_hierarchical_v2(self):
        script = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        page = (ROOT / "learning-map/index.html").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:2", script)
        self.assertIn("data.themes", script)
        self.assertIn("data.modules", script)
        self.assertNotIn('fetch("../data/catalog/lessons.json"', script)
        self.assertLess(page.index("catalog-compat.js"), page.index("planet-map-catalog.js"))

    def test_homepage_and_localized_maps_read_v2(self):
        script = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:2", script)
        self.assertIn('baseUrl:"data/catalog"', script)
        for relative in ["index.html", "learning-map/index-en.html", "learning-map/index-zh.html"]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("data-home-knowledge-map", page)
            self.assertLess(page.index("catalog-compat.js"), page.index("home-knowledge-map.js"))

    def test_all_track_and_lesson_catalogues_use_v2(self):
        for relative in [
            "tracks/understanding-ai.html", "tracks/understanding-ai-en.html",
            "tracks/understanding-ai-zh.html", "lessons/index.html",
            "lessons/index-en.html", "lessons/index-zh.html"
        ]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("data-lesson-catalog", page, relative)
            self.assertLess(page.index("catalog-compat.js"), page.index("lesson-catalog.js"), relative)
        schema = (ROOT / "data/catalog/schema-v2.json").read_text(encoding="utf-8")
        self.assertIn('"title_i18n"', schema)

if __name__ == "__main__":
    unittest.main()
