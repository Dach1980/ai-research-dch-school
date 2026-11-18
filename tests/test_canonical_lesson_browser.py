import json
import threading
import unittest
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sync_playwright = None

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))


def uid_number(item):
    try:
        return int(item.get("uid", "").rsplit("-", 1)[-1])
    except (TypeError, ValueError):
        return 0


# Automatically include every new UID-backed Track A lesson from the contract boundary onward.
CANONICAL_LESSONS = sorted(
    (
        item for item in CATALOG.get("lessons", [])
        if item.get("track_uid") == "trk-a"
        and uid_number(item) >= 169
        and set((item.get("url_i18n") or {}).keys()) == {"ru", "en", "zh"}
    ),
    key=lambda item: tuple(int(part) for part in item["code"].split(".")),
)
PUBLISHED_LESSONS = [
    item for item in CATALOG.get("lessons", [])
    if item.get("track_uid") == "trk-a"
    and item.get("status") == "published"
    and item.get("content_state") == "published"
    and set((item.get("url_i18n") or {}).keys()) == {"ru", "en", "zh"}
]


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_args):
        pass


@unittest.skipIf(sync_playwright is None, "Playwright is installed in CI browser-acceptance jobs")
class CanonicalLessonBrowserAcceptanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not CANONICAL_LESSONS:
            raise AssertionError("No UID-backed Track A lessons found for canonical browser acceptance")
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)

    def open_page(self, lesson, locale, width=1440, theme="light"):
        page = self.browser.new_page(viewport={"width": width, "height": 1000})
        page.add_init_script(f"localStorage.setItem('dch-school-theme', '{theme}');")
        # Auth uses a remote Supabase SDK; isolate it from shell/navigation acceptance.
        page.route("**/scripts/account-ui.js", lambda route: route.fulfill(status=200, content_type="application/javascript", body="/* account UI isolated in shell acceptance */"))
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        relative_path = "/" + lesson["url_i18n"][locale]
        response = page.goto(self.base + relative_path, wait_until="domcontentloaded")
        self.assertEqual(response.status, 200)
        page.locator("main.lesson h1").wait_for()
        page.locator("nav.lesson-nav a.button").first.wait_for()
        self.assertEqual(errors, [], f"uncaught browser errors on {lesson['code']} / {locale}: {errors}")
        return page

    def test_locale_switcher_is_in_header_only_and_preserves_each_lesson(self):
        for lesson in CANONICAL_LESSONS:
            for locale in ("ru", "en", "zh"):
                with self.subTest(code=lesson["code"], locale=locale):
                    page = self.open_page(lesson, locale)
                    self.assertEqual(page.locator("header.site-header .language-switcher").count(), 1)
                    self.assertEqual(page.locator("main .language-switcher, footer .language-switcher, .lesson-language-links, .locale-links").count(), 0)
                    self.assertEqual(page.locator("header.site-header .language-switcher a").count(), 3)
                    links = page.locator("header.site-header .language-switcher a")
                    for index, target_locale in enumerate(("ru", "en", "zh")):
                        self.assertTrue(
                            links.nth(index).get_attribute("href").endswith(lesson["url_i18n"][target_locale].split("/")[-1])
                        )
                    self.assertEqual(
                        page.locator("header.site-header .language-switcher a[aria-current='page']").count(),
                        1,
                    )
                    if locale == "ru":
                        page.locator("header.site-header .language-switcher a[lang='en']").click()
                        page.wait_for_url("**/" + lesson["url_i18n"]["en"].split("/")[-1])
                        self.assertTrue(page.locator("html").get_attribute("lang").lower().startswith("en"))
                    page.close()

    def test_shared_navigation_is_single_and_never_links_to_unpublished_lessons(self):
        published_routes = {
            item["url_i18n"]["ru"].split("/")[-1]
            for item in PUBLISHED_LESSONS
        }
        for lesson in CANONICAL_LESSONS:
            with self.subTest(code=lesson["code"]):
                page = self.open_page(lesson, "ru")
                self.assertEqual(page.locator("nav.lesson-nav").count(), 1)
                self.assertEqual(page.locator("header.site-header .language-switcher").count(), 1)
                lesson_links = page.locator("nav.lesson-nav a[href*='/lessons/a-']")
                for index in range(lesson_links.count()):
                    href = lesson_links.nth(index).get_attribute("href")
                    self.assertIn(href.split("/")[-1], published_routes)
                if lesson.get("status") != "published" or lesson.get("content_state") != "published":
                    self.assertEqual(page.locator("nav.lesson-nav .is-disabled").count(), 1)
                    previous = [
                        item for item in PUBLISHED_LESSONS
                        if tuple(int(part) for part in item["code"].split(".")) < tuple(int(part) for part in lesson["code"].split("."))
                    ]
                    previous.sort(key=lambda item: tuple(int(part) for part in item["code"].split(".")))
                    if previous:
                        self.assertTrue(
                            page.locator("nav.lesson-nav a").first.get_attribute("href").endswith(
                                previous[-1]["url_i18n"]["ru"].split("/")[-1]
                            )
                        )
                page.close()

    def test_published_canonical_lesson_block_order(self):
        selectors = [
            "main.lesson > .lesson-intro",
            "main.lesson > #lesson-outcomes",
            "main.lesson > #lesson-sections",
            "main.lesson > #lesson-practice",
            "main.lesson > #lesson-sources",
            "main.lesson > #lesson-navigation",
            "main.lesson > #lesson-glossary",
            "main.lesson > #lesson-quiz",
            "footer.footer",
        ]
        for lesson in PUBLISHED_LESSONS:
            if uid_number(lesson) < 169:
                continue
            for locale in ("ru", "en", "zh"):
                with self.subTest(code=lesson["code"], locale=locale):
                    page = self.open_page(lesson, locale)
                    result = page.evaluate("""(selectors) => {
                      const nodes = selectors.map((selector) => Array.from(document.querySelectorAll(selector)));
                      return {
                        counts: nodes.map((items) => items.length),
                        ordered: nodes.every((items, index) =>
                          index === 0 || nodes[index - 1][0].compareDocumentPosition(items[0]) & Node.DOCUMENT_POSITION_FOLLOWING
                        ),
                        inMain: nodes.slice(0, 8).every((items) => items[0] && items[0].closest("main.lesson")),
                        footerAfterMain: !!(nodes[8][0] && nodes[8][0].compareDocumentPosition(document.querySelector("main.lesson")) & Node.DOCUMENT_POSITION_PRECEDING)
                      };
                    }""", selectors)
                    self.assertEqual(result["counts"], [1] * 9, f"{lesson['uid']} / {locale}: missing or duplicate block root")
                    self.assertTrue(result["ordered"], f"{lesson['uid']} / {locale}: incorrect DOM block order")
                    self.assertTrue(result["inMain"], f"{lesson['uid']} / {locale}: lesson blocks must be inside main.lesson")
                    self.assertTrue(result["footerAfterMain"], f"{lesson['uid']} / {locale}: footer must follow lesson content")
                    page.close()

    def test_theme_aware_headings_and_responsive_layout(self):
        for lesson in CANONICAL_LESSONS:
            for theme, expected in (("light", "rgb(23, 35, 61)"), ("dark", "rgb(237, 243, 255)")):
                for width in (375, 768, 1440):
                    with self.subTest(code=lesson["code"], theme=theme, width=width):
                        page = self.open_page(lesson, "ru", width=width, theme=theme)
                        heading = page.locator("main.lesson h1").first
                        self.assertEqual(heading.evaluate("(el) => getComputedStyle(el).color"), expected)
                        section_heading = page.locator(".xai-canonical-section-title")
                        if section_heading.count():
                            self.assertEqual(section_heading.first.evaluate("(el) => getComputedStyle(el).color"), expected)
                        self.assertEqual(page.locator("header.site-header [data-dch-theme-control]").count(), 1)
                        self.assertEqual(page.locator("header.site-header .language-switcher").count(), 1)
                        overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                        self.assertLessEqual(overflow, 1, f"page-level horizontal overflow {overflow}px at {width}px")
                        page.close()


    def test_canonical_dictionary_cards_and_metadata_on_reference_lessons(self):
        cases = [
            ("7.1.1", "lessons/a-7-1-1-les-a-0018.html", 5, "Словарь терминов"),
            ("7.1.1-en", "lessons/a-7-1-1-les-a-0018-en.html", 5, "Key terms"),
            ("7.1.1-zh", "lessons/a-7-1-1-les-a-0018-zh.html", 5, "术语词典"),
            ("7.1.2", "lessons/a-7-1-2-les-a-0169.html", 8, "Словарь терминов"),
            ("7.1.2-en", "lessons/a-7-1-2-les-a-0169-en.html", 8, "Key terms"),
            ("7.1.2-zh", "lessons/a-7-1-2-les-a-0169-zh.html", 8, "术语词典"),
        ]
        for label, route, expected_cards, expected_heading in cases:
            for width, theme in ((375, "light"), (768, "dark"), (1440, "light")):
                with self.subTest(lesson=label, width=width, theme=theme):
                    page = self.browser.new_page(viewport={"width": width, "height": 1000})
                    page.add_init_script(f"localStorage.setItem('dch-school-theme', '{theme}');")
                    page.route("**/scripts/account-ui.js", lambda route: route.fulfill(status=200, content_type="application/javascript", body="/* isolated account UI */"))
                    errors = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    response = page.goto(self.base + "/" + route, wait_until="domcontentloaded")
                    self.assertEqual(response.status, 200)
                    glossary = page.locator("section.lesson-glossary")
                    glossary.wait_for()
                    self.assertEqual(glossary.locator(":scope > h2").inner_text(), expected_heading)
                    self.assertEqual(glossary.locator(".glossary-grid").count(), 1)
                    cards = glossary.locator(".glossary-entry")
                    self.assertEqual(cards.count(), expected_cards)
                    self.assertEqual(glossary.locator(".term-index").count(), expected_cards)
                    self.assertEqual(page.locator(".lesson-duration").count(), 0)
                    self.assertNotRegex(glossary.inner_text(), r"(?i)glossary|глоссарий|краткий словарь|简明术语表|术语表")
                    card = cards.first
                    self.assertEqual(card.evaluate("(el) => getComputedStyle(el).display"), "flex")
                    self.assertNotEqual(card.evaluate("(el) => getComputedStyle(el).backgroundColor"), "rgba(0, 0, 0, 0)")
                    self.assertGreater(card.evaluate("(el) => parseFloat(getComputedStyle(el).borderRadius)"), 0)
                    columns = glossary.locator(".glossary-grid").evaluate("(el) => getComputedStyle(el).gridTemplateColumns.split(' ').length")
                    self.assertEqual(columns, 1 if width == 375 else 2)
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth - window.innerWidth"), 1)
                    self.assertEqual(errors, [])
                    page.close()


if __name__ == "__main__":
    unittest.main()
