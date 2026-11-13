import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


class PublishedLessonNavigationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lessons = sorted(
            (
                item for item in cls.catalog["lessons"]
                if item.get("track_uid") == "trk-a" and item.get("status") == "published"
            ),
            key=lambda item: tuple(int(part) for part in item["code"].split(".")),
        )
        cls.script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")

    def test_every_published_track_a_page_loads_the_shared_navigation_normalizer(self):
        self.assertTrue(self.lessons)
        for lesson in self.lessons:
            for locale in LOCALES:
                with self.subTest(code=lesson["code"], locale=locale):
                    page = ROOT / lesson["url_i18n"][locale]
                    self.assertTrue(page.is_file(), str(page))
                    source = page.read_text(encoding="utf-8")
                    self.assertIn('<nav class="lesson-nav"', source, str(page))
                    self.assertIn("../scripts/lesson-layout.js", source, str(page))

    def test_normalizer_uses_only_published_track_a_lessons_and_catalog_order(self):
        self.assertIn('item.track_uid==="trk-a"&&item.status==="published"', self.script)
        self.assertIn('item.url_i18n[locale]', self.script)
        self.assertIn('return a.code.split(".").map(Number)', self.script)
        self.assertIn('var currentPath=window.location.pathname.split("/").pop()', self.script)
        self.assertIn('var index=published.findIndex', self.script)
        self.assertIn('new URL(previous.url_i18n[locale],rootUrl)', self.script)
        self.assertIn('new URL(next.url_i18n[locale],rootUrl)', self.script)

    def test_navigation_actions_are_created_in_canonical_order_and_with_one_primary(self):
        actions = (
            'fragment.appendChild(link("secondary",new URL(previous.url_i18n[locale],rootUrl)',
            'fragment.appendChild(link("primary",new URL(next.url_i18n[locale],rootUrl)',
            'fragment.appendChild(link("secondary",new URL("learning-map/index"+suffix+".html"',
            'fragment.appendChild(link("secondary",new URL("tracks/understanding-ai"+suffix+".html"',
            'fragment.appendChild(link("secondary",new URL("lessons/index"+suffix+".html"',
        )
        positions = [self.script.index(action) for action in actions]
        self.assertEqual(positions, sorted(positions))
        self.assertEqual(self.script.count('link("primary"'), 1)
        self.assertEqual(self.script.count('link("secondary"'), 4)
        self.assertIn('a.className="button "+className', self.script)
        self.assertIn('nav.replaceChildren(fragment)', self.script)

    def test_all_locales_have_localized_labels_and_aria_names(self):
        expected = {
            "ru": ("Навигация по уроку", "Предыдущий урок", "Следующий урок", "Карта знаний", "Программа Track A", "Все уроки"),
            "en": ("Lesson navigation", "Previous lesson", "Next lesson", "Knowledge map", "Track A programme", "All lessons"),
            "zh": ("课程导航", "上一课", "下一课", "知识地图", "Track A 学习计划", "全部课程"),
        }
        for locale, labels in expected.items():
            with self.subTest(locale=locale):
                for label in labels:
                    self.assertIn(label, self.script)

    def test_review_and_planned_lessons_are_not_navigation_targets(self):
        published = {item["code"] for item in self.lessons}
        non_published = {
            item["code"] for item in self.catalog["lessons"]
            if item.get("track_uid") == "trk-a" and item.get("status") != "published"
        }
        self.assertTrue(non_published)
        self.assertTrue(published.isdisjoint(non_published))
        self.assertIn('item.status==="published"', self.script)


if __name__ == "__main__":
    unittest.main()
