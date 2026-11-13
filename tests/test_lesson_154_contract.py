import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-4.html",
    "en": ROOT / "lessons/a-1-5-4-en.html",
    "zh": ROOT / "lessons/a-1-5-4-zh.html",
}


class StructureParser(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append(f"unexpected closing tag: {tag}")
        elif self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.errors.append(f"misnested closing tag: {tag}; open={self.stack[-5:]}")
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]
        else:
            self.errors.append(f"closing tag without opener: {tag}")


class Lesson154ContractTests(unittest.TestCase):
    def test_catalog_identity_prerequisites_and_localized_routes(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["uid"] == "les-a-0046")
        self.assertEqual(lesson["code"], "1.5.4")
        self.assertEqual(lesson["track_uid"], "trk-a")
        self.assertEqual(lesson["theme_uid"], "thm-a-01")
        self.assertEqual(lesson["module_uid"], "mod-a-01-05")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0045"])
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        following = next(item for item in catalog["lessons"] if item["uid"] == "les-a-0047")
        self.assertEqual(following["prerequisite_uids"], ["les-a-0046"])

    def test_three_locales_have_equal_structure_components_and_assessment_keys(self):
        expected = {
            "lesson-outcomes": 1, "lesson-problem": 2, "lesson-conclusion": 1,
            "lesson-sources": 1, "lesson-nav": 1, "lesson-glossary": 1,
            "glossary-entry": 5, "lesson-check-question": 7,
            "lesson-check-button": 7, "lesson-check-feedback": 7,
        }
        section_ids = None
        answer_keys = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn('../styles/lesson-reference-111.css', source)
                self.assertIn('../styles/lesson-124.css', source)
                self.assertIn('../styles/lesson-154.css', source)
                self.assertIn('../scripts/lesson-layout.js', source)
                self.assertIn('../scripts/lesson-assessment.js', source)
                self.assertEqual(source.count("<svg "), 3)
                self.assertEqual(source.count('role="math"'), 5)
                self.assertEqual(source.count('type="checkbox"'), 28)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                self.assertEqual(source.count('class="glossary-entry"'), 5)
                self.assertEqual(source.count('class="lesson-check-question"'), 7)
                self.assertIn('data-mode="single"', source)
                self.assertIn('aria-live="polite"', source)
                self.assertIn('<nav class="lesson-nav"', source)
                self.assertIn('aria-label="', source)
                for component, count in expected.items():
                    self.assertEqual(source.count(f'class="{component}"'), count, component)
                ids = re.findall(r'<section id="([^"]+)"', source)
                if section_ids is None:
                    section_ids = ids
                else:
                    self.assertEqual(ids, section_ids)
                keys = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(keys), 7)
                if answer_keys is None:
                    answer_keys = keys
                else:
                    self.assertEqual(keys, answer_keys)
                parser = StructureParser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [], f"unclosed tags: {parser.stack}")
                self.assertIn(f'<link rel="canonical" href="https://dchai.ru/lessons/a-1-5-4{"-en" if locale=="en" else "-zh" if locale=="zh" else ""}.html">', source)

    def test_metric_formulas_and_rare_class_example(self):
        required = [
            "TPR = TP / (TP + FN) = Recall",
            "FPR = FP / (FP + TN)",
            "ROC-AUC = ∫₀¹ TPR(FPR) d(FPR)",
            "AP = Σₙ (Recallₙ − Recallₙ₋₁) × Precisionₙ",
            "TP = 80", "FN = 20", "FP = 198", "TN = 9,702",
            "28.8%", "0.02", "0.80",
        ]
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            for token in required:
                self.assertIn(token, source)
            self.assertIn("lesson-154-figure", source)
            self.assertIn("lesson-154-table", source)

    def test_svg_and_formula_styles_are_theme_aware(self):
        css = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", css)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", css)
        lesson_css = (ROOT / "styles/lesson-154.css").read_text(encoding="utf-8")
        for token in ("--lds-surface", "--lds-line", "--lds-ink", "--lds-muted", "--lds-accent", "--lds-good", "--lds-warning"):
            self.assertIn(token, lesson_css)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertNotRegex(source, r'<text[^>]+(?:fill|style)=')
            self.assertNotRegex(source, r'<(?:rect|path)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}"')
            self.assertNotIn("<style", source)
            self.assertIn('aria-labelledby="roc154-', source)
            self.assertIn("<figcaption>", source)
            self.assertIn("tspan", source) if locale_has_multiline(source) else None

    def test_assessment_has_explanations_and_balanced_answer_positions(self):
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('data-explanation="'), 7)
            self.assertEqual(source.count('class="lesson-check-button"'), 7)
            keys = re.findall(r'data-correct="([a-d])"', source)
            self.assertEqual(set(keys), {"a", "b", "c", "d"})
            self.assertGreaterEqual(len(set(keys)), 3)


def locale_has_multiline(source):
    return False


if __name__ == "__main__":
    unittest.main()
