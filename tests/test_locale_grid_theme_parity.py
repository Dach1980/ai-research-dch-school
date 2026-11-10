import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HOME = ["index.html", "index-en.html", "index-zh.html"]
CATALOG = ["lessons/index.html", "lessons/index-en.html", "lessons/index-zh.html"]
TRACKS = [
    "tracks/understanding-ai.html", "tracks/understanding-ai-en.html", "tracks/understanding-ai-zh.html",
    "tracks/inside-ai.html", "tracks/inside-ai-en.html", "tracks/inside-ai-zh.html",
    "tracks/building-with-ai.html", "tracks/building-with-ai-en.html", "tracks/building-with-ai-zh.html",
]
MAPS = ["learning-map/index.html", "learning-map/index-en.html", "learning-map/index-zh.html"]
LESSONS = [
    "lessons/a-1-what-is-artificial-intelligence.html",
    "lessons/a-1-what-is-artificial-intelligence-en.html",
    "lessons/a-1-what-is-artificial-intelligence-zh.html",
    "lessons/a-2-ai-ml-deep-learning.html",
    "lessons/a-2-ai-ml-deep-learning-en.html",
    "lessons/a-2-ai-ml-deep-learning-zh.html",
    "lessons/a-3-how-machines-learn-from-data.html",
    "lessons/a-3-how-machines-learn-from-data-en.html",
    "lessons/a-3-how-machines-learn-from-data-zh.html",
    "lessons/a-4-what-is-machine-learning-model.html",
    "lessons/a-4-what-is-machine-learning-model-en.html",
    "lessons/a-4-what-is-machine-learning-model-zh.html",
    "lessons/a-5-how-to-evaluate-a-model.html",
    "lessons/a-5-how-to-evaluate-a-model-en.html",
    "lessons/a-5-how-to-evaluate-a-model-zh.html",
]

class LocaleGridThemeParityTests(unittest.TestCase):
    def test_homepages_share_the_same_grid_component_and_stylesheet(self):
        for relative in HOME:
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(page=relative):
                self.assertIn('class="knowledge-home', page)
                self.assertIn('class="home-knowledge-grid" data-home-knowledge-map', page)
                self.assertIn('class="knowledge-cta"', page)
                self.assertIn("styles/main.css", page)
                self.assertEqual(page.count("home-knowledge-map.js"), 1)
                self.assertEqual(page.count("theme-system.js"), 1)
        css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
        self.assertIn(".home-knowledge-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))", css)
        self.assertIn("@media(max-width:900px){.home-knowledge-grid{grid-template-columns:repeat(3", css)
        self.assertIn("@media(max-width:620px){.knowledge-home", css)
        self.assertIn("@media(max-width:380px){.home-knowledge-grid{grid-template-columns:1fr", css)

    def test_theme_script_is_loaded_once_on_all_localized_core_pages(self):
        for relative in HOME + CATALOG + TRACKS + MAPS + LESSONS + ["account/index.html", "news/001-school-launch.html"]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(page=relative):
                self.assertEqual(page.count("theme-system.js"), 1)
                self.assertIn("styles/main.css", page)
                self.assertIn("styles/account.css", page)
        theme = (ROOT / "scripts/theme-system.js").read_text(encoding="utf-8")
        self.assertIn('var KEY="dch-school-theme"', theme)
        self.assertIn('localStorage.setItem(KEY,next)', theme)
        self.assertIn('document.documentElement.dataset.theme=resolved', theme)

    def test_localized_pages_load_language_switcher_once(self):
        localized = [p for p in HOME + CATALOG + TRACKS + MAPS + LESSONS if p.endswith(("-en.html", "-zh.html"))]
        for relative in localized:
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(page=relative):
                self.assertEqual(page.count("language-switcher.js"), 1)

    def test_home_and_lesson_catalogues_use_v3_published_lessons_without_durations_or_legacy(self):
        home = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        lessons = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        map_script = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        for source in (home, lessons, map_script):
            self.assertIn("catalog-v3.json", source)
            self.assertNotIn("loadLegacyProjection", source)
            self.assertNotIn("v3_target_codes", source)
            self.assertNotIn("duration_min", source)
        self.assertIn('item.status === "published" && item.content_state === "published"', home)
        self.assertIn('item.status === "published" && item.content_state === "published"', lessons)
        self.assertIn('x.status==="published"&&x.content_state==="published"', map_script)

    def test_v3_published_lessons_have_single_codes_and_complete_localization(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        published = [x for x in catalog["lessons"] if x["status"] == "published" and x["content_state"] == "published"]
        self.assertEqual(len(published), 4)
        for lesson in published:
            with self.subTest(code=lesson["code"]):
                self.assertRegex(lesson["code"], r"^\d+\.\d+\.\d+$")
                self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
                self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
                for route in lesson["url_i18n"].values():
                    self.assertTrue((ROOT / route).is_file(), route)
                self.assertNotIn("duration_min", lesson)
                self.assertNotIn("duration_max", lesson)
        for collection in ("themes", "modules"):
            item = next(x for x in catalog[collection] if x["uid"] in ("thm-a-01", "mod-a-01-01"))
            self.assertEqual(set(item["title_i18n"]), {"ru", "en", "zh"})

    def test_legacy_catalog_has_no_unverified_duration_estimates(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v2.json").read_text(encoding="utf-8"))
        for lesson in catalog["lessons"]:
            self.assertNotIn("duration_min", lesson)
            self.assertNotIn("duration_max", lesson)

    def test_a1_lesson_uses_shared_planet_hero_and_end_of_lesson_check_in_all_locales(self):
        pages = {
            "ru": "lessons/a-1-what-is-artificial-intelligence.html",
            "en": "lessons/a-1-what-is-artificial-intelligence-en.html",
            "zh": "lessons/a-1-what-is-artificial-intelligence-zh.html",
        }
        for locale, relative in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn('<section class="track-hero article-hero">', page)
                self.assertIn('<article class="article-body">', page)
                self.assertEqual(page.count("<h1>"), 1)
                self.assertEqual(page.count('class="lesson-planet-banner"'), 1)
                self.assertIn("lesson-design-system.css", page)
                self.assertEqual(page.count('class="lesson-check-question"'), 3)
                self.assertEqual(page.count('class="lesson-check-option"'), 8)
                self.assertIn("lesson-assessment.js", page)
                check_start = page.index('class="lesson-check"')
                self.assertEqual(page.count('class="lesson-check"'), 1)
                self.assertEqual(page.count('class="lesson-check-question"'), 3)
                self.assertEqual(page.count('class="lesson-check-option"'), 8)
                self.assertNotIn("<h2>15. Самопроверка</h2>", page)
                self.assertNotIn("<h3>Self-check</h3>", page)
                self.assertNotIn("<h3>自我检查</h3>", page)
        design = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-planet-banner{", design)
        self.assertIn(".lesson-planet-sphere{", design)


    def test_five_checked_lessons_use_the_shared_layout_system_in_all_locales(self):
        for relative in LESSONS:
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(page=relative):
                self.assertIn("lesson-standard.css", page)
                self.assertEqual(page.count("lesson-layout.js"), 1)
                self.assertIn("lesson-design-system.css", page)
        self.assertTrue((ROOT / "styles/lesson-standard.css").is_file())
        self.assertTrue((ROOT / "scripts/lesson-layout.js").is_file())
        self.assertTrue((ROOT / "docs/standards/LESSON_PAGE_STANDARD_RU_EN_ZH.md").is_file())

    def test_practice_and_final_assessment_counts_match_across_locales(self):
        groups = [
            ([
                "lessons/a-2-ai-ml-deep-learning.html",
                "lessons/a-2-ai-ml-deep-learning-en.html",
                "lessons/a-2-ai-ml-deep-learning-zh.html",
            ], "class=\"quiz\"", 5, "class=\"lesson-check-question\"", 3),
            ([
                "lessons/a-3-how-machines-learn-from-data.html",
                "lessons/a-3-how-machines-learn-from-data-en.html",
                "lessons/a-3-how-machines-learn-from-data-zh.html",
            ], "class=\"quiz\"", 4, "class=\"lesson-check-question\"", 4),
            ([
                "lessons/a-4-what-is-machine-learning-model.html",
                "lessons/a-4-what-is-machine-learning-model-en.html",
                "lessons/a-4-what-is-machine-learning-model-zh.html",
            ], "class=\"interactive-quiz-item\"", 6, None, None),
            ([
                "lessons/a-5-how-to-evaluate-a-model.html",
                "lessons/a-5-how-to-evaluate-a-model-en.html",
                "lessons/a-5-how-to-evaluate-a-model-zh.html",
            ], "class=\"lesson-check-question\"", 4, None, None),
        ]
        for pages, primary_marker, expected_primary, secondary_marker, expected_secondary in groups:
            for relative in pages:
                page = (ROOT / relative).read_text(encoding="utf-8")
                with self.subTest(page=relative, marker=primary_marker):
                    self.assertEqual(page.count(primary_marker), expected_primary)
                    if secondary_marker:
                        self.assertEqual(page.count(secondary_marker), expected_secondary)

if __name__ == "__main__":
    unittest.main()
