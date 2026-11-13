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
    "a-1-4-2": 8,
    "a-1-4-4": 8,
}


class LessonDesignSystemTests(unittest.TestCase):
    def test_track_a_locales_load_shared_design_assets(self):
        bases = list(LESSONS) + [
            "a-1-1-2",
            "a-1-1-4",
            "a-1-3-1",
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
            "-en": ("7. Review checkpoint", "8. Expanded lesson: concepts, boundaries and examples", "9. Deep dive: approaches and task types", "10. Lesson glossary", "11. Sources and further reading", "12. Self-check"),
            "-zh": ("7. 复习检查点", "8. 扩展课程：概念、边界与案例", "9. 技术路线与任务类型详解", "10. 本课术语表", "11. 参考资料与延伸阅读", "12. 自测"),
        }
        for suffix, labels in expected.items():
            source = (ROOT / "lessons" / f"a-1-1-1{suffix}.html").read_text(encoding="utf-8")
            for label in labels:
                self.assertIn(label, source, f"{suffix}: {label}")
            self.assertNotIn("<section><h2>14. Словарь урока</h2></section>", source)

    def test_admin_declares_lesson_111_as_the_single_exact_design_reference(self):
        admin = (ROOT / "admin/index.html").read_text(encoding="utf-8")
        self.assertIn("Эталон оформления: урок 1.1.1", admin)
        self.assertIn("точь-в-точь по уроку 1.1.1", admin)
        self.assertIn("../lessons/a-1-1-1-en.html", admin)
        self.assertIn("../lessons/a-1-1-1-zh.html", admin)

    def test_first_data_lessons_use_the_exact_111_page_shell_in_all_locales(self):
        bases = ("a-1-2-1", "a-1-2-2", "a-1-2-4", "a-1-2-5", "a-1-2-6", "a-1-3-1")
        for base in bases:
            for suffix, locale in (("", "ru"), ("-en", "en"), ("-zh", "zh")):
                path = ROOT / "lessons" / f"{base}{suffix}.html"
                source = path.read_text(encoding="utf-8")
                with self.subTest(path=path):
                    self.assertIn(f'<html lang="{locale}"', source)
                    self.assertIn('<header class="site-header">', source)
                    self.assertIn('<main class="container">', source)
                    self.assertIn('<section class="track-hero article-hero">', source)
                    self.assertIn('<article class="article-body">', source)
                    self.assertIn('class="lesson-planet-banner"', source)
                    self.assertIn('class="lesson-planet-art"', source)
                    self.assertIn('<section class="lesson-sources">', source)
                    self.assertIn('<nav class="lesson-nav"', source)
                    self.assertIn('class="lesson-glossary"', source)
                    self.assertIn('<section class="lesson-check">', source)
                    self.assertIn('<footer class="footer">', source)
                    self.assertIn("../styles/lesson-reference-111.css", source)
                    self.assertNotIn("<style>", source)
                    self.assertNotIn("lesson-languages", source)


    def test_lesson_121_expanded_content_is_complete_and_localized(self):
        expected = {
            "": ("ru", "Результаты обучения", "Паспорт набора данных", "Самопроверка"),
            "-en": ("en", "Learning outcomes", "A dataset datasheet", "Self-check"),
            "-zh": ("zh", "学习目标", "数据集说明", "自测"),
        }
        for suffix, (locale, outcome_heading, datasheet_heading, quiz_heading) in expected.items():
            path = ROOT / "lessons" / f"a-1-2-1{suffix}.html"
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertEqual(len(re.findall(r'<section id="section-\d+">', source)), 8)
                self.assertEqual(source.count('class="glossary-entry"'), 14 if locale == "ru" else 13)
                self.assertEqual(source.count('class="lesson-check-question"'), 7)
                self.assertEqual(source.count('class="lesson-check-button"'), 7)
                self.assertIn(outcome_heading, source)
                self.assertIn(datasheet_heading, source)
                self.assertIn(quiz_heading, source)
                self.assertIn("lesson-data-table", source)
                self.assertIn("sampling bias", source.lower())
                self.assertIn("distribution shift", source.lower())
                self.assertIn('data-mode="multiple"', source)
                self.assertIn('data-correct="a,c,d"', source)
                self.assertIn("data-characteristics", source)
                self.assertIn("Datasheets for Datasets", source)
                self.assertIn("lesson-assessment.js", source)
                self.assertIn("canonical", source)

    def test_lesson_131_supervised_learning_is_complete_in_all_locales(self):
        for suffix, locale in (("", "ru"), ("-en", "en"), ("-zh", "zh")):
            page = (ROOT / f"lessons/a-1-3-1{suffix}.html").read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', page)
                self.assertIn("Supervised Learning", page)
                self.assertEqual(page.count('class="lesson-check-question"'), 4)
                self.assertEqual(page.count('class="lesson-check-button"'), 4)
                self.assertEqual(page.count('class="glossary-entry"'), 8)
                self.assertIn("class=\"lesson-practice\"", page)
                self.assertIn("class=\"lesson-figure\"", page)
                self.assertIn('data-correct="', page)
                self.assertIn('data-explanation="', page)
                self.assertIn("canonical", page)
                self.assertNotIn("<style>", page)

    def test_all_active_track_a_lessons_share_the_canonical_111_shell(self):
        bases = (
            "a-1-1-1", "a-1-1-2", "a-1-1-3", "a-1-1-4",
            "a-1-2-1", "a-1-2-2", "a-1-2-4", "a-1-2-5", "a-1-2-6", "a-1-3-1", "a-1-4-4",
        )
        for base in bases:
            for suffix, locale in (("", "ru"), ("-en", "en"), ("-zh", "zh")):
                path = ROOT / "lessons" / f"{base}{suffix}.html"
                page = path.read_text(encoding="utf-8")
                with self.subTest(path=path):
                    self.assertIn(f'<html lang="{locale}"', page)
                    self.assertIn('<header class="site-header">', page)
                    self.assertIn('<main class="container">', page)
                    self.assertIn('<section class="track-hero article-hero">', page)
                    self.assertIn('<article class="article-body">', page)
                    self.assertIn('class="lesson-planet-banner"', page)
                    self.assertIn('class="lesson-planet-art"', page)
                    self.assertIn('class="lesson-sources"', page)
                    self.assertIn('<nav class="lesson-nav"', page)
                    self.assertIn('class="lesson-glossary"', page)
                    self.assertIn('class="lesson-check"', page)
                    self.assertIn('<footer class="footer">', page)
                    self.assertIn("../styles/lesson-reference-111.css", page)
                    self.assertNotIn("<style>", page)
                    self.assertEqual(page.count("<h1>"), 1)
                    if base in ("a-1-1-2", "a-1-1-3", "a-1-1-4"):
                        self.assertIn("../styles/lesson-content-components.css", page)

    def test_canonical_lesson_111_has_correct_final_section_sequence(self):
        cases = {
            "": ("14. Расширенный словарь терминов", "15. Практическое задание", "16. Источники и дополнительное чтение", "17. Самопроверка"),
            "-en": ("7. Review checkpoint", "8. Expanded lesson: concepts, boundaries and examples", "9. Deep dive: approaches and task types", "10. Lesson glossary", "11. Sources and further reading", "12. Self-check"),
            "-zh": ("7. 复习检查点", "8. 扩展课程：概念、边界与案例", "9. 技术路线与任务类型详解", "10. 本课术语表", "11. 参考资料与延伸阅读", "12. 自测"),
        }
        for suffix, headings in cases.items():
            source = (ROOT / "lessons" / f"a-1-1-1{suffix}.html").read_text(encoding="utf-8")
            for heading in headings:
                self.assertIn(heading, source, f"{suffix}: {heading}")
            self.assertNotIn("<style>", source)
            self.assertIn("../styles/lesson-reference-111.css", source)

    def test_canonical_html_template_and_authoring_guide_are_available(self):
        template = (ROOT / "templates/lesson-page-template.html").read_text(encoding="utf-8")
        guide = (ROOT / "docs/education/LESSON_AUTHORING_TEMPLATE.md").read_text(encoding="utf-8")
        for required in (
            'class="site-header"', 'class="track-hero article-hero"',
            'class="lesson-planet-banner"', 'class="article-body"',
            'class="lesson-sources"', 'class="lesson-nav"',
            'class="lesson-glossary"', 'class="lesson-check"',
            'class="footer"', "lesson-reference-111.css",
        ):
            self.assertIn(required, template)
        self.assertIn("{{LESSON_CODE}}", template)
        self.assertIn("{{LECTURE_CONTENT}}", template)
        self.assertIn("{{SELF_CHECK_QUESTIONS}}", template)
        self.assertIn("точь-в-точь", guide)
        self.assertIn("не допускаются пропуски, дубли", guide.lower())

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
