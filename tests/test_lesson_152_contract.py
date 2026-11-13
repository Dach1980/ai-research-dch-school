import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-1-5-2.html",
    "en": ROOT / "lessons/a-1-5-2-en.html",
    "zh": ROOT / "lessons/a-1-5-2-zh.html",
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


class Lesson152ContractTests(unittest.TestCase):
    def test_catalog_identity_and_localized_routes(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(item for item in catalog["lessons"] if item["uid"] == "les-a-0044")
        self.assertEqual(lesson["code"], "1.5.2")
        self.assertEqual(lesson["track_uid"], "trk-a")
        self.assertEqual(lesson["module_uid"], "mod-a-01-05")
        self.assertIn(lesson["status"], {"review", "published"})
        self.assertIn(lesson["content_state"], {"localized", "published"})
        self.assertEqual(lesson["prerequisite_uids"], ["les-a-0043"])
        self.assertEqual(set(lesson["url_i18n"]), {"ru", "en", "zh"})
        self.assertEqual(set(lesson["title_i18n"]), {"ru", "en", "zh"})

    def test_three_locales_have_equal_learning_components(self):
        expected = {
            "lesson-outcomes": 1,
            "lesson-problem": 1,
            "lesson-conclusion": 1,
            "lesson-sources": 1,
            "lesson-nav": 1,
            "lesson-glossary": 1,
            "glossary-entry": 5,
            "lesson-check-question": 7,
            "lesson-check-button": 7,
            "lesson-check-feedback": 7,
        }
        section_ids = None
        correct_keys = None
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                self.assertIn(f'<html lang="{locale}"', source)
                self.assertIn('<section class="track-hero article-hero">', source)
                self.assertIn('<article class="article-body">', source)
                self.assertIn('class="lesson-planet-banner"', source)
                self.assertIn('class="lesson-planet-art"', source)
                self.assertIn('../styles/lesson-reference-111.css', source)
                self.assertIn('../styles/lesson-124.css', source)
                self.assertIn('../styles/lesson-152.css', source)
                self.assertIn('../scripts/lesson-layout.js', source)
                self.assertIn('../scripts/lesson-assessment.js', source)
                self.assertEqual(source.count('<svg '), 1)
                self.assertIn('aria-labelledby="cm-' + locale + '-title cm-' + locale + '-desc"', source)
                self.assertIn('<figcaption>', source)
                self.assertEqual(len(re.findall(r'<li><a href="https://', source)), 3)
                self.assertEqual(source.count('type="checkbox"'), 26)
                self.assertIn('data-mode="yesno"', source)
                self.assertIn('aria-live="polite"', source)
                self.assertIn('<nav class="lesson-nav"', source)
                self.assertNotIn('a-1-5-3.html', source)
                self.assertNotIn('a-1-5-1.html', source.split('<nav class="lesson-nav"', 1)[1].split('</nav>', 1)[0])
                for component, count in expected.items():
                    self.assertEqual(source.count(f'class="{component}"'), count, component)
                ids = re.findall(r'<section id="([^"]+)"', source)
                if section_ids is None:
                    section_ids = ids
                else:
                    self.assertEqual(ids, section_ids)
                keys = re.findall(r'data-correct="([a-d])"', source)
                self.assertEqual(len(keys), 7)
                if correct_keys is None:
                    correct_keys = keys
                else:
                    self.assertEqual(keys, correct_keys)
                parser = StructureParser()
                parser.feed(source)
                self.assertEqual(parser.errors, [])
                self.assertEqual(parser.stack, [], f"unclosed tags: {parser.stack}")
                footer = source.split('<footer class="footer">', 1)[1].split("</footer>", 1)[0]
                home = {"ru": "../index.html", "en": "../index-en.html", "zh": "../index-zh.html"}[locale]
                self.assertIn(f'<a class="brand" href="{home}">', footer)
                self.assertIn('<img src="../assets/site-brand-icon.jpg" alt="DCH">', footer)
                self.assertIn("<strong>AI Research</strong><small>DCH SCHOOL</small>", footer)

    def test_matrix_semantics_and_example_are_consistent(self):
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                self.assertIn("18", source)
                self.assertIn("168", source)
                self.assertIn("18 + 2 + 12 + 168 = 200", source)
                self.assertIn("cell-tp", source)
                self.assertIn("cell-tn", source)
                self.assertIn("cell-fp", source)
                self.assertIn("cell-fn", source)
                self.assertIn("Actual", source) if path.name.endswith("-en.html") else None

    def test_glossary_and_svg_use_theme_aware_shared_system(self):
        css = (ROOT / "styles/lesson-124.css").read_text(encoding="utf-8")
        self.assertIn(".lesson-glossary{display:grid", css)
        self.assertIn(".lesson-glossary>.glossary-entry{display:flex;flex-direction:column", css)
        diagram_css = (ROOT / "styles/lesson-152.css").read_text(encoding="utf-8")
        for token in ("--lds-surface", "--lds-line", "--lds-ink", "--lds-muted", "--lds-accent", "--lds-good", "--lds-bad"):
            self.assertIn(token, diagram_css)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertEqual(source.count('class="glossary-entry"'), 5)
            self.assertNotRegex(source, r'<text[^>]+(?:fill|style)=')
            self.assertNotRegex(source, r'<(?:rect|path)[^>]+(?:fill|stroke)="#[0-9a-fA-F]{3,8}"')

    def test_assessment_answers_are_balanced_and_explanations_exist(self):
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            keys = re.findall(r'data-correct="([a-d])"', source)
            self.assertEqual(len(keys), 7)
            self.assertGreaterEqual(len(set(keys)), 4)
            self.assertEqual(source.count('data-explanation="'), 7)
            self.assertEqual(source.count('class="lesson-check-button"'), 7)

    def test_curriculum_boundary_and_catalog_driven_navigation(self):
        curriculum = (ROOT / "docs/education/TRACK_A_CURRICULUM.md").read_text(encoding="utf-8")
        self.assertIn("Граница содержания урока 1.5.2", curriculum)
        self.assertIn("1.5.3", curriculum)
        script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")
        self.assertIn('item.track_uid==="trk-a"&&item.status==="published"', script)
        self.assertIn("nav.replaceChildren(fragment)", script)
        for path in PAGES.values():
            source = path.read_text(encoding="utf-8")
            self.assertIn('<nav class="lesson-nav"', source)
            self.assertNotIn('class="button primary"', source)


if __name__ == "__main__":
    unittest.main()
