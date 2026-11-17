import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-5-1-3-les-a-0045.html",
    "en": ROOT / "lessons/a-5-1-3-les-a-0045-en.html",
    "zh": ROOT / "lessons/a-5-1-3-les-a-0045-zh.html",
}
LEGACY_ROUTES = {
    "ru": "a-1-5-3.html",
    "en": "a-1-5-3-en.html",
    "zh": "a-1-5-3-zh.html",
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
            return
        if self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.errors.append(f"misnested closing tag: {tag}; open={self.stack[-5:]}")
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]
        else:
            self.errors.append(f"closing tag without opener: {tag}")


class Lesson153ContractTests(unittest.TestCase):
    def test_catalog_identity_and_localized_routes(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["uid"] == "les-a-0045")
        self.assertEqual(lesson["code"], "5.1.3")
        self.assertEqual(lesson["track_uid"], "trk-a")
        self.assertEqual(lesson["module_uid"], "mod-a-05-01")
        self.assertEqual(lesson["status"], "published")
        self.assertEqual(lesson["content_state"], "published")
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0044"])
        self.assertEqual(lesson["url_i18n"], {
            "ru": "lessons/a-5-1-3-les-a-0045.html",
            "en": "lessons/a-5-1-3-les-a-0045-en.html",
            "zh": "lessons/a-5-1-3-les-a-0045-zh.html",
        })
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})
        for locale, path in PAGES.items():
            self.assertTrue(path.is_file(), f"missing canonical {locale} lesson page")
            legacy = (ROOT / "lessons" / LEGACY_ROUTES[locale]).read_text(encoding="utf-8")
            self.assertIn(path.name, legacy)
            self.assertIn("location.replace", legacy)

    def test_locales_have_equal_learning_components(self):
        expected = {
            "lesson-outcomes": 1, "lesson-problem": 2, "lesson-conclusion": 1,
            "lesson-sources": 1, "lesson-nav": 1, "lesson-glossary": 1,
            "glossary-entry": 5, "lesson-check-question": 7,
            "lesson-check-button": 7, "lesson-check-feedback": 7,
        }
        ids = None
        keys = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn('class="locale-links"', source)
                self.assertIn('../styles/lesson-reference-111.css', source)
                self.assertIn('../styles/lesson-124.css', source)
                self.assertIn('../styles/lesson-153.css', source)
                self.assertIn('../scripts/lesson-layout.js', source)
                self.assertIn('../scripts/lesson-assessment.js', source)
                self.assertEqual(source.count('<svg '), 1)
                self.assertIn(f'aria-labelledby="metric-{locale}-title metric-{locale}-desc"', source)
                self.assertIn('<figcaption>', source)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                self.assertEqual(source.count('type="checkbox"'), 28)
                self.assertEqual(source.count('role="math"'), 5)
                self.assertGreaterEqual(source.count('aria-label="'), 4)
                self.assertIn('data-mode="single"', source)
                self.assertIn('aria-live="polite"', source)
                self.assertIn('<nav class="lesson-nav"', source)
                self.assertNotIn('a-5-1-4-les-a-0046', source)
                self.assertNotIn('class="button primary"', source)
                for component, count in expected.items():
                    self.assertEqual(source.count(f'class="{component}"'), count, component)
                section_ids = re.findall(r'<section id="([^"]+)"', source)
                if ids is None:
                    ids = section_ids
                else:
                    self.assertEqual(section_ids, ids)
                answers = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(answers), 7)
                if keys is None:
                    keys = answers
                else:
                    self.assertEqual(answers, keys)
                parser = StructureParser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [], f"unclosed tags: {parser.stack}")
                footer = source.split('<footer class="footer">', 1)[1].split("</footer>", 1)[0]
                home = {"ru": "../index.html", "en": "../index-en.html", "zh": "../index-zh.html"}[locale]
                self.assertIn(f'<a class="brand" href="{home}">', footer)
                self.assertIn('<img src="../assets/site-brand-icon.jpg" alt="DCH">', footer)
                self.assertIn("<strong>AI Research</strong><small>DCH SCHOOL</small>", footer)

    def test_metric_definitions_and_calculations_are_consistent(self):
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                for token in ("Accuracy", "Precision", "Recall", "F1", "TP + FP", "TP + FN", "TP + TN"):
                    self.assertIn(token, source)
                self.assertEqual(source.count('role="math"'), 5)
                for percentage in ("93%", "60%", "90%", "72%", "96%", "80%", "87%", "84%", "70%"):
                    self.assertIn(percentage, source)
                self.assertIn("76,4%" if locale == "ru" else "76.4%", source)
                self.assertIn("lesson-153-figure", source)
                self.assertIn("harmonic mean" if locale == "en" else ("гармоническое среднее" if locale == "ru" else "调和平均"), source)

    def test_glossary_svg_formula_and_theme_tokens(self):
        css = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", css)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", css)
        diagram_css = (ROOT / "styles/lesson-153.css").read_text(encoding="utf-8")
        for token in ("--lds-surface", "--lds-line", "--lds-ink", "--lds-muted", "--lds-accent", "--lds-good", "--lds-warning"):
            self.assertIn(token, diagram_css)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="glossary-entry"'), 5)
            self.assertNotRegex(source, r'<text[^>]+(?:fill|style)=')
            self.assertNotRegex(source, r'<(?:rect|path)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}"')
            self.assertNotIn("<style", source)

    def test_assessment_answers_and_explanations(self):
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            answers = re.findall(r'data-correct="([a-d])"', source)
            self.assertEqual(len(answers), 7)
            self.assertEqual(source.count('data-explanation="'), 7)
            self.assertEqual(source.count('class="lesson-check-button"'), 7)
            self.assertGreaterEqual(len(set(answers)), 4)

    def test_curriculum_boundary_and_catalog_driven_navigation(self):
        curriculum = (ROOT / "docs/education/TRACK_A_CURRICULUM.md").read_text(encoding="utf-8")
        self.assertIn("Граница содержания урока 1.5.3", curriculum)
        self.assertIn("1.5.4", curriculum)
        script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")
        self.assertIn("Canonical Track A lesson navigation", script)
        self.assertIn('item.track_uid==="trk-a"', script)
        self.assertIn('item.status==="published"', script)
        self.assertIn('item.content_state==="published"', script)
        self.assertIn("published.findIndex(function(item)", script)
        self.assertIn("nav.replaceChildren(fragment)", script)
        self.assertIn('"a-5-1-3-les-a-0045.html"', script)
        self.assertIn('"code": "5.1.3"', script)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            nav = source.split('<nav class="lesson-nav"', 1)[1].split("</nav>", 1)[0]
            self.assertNotIn('class="button primary"', nav)
            self.assertNotIn("a-5-1-4-les-a-0046", nav)


if __name__ == "__main__":
    unittest.main()
