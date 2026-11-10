import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = {
    "a-1-1-1": 3,
    "a-1-1-3": 3,
    "a-3-how-machines-learn-from-data": 4,
    "a-4-what-is-machine-learning-model": 6,
    "a-5-how-to-evaluate-a-model": 4,
    "a-6-generalization-and-overfitting": 4,
}


class LessonDesignSystemTests(unittest.TestCase):
    def test_track_a_locales_load_shared_design_assets(self):
        bases = list(LESSONS) + [
            "a-1-1-2",
            "a-1-1-4",
        ]
        for base in bases:
            for suffix in ("", "-en", "-zh"):
                path = ROOT / "lessons" / f"{base}{suffix}.html"
                source = path.read_text(encoding="utf-8")
                self.assertIn("../styles/lesson-design-system.css", source, str(path))
                self.assertIn("../scripts/lesson-assessment.js", source, str(path))
                self.assertIn("../scripts/code-blocks.js", source, str(path))

    def test_authored_interactive_checks_exist_in_all_track_a_locales(self):
        for base, expected in LESSONS.items():
            for suffix in ("", "-en", "-zh"):
                path = ROOT / "lessons" / f"{base}{suffix}.html"
                source = path.read_text(encoding="utf-8")
                if base == "a-4-what-is-machine-learning-model":
                    self.assertEqual(source.count('class="interactive-quiz-item"'), expected, f"{base}{suffix}")
                    self.assertEqual(source.count('class="quiz-check-button"'), expected, f"{base}{suffix}")
                    self.assertEqual(source.count('class="quiz-feedback"'), expected, f"{base}{suffix}")
                else:
                    self.assertEqual(source.count('class="lesson-check-question"'), expected, f"{base}{suffix}")
                    self.assertEqual(source.count('class="lesson-check-button"'), expected, f"{base}{suffix}")
                    self.assertEqual(source.count('class="lesson-check-feedback"'), expected, f"{base}{suffix}")
                self.assertIn('data-explanation="', source, str(path))
                self.assertIn('type="checkbox"', source, str(path))
                self.assertIn('data-mode="yesno"', source, str(path))

    def test_history_and_symbolic_lessons_keep_source_linked_questions(self):
        for base, expected in (
            ("a-1-1-2", 4),
            ("a-1-1-4", 8),
        ):
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / "lessons" / f"{base}{suffix}.html").read_text(encoding="utf-8")
                self.assertEqual(source.count('class="lesson-check-question"'), expected, f"{base}{suffix}")
                self.assertEqual(source.count('class="lesson-check-button"'), expected, f"{base}{suffix}")
                self.assertEqual(source.count('class="lesson-check-feedback"'), expected, f"{base}{suffix}")
                self.assertNotIn('class="quiz-item"', source)
                self.assertIn('data-correct="', source)
                self.assertIn('data-explanation="', source)
                self.assertIn("lesson-assessment.js", source)

    def test_glossary_card_markup_and_shared_styles_are_present(self):
        for base in (
            "a-1-1-1",
            "a-1-1-3",
            "a-3-how-machines-learn-from-data",
        ):
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / "lessons" / f"{base}{suffix}.html").read_text(encoding="utf-8")
                terms = source.count('class="glossary-entry"') + source.count("<dt>")
                self.assertGreaterEqual(terms, 10, f"{base}{suffix}")
        css = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary", css)
        assessment = (ROOT / "scripts/lesson-assessment.js").read_text(encoding="utf-8")
        self.assertNotIn("enhanceLegacyQuiz", assessment)
        self.assertNotIn("answers[(index+step)", assessment)
        self.assertIn(".lesson-check-feedback.is-correct", css)
        self.assertIn(".lesson-check-feedback.is-wrong", css)
        self.assertIn(".lesson-code-block", css)

    def test_a4_glossary_has_twelve_unique_cards_in_all_locales(self):
        for suffix in ("", "-en", "-zh"):
            source = (ROOT / "lessons" / f"a-4-what-is-machine-learning-model{suffix}.html").read_text(encoding="utf-8")
            self.assertEqual(source.count('class="glossary-entry"'), 12, f"A.4{suffix}")
            terms = re.findall(r'class="term">([^<]+)', source)
            self.assertEqual(len(terms), len(set(terms)), f"A.4 duplicate term: {suffix}")

    def test_canonical_lesson_111_section_numbering_is_sequential_in_all_locales(self):
        expected = {
            "": ("14. Расширенный словарь терминов", "15. Практическое задание", "16. Источники и дополнительное чтение", "17. Самопроверка"),
            "-en": ("14. Practical task", "15. Lesson glossary", "16. Sources and further reading", "17. Self-check"),
            "-zh": ("14. 实践任务", "15. 本课术语表", "16. 参考资料与延伸阅读", "17. 自测"),
        }
        for suffix, labels in expected.items():
            source = (ROOT / "lessons" / f"a-1-1-1{suffix}.html").read_text(encoding="utf-8")
            for label in labels:
                self.assertIn(label, source, f"{suffix}: {label}")
            self.assertNotIn("<section><h2>14. Словарь урока</h2></section>", source)
            self.assertNotIn(">16. Practical task<", source)
            self.assertNotIn(">16. 实践任务<", source)

    def test_admin_declares_lesson_111_as_the_single_exact_design_reference(self):
        admin = (ROOT / "admin/index.html").read_text(encoding="utf-8")
        self.assertIn("Эталон оформления: урок 1.1.1", admin)
        self.assertIn("точь-в-точь по уроку 1.1.1", admin)
        self.assertIn("../lessons/a-1-1-1-en.html", admin)
        self.assertIn("../lessons/a-1-1-1-zh.html", admin)

    def test_admin_exposes_design_system_tab_and_document(self):
        admin = (ROOT / "admin/index.html").read_text(encoding="utf-8")
        self.assertIn('id="tab-design"', admin)
        self.assertIn('id="panel-design"', admin)
        self.assertIn("VISUAL MOODBOARD", admin)
        self.assertTrue((ROOT / "docs/education/LESSON_DESIGN_SYSTEM.md").exists())


    def test_canonical_lesson_url_and_closing_navigation_standard_is_documented(self):
        standard = (ROOT / "docs/education/LESSON_DESIGN_SYSTEM.md").read_text(encoding="utf-8")
        for required in (
            "Единая идентификация и адреса страниц уроков",
            "a-1-1-1.html",
            "a-1-1-2.html",
            "Стандартная нижняя навигация урока",
            "Карта планет",
            "Следующий урок",
            "Программа Track",
            "Все уроки",
            "Стандартный footer",
            "перенаправление",
        ):
            self.assertIn(required, standard)

        admin = (ROOT / "admin/index.html").read_text(encoding="utf-8")
        self.assertIn("Канонический URL", admin)
        self.assertIn("LESSON_DESIGN_SYSTEM.md, разделы 8–13", admin)

        import json
        roadmap = json.loads((ROOT / "data/audit-roadmap.json").read_text(encoding="utf-8"))
        self.assertTrue(any(item["id"] == "RM-13" for item in roadmap["roadmap"]))
        self.assertTrue(any(item["id"] == "AUD-034" for item in roadmap["audit_log"]))


if __name__ == "__main__":
    unittest.main()
