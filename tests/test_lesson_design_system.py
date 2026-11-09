import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = {
    "a-1-what-is-artificial-intelligence": 5,
    "a-2-ai-ml-deep-learning": 5,
    "a-3-how-machines-learn-from-data": 4,
    "a-4-what-is-machine-learning-model": 6,
    "a-5-how-to-evaluate-a-model": 4,
    "a-6-generalization-and-overfitting": 4,
}


class LessonDesignSystemTests(unittest.TestCase):
    def test_track_a_locales_load_shared_design_assets(self):
        bases = list(LESSONS) + [
            "1-1-2-history-of-ai",
            "1-1-3-symbolic-ai-and-machine-learning",
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
                if base in ("a-1-what-is-artificial-intelligence", "a-2-ai-ml-deep-learning"):
                    self.assertIn('type="radio"', source, str(path))
                else:
                    self.assertIn('type="checkbox"', source, str(path))
                self.assertIn('data-mode="yesno"', source, str(path))

    def test_history_and_symbolic_lessons_keep_source_linked_questions(self):
        for base, expected in (
            ("1-1-2-history-of-ai", 4),
            ("1-1-3-symbolic-ai-and-machine-learning", 8),
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
        minimums = {
            "a-1-what-is-artificial-intelligence": 8,
            "a-2-ai-ml-deep-learning": 8,
            "a-3-how-machines-learn-from-data": 10,
        }
        for base, minimum in minimums.items():
            for suffix in ("", "-en", "-zh"):
                source = (ROOT / "lessons" / f"{base}{suffix}.html").read_text(encoding="utf-8")
                terms = source.count('class="glossary-entry"') + source.count("<dt>")
                self.assertGreaterEqual(terms, minimum, f"{base}{suffix}")
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


    def test_published_lessons_111_to_114_have_valid_assessment_and_glossary_parity(self):
        lessons = {
            "1.1.1": ("a-1-what-is-artificial-intelligence", 5, 8),
            "1.1.2": ("1-1-2-history-of-ai", 4, 11),
            "1.1.3": ("1-1-3-symbolic-ai-and-machine-learning", 8, 12),
            "1.1.4": ("a-2-ai-ml-deep-learning", 5, 8),
        }
        for code, (base, expected_questions, expected_terms) in lessons.items():
            locale_counts = []
            for suffix in ("", "-en", "-zh"):
                path = ROOT / "lessons" / f"{base}{suffix}.html"
                source = path.read_text(encoding="utf-8")
                questions = re.findall(
                    r'<article class="lesson-check-question"([^>]*)>([\s\S]*?)</article>',
                    source,
                )
                self.assertEqual(len(questions), expected_questions, f"{code}{suffix}")
                ids = []
                for attrs, body in questions:
                    match = re.search(r'data-question-id="([^"]+)"', attrs)
                    self.assertIsNotNone(match, f"Missing question ID: {code}{suffix}")
                    ids.append(match.group(1))
                    self.assertGreater(body.count('type="radio"'), 0, f"{code}{suffix}")
                    correct = re.search(r'data-correct="([^"]+)"', attrs)
                    self.assertIsNotNone(correct, f"Missing answer key: {code}{suffix}")
                    values = re.findall(r'<input[^>]+value="([^"]+)"', body)
                    for answer in correct.group(1).split(","):
                        self.assertIn(answer, values, f"Invalid answer key {code}{suffix}")
                self.assertEqual(len(ids), len(set(ids)), f"Duplicate question IDs: {code}{suffix}")
                self.assertEqual(source.count('class="glossary-entry"'), expected_terms, f"Glossary count {code}{suffix}")
                self.assertNotIn("KEY CONCEPT", source, f"Placeholder in {code}{suffix}")
                locale_counts.append(source.count('class="glossary-entry"'))
            self.assertEqual(locale_counts, [expected_terms] * 3, code)

    def test_admin_exposes_design_system_tab_and_document(self):
        admin = (ROOT / "admin/index.html").read_text(encoding="utf-8")
        self.assertIn('id="tab-design"', admin)
        self.assertIn('id="panel-design"', admin)
        self.assertIn("VISUAL MOODBOARD", admin)
        self.assertTrue((ROOT / "docs/education/LESSON_DESIGN_SYSTEM.md").exists())


if __name__ == "__main__":
    unittest.main()
