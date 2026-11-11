import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class LessonA4InteractiveQuizTests(unittest.TestCase):
    def test_all_locales_have_styled_glossary_and_interactive_questions(self):
        for suffix, lang in (("", "ru"), ("-en", "en"), ("-zh", "zh")):
            source = (ROOT / f"lessons/a-4-what-is-machine-learning-model{suffix}.html").read_text(encoding="utf-8")
            self.assertIn('class="lesson-glossary"', source)
            self.assertEqual(source.count('class="glossary-entry"'), 12)
            self.assertEqual(source.count('class="interactive-quiz-item"'), 6)
            self.assertEqual(source.count('class="quiz-check-button"'), 6)
            self.assertIn('class="quiz-feedback"', source)
            self.assertIn(".quiz-feedback.is-correct{color:#168447}", source)
            self.assertIn(".quiz-feedback.is-wrong{color:#c63737}", source)
            self.assertIn('type="checkbox"', source)
            self.assertIn('data-mode="yesno"', source)
            self.assertIn('data-mode="multi"', source)
            self.assertIn('aria-live="polite"', source)

    def test_quiz_explanations_and_answer_keys_are_present(self):
        for suffix in ("", "-en", "-zh"):
            source = (ROOT / f"lessons/a-4-what-is-machine-learning-model{suffix}.html").read_text(encoding="utf-8")
            cards = re.findall(r'<div class="interactive-quiz-item" data-question="(\d+)" data-mode="([^"]+)" data-correct="([^"]+)">([\s\S]*?)</div>', source)
            self.assertEqual(len(cards), 6)
            self.assertEqual({mode for _, mode, _, _ in cards}, {"single", "multi", "yesno"})
            for _, _, correct, _ in cards:
                self.assertTrue(correct)
            self.assertEqual(source.count('data-explanation="'), 6)
            self.assertEqual(source.count('class="quiz-check-button"'), 6)

    def test_answer_feedback_is_computed_from_exact_selected_set(self):
        for suffix in ("", "-en", "-zh"):
            source = (ROOT / f"lessons/a-4-what-is-machine-learning-model{suffix}.html").read_text(encoding="utf-8")
            self.assertIn('selected.length===expected.length', source)
            self.assertIn('ok?"is-correct":"is-wrong"', source)
            self.assertIn('if(box.checked)boxes.forEach', source)


if __name__ == "__main__":
    unittest.main()
