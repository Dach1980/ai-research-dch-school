import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-6-1-2-les-a-0148.html",
    "en": ROOT / "lessons/a-6-1-2-les-a-0148-en.html",
    "zh": ROOT / "lessons/a-6-1-2-les-a-0148-zh.html",
}
ROUTES = {"ru": "a-6-1-2-les-a-0148.html", "en": "a-6-1-2-les-a-0148-en.html", "zh": "a-6-1-2-les-a-0148-zh.html"}


class TagBalance(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__()
        self.stack, self.errors = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(tag)
            if tag in self.stack:
                self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]
        else:
            self.stack.pop()


class Lesson612DraftTests(unittest.TestCase):
    def test_locale_switchers_have_correct_targets_and_active_locale(self):
        for locale, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            block = re.search(r'<div class="language-switcher"[^>]*>(.*?)</div>', html, re.S)
            self.assertIsNotNone(block)
            links = re.findall(r'<a href="([^"]+)"([^>]*)>(RU|EN|中文)</a>', block.group(1))
            self.assertEqual([(u, label) for u, _, label in links], [
                (ROUTES["ru"], "RU"), (ROUTES["en"], "EN"), (ROUTES["zh"], "中文")
            ])
            self.assertEqual(sum('aria-current="page"' in attrs for _, attrs, _ in links), 1)
            active = next(label for _, attrs, label in links if 'aria-current="page"' in attrs)
            self.assertEqual(active, {"ru": "RU", "en": "EN", "zh": "中文"}[locale])
            self.assertNotIn("undefined", block.group(1))

    def test_three_locales_keep_nine_sections_and_equal_learning_components(self):
        expected = [f"section-{n}" for n in range(1, 10)]
        for locale, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', html)
                self.assertEqual(re.findall(r'<section id="([^"]+)"', html), expected)
                self.assertEqual(html.count('class="lesson-check-question"'), 5)
                self.assertEqual(html.count('class="lesson-check-button"'), 5)
                self.assertEqual(html.count('class="lesson-check-feedback"'), 5)
                self.assertEqual(html.count('class="glossary-entry"'), 8)
                self.assertEqual(html.count('class="lesson-sources"'), 1)
                self.assertEqual(html.count('class="lesson-figure"'), 1)
                self.assertIn('<title id="route-title">', html)
                self.assertIn('<desc id="route-desc">', html)
                self.assertEqual(len(re.findall(r'<li><a href="https://', html)), 6)

    def test_single_choice_questions_use_distinct_radio_groups(self):
        for path in PAGES.values():
            html = path.read_text(encoding="utf-8")
            questions = re.findall(r'<article class="lesson-check-question"[^>]*>(.*?)</article>', html, re.S)
            self.assertEqual(len(questions), 5)
            for index, question in enumerate(questions, 1):
                radios = re.findall(r'<input type="radio" name="([^"]+)" value="([a-z])">', question)
                self.assertEqual(len(radios), 3)
                self.assertEqual({name for name, _ in radios}, {f"lesson-check-q{index}"})
                self.assertIn('aria-live="polite"', question)

    def test_logistic_regression_and_shap_limitations_are_explained(self):
        expected = {
            "ru": ("log-odds", "exp(βⱼ)", "процентных пунктов", "raw score", "interventional", "conditional", "не доказывает причинность"),
            "en": ("log-odds", "exp(βⱼ)", "percentage points", "raw-score", "interventional", "conditional", "does not establish causality"),
            "zh": ("log-odds", "exp(βⱼ)", "百分点", "原始分数", "干预式", "条件式", "不能证明因果关系"),
        }
        for locale, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            for term in expected[locale]:
                self.assertIn(term, html)

    def test_html_structure_and_local_assets(self):
        for locale, path in PAGES.items():
            html = path.read_text(encoding="utf-8")
            parser = TagBalance()
            parser.feed(html)
            with self.subTest(locale=locale):
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [])
                refs = re.findall(r'(?:src|href)="([^"]+)"', html)
                local = [ref for ref in refs if not ref.startswith(("https://", "http://", "#", "mailto:"))]
                for ref in local:
                    clean_ref = ref.split("#", 1)[0].split("?", 1)[0]
                    if clean_ref:
                        self.assertTrue((path.parent / clean_ref).resolve().is_file(), ref)
                self.assertNotIn('href="undefined"', html)

    def test_shared_assessment_script_handles_radio_controls(self):
        script = (ROOT / "scripts/lesson-assessment.js").read_text(encoding="utf-8")
        self.assertIn('input[type="checkbox"],input[type="radio"]', script)

    def test_612_is_published_with_approved_stable_uid_and_localized_urls(self):
        import json
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item.get("uid") == "les-a-0148")
        self.assertEqual(lesson["code"], "6.1.2")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["theme_uid"], "thm-a-06")
        self.assertEqual(lesson["module_uid"], "mod-a-06-01")
        self.assertEqual(lesson["url_i18n"]["ru"], "lessons/a-6-1-2-les-a-0148.html")
        self.assertEqual(lesson["url_i18n"]["en"], "lessons/a-6-1-2-les-a-0148-en.html")
        self.assertEqual(lesson["url_i18n"]["zh"], "lessons/a-6-1-2-les-a-0148-zh.html")
        self.assertEqual(catalog["lessons"][catalog["lessons"].index(lesson)-1]["uid"], "les-a-0147")


if __name__ == "__main__":
    unittest.main()
