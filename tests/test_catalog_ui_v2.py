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

    def test_homepage_displays_hierarchical_lesson_ids(self):
        page = (ROOT / "index.html").read_text(encoding="utf-8")
        for number in range(1, 7):
            self.assertIn("data-home-knowledge-map", page)
        script = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:2", script)
        self.assertIn('baseUrl:"data/catalog"', script)


if __name__ == "__main__":
    unittest.main()
