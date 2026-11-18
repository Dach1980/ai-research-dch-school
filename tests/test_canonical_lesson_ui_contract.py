import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "ru": ROOT / "lessons/a-7-1-2-les-a-0169.html",
    "en": ROOT / "lessons/a-7-1-2-les-a-0169-en.html",
    "zh": ROOT / "lessons/a-7-1-2-les-a-0169-zh.html",
}


class PageAudit(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def __init__(self):
        super().__init__()
        self.tags = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set((attrs.get("class") or "").split())
        self.tags.append((tag, attrs, classes, tuple(self.stack)))
        if tag not in self.VOID:
            self.stack.append((tag, classes))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break


class CanonicalLessonUIContractTests(unittest.TestCase):
    def test_all_locales_use_one_canonical_shell(self):
        for locale, path in PAGES.items():
            with self.subTest(locale=locale):
                source = path.read_text(encoding="utf-8")
                audit = PageAudit()
                audit.feed(source)
                tags = audit.tags
                self.assertRegex(source, rf'<html lang="{locale}"')
                self.assertEqual(sum(t == "header" and "site-header" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "footer" and "footer" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "main" and "lesson" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "nav" and "lesson-nav" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "nav" and "nav" in c for t, a, c, p in tags), 1)
                self.assertNotIn('class="language-switcher"', source)
                self.assertNotIn("locale-links", source)
                self.assertNotIn("lesson-language-links", source)
                self.assertIn('class="lesson-nav" id="lesson-navigation"', source)
                self.assertIn('id="lesson-navigation" aria-label=', source)

    def test_shared_scripts_are_loaded_once_and_owned_by_the_shell(self):
        required = (
            "scripts/main.js",
            "scripts/language-switcher.js",
            "scripts/theme-system.js",
            "scripts/lesson-layout.js",
        )
        for locale, path in PAGES.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(locale=locale):
                for script in required:
                    self.assertEqual(source.count(script), 1, (locale, script))
        renderer = (ROOT / "scripts/xai-local-global-lesson.js").read_text(encoding="utf-8")
        self.assertNotIn("lesson-language-links", renderer)
        self.assertNotIn("nav.innerHTML", renderer)
        self.assertNotIn('document.getElementById("lesson-navigation")', renderer)

    def test_locale_switcher_accepts_all_lesson_number_sequences(self):
        script = (ROOT / "scripts/language-switcher.js").read_text(encoding="utf-8")
        self.assertIn(r"^lessons\/a-[a-z0-9.-]+\.html$", script)
        for route in (
            "lessons/a-1-1-1.html",
            "lessons/a-6-1-3.html",
            "lessons/a-7-1-2-les-a-0169.html",
            "lessons/a-11-2-2-les-a-0999.html",
        ):
            self.assertRegex(route, r"^lessons/a-[a-z0-9.-]+\.html$")

    def test_shared_navigation_owns_review_and_published_lesson_pages(self):
        script = (ROOT / "scripts/lesson-layout.js").read_text(encoding="utf-8")
        self.assertIn("var allLessons=", script)
        self.assertIn("var currentLesson=allLessons.find", script)
        self.assertIn('item.status==="published"&&item.content_state==="published"', script)
        self.assertIn("index>=0&&index<published.length-1", script)
        self.assertIn("previous=published.filter", script)
        self.assertIn('pending.className="button primary is-disabled"', script)
        self.assertNotIn("lesson-language-links", script)

    def test_shared_heading_tokens_override_legacy_fixed_h2_color(self):
        css = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        self.assertIn("main.lesson .xai-canonical-section-title", css)
        self.assertIn("color: var(--lds-ink", css)
        legacy = (ROOT / "styles/lesson-reference-111.css").read_text(encoding="utf-8")
        self.assertIn(".lesson h2{margin-top:2.4em;color:#a9caff}", legacy)

    def test_canonical_template_and_contract_exist(self):
        template = ROOT / "templates/lessons/canonical-lesson-shell.html"
        contract = ROOT / "docs/standards/CANONICAL_LESSON_UI_CONTRACT.md"
        self.assertTrue(template.is_file())
        self.assertTrue(contract.is_file())
        text = contract.read_text(encoding="utf-8")
        for rule in ("sole owner", "only `scripts/lesson-layout.js`", "Playwright", "status: published"):
        self.assertIn(r"^lessons\/a-[a-z0-9.-]+\.html$", script)


if __name__ == "__main__":
    unittest.main()
