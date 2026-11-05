import importlib.util
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
