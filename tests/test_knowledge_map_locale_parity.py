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
    "data-planets-root", "data-planets-list", 'id="planetDetails"',
    'id="mapMode"', 'id="listMode"', 'id="mapView"', 'id="listView"',
)

class KnowledgeMapLocaleParityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {locale: path.read_text(encoding="utf-8") for locale, path in PAGES.items()}
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))

    def test_all_locales_use_the_same_interactive_map_shell(self):
        expected_lang = {"ru": "ru", "en": "en", "zh": "zh-CN"}
        for locale, html in self.pages.items():
            self.assertIn(f'<html lang="{expected_lang[locale]}"', html, locale)
            for marker in REQUIRED_MAP_MARKERS:
                self.assertIn(marker, html, f"{locale}: {marker}")
            for asset in ("styles/knowledge-map.css", "styles/theme-system.css",
                          "scripts/catalog-compat.js", "scripts/planet-map-catalog.js",
                          "scripts/main.js", "scripts/account-ui.js",
                          "scripts/language-switcher.js", "scripts/theme-system.js"):
                self.assertEqual(html.count(asset), 1, f"{locale}: {asset}")
            self.assertNotIn("data-home-knowledge-map", html, locale)
            if locale in ("en", "zh"):
                self.assertNotRegex(html, r"[А-Яа-яЁё]", locale)

    def test_all_locales_use_one_shared_responsive_stylesheet(self):
        css = (ROOT / "styles/knowledge-map.css").read_text(encoding="utf-8")
        for selector in (".map-shell", ".universe", ".planet-button", ".map-side",
                         ".list-view", "@media(max-width:900px)", "@media(max-width:560px)"):
            self.assertIn(selector, css)
        for locale, html in self.pages.items():
            self.assertIn("../styles/knowledge-map.css", html, locale)
            self.assertNotIn("<style>", html.lower(), locale)

    def test_map_reads_v3_and_only_renders_published_track_a_lessons(self):
        source = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        self.assertIn("schemaVersion:3", source)
        self.assertIn('x.track_uid==="trk-a"&&x.status==="published"&&x.content_state==="published"', source)
        self.assertNotIn("loadLegacyProjection", source)
        self.assertNotIn("v3_target_codes", source)
        published = [x for x in self.catalog["lessons"]
                     if x["track_uid"] == "trk-a" and x["status"] == "published"
                     and x["content_state"] == "published"]
        self.assertEqual(len(published), 4)
        self.assertTrue(all(len(x["code"].split(".")) == 3 for x in published))

    def test_every_published_lesson_has_a_real_route_and_title_in_all_locales(self):
        lessons = [x for x in self.catalog["lessons"]
                   if x["track_uid"] == "trk-a" and x["status"] == "published"
                   and x["content_state"] == "published"]
        for lesson in lessons:
            for locale in ("ru", "en", "zh"):
                route = lesson.get("url_i18n", {}).get(locale)
                self.assertTrue(route, f"{lesson['uid']} missing {locale} URL")
                self.assertTrue((ROOT / route).is_file(), f"{lesson['uid']} {locale} route missing: {route}")
                self.assertTrue(lesson.get("title_i18n", {}).get(locale), f"{lesson['uid']} missing {locale} title")
            self.assertGreaterEqual(lesson.get("duration_min", 0), 1)
            self.assertGreaterEqual(lesson.get("duration_max", 0), lesson["duration_min"])

    def test_shared_map_has_localized_controls_and_no_legacy_projection(self):
        source = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        for label in ("Урок", "Lesson", "课程", "ТЕМА", "THEME", "主题",
                      "МОДУЛЬ", "MODULE", "模块"):
            self.assertIn(label, source)
        self.assertIn("title_i18n", source)
        self.assertIn("duration_min", source)
        self.assertNotIn("loadLegacyProjection", source)
        self.assertNotIn("v3_target_codes", source)

if __name__ == "__main__":
    unittest.main()
