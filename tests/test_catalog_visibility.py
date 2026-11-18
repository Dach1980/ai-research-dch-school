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
        self.assertEqual((lesson["status"], lesson["content_state"]), ("published", "published"))

    def test_614_is_registered_under_canonical_track_hierarchy(self):
        lesson = next(item for item in self.lessons if item["uid"] == "les-a-0168")
        self.assertEqual((lesson["code"], lesson["theme_uid"], lesson["module_uid"]), ("6.1.4", "thm-a-06", "mod-a-06-01"))
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0016"])
        self.assertEqual((lesson["status"], lesson["content_state"]), ("published", "published"))
        self.assertEqual(set(lesson["url_i18n"]), set(LOCALES))
        canonical = json.loads((ROOT / "data/catalog/curriculum-canonical-v1.json").read_text(encoding="utf-8"))
        matches = []
        def walk(value):
            if isinstance(value, list):
                for child in value: walk(child)
            elif isinstance(value, dict):
                if value.get("number") == "6.1.4": matches.append(value)
                for child in value.values(): walk(child)
        walk(canonical)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["uid"], "les-a-0168")
        self.assertEqual(matches[0]["publication_status"], "published")

    def test_611_publication_state_matches_canonical_curriculum(self):
        lesson = next(item for item in self.lessons if item["uid"] == "les-a-0147")
        canonical = json.loads((ROOT / "data/catalog/curriculum-canonical-v1.json").read_text(encoding="utf-8"))
        matches = []
        def walk(value):
            if isinstance(value, list):
                for child in value:
                    walk(child)
            elif isinstance(value, dict):
                if value.get("uid") == "les-a-0147":
                    matches.append(value)
                for child in value.values():
                    walk(child)
        walk(canonical)
        self.assertEqual((lesson["status"], lesson["content_state"]), ("published", "published"))
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["publication_status"], "published")

    def test_611_and_711_are_nested_under_their_canonical_themes_and_modules(self):
        themes = {item["uid"]: item for item in self.catalog["themes"]}
        modules = {item["uid"]: item for item in self.catalog["modules"]}
        expected = {
            "les-a-0147": ("6.1.1", "thm-a-06", "mod-a-06-01", 6, 1),
            "les-a-0018": ("7.1.1", "thm-a-07", "mod-a-07-01", 7, 1),
        }
        for uid, (code, theme_uid, module_uid, theme_number, module_number) in expected.items():
            lesson = next(item for item in self.lessons if item["uid"] == uid)
            theme = themes[theme_uid]
            module = modules[module_uid]
            with self.subTest(uid=uid):
                self.assertEqual(lesson["code"], code)
                self.assertEqual(lesson["theme_uid"], theme_uid)
                self.assertEqual(lesson["module_uid"], module_uid)
                self.assertEqual(theme["number"], theme_number)
                self.assertEqual(module["number"], module_number)
                self.assertEqual(module["theme_uid"], theme_uid)
        self.assertEqual(themes["thm-a-07"]["title_i18n"]["ru"], "Основы XAI и важность признаков")
        self.assertEqual(modules["mod-a-07-01"]["title_i18n"]["ru"], "Основные принципы объяснимого искусственного интеллекта")

    def test_track_a_lessons_1_to_5_are_grouped_under_their_numbered_themes(self):
        themes = {item["uid"]: item for item in self.catalog["themes"]}
        modules = {item["uid"]: item for item in self.catalog["modules"]}
        expected_titles = {
            2: "Данные и признаки",
            3: "Основы машинного обучения",
            4: "Модели и их качество",
            5: "Метрики и оценка моделей",
        }
        for lesson in self.lessons:
            if lesson.get("track_uid") != "trk-a":
                continue
            code = lesson.get("code", "")
            parts = code.split(".")
            if len(parts) != 3 or not parts[0].isdigit() or not parts[1].isdigit():
                continue
            theme_number, module_number = int(parts[0]), int(parts[1])
            if theme_number not in range(1, 6):
                continue
            theme_uid = f"thm-a-{theme_number:02d}"
            module_uid = f"mod-a-{theme_number:02d}-{module_number:02d}"
            with self.subTest(code=code, uid=lesson["uid"]):
                self.assertEqual(lesson["theme_uid"], theme_uid)
                self.assertEqual(lesson["module_uid"], module_uid)
                self.assertEqual(modules[module_uid]["theme_uid"], theme_uid)
                self.assertEqual(modules[module_uid]["number"], module_number)
                if theme_number in expected_titles:
                    self.assertEqual(themes[theme_uid]["title_i18n"]["ru"], expected_titles[theme_number])

    def test_track_catalog_renderer_nests_themes_modules_and_lessons(self):
        loader = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
        self.assertIn("const themes = new Map(data.themes.map", loader)
        self.assertIn("const themeGroups = new Map()", loader)
        self.assertIn("class=\"catalog-theme\"", loader)
        self.assertIn("class=\"catalog-theme-heading\"", loader)
        self.assertIn("class=\"catalog-module\"", loader)
        self.assertIn("module.theme_uid !== themeUid", loader)
        self.assertIn(".catalog-theme-heading", css)
        self.assertIn(".catalog-module-heading", css)

    def test_catalog_visual_standard_is_shared_across_all_four_tracks(self):
        loader = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
        standard = (ROOT / "docs/management/TRACK_CATALOG_VISUAL_STANDARD_2026-11-17.md").read_text(encoding="utf-8")
        for track_id, track_uid in (("track-a", "trk-a"), ("track-b", "trk-b"), ("track-c", "trk-c"), ("track-d", "trk-d")):
            with self.subTest(track=track_id):
                self.assertIn(f'"{track_id}":"{track_uid}"', loader)
        for label in ('theme:"ТЕМА"', 'module:"МОДУЛЬ"', 'theme:"THEME"', 'module:"MODULE"', 'theme:"主题"', 'module:"模块"'):
            self.assertIn(label, loader)
        for selector in (".catalog-theme", ".catalog-theme-heading", ".catalog-theme-modules",
                         ".catalog-module", ".catalog-module-heading", ".catalog-lesson-list"):
            self.assertIn(selector, css)
        self.assertIn("html[data-theme=\"light\"] .catalog-theme", css)
        self.assertIn("@media(max-width:620px)", css)
        self.assertIn(".catalog-lesson-list{grid-template-columns:1fr", css)
        self.assertIn("Track A", standard)
        self.assertIn("Track B", standard)
        self.assertIn("Track C", standard)
        self.assertIn("Track D", standard)

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

    def test_homepage_knowledge_map_also_includes_localized_review_lessons(self):
        loader = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        self.assertIn('item.status === "review" && item.content_state === "localized"', loader)
        self.assertIn("home-planet-review", loader)
        for page in ("index.html", "index-en.html", "index-zh.html"):
            source = (ROOT / page).read_text(encoding="utf-8")
            with self.subTest(page=page):
                self.assertIn("home-knowledge-map.js", source)
                self.assertIn("data-home-knowledge-map", source)

    def test_published_612_is_exposed_and_working_drafts_are_retained(self):
        lesson = next(item for item in self.lessons if item.get("uid") == "les-a-0148")
        self.assertEqual(lesson.get("code"), "6.1.2")
        self.assertEqual(lesson.get("status"), "published")
        self.assertEqual(lesson.get("content_state"), "published")
        for route in ("a-6-1-2-les-a-0148.html", "a-6-1-2-les-a-0148-en.html", "a-6-1-2-les-a-0148-zh.html"):
            self.assertTrue((ROOT / "lessons" / route).is_file())
        draft = ROOT / "drafts/lessons/a-6-1-2-ru.html"
        self.assertTrue(draft.is_file())


if __name__ == "__main__":
    unittest.main()
