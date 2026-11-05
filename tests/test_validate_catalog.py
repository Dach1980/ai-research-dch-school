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
        self.assertIn('aria-labelledby="dataset-title dataset-desc"', page)
        self.assertIn('aria-labelledby="pipeline-title pipeline-desc"', page)
        self.assertIn('aria-labelledby="generalization-title generalization-desc"', page)
        self.assertIn("Проверка понимания", page)

    def test_map_uses_catalog_and_has_no_stale_planet_a1_binding(self):
        page = (ROOT / "learning-map" / "index.html").read_text(encoding="utf-8")
        script = (ROOT / "scripts" / "planet-map-catalog.js").read_text(encoding="utf-8")
        self.assertNotIn("getElementById('planetA1')", page)
        self.assertIn('data-planets-root', page)
        self.assertIn('data/catalog/lessons.json', script)
        self.assertIn('data/catalog/planets.json', script)
        self.assertIn('generatedPlanet', script)
        self.assertIn('data-select-lesson', script)

    def test_a4_and_a5_are_published_in_three_languages(self):
        catalog = json.loads((ROOT / "data" / "catalog" / "lessons.json").read_text(encoding="utf-8"))
        lessons = {item["id"]: item for item in catalog["lessons"]}
        for lesson_id, base in [
            ("A.1", "a-1-what-is-artificial-intelligence"),
            ("A.2", "a-2-ai-ml-deep-learning"),
            ("A.3", "a-3-how-machines-learn-from-data"),
            ("A.4", "a-4-what-is-machine-learning-model"),
            ("A.5", "a-5-how-to-evaluate-a-model"),
        ]:
            lesson = lessons[lesson_id]
            self.assertEqual(lesson["status"], "published")
            self.assertEqual(lesson.get("languages"), ["ru", "en", "zh"])
            self.assertEqual(set(lesson.get("url_i18n", {})), {"ru", "en", "zh"})
            for locale in ("ru", "en", "zh"):
                with self.subTest(lesson=lesson_id, locale=locale):
                    self.assertTrue((ROOT / lesson["url_i18n"][locale]).is_file())
        a4 = (ROOT / lessons["A.4"]["url"]).read_text(encoding="utf-8")
        a5 = (ROOT / lessons["A.5"]["url"]).read_text(encoding="utf-8")
        self.assertGreaterEqual(a4.count("<svg"), 6)
        self.assertGreaterEqual(a5.count("<svg"), 5)
        self.assertIn("Training", a4)
        self.assertIn("Inference", a4)
        self.assertIn("Проверка понимания", a5)
        self.assertNotIn("\\hat", a4)

    def test_language_switcher_and_homepage_knowledge_map(self):
        switcher = (ROOT / "scripts" / "language-switcher.js").read_text(encoding="utf-8")
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("language-switcher", switcher)
        self.assertIn('id="knowledge-universe"', home)
        self.assertIn("A.5", home)
        for relative in ["index-en.html", "index-zh.html", "lessons/index-en.html",
                         "lessons/index-zh.html", "learning-map/index-en.html",
                         "learning-map/index-zh.html", "tracks/understanding-ai-en.html",
                         "tracks/understanding-ai-zh.html", "tracks/inside-ai-en.html",
                         "tracks/inside-ai-zh.html", "tracks/building-with-ai-en.html",
                         "tracks/building-with-ai-zh.html"]:
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_a1_and_a2_have_original_explanatory_diagrams(self):
        a1 = (ROOT / "lessons" / "a-1-what-is-artificial-intelligence.html").read_text(encoding="utf-8")
        a2 = (ROOT / "lessons" / "a-2-ai-ml-deep-learning.html").read_text(encoding="utf-8")
        self.assertGreaterEqual(a1.count("<svg"), 2)
        self.assertGreaterEqual(a2.count("<svg"), 3)
        self.assertIn("семейство подходов", a1)
        self.assertIn("Вложенность AI, ML и DL", a2)


    def test_every_published_lesson_has_learning_outcomes(self):
        catalog = json.loads((ROOT / "data" / "catalog" / "lessons.json").read_text(encoding="utf-8"))
        for lesson in catalog["lessons"]:
            if lesson["status"] == "published":
                with self.subTest(lesson=lesson["id"]):
                    self.assertTrue(lesson.get("learning_outcomes"))

    def test_admin_security_scaffold_and_unique_migration_versions(self):
        migration_dir = ROOT / "supabase" / "migrations"
        migrations = sorted(migration_dir.glob("*.sql"))
        versions = [path.name.split("_", 1)[0] for path in migrations]
        self.assertEqual(len(versions), len(set(versions)))
        self.assertTrue((ROOT / "supabase" / "functions" / "school-admin-management" / "index.ts").is_file())
        edge = (ROOT / "supabase" / "functions" / "school-admin-management" / "index.ts").read_text(encoding="utf-8")
        self.assertIn('role.role !== "owner"', edge)
        self.assertIn("SUPABASE_SERVICE_ROLE_KEY", edge)
        browser_code = (ROOT / "scripts" / "admin-management.js").read_text(encoding="utf-8")
        self.assertNotIn("SUPABASE_SERVICE_ROLE_KEY", browser_code)
        config = (ROOT / "scripts" / "supabase-config.js").read_text(encoding="utf-8")
        self.assertIn("registrationEnabled: false", config)
        self.assertTrue((migration_dir / "006_multilingual_catalog_and_admin_audit.sql").is_file())

    def test_primary_pages_have_mobile_navigation_toggle(self):
        pages = [
            "index.html",
            "lessons/index.html",
            "lessons/a-1-what-is-artificial-intelligence.html",
            "lessons/a-2-ai-ml-deep-learning.html",
            "lessons/a-3-how-machines-learn-from-data.html",
            "learning-map/index.html",
            "tracks/understanding-ai.html",
            "tracks/inside-ai.html",
            "tracks/building-with-ai.html",
            "news/index.html",
            "news/001-school-launch.html",
            "account/index.html",
            "index-en.html", "index-zh.html",
            "lessons/index-en.html", "lessons/index-zh.html",
            "learning-map/index-en.html", "learning-map/index-zh.html",
            "tracks/understanding-ai-en.html", "tracks/understanding-ai-zh.html",
            "tracks/inside-ai-en.html", "tracks/inside-ai-zh.html",
            "tracks/building-with-ai-en.html", "tracks/building-with-ai-zh.html",
            "lessons/a-1-what-is-artificial-intelligence-en.html",
            "lessons/a-1-what-is-artificial-intelligence-zh.html",
            "lessons/a-2-ai-ml-deep-learning-en.html",
            "lessons/a-2-ai-ml-deep-learning-zh.html",
            "lessons/a-3-how-machines-learn-from-data-en.html",
            "lessons/a-3-how-machines-learn-from-data-zh.html",
            "lessons/a-4-what-is-machine-learning-model-en.html",
            "lessons/a-4-what-is-machine-learning-model-zh.html",
            "lessons/a-5-how-to-evaluate-a-model.html",
            "lessons/a-5-how-to-evaluate-a-model-en.html",
            "lessons/a-5-how-to-evaluate-a-model-zh.html",
        ]
        for relative in pages:
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(page=relative):
                self.assertIn('class="menu-toggle"', page)
                self.assertIn("scripts/main.js", page)


if __name__ == "__main__":
    unittest.main()
