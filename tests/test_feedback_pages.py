import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "feedback/index.html",
    "en": ROOT / "feedback/index-en.html",
    "zh": ROOT / "feedback/index-zh.html",
}
EXPECTED = {
    "ru": ("Вопросы и пожелания", "Отправить"),
    "en": ("Questions & feedback", "Send"),
    "zh": ("问题与建议", "发送"),
}

class FeedbackPageTests(unittest.TestCase):
    def test_localized_pages_and_api_delivery(self):
        for lang, path in PAGES.items():
            self.assertTrue(path.exists(), path)
            source = path.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}">', source)
            for token in EXPECTED[lang]:
                self.assertIn(token, source)
            self.assertIn('id="feedback-form"', source)
            self.assertIn('../scripts/language-switcher.js', source)
            self.assertNotIn('mailto:', source)
            self.assertNotIn('itprof80@gmail.com', source)
            self.assertIn('method="post" action="/api/feedback"', source)
            self.assertIn('../scripts/feedback-api.js', source)
            self.assertIn('name="website" hidden', source)
            self.assertIn('name="consent" value="yes" required', source)
            self.assertIn('../legal/feedback-consent.html', source)
            self.assertIn('type="submit" disabled', source)
            self.assertIn('../legal/privacy.html', source)
            for key in ('busy', 'success', 'rate', 'error'):
                self.assertIn(f'data-{key}="', source)
            for field in ('kind', 'name', 'replyEmail', 'pageUrl', 'message'):
                self.assertIn(f'name="{field}"', source)
            self.assertIn('aria-live="polite"', source)
            self.assertIn('maxlength="3000"', source)
            self.assertNotIn("supabase.from(", source)
            self.assertNotIn("fetch(", source)
            self.assertNotIn("formsubmit", source.lower())
            self.assertIn("Mail.ru", source)
            self.assertIn("сохраняются" if lang == "ru" else "stored" if lang == "en" else "保存在", source)

    def test_client_contract(self):
        source = (ROOT / "scripts/feedback-api.js").read_text(encoding="utf-8")
        for token in ("fetch('/api/feedback'", "method: 'POST'", "credentials: 'omit'",
                      "application/json", "response.status === 429", "response.status !== 201",
                      "result.status !== 'accepted'", "textContent", "AbortController"):
            self.assertIn(token, source)
        self.assertNotIn("innerHTML", source)
        self.assertNotIn("mailto:", source)
        self.assertNotIn("localStorage", source)

    def test_shared_navigation_injects_feedback_link(self):
        source = (ROOT / "scripts/main.js").read_text(encoding="utf-8")
        for token in ["data-feedback-link", "feedback/index", "Вопросы и пожелания", "Questions & feedback", "问题与建议"]:
            self.assertIn(token, source)

if __name__ == "__main__":
    unittest.main()
