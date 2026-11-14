import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-8.html",
    "en": ROOT / "lessons/a-1-5-8-en.html",
    "zh": ROOT / "lessons/a-1-5-8-zh.html",
}


class Parser(HTMLParser):
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
            self.errors.append("unexpected closing: " + tag)
        elif self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.errors.append("misnested: " + tag)
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]
        else:
            self.errors.append("closing without opener: " + tag)


class Lesson158ContractTests(unittest.TestCase):
    def test_catalog_identity_prerequisites_and_urls(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0057")
        self.assertEqual((lesson["code"], lesson["track_uid"], lesson["theme_uid"], lesson["module_uid"]),
                         ("1.5.8", "trk-a", "thm-a-01", "mod-a-01-05"))
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0048", "les-a-0046"])
        self.assertEqual(lesson["status"], "review")
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        previous = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0048")
        self.assertEqual(previous["status"], "published")
        for locale, path in PAGES.items():
            self.assertTrue(path.is_file(), locale)
            self.assertEqual(lesson["url_i18n"][locale], str(path.relative_to(ROOT)))

    def test_locale_structure_glossary_sources_and_quiz_parity(self):
        expected_sections = [f"section-{i}" for i in range(1, 9)] + ["practice"]
        expected_answers = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}">', source)
                self.assertEqual(re.findall(r'<section id="([^"]+)"', source), expected_sections)
                self.assertEqual(source.count('class="glossary-entry"'), 5)
                self.assertEqual(source.count('class="lesson-check-question"'), 6)
                self.assertEqual(source.count('class="lesson-check-button"'), 6)
                self.assertEqual(source.count('class="lesson-check-feedback"'), 6)
                self.assertEqual(source.count('data-explanation="'), 6)
                self.assertEqual(source.count('role="math"'), 4)
                self.assertEqual(source.count('class="formula"'), 4)
                self.assertEqual(source.count("<svg "), 2)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                answers = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(answers), 6)
                self.assertEqual(set(answers), set("abc"))
                if expected_answers is None:
                    expected_answers = answers
                else:
                    self.assertEqual(answers, expected_answers)
                parser = Parser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [])
                for href in re.findall(r'href="([^"]+)"', source):
                    parts = urlsplit(href)
                    if parts.scheme or href.startswith("#") or not parts.path:
                        continue
                    target = (path.parent / parts.path).resolve()
                    self.assertTrue(target.is_file(), f"{locale}: broken link {href}")
                canonical = f'https://dach1980.github.io/ai-research-dch-school/lessons/a-1-5-8{"-"+locale if locale != "ru" else ""}.html'
                self.assertIn(f'<link rel="canonical" href="{canonical}">', source)

    def test_formula_svg_theme_and_glossary_layout(self):
        css = (ROOT / "styles/lesson-158.css").read_text(encoding="utf-8")
        for token in ("--lds-surface", "--lds-line", "--lds-ink", "--lds-muted", "--lds-accent", "--lds-good", "--lds-bad"):
            self.assertIn(token, css)
        self.assertNotIn("--lds-warn", css)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", css)
        base = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", base)
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            svgs = re.findall(r"<svg\\b.*?</svg>", source, re.S)
            self.assertEqual(len(svgs), 2, locale)
            for svg in svgs:
                self.assertRegex(svg, r"<title id=")
                self.assertRegex(svg, r"<desc id=")
                self.assertRegex(svg, r'<text class="[^"]+"')
                self.assertNotRegex(svg, r'<text[^>]+(?:fill|style)=')
                self.assertNotRegex(svg, r'<(?:rect|path|line|circle)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}')
            for expression in ("BS =", "LL =", "ECE =", "p̂ ="):
                self.assertIn(expression, source)
            self.assertIn("class=\"definition-term\"", source)
            self.assertIn("class=\"definition-text\"", source)
            self.assertIn("../styles/lesson-158.css", source)
            self.assertIn("../scripts/lesson-layout.js", source)
            self.assertIn("../scripts/lesson-assessment.js", source)


if __name__ == "__main__":
    unittest.main()
