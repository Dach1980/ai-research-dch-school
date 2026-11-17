import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


class PublishedLessonNavigationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.lessons = {item["uid"]: item for item in cls.catalog["lessons"]}
        cls.script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")

    def test_every_published_track_a_page_loads_the_shared_navigation_normalizer(self):
        published = [
            item for item in self.catalog["lessons"]
            if item.get("track_uid") == "trk-a"
            and item.get("status") == "published"
            and item.get("content_state") == "published"
        ]
        self.assertTrue(published)
        for lesson in published:
            for locale in LOCALES:
                with self.subTest(code=lesson["code"], locale=locale):
                    page = ROOT / lesson["url_i18n"][locale]
                    self.assertTrue(page.is_file(), str(page))
                    source = page.read_text(encoding="utf-8")
                    self.assertIn('<nav class="lesson-nav"', source, str(page))
                    self.assertIn("lesson-layout.js", source, str(page))

    def test_normalizer_uses_catalog_publication_state_and_canonical_localized_urls(self):
        self.assertIn('var catalogUrl=new URL("../data/catalog/catalog-v3.json",scriptUrl)', self.script)
        self.assertIn('item.track_uid==="trk-a"', self.script)
        self.assertIn('item.status==="published"', self.script)
        self.assertIn('item.content_state==="published"', self.script)
        self.assertIn('item.url_i18n&&item.url_i18n[locale]', self.script)
        self.assertIn('published.findIndex(function(item)', self.script)
        self.assertIn('item.url_i18n[locale].split("/").pop()===currentPath', self.script)
        self.assertIn('new URL(previous.url_i18n[locale],rootUrl)', self.script)
        self.assertIn('new URL(next.url_i18n[locale],rootUrl)', self.script)
        self.assertNotIn("curriculum-sequence-track-a.json", self.script)
        self.assertNotIn("var steps=sequence.steps", self.script)

    def test_published_navigation_order_follows_canonical_lesson_codes(self):
        published = [
            item for item in self.catalog["lessons"]
            if item.get("track_uid") == "trk-a"
            and item.get("status") == "published"
            and item.get("content_state") == "published"
        ]
        codes = [item["code"] for item in published]
        numeric_order = sorted(codes, key=lambda code: tuple(int(part) for part in code.split(".")))
        self.assertEqual(codes, numeric_order)
        self.assertIn('"en",{numeric:true}', self.script)
        self.assertIn('published.sort(function(a,b){return a.code.localeCompare(b.code,"en",{numeric:true});})', self.script)

    def test_unpublished_lessons_are_excluded_and_pending_next_is_not_clickable(self):
        self.assertIn('item.status==="published"&&item.content_state==="published"', self.script)
        self.assertIn('pending.className="button primary is-disabled"', self.script)
        self.assertIn('pending.setAttribute("aria-disabled","true")', self.script)
        self.assertNotIn("pending.href", self.script)
        self.assertIn('nextSoon:"Следующий урок скоро"', self.script)
        self.assertIn('nextSoon:"Next lesson coming soon"', self.script)
        self.assertIn('nextSoon:"下一课即将推出"', self.script)

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
