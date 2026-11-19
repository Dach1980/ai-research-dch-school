import json
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES_711 = {
    "ru": ROOT / "lessons/a-7-1-1-les-a-0018.html",
    "en": ROOT / "lessons/a-7-1-1-les-a-0018-en.html",
    "zh": ROOT / "lessons/a-7-1-1-les-a-0018-zh.html",
}
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
    BLOCK_SELECTORS = (
        ("lesson-intro", lambda tag, attrs, classes: tag == "section" and "lesson-intro" in classes),
        ("lesson-outcomes", lambda tag, attrs, classes: attrs.get("id") == "lesson-outcomes"),
        ("lesson-sections", lambda tag, attrs, classes: attrs.get("id") == "lesson-sections"),
        ("lesson-practice", lambda tag, attrs, classes: attrs.get("id") == "lesson-practice"),
        ("lesson-sources", lambda tag, attrs, classes: attrs.get("id") == "lesson-sources"),
        ("lesson-navigation", lambda tag, attrs, classes: attrs.get("id") == "lesson-navigation"),
        ("lesson-glossary", lambda tag, attrs, classes: attrs.get("id") == "lesson-glossary"),
        ("lesson-quiz", lambda tag, attrs, classes: attrs.get("id") == "lesson-quiz"),
        ("footer", lambda tag, attrs, classes: tag == "footer" and "footer" in classes),
    )

    def assert_canonical_block_order(self, source, label):
        audit = PageAudit()
        audit.feed(source)
        positions = []
        for name, matches in self.BLOCK_SELECTORS:
            found = [
                index for index, (tag, attrs, classes, parents) in enumerate(audit.tags)
                if matches(tag, attrs, classes)
            ]
            self.assertEqual(len(found), 1, f"{label}: expected exactly one {name}, got {len(found)}")
            positions.append(found[0])
            if name != "footer":
                tag, attrs, classes, parents = audit.tags[found[0]]
                self.assertTrue(
                    any(parent_tag == "main" and "lesson" in parent_classes
                        for parent_tag, parent_classes in parents),
                    f"{label}: {name} must be inside main.lesson",
                )
        self.assertEqual(
            positions, sorted(positions),
            f"{label}: lesson blocks must follow intro → outcomes → sections → practice → sources → navigation → glossary → quiz → footer",
        )

    def test_canonical_template_declares_mandatory_block_order(self):
        template = (ROOT / "templates/lessons/canonical-lesson-shell.html.tmpl").read_text(encoding="utf-8")
        self.assert_canonical_block_order(template, "canonical shell template")
        self.assertIn('scripts/lesson-svg-renderer.js', template)

    def test_published_uid_backed_lessons_cannot_bypass_block_order(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        published = [
            item for item in catalog.get("lessons", [])
            if item.get("track_uid") == "trk-a"
            and int(item.get("uid", "0").rsplit("-", 1)[-1]) >= 169
            and item.get("status") == "published"
            and item.get("content_state") == "published"
        ]
        for lesson in published:
            for locale in ("ru", "en", "zh"):
                with self.subTest(uid=lesson["uid"], locale=locale):
                    route = (lesson.get("url_i18n") or {}).get(locale)
                    self.assertTrue(route, f"{lesson['uid']}: missing {locale} route")
                    page = ROOT / route
                    self.assertTrue(page.is_file(), f"{lesson['uid']}: missing {locale} page {route}")
                    self.assert_canonical_block_order(page.read_text(encoding="utf-8"), f"{lesson['uid']} / {locale}")

    def test_published_reference_lesson_711_uses_mandatory_block_order_in_all_locales(self):
        for locale, path in PAGES_711.items():
            with self.subTest(locale=locale):
                self.assert_canonical_block_order(path.read_text(encoding="utf-8"), f"7.1.1 / {locale}")

    def test_review_lesson_712_uses_mandatory_block_order_in_all_locales(self):
        for locale, path in PAGES.items():
            with self.subTest(locale=locale):
                self.assert_canonical_block_order(path.read_text(encoding="utf-8"), f"7.1.2 / {locale}")

    def test_all_locales_use_one_canonical_shell(self):
        for locale, path in PAGES.items():
            with self.subTest(locale=locale):
                source = path.read_text(encoding="utf-8")
                audit = PageAudit()
                audit.feed(source)
                tags = audit.tags
                self.assertRegex(source, rf'<html lang="{locale}(?:-[A-Za-z0-9-]+)?"')
                self.assertEqual(sum(t == "header" and "site-header" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "footer" and "footer" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "main" and "lesson" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "nav" and "lesson-nav" in c for t, a, c, p in tags), 1)
                self.assertEqual(sum(t == "nav" and "nav" in c for t, a, c, p in tags), 1)
                self.assertTrue(any(
                    t == "div" and "container" in c
                    and any("footer" in parent_classes for _, parent_classes in parents)
                    for t, a, c, parents in tags
                ))
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
        self.assertIn("link.lang = locale;", script)
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
        template = ROOT / "templates/lessons/canonical-lesson-shell.html.tmpl"
        contract = ROOT / "docs/standards/CANONICAL_LESSON_UI_CONTRACT.md"
        self.assertTrue(template.is_file())
        self.assertTrue(contract.is_file())
        contract_text = contract.read_text(encoding="utf-8").lower()
        for rule in ("sole owner", "only `scripts/lesson-layout.js`", "playwright", "status: published"):
            self.assertIn(rule, contract_text)


    def test_reference_and_new_lessons_use_canonical_dictionary_and_metadata(self):
        data_711 = (ROOT / "lessons/data/xai-01-what-and-why.js").read_text(encoding="utf-8")
        data_712 = (ROOT / "lessons/data/xai-02-local-global.js").read_text(encoding="utf-8")
        renderer_712 = (ROOT / "scripts/xai-local-global-lesson.js").read_text(encoding="utf-8")
        page_711 = (ROOT / "lessons/a-7-1-1-les-a-0018.html").read_text(encoding="utf-8")

        # Three locales: five cards in 7.1.1 and eight in 7.1.2.
        self.assertEqual(data_711.count("glossary-grid"), 3)
        self.assertEqual(data_711.count("glossary-entry"), 15)
        self.assertEqual(data_712.count("glossary-grid"), 3)
        self.assertEqual(data_712.count("glossary-entry"), 24)
        for source in (data_711, data_712):
            self.assertNotIn("<dl>", source)
            self.assertNotRegex(source, r"<h[23]>(?:Глоссарий|Краткий словарь|Glossary|Short glossary|简明术语表|术语表)</h[23]>")
            for heading in ("Словарь терминов", "Key terms", "术语词典"):
                self.assertIn(heading, source)

        # No duration estimates or locally invented level/format labels.
        self.assertNotIn('"duration": {', data_711)
        self.assertNotIn("duration: {ru:", data_712)
        self.assertNotIn("lesson.duration", renderer_712)
        self.assertNotIn("lesson-duration", renderer_712)
        self.assertNotIn("Продолжительность", renderer_712)
        self.assertNotIn("Начальный уровень", page_711)
        self.assertNotIn("мини-лаборатория</p>", page_711)

        design = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        for selector in (".lesson-glossary", ".glossary-grid", ".glossary-entry", ".term-index", ".term-en"):
            self.assertIn(selector, design)


    def test_learning_outcomes_have_shared_automatic_card_component(self):
        design = (ROOT / "styles/lesson-design-system.css").read_text(encoding="utf-8")
        template = (ROOT / "templates/lessons/canonical-lesson-shell.html.tmpl").read_text(encoding="utf-8")
        self.assertIn('class="outcomes" id="lesson-outcomes"', template)
        self.assertIn("Canonical learning-outcomes cards.", design)
        self.assertIn("main.lesson #lesson-outcomes > ul", design)
        self.assertIn("counter(lesson-outcome, decimal-leading-zero)", design)
        self.assertIn("@media (max-width: 650px)", design)
        self.assertIn("var(--lds-surface)", design)
        self.assertIn("var(--lds-ink)", design)


if __name__ == "__main__":
    unittest.main()
