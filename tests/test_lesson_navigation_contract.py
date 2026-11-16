import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


class PublishedLessonNavigationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lessons = sorted(
            (item for item in cls.catalog["lessons"] if item.get("track_uid") == "trk-a"),
            key=lambda item: tuple(int(part) for part in item["code"].split(".")),
        )
        cls.published = [item for item in cls.lessons if item.get("status") == "published"]
        cls.by_code = {item["code"]: item for item in cls.lessons}
        cls.script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")

    def test_every_published_track_a_page_loads_the_shared_navigation_normalizer(self):
        self.assertTrue(self.published)
        for lesson in self.published:
            for locale in LOCALES:
                with self.subTest(code=lesson["code"], locale=locale):
                    page = ROOT / lesson["url_i18n"][locale]
                    self.assertTrue(page.is_file(), str(page))
                    source = page.read_text(encoding="utf-8")
                    self.assertIn('<nav class="lesson-nav"', source, str(page))
                    self.assertIn("lesson-layout.js", source, str(page))

    def test_normalizer_uses_complete_catalog_order_including_unpublished_blockers(self):
        self.assertIn('return item.track_uid==="trk-a";', self.script)
        self.assertIn('var allLessons=', self.script)
        self.assertIn('var index=allLessons.findIndex', self.script)
        self.assertIn('previous.status==="published"', self.script)
        self.assertIn('next.status==="published"', self.script)
        self.assertNotIn('if(currentPath==="01-what-and-why.html")', self.script)
        self.assertNotIn('previousCode="A.1.1.8"', self.script)

    def test_theme_one_sequence_remains_contiguous(self):
        ordered = [item["code"] for item in self.lessons]
        self.assertEqual(ordered[ordered.index("1.2.1") - 1], "1.1.4")
        self.assertEqual(ordered[ordered.index("1.2.1") + 1], "1.2.2")
        self.assertEqual(self.by_code["1.1.4"]["status"], "published")
        self.assertEqual(self.by_code["1.2.2"]["status"], "published")

    def test_last_published_foundation_lesson_does_not_jump_to_xai(self):
        ordered = [item["code"] for item in self.lessons]
        current = ordered.index("1.5.8")
        self.assertEqual(ordered[current + 1], "3.1.6")
        self.assertNotEqual(self.by_code[ordered[current + 1]]["status"], "published")
        self.assertIn('nextSoon:"Следующий урок скоро"', self.script)
        self.assertIn('nextSoon:"Next lesson coming soon"', self.script)
        self.assertIn('nextSoon:"下一课即将推出"', self.script)
        self.assertIn('pending.setAttribute("aria-disabled","true")', self.script)
        self.assertNotIn('pending.href', self.script)

    def test_xai_lesson_is_not_navigationally_adjacent_to_1_5_8(self):
        ordered = [item["code"] for item in self.lessons]
        current = ordered.index("4.2.1")
        self.assertEqual(ordered[current - 1], "4.1.4")
        self.assertEqual(ordered[current + 1], "4.2.2")
        self.assertEqual(self.by_code["4.1.4"]["status"], "planned")
        self.assertEqual(self.by_code["4.2.2"]["status"], "planned")

    def test_review_and_planned_lessons_are_never_navigation_targets(self):
        for lesson in self.lessons:
            if lesson.get("status") != "published":
                self.assertNotIn("url_i18n", lesson)
        self.assertIn('item.status==="published"', self.script)

    def test_navigation_actions_are_created_in_canonical_order(self):
        actions = (
            'fragment.appendChild(link("secondary",new URL(previous.url_i18n[locale],rootUrl)',
            'fragment.appendChild(link("primary",new URL(next.url_i18n[locale],rootUrl)',
            'fragment.appendChild(link("secondary",new URL("learning-map/index"+suffix+".html"',
            'fragment.appendChild(link("secondary",new URL("tracks/understanding-ai"+suffix+".html"',
            'fragment.appendChild(link("secondary",new URL("lessons/index"+suffix+".html"',
        )
        positions = [self.script.index(action) for action in actions]
        self.assertEqual(positions, sorted(positions))
        self.assertIn('a.className="button "+className', self.script)
        self.assertIn('nav.replaceChildren(fragment)', self.script)

    def test_all_locales_have_localized_labels_and_aria_names(self):
        expected = {
            "ru": ("Навигация по уроку", "Предыдущий урок", "Следующий урок", "Следующий урок скоро", "Карта знаний", "Программа Track A", "Все уроки"),
            "en": ("Lesson navigation", "Previous lesson", "Next lesson", "Next lesson coming soon", "Knowledge map", "Track A programme", "All lessons"),
            "zh": ("课程导航", "上一课", "下一课", "下一课即将推出", "知识地图", "Track A 学习计划", "全部课程"),
        }
        for labels in expected.values():
            for label in labels:
                self.assertIn(label, self.script)


if __name__ == "__main__":
    unittest.main()
