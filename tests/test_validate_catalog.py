import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("catalog_validator", ROOT / "scripts" / "validate-catalog.py")
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)


class CatalogPathTests(unittest.TestCase):
    def check_invalid(self, value):
        errors = []
        validator.validate_relative_html_path(value, "test", errors)
        self.assertTrue(errors, value)

    def test_rejects_external_url(self):
        self.check_invalid("https://example.com/lesson.html")

    def test_rejects_root_absolute_path(self):
        self.check_invalid("/lessons/a.html")

    def test_rejects_parent_traversal(self):
        self.check_invalid("../private/lesson.html")

    def test_rejects_backslash(self):
        self.check_invalid(r"lessons\\a.html")

    def test_rejects_non_html(self):
        self.check_invalid("data/lesson.json")

    def test_accepts_existing_relative_lesson(self):
        errors = []
        validator.validate_relative_html_path(
            "lessons/a-1-what-is-artificial-intelligence.html", "test", errors
        )
        self.assertEqual(errors, [])


class CatalogRelationshipTests(unittest.TestCase):
    def base(self):
        return {
            "tracks": {"tracks": [{"id": "track-a"}]},
            "modules": {"modules": [{"id": "module-1", "track_id": "track-a"}]},
            "lessons": {"lessons": [
                {"id": "A.1", "module_id": "module-1", "track_id": "track-a",
                 "status": "published", "prerequisites": []},
                {"id": "A.2", "module_id": "module-1", "track_id": "track-a",
                 "status": "published", "prerequisites": ["A.1"]},
            ]},
            "planets": {"planets": [
                {"id": "planet-A-1", "lesson_id": "A.1"},
                {"id": "planet-A-2", "lesson_id": "A.2"},
            ]},
        }

    def test_rejects_missing_prerequisite(self):
        data = self.base()
        data["lessons"]["lessons"][1]["prerequisites"] = ["A.9"]
        self.assertTrue(any("отсутствует в каталоге" in e
                            for e in validator.validate_cross_references(data)))

    def test_rejects_prerequisite_cycle(self):
        data = self.base()
        data["lessons"]["lessons"][0]["prerequisites"] = ["A.2"]
        self.assertTrue(any("Цикл prerequisites" in e
                            for e in validator.validate_cross_references(data)))

    def test_rejects_planet_for_unpublished_lesson(self):
        data = self.base()
        data["lessons"]["lessons"][1]["status"] = "draft"
        self.assertTrue(any("неопубликованный урок" in e
                            for e in validator.validate_cross_references(data)))

    def test_requires_planet_for_every_published_lesson(self):
        data = self.base()
        data["planets"]["planets"].pop()
        self.assertTrue(any("отсутствует соответствующая планета" in e
                            for e in validator.validate_cross_references(data)))


if __name__ == "__main__":
    unittest.main()


class PublishedSiteIntegrityTests(unittest.TestCase):
    def test_every_published_lesson_has_page_and_planet(self):
        catalog_dir = ROOT / "data" / "catalog"
        lessons = json.loads((catalog_dir / "lessons.json").read_text(encoding="utf-8"))["lessons"]
        planets = json.loads((catalog_dir / "planets.json").read_text(encoding="utf-8"))["planets"]
        planet_ids = {item["lesson_id"] for item in planets}
        published = [item for item in lessons if item["status"] == "published"]
        for lesson in published:
            with self.subTest(lesson=lesson["id"]):
                self.assertTrue((ROOT / lesson["url"]).is_file())
                self.assertIn(lesson["id"], planet_ids)

    def test_a3_has_accessible_original_diagrams(self):
        page = (ROOT / "lessons" / "a-3-how-machines-learn-from-data.html").read_text(encoding="utf-8")
        self.assertGreaterEqual(page.count("<svg"), 4)
        self.assertIn('aria-labelledby="dataset-caption"', page)
        self.assertIn('aria-labelledby="pipeline-caption"', page)
        self.assertIn('aria-labelledby="generalization-caption"', page)
        self.assertIn("Проверка понимания", page)

    def test_map_uses_catalog_and_has_no_stale_planet_a1_binding(self):
        page = (ROOT / "learning-map" / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "scripts" / "planet-map-catalog.js").read_text(encoding="utf-8")
        self.assertNotIn("getElementById('planetA1')", page)
        self.assertIn('data-planets-root', page)
        self.assertIn('data/catalog/lessons.json', script)
        self.assertIn('data/catalog/planets.json', script)
        self.assertIn('data-generated-planet', script)
        self.assertIn('data-select-lesson', script)

    def test_a4_and_a5_are_editorial_drafts_not_published_pages(self):
        catalog = json.loads((ROOT / "data" / "catalog" / "lessons.json").read_text(encoding="utf-8"))
        ids = {item["id"] for item in catalog["lessons"]}
        self.assertNotIn("A.4", ids)
        self.assertNotIn("A.5", ids)
        self.assertTrue((ROOT / "docs" / "education" / "drafts" / "A4-MACHINE-LEARNING-MODEL.md").is_file())
        self.assertTrue((ROOT / "docs" / "education" / "drafts" / "A5-MODEL-EVALUATION.md").is_file())
