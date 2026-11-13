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
    "lessons/a-1-4-3.html",
    "lessons/a-1-4-3-en.html",
    "lessons/a-1-4-3-zh.html",
    "lessons/a-1-1-1.html",
    "lessons/a-1-1-1-en.html",
    "lessons/a-1-1-1-zh.html",
    "lessons/a-1-1-3.html",
    "lessons/a-1-1-3-en.html",
    "lessons/a-1-1-3-zh.html",
    "lessons/a-1-1-4.html",
    "lessons/a-1-1-4-en.html",
    "lessons/a-1-1-4-zh.html",
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
                self.assertIn("knowledge-home", page)
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
        self.assertEqual(len(published), 17)
        self.assertIn("les-a-0010", {lesson["uid"] for lesson in published})
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
            "ru": "lessons/a-1-1-1.html",
            "en": "lessons/a-1-1-1-en.html",
            "zh": "lessons/a-1-1-1-zh.html",
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
                self.assertIn("<h2>17. Самопроверка</h2>" if locale == "ru" else ("<h2>12. Self-check</h2>" if locale == "en" else "<h2>12. 自测</h2>"), page)
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
                "lessons/a-1-1-3.html",
                "lessons/a-1-1-3-en.html",
                "lessons/a-1-1-3-zh.html",
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



    def test_a1_lesson_content_structure_sources_and_final_navigation_match_all_locales(self):
        pages = {
            "ru": "lessons/a-1-1-1.html",
            "en": "lessons/a-1-1-1-en.html",
            "zh": "lessons/a-1-1-1-zh.html",
        }
        required_sources = [
            "https://oecd.ai/en/ai-principles",
            "https://oecd.ai/en/wonk/ai-system-definition-update",
            "https://hai.stanford.edu/",
            "https://plato.stanford.edu/entries/artificial-intelligence/",
            "https://aima.cs.berkeley.edu/",
        ]
        required_navigation = {
            "ru": ["../learning-map/index.html", "a-1-1-2.html", "../tracks/understanding-ai.html", "index.html"],
            "en": ["../learning-map/index-en.html", "a-1-1-2-en.html", "../tracks/understanding-ai-en.html", "index-en.html"],
            "zh": ["../learning-map/index-zh.html", "a-1-1-2-zh.html", "../tracks/understanding-ai-zh.html", "index-zh.html"],
        }
        locale_headings = {
            "ru": ["14. Расширенный словарь терминов", "15. Практическое задание", "16. Источники и дополнительное чтение", "17. Самопроверка"],
            "en": ["7. Review checkpoint", "8. Expanded lesson: concepts, boundaries and examples", "9. Deep dive: approaches and task types", "10. Lesson glossary", "11. Sources and further reading", "12. Self-check"],
            "zh": ["7. 复习检查点", "8. 扩展课程：概念、边界与案例", "9. 技术路线与任务类型详解", "10. 本课术语表", "11. 参考资料与延伸阅读", "12. 自测"],
        }
        for locale, relative in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                for heading in locale_headings[locale]:
                    self.assertIn(heading, page)
                for url in required_sources:
                    self.assertIn(url, page)
                self.assertEqual(page.count('class="lesson-sources"'), 1)
                self.assertEqual(page.count('class="lesson-nav"'), 1)
                nav_start = page.index('class="lesson-nav"')
                self.assertGreater(nav_start, page.index('class="lesson-sources"'))
                self.assertLess(nav_start, page.index('class="lesson-glossary"'))
                for href in required_navigation[locale]:
                    self.assertIn('href="' + href + '"', page[nav_start:])
                self.assertLess(nav_start, page.index("</main>"))
        # The extended examples and practical work in EN/ZH are retained rather than replaced by a short translation.
        en_page = (ROOT / pages["en"]).read_text(encoding="utf-8")
        zh_page = (ROOT / pages["zh"]).read_text(encoding="utf-8")
        for marker in ["Worked example: a building energy assistant", "Mini-experiment: three ways to detect excessive energy use", "Rule-based systems", "Expert systems", "Search and planning"]:
            self.assertIn(marker, en_page)
        for marker in ["案例：建筑能耗助手", "迷你实验：用三种方式发现能耗异常", "基于规则的系统", "专家系统", "搜索与规划"]:
            self.assertIn(marker, zh_page)

    def test_a1_lesson_shell_planet_footer_and_outcomes_contrast_match_all_locales(self):
        pages = {
            "ru": "lessons/a-1-1-1.html",
            "en": "lessons/a-1-1-1-en.html",
            "zh": "lessons/a-1-1-1-zh.html",
        }
        contents = {}
        for locale, relative in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            contents[locale] = page
            with self.subTest(locale=locale):
                self.assertIn('class="site-header"', page)
                self.assertIn('class="lesson-planet-banner"', page)
                self.assertIn('class="lesson-planet-sphere"', page)
                self.assertIn('class="footer"', page)
                self.assertIn("lesson-planet-art", page)
                self.assertIn("lesson-reference-111.css", page)
                self.assertNotIn('class="outcomes"', page)
                self.assertNotIn('<div class="outcomes"><strong>', page)
                self.assertIn("theme-system.js", page)
                self.assertIn("lesson-layout.js", page)
                self.assertEqual(page.count('class="footer"'), 1)
        for locale in ("en", "zh"):
            self.assertIn('class="nav"', contents[locale])
            self.assertIn('class="footer"', contents[locale])
            self.assertNotIn('href="../tracks/understanding-ai.html"', contents[locale])
        self.assertIn("<h2>Learning outcomes</h2><p>", contents["en"])
        self.assertIn("<h2>学习目标</h2><p>", contents["zh"])
        self.assertIn(">Track B</a>", contents["en"])
        self.assertIn(">学习方向 B</a>", contents["zh"])
        self.assertIn(">All lessons</a>", contents["en"])
        self.assertIn(">全部课程</a>", contents["zh"])

    def test_lesson_111_section_numbering_is_hierarchical_in_all_locales(self):
        import re
        pages = {
            "ru": ("lessons/a-1-1-1.html", list(range(1, 18)), ["2.1", "4.1", "6.1", "6.2", "6.3", "6.4", "6.5", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6"]),
            "en": ("lessons/a-1-1-1-en.html", list(range(1, 13)), [f"7.{i}" for i in range(1, 7)] + [f"8.{i}" for i in range(1, 9)] + [f"9.{i}" for i in range(1, 9)]),
            "zh": ("lessons/a-1-1-1-zh.html", list(range(1, 13)), [f"7.{i}" for i in range(1, 7)] + [f"8.{i}" for i in range(1, 9)] + [f"9.{i}" for i in range(1, 9)]),
        }
        for locale, (relative, expected_h2, expected_h3) in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            h2 = [int(value) for value in re.findall(r"<h2[^>]*>\s*(\d+)\.", page)]
            h3 = re.findall(r"<h3[^>]*>\s*(\d+(?:\.\d+)+)\.", page)
            with self.subTest(locale=locale):
                self.assertEqual(h2, expected_h2)
                self.assertEqual(h3, expected_h3)

    def test_public_track_and_home_pages_use_numeric_catalog_codes_not_legacy_ids(self):
        import re
        for locale, path in (
            ("ru", "tracks/understanding-ai.html"),
            ("en", "tracks/understanding-ai-en.html"),
            ("zh", "tracks/understanding-ai-zh.html"),
        ):
            page = (ROOT / path).read_text(encoding="utf-8")
            with self.subTest(path=path):
                self.assertIn('data-lesson-catalog', page)
                self.assertIn('lesson-catalog.js', page)
                self.assertIsNone(re.search(r'\\bA\.\d+', page))
        for path in ("index.html", "index-en.html", "index-zh.html"):
            page = (ROOT / path).read_text(encoding="utf-8")
            with self.subTest(path=path):
                self.assertIsNone(re.search(r'\\bA\.\d+', page))
        home_ru = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("1.1.3 — AI, Machine Learning и Deep Learning", home_ru)
        self.assertIn('href="lessons/a-1-1-3.html"', home_ru)
        for path in ("scripts/lesson-catalog.js", "scripts/planet-map-catalog.js", "scripts/home-knowledge-map.js"):
            script = (ROOT / path).read_text(encoding="utf-8")
            self.assertIn("catalog-v3.json", script)
            self.assertNotIn("catalog-v2.json", script)

    def test_learning_maps_share_planet_universe_header_footer_and_theme_contrast(self):
        pages = {
            "ru": "learning-map/index.html",
            "en": "learning-map/index-en.html",
            "zh": "learning-map/index-zh.html",
        }
        contents = {}
        for locale, relative in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            contents[locale] = page
            with self.subTest(locale=locale):
                self.assertIn('class="site-header"', page)
                self.assertIn('class="map-intro"', page)
                self.assertIn('class="universe" data-planets-root', page)
                self.assertIn('class="orbit o1"', page)
                self.assertIn('id="planetDetails"', page)
                self.assertIn('id="listView"', page)
                self.assertIn('class="footer"', page)
                self.assertIn('planet-map-catalog.js', page)
                self.assertIn('language-switcher.js', page)
                self.assertIn('theme-system.js', page)
                self.assertIn('color:#f2f6ff', page)
                self.assertNotIn('home-knowledge-map.js', page)
        for locale in ("en", "zh"):
            self.assertIn('<html lang="' + locale + '">', contents[locale])
            self.assertNotIn("Главная", contents[locale])
            self.assertNotIn("Доступный урок", contents[locale])
            self.assertNotIn("Орбиты — визуальная навигация", contents[locale])
        self.assertIn('>Home</a>', contents["en"])
        self.assertIn('>首页</a>', contents["zh"])

if __name__ == "__main__":
    unittest.main()
