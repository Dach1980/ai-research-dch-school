import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "learning-map/index.html",
    "en": ROOT / "learning-map/index-en.html",
    "zh": ROOT / "learning-map/index-zh.html",
}
REQUIRED_MAP_MARKERS = (
    "data-planets-root",
    "data-planets-list",
    'id="planetDetails"',
    'id="mapMode"',
    'id="listMode"',
    'id="mapView"',
    'id="listView"',
)

class KnowledgeMapLocaleParityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {locale: path.read_text(encoding="utf-8") for locale, path in PAGES.items()}
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v2.json").read_text(encoding="utf-8"))

    def test_all_locales_use_the_same_interactive_map_shell(self):
        expected_lang = {"ru": "ru", "en": "en", "zh": "zh-CN"}
        for locale, html in self.pages.items():
            self.assertIn(f'<html lang="{expected_lang[locale]}"', html, locale)
            for marker in REQUIRED_MAP_MARKERS:
                self.assertIn(marker, html, f"{locale}: {marker}")
            for asset in (
                "styles/knowledge-map.css",
                "scripts/catalog-compat.js",
                "scripts/planet-map-catalog.js",
                "scripts/main.js",
                "scripts/account-ui.js",
                "scripts/language-switcher.js",
                "scripts/theme-system.js",
            ):
                self.assertEqual(html.count(asset), 1, f"{locale}: {asset}")
            self.assertNotIn("data-home-knowledge-map", html, locale)

    def test_all_locales_use_one_shared_responsive_stylesheet(self):
        css = (ROOT / "styles/knowledge-map.css").read_text(encoding="utf-8")
        for selector in (".map-shell", ".universe", ".planet-button", ".map-side", ".list-view", "@media(max-width:900px)", "@media(max-width:560px)"):
            self.assertIn(selector, css)
        for locale, html in self.pages.items():
            self.assertIn("../styles/knowledge-map.css", html, locale)
            self.assertNotIn("<style>", html.lower(), locale)

    def test_planets_equal_all_published_track_a_lessons(self):
        modules = {item["id"]: item for item in self.catalog["modules"]}
        themes = {item["id"]: item for item in self.catalog["themes"]}
        lessons = [item for item in self.catalog["lessons"] if item["status"] == "published" and themes[modules[item["module_id"]]["theme_id"]]["track_id"] == "track-a"]
        planet_ids = {item["lesson_id"] for item in self.catalog["planets"]}
        lesson_ids = {item["id"] for item in lessons}
        self.assertEqual(planet_ids, lesson_ids)
        self.assertEqual(len(lessons), len(planet_ids))

    def test_every_published_lesson_has_a_real_route_in_all_locales(self):
        modules = {item["id"]: item for item in self.catalog["modules"]}
        themes = {item["id"]: item for item in self.catalog["themes"]}
        lessons = [item for item in self.catalog["lessons"] if item["status"] == "published" and themes[modules[item["module_id"]]["theme_id"]]["track_id"] == "track-a"]
        for lesson in lessons:
            for locale in ("ru", "en", "zh"):
                route = lesson.get("url_i18n", {}).get(locale)
                self.assertTrue(route, f"{lesson['id']} missing {locale} URL")
                self.assertTrue((ROOT / route).is_file(), f"{lesson['id']} {locale} route missing: {route}")
                self.assertTrue(lesson.get("title_i18n", {}).get(locale), f"{lesson['id']} missing {locale} title")

    def test_shared_map_script_has_localized_ui_and_outcomes(self):
        source = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        for locale in ("ru", "en", "zh"):
            self.assertIn(f"    {locale}:{{track:", source)
        for lesson_id in ("A.1", "A.2", "A.3", "A.4", "A.5", "A.6", "A.7", "A.8"):
            self.assertIn(f'"{lesson_id}":{{', source)
        self.assertIn("url_i18n[locale]", source)
        self.assertIn("title_i18n[locale]", source)

if __name__ == "__main__":
    unittest.main()
