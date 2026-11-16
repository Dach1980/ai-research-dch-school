import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("ru", "en", "zh")


class PublishedLessonNavigationContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        cls.sequence = json.loads((ROOT / "data/curriculum-sequence-track-a.json").read_text(encoding="utf-8"))
        cls.lessons = {item["uid"]: item for item in cls.catalog["lessons"]}
        cls.steps = cls.sequence["steps"]
        cls.script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")

    def step_index(self, code):
        return next(i for i, step in enumerate(self.steps) if step.get("code") == code)

    def test_every_published_track_a_page_loads_the_shared_navigation_normalizer(self):
        published = [item for item in self.catalog["lessons"] if item.get("track_uid") == "trk-a" and item.get("status") == "published"]
        self.assertTrue(published)
        for lesson in published:
            for locale in LOCALES:
                with self.subTest(code=lesson["code"], locale=locale):
                    page = ROOT / lesson["url_i18n"][locale]
                    self.assertTrue(page.is_file(), str(page))
                    source = page.read_text(encoding="utf-8")
                    self.assertIn('<nav class="lesson-nav"', source, str(page))
                    self.assertIn("lesson-layout.js", source, str(page))

    def test_normalizer_uses_explicit_macro_sequence_not_numeric_code_sorting(self):
        self.assertIn('fetch(new URL("../data/curriculum-sequence-track-a.json",scriptUrl).href)', self.script)
        self.assertIn('var steps=sequence.steps||[]', self.script)
        self.assertIn('step.kind!=="lesson"', self.script)
        self.assertNotIn('a.code.split(".").map(Number)', self.script)
        self.assertNotIn('var allLessons=', self.script)

    def test_theme_one_sequence_remains_contiguous(self):
        ordered = [step["code"] for step in self.steps if step.get("macro_module") == 11 and step["kind"] == "lesson"]
        self.assertEqual(ordered[ordered.index("1.2.1") - 1], "1.1.4")
        self.assertEqual(ordered[ordered.index("1.2.1") + 1], "1.2.2")
        self.assertEqual(self.lessons[next(s["lesson_uid"] for s in self.steps if s.get("code") == "1.1.4")]["status"], "published")
        self.assertEqual(self.lessons[next(s["lesson_uid"] for s in self.steps if s.get("code") == "1.2.2")]["status"], "published")

    def test_1_5_8_is_followed_by_the_macro_12_gate_not_a_provisional_foundation_candidate(self):
        index = self.step_index("1.5.8")
        next_step = self.steps[index + 1]
        self.assertEqual(next_step["kind"], "module_gate")
        self.assertEqual(next_step["macro_module"], 12)
        self.assertIn("Линейные интерпретируемые модели", next_step["title"])
        self.assertEqual(self.sequence["excluded_candidates"][0]["code"], "3.1.6")
        self.assertIn("candidate_only", self.sequence["excluded_candidates"][0]["reason"])
        self.assertIn('nextSoon:"Следующий урок скоро"', self.script)
        self.assertIn('nextSoon:"Next lesson coming soon"', self.script)
        self.assertIn('nextSoon:"下一课即将推出"', self.script)
        self.assertIn('pending.setAttribute("aria-disabled","true")', self.script)
        self.assertNotIn('pending.href', self.script)

    def test_xai_4_2_1_follows_macro_16_and_is_not_adjacent_to_1_5_8(self):
        index = self.step_index("4.2.1")
        self.assertEqual(self.steps[index - 1]["kind"], "module_gate")
        self.assertEqual(self.steps[index - 1]["macro_module"], 17)
        self.assertEqual(self.steps[index + 1]["code"], "4.2.2")
        self.assertEqual(self.lessons[self.steps[index + 1]["lesson_uid"]]["status"], "planned")
        codes = [step.get("code") for step in self.steps]
        self.assertGreater(codes.index("4.2.1"), codes.index("4.3.5"))
        self.assertGreater(codes.index("4.3.4"), codes.index("4.7.4"))
        self.assertLess(codes.index("4.3.4"), len(codes))

    def test_approved_macro_gaps_are_explicit_blocking_gates(self):
        gates = {step["macro_module"]: step for step in self.steps if step["kind"] == "module_gate"}
        for macro in (14, 15, 19, 20, 21, 22, 23, 24, 25, 26):
            self.assertIn(macro, gates)
        self.assertEqual(gates[14]["title"], "Каузальность и причинная интерпретация")
        self.assertEqual(gates[15]["title"], "Гетерогенные эффекты")

    def test_review_and_planned_lessons_are_never_navigation_targets(self):
        for step in self.steps:
            if step["kind"] == "lesson":
                lesson = self.lessons[step["lesson_uid"]]
                self.assertEqual(lesson["code"], step["code"])
                self.assertEqual(lesson["status"], step["status"])
        self.assertIn('previous.status==="published"', self.script)
        self.assertIn('next.status==="published"', self.script)

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
