import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-3-3.html",
    "en": ROOT / "lessons/a-1-3-3-en.html",
    "zh": ROOT / "lessons/a-1-3-3-zh.html",
}
TITLES = {
    "ru": "Обучение с подкреплением",
    "en": "Reinforcement Learning",
    "zh": "强化学习",
}
REQUIRED = (
    "Agent", "Environment", "Q-learning", "Exploration", "Policy",
    "Markov Decision Process", "Gymnasium", "spinningup.openai.com",
)


class Lesson133Tests(unittest.TestCase):
    def test_published_locales_and_canonical_urls(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                html = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}">', html)
                self.assertIn("1.3.3", html)
                self.assertIn(TITLES[locale], html)
                self.assertIn('rel="canonical"', html)
                self.assertNotIn('name="robots" content="noindex,nofollow"', html)
                self.assertNotIn("На редакционной проверке", html)
                self.assertIn("© 2026 AI Research DCH School", html)
                self.assertIn('class="lesson-planet-banner"', html)
                self.assertIn('class="lesson-nav"', html)
                self.assertIn('class="lesson-sources"', html)

    def test_lesson_structure_and_localization_parity(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                html = path.read_text(encoding="utf-8")
                self.assertEqual(len(re.findall(r'<figure class="lesson-figure">', html)), 3)
                self.assertEqual(len(re.findall(r'class="glossary-entry"', html)), 10)
                self.assertEqual(len(re.findall(r'class="lesson-check-question"', html)), 6)
                self.assertEqual(html.count('data-mode="multi"'), 1)
                self.assertIn('data-correct="a,b,c"', html)
                self.assertIn('class="language-python"', html)
                self.assertIn('class="lesson-practice"', html)
                self.assertIn("lesson-assessment.js", html)
                self.assertNotIn("{{", html)

    def test_code_is_html_escaped_and_reproducible(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            code = re.search(r'<pre class="language-python"><code>(.*?)</code></pre>', html, re.S)
            self.assertIsNotNone(code)
            self.assertIn("random.seed(7)", code.group(1))
            self.assertIn("&lt; epsilon", code.group(1))
            self.assertIn("&gt;", code.group(1))
            self.assertIn("print(", code.group(1))
            self.assertIn("0 -&gt; 1 -&gt; 2 -&gt; 3 -&gt; 4", html)

    def test_sources_quiz_and_navigation_order(self):
        for locale, path in FILES.items():
            html = path.read_text(encoding="utf-8")
            self.assertLess(html.index('class="lesson-sources"'), html.index('class="lesson-nav"'))
            self.assertLess(html.index('class="lesson-nav"'), html.index('class="lesson-glossary"'))
            self.assertLess(html.index('class="lesson-glossary"'), html.index('class="lesson-check"'))
            self.assertIn("incompleteideas.net/book/the-book-2nd.html", html)
            self.assertIn("gymnasium.farama.org/api/env/", html)
            self.assertIn("spinningup.openai.com/en/latest/spinningup/rl_intro.html", html)
            self.assertNotIn('href="a-1-3-4', html)

    def test_catalog_sequence_and_publication_state(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        by_code = {item["code"]: item for item in catalog["lessons"]}
        lesson = by_code["1.3.3"]
        self.assertEqual(lesson["uid"], "les-a-0053")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["url_i18n"]["ru"], "lessons/a-1-3-3.html")
        self.assertEqual(lesson["url_i18n"]["en"], "lessons/a-1-3-3-en.html")
        self.assertEqual(lesson["url_i18n"]["zh"], "lessons/a-1-3-3-zh.html")
        self.assertIn("les-a-0008", lesson["prerequisite_uids"])
        self.assertEqual(by_code["1.3.4"]["status"], "planned")
        self.assertEqual(by_code["1.3.5"]["status"], "planned")

    def test_previous_lesson_links_to_1_3_3_in_all_locales(self):
        for locale in ("", "-en", "-zh"):
            path = ROOT / f"lessons/a-1-3-2{locale}.html"
            html = path.read_text(encoding="utf-8")
            self.assertIn(f'href="a-1-3-3{locale}.html"', html)


if __name__ == "__main__":
    unittest.main()
