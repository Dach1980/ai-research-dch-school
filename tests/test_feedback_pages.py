import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "feedback/index.html",
    "en": ROOT / "feedback/index-en.html",
    "zh": ROOT / "feedback/index-zh.html",
}
EXPECTED = {
    "ru": ("Вопросы и пожелания", "Подготовить письмо"),
    "en": ("Questions & feedback", "Prepare email"),
    "zh": ("问题与建议", "准备邮件"),
}

class FeedbackPageTests(unittest.TestCase):
    def test_localized_pages_and_mailto_only_delivery(self):
        for lang, path in PAGES.items():
            self.assertTrue(path.exists(), path)
            source = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">', source)
            for token in EXPECTED[lang]:
                self.assertIn(token, source)
            self.assertIn('id="feedback-form"', source)
            self.assertIn('mailto:itprof80@gmail.com', source)
            self.assertIn('aria-live="polite"', source)
            self.assertIn('maxlength="3000"', source)
            self.assertNotIn("supabase.from(", source)
            self.assertNotIn("fetch(", source)
            self.assertNotIn("formsubmit", source.lower())
            self.assertIn("не сохраняет" if lang == "ru" else "does not store" if lang == "en" else "不会保存", source)

    def test_shared_navigation_injects_feedback_link(self):
        source = (ROOT / "scripts/main.js").read_text(encoding="utf-8")
        for token in ["data-feedback-link", "feedback/index", "Вопросы и пожелания", "Questions & feedback", "问题与建议"]:
            self.assertIn(token, source)

if __name__ == "__main__":
    unittest.main()
