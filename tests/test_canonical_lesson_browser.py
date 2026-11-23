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
        page.add_init_script(f"""
            localStorage.setItem('dch-school-theme', '{theme}');
            window.__dchScriptErrors = [];
            window.addEventListener('error', function (event) {{
                window.__dchScriptErrors.push({{
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    target: event.target && event.target.src ? event.target.src : null
                }});
            }}, true);
        """)
        # Auth uses a remote Supabase SDK; isolate it from shell/navigation acceptance.
        page.route("**/scripts/account-ui.js", lambda route: route.fulfill(status=200, content_type="application/javascript", body="/* account UI isolated in shell acceptance */"))
        errors = []
        page.on("pageerror", lambda error: errors.append({"kind": "pageerror", "message": str(error), "stack": getattr(error, "stack", None)}))
        page.on("console", lambda message: errors.append({
            "kind": "console",
            "message": message.text,
            "location": message.location,
        }) if message.type == "error" else None)
        relative_path = "/" + lesson["url_i18n"][locale]
        response = page.goto(self.base + relative_path, wait_until="domcontentloaded")
        self.assertEqual(response.status, 200)
        page.locator("main.lesson h1").wait_for()
        page.locator("nav.lesson-nav a.button").first.wait_for()
        script_errors = page.evaluate("window.__dchScriptErrors || []")
        self.assertEqual(
            errors + script_errors,
            [],
            f"uncaught browser errors on {lesson['code']} / {locale}; page/console={errors}; script locations={script_errors}",
        )
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

    def test_canonical_lesson_block_order_all_locales_including_review(self):
        selectors = [
            "main.lesson > .lesson-standard-hero",
            "main.lesson > .lesson-standard-hero #lesson-outcomes",
            "main.lesson > .lesson-standard-article > #lesson-sections",
            "main.lesson > .lesson-standard-article > #lesson-practice",
            "main.lesson > .lesson-standard-article > #lesson-sources",
            "main.lesson > .lesson-standard-article > #lesson-navigation",
            "main.lesson > .lesson-standard-article > #lesson-glossary",
            "main.lesson > .lesson-standard-article > #lesson-quiz",
            "footer.footer",
        ]
        for lesson in CANONICAL_LESSONS:
            for locale in ("ru", "en", "zh"):
                with self.subTest(code=lesson["code"], locale=locale):
                    page = self.open_page(lesson, locale)
                    result = page.evaluate("""(selectors) => {
                      const nodes = selectors.map((selector) => Array.from(document.querySelectorAll(selector)));
                      return {
                        counts: nodes.map((items) => items.length),
                        ordered: nodes.every((items, index) =>
                          index === 0 || !!(nodes[index - 1][0].compareDocumentPosition(items[0]) & Node.DOCUMENT_POSITION_FOLLOWING)
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

    def test_reference_lesson_711_block_order_all_locales(self):
        lesson = {
            "code": "7.1.1",
            "uid": "les-a-0018",
            "status": "published",
            "content_state": "published",
            "url_i18n": {
                "ru": "lessons/a-7-1-1-les-a-0018.html",
                "en": "lessons/a-7-1-1-les-a-0018-en.html",
                "zh": "lessons/a-7-1-1-les-a-0018-zh.html",
            },
        }
        selectors = [
            "main.lesson > .lesson-standard-hero",
            "main.lesson > .lesson-standard-hero #lesson-outcomes",
            "main.lesson > .lesson-standard-article > #lesson-sections",
            "main.lesson > .lesson-standard-article > #lesson-practice",
            "main.lesson > .lesson-standard-article > #lesson-sources",
            "main.lesson > .lesson-standard-article > #lesson-navigation",
            "main.lesson > .lesson-standard-article > #lesson-glossary",
            "main.lesson > .lesson-standard-article > #lesson-quiz",
            "footer.footer",
        ]
        for locale in ("ru", "en", "zh"):
            with self.subTest(code=lesson["code"], locale=locale):
                page = self.open_page(lesson, locale)
                result = page.evaluate("""(selectors) => {
                  const nodes = selectors.map((selector) => Array.from(document.querySelectorAll(selector)));
                  return {
                    counts: nodes.map((items) => items.length),
                    ordered: nodes.every((items, index) =>
                      index === 0 || !!(nodes[index - 1][0].compareDocumentPosition(items[0]) & Node.DOCUMENT_POSITION_FOLLOWING)
                    ),
                    inMain: nodes.slice(0, 8).every((items) => items[0] && items[0].closest("main.lesson")),
                    footerAfterMain: !!(nodes[8][0] && nodes[8][0].compareDocumentPosition(document.querySelector("main.lesson")) & Node.DOCUMENT_POSITION_PRECEDING),
                    practiceHasLab: !!document.querySelector("#lesson-practice h2"),
                    sourcesHasHeading: !!document.querySelector("#lesson-sources h3"),
                    glossaryCards: document.querySelectorAll("#lesson-glossary .glossary-entry").length,
                        glossaryRootClass: document.querySelector("#lesson-glossary").classList.contains("lesson-glossary--grouped"),
                    quizForms: document.querySelectorAll("#lesson-quiz form.knowledge-check").length
                  };
                }""", selectors)
                self.assertEqual(result["counts"], [1] * 9, f"7.1.1 / {locale}: missing or duplicate block root")
                self.assertTrue(result["ordered"], f"7.1.1 / {locale}: incorrect DOM block order")
                self.assertTrue(result["inMain"], f"7.1.1 / {locale}: lesson blocks must be inside main.lesson")
                self.assertTrue(result["footerAfterMain"], f"7.1.1 / {locale}: footer must follow lesson content")
                self.assertTrue(result["practiceHasLab"], f"7.1.1 / {locale}: mini-lab missing from practice root")
                self.assertTrue(result["sourcesHasHeading"], f"7.1.1 / {locale}: references missing from sources root")
                self.assertEqual(result["glossaryCards"], 5, f"7.1.1 / {locale}: expected five glossary cards")
                self.assertEqual(result["quizForms"], 2, f"7.1.1 / {locale}: expected two self-check forms")
                page.close()

    def test_published_canonical_lesson_block_order(self):
        selectors = [
            "main.lesson > .lesson-standard-hero",
            "main.lesson > .lesson-standard-hero #lesson-outcomes",
            "main.lesson > .lesson-standard-article > #lesson-sections",
            "main.lesson > .lesson-standard-article > #lesson-practice",
            "main.lesson > .lesson-standard-article > #lesson-sources",
            "main.lesson > .lesson-standard-article > #lesson-navigation",
            "main.lesson > .lesson-standard-article > #lesson-glossary",
            "main.lesson > .lesson-standard-article > #lesson-quiz",
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

    def test_shapley_lesson_uses_canonical_shell_components_all_locales(self):
        lesson = next((item for item in CANONICAL_LESSONS if item.get("uid") == "les-a-0182"), None)
        self.assertIsNotNone(lesson, "Shapley 10.1.1 must be included in canonical browser acceptance")
        for locale in ("ru", "en", "zh"):
            for width in (375, 768, 1440):
                with self.subTest(locale=locale, width=width):
                    page = self.open_page(lesson, locale, width=width)
                    result = page.evaluate("""() => {
                      const grid = document.querySelector("#lesson-glossary .glossary-grid");
                      return {
                        hero: !!document.querySelector("main.lesson > .lesson-standard-hero"),
                        article: !!document.querySelector("main.lesson > .lesson-standard-article"),
                        planet: !!document.querySelector("main.lesson > .lesson-planet-banner"),
                        metadata: document.querySelectorAll(".lesson-standard-hero .lesson-meta span").length,
                        outcomes: document.querySelectorAll(".lesson-standard-hero #lesson-outcomes li").length,
                        sections: document.querySelectorAll("#lesson-sections > .xai-canonical-section").length,
                        figures: document.querySelectorAll("#lesson-sections figure svg").length,
                        practiceClass: document.querySelector("#lesson-practice").classList.contains("lesson-practice"),
                        sourcesClass: document.querySelector("#lesson-sources").classList.contains("lesson-sources"),
                        quizClass: document.querySelector("#lesson-quiz").classList.contains("lesson-check"),
                        glossaryCards: document.querySelectorAll("#lesson-glossary .glossary-entry").length,
                        glossaryRootClass: document.querySelector("#lesson-glossary").classList.contains("lesson-glossary--grouped"),
                        glossaryLayout: grid ? getComputedStyle(grid).display : null,
                        glossaryColumns: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0,
                        questions: document.querySelectorAll("#lesson-quiz .lesson-check-question").length,
                        options: document.querySelectorAll("#lesson-quiz .lesson-check-option").length,
                        codeBlocks: document.querySelectorAll("#lesson-practice .lesson-code-block").length
                      };
                    }""")
                    self.assertTrue(result["hero"], result)
                    self.assertTrue(result["article"], result)
                    self.assertTrue(result["planet"], result)
                    self.assertEqual(result["metadata"], 2, result)
                    self.assertEqual(result["outcomes"], 7, result)
                    self.assertEqual(result["sections"], 9, result)
                    self.assertEqual(result["figures"], 7, result)
                    self.assertTrue(result["practiceClass"], result)
                    self.assertTrue(result["sourcesClass"], result)
                    self.assertTrue(result["quizClass"], result)
                    self.assertEqual(result["glossaryCards"], 14, result)
                    self.assertTrue(result["glossaryRootClass"], result)
                    self.assertEqual(result["glossaryLayout"], "grid", result)
                    self.assertEqual(result["glossaryColumns"], 1 if width == 375 else 2, result)
                    self.assertEqual(result["questions"], 10, result)
                    self.assertEqual(result["options"], 40, result)
                    self.assertEqual(result["codeBlocks"], 3, result)
                    page.close()

    def test_faithfulness_display_math_wraps_without_horizontal_page_scroll(self):
        lesson = next((item for item in CANONICAL_LESSONS if item.get("uid") == "les-a-0173"), None)
        self.assertIsNotNone(lesson, "Faithfulness lesson must be included in canonical browser acceptance")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                for width in (375, 768, 1440):
                    with self.subTest(locale=locale, theme=theme, width=width):
                        page = self.open_page(lesson, locale, width=width, theme=theme)
                        result = page.evaluate("""() => {
                          const formulas = [...document.querySelectorAll(
                            '#lesson-sections .formula, #lesson-practice .formula, #lesson-sources .formula'
                          )];
                          return {
                            viewportWidth: window.innerWidth,
                            documentWidth: document.documentElement.scrollWidth,
                            bodyWidth: document.body.scrollWidth,
                            formulas: formulas.map((formula) => {
                              const expression = formula.querySelector('.formula-expression');
                              return {
                                width: formula.clientWidth,
                                scrollWidth: formula.scrollWidth,
                                expressionWidth: expression ? expression.clientWidth : 0,
                                expressionScrollWidth: expression ? expression.scrollWidth : 0,
                                whiteSpace: expression ? getComputedStyle(expression).whiteSpace : null,
                                noteCount: formula.querySelectorAll('.formula-note').length
                              };
                            })
                          };
                        }""")
                        self.assertGreaterEqual(len(result["formulas"]), 2, f"{locale}: expected both display equations")
                        self.assertLessEqual(result["documentWidth"], result["viewportWidth"] + 1, result)
                        self.assertLessEqual(result["bodyWidth"], result["viewportWidth"] + 1, result)
                        for formula in result["formulas"]:
                            self.assertGreater(formula["width"], 0, result)
                            self.assertLessEqual(formula["scrollWidth"], formula["width"] + 1, result)
                            self.assertLessEqual(formula["expressionScrollWidth"], formula["expressionWidth"] + 1, result)
                            self.assertEqual(formula["whiteSpace"], "normal", result)
                        self.assertEqual(result["formulas"][0]["noteCount"], 1, result)
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
                        offenders = page.evaluate("Array.from(document.querySelectorAll('body *')).filter(el => el.getBoundingClientRect().right > window.innerWidth + 1).map(el => [el.tagName, el.id, String(el.className || ''), Math.round(el.getBoundingClientRect().right)]).slice(0, 10)")
                        self.assertLessEqual(overflow, 1, "page-level overflow " + str(overflow) + "; offenders=" + repr(offenders))
                        page.close()


    def test_reference_lesson_711_visual_components_have_computed_styles(self):
        lesson = {
            "code": "7.1.1",
            "uid": "les-a-0018",
            "url_i18n": {
                "ru": "lessons/a-7-1-1-les-a-0018.html",
                "en": "lessons/a-7-1-1-les-a-0018-en.html",
                "zh": "lessons/a-7-1-1-les-a-0018-zh.html",
            },
        }
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                with self.subTest(locale=locale, theme=theme):
                    page = self.open_page(lesson, locale, width=1440, theme=theme)
                    result = page.evaluate("""() => {
                      const style = (selector) => {
                        const el = document.querySelector(selector);
                        if (!el) return null;
                        const s = getComputedStyle(el);
                        return {
                          color: s.color,
                          background: s.backgroundColor,
                          backgroundImage: s.backgroundImage,
                          borderStyle: s.borderTopStyle,
                          borderWidth: parseFloat(s.borderTopWidth),
                          radius: parseFloat(s.borderRadius),
                          padding: parseFloat(s.paddingTop),
                          fontSize: parseFloat(s.fontSize),
                          lineHeight: parseFloat(s.lineHeight),
                          display: s.display
                        };
                      };
                      return {
                        body: style("#lesson-sections .xai-canonical-section-content p"),
                        formula: style("#lesson-practice .formula"),
                        expression: style("#lesson-practice .formula-expression"),
                        quiz: style("#lesson-quiz .knowledge-check"),
                        fieldset: style("#lesson-quiz .knowledge-check fieldset"),
                        option: style("#lesson-quiz .knowledge-check label"),
                        button: style("#lesson-quiz .quiz-submit"),
                        summary: style("#lesson-quiz .quiz-summary"),
                        counts: {
                          formula: document.querySelectorAll("#lesson-practice .formula").length,
                          forms: document.querySelectorAll("#lesson-quiz form.knowledge-check").length,
                          options: document.querySelectorAll("#lesson-quiz .knowledge-check label").length
                        }
                      };
                    }""")
                    self.assertIsNotNone(result["body"])
                    self.assertGreater(result["body"]["fontSize"], 0)
                    self.assertGreater(result["body"]["lineHeight"], result["body"]["fontSize"])
                    self.assertIsNotNone(result["formula"])
                    self.assertGreater(result["formula"]["borderWidth"], 0)
                    self.assertGreater(result["formula"]["radius"], 0)
                    self.assertNotEqual(result["formula"]["backgroundImage"], "none")
                    self.assertIsNotNone(result["expression"])
                    self.assertGreater(result["expression"]["fontSize"], 0)
                    self.assertIsNotNone(result["quiz"])
                    self.assertGreater(result["quiz"]["borderWidth"], 0)
                    self.assertGreater(result["quiz"]["radius"], 0)
                    self.assertGreater(result["quiz"]["padding"], 0)
                    self.assertGreater(result["fieldset"]["borderWidth"], 0)
                    self.assertEqual(result["option"]["display"], "flex")
                    self.assertGreater(result["button"]["padding"], 0)
                    self.assertGreater(result["summary"]["borderWidth"], 0)
                    self.assertEqual(result["counts"]["formula"], 1)
                    self.assertEqual(result["counts"]["forms"], 2)
                    self.assertGreater(result["counts"]["options"], 0)
                    page.close()

    def test_reference_lesson_711_visual_components_are_responsive(self):
        lesson = {
            "code": "7.1.1",
            "uid": "les-a-0018",
            "url_i18n": {
                "ru": "lessons/a-7-1-1-les-a-0018.html",
                "en": "lessons/a-7-1-1-les-a-0018-en.html",
                "zh": "lessons/a-7-1-1-les-a-0018-zh.html",
            },
        }
        for locale in ("ru", "en", "zh"):
            page = self.open_page(lesson, locale, width=375, theme="light")
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            self.assertLessEqual(overflow, 1, f"7.1.1 / {locale}: page overflow {overflow}px")
            self.assertLessEqual(
                page.locator("#lesson-practice .formula").evaluate("(el) => el.getBoundingClientRect().width"),
                375,
            )
            self.assertEqual(page.locator("#lesson-quiz form.knowledge-check").count(), 2)
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


    def test_outcomes_card_text_contrast_all_locales_both_themes(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.1.3")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                with self.subTest(locale=locale, theme=theme):
                    page = self.open_page(lesson, locale, width=1440, theme=theme)
                    result = page.evaluate("""() => {
                      const root = document.querySelector("main.lesson > #lesson-outcomes.outcomes");
                      if (!root) return {missing: true};
                      const pick = (el) => {
                        const s = getComputedStyle(el);
                        return {color:s.color, background:s.backgroundColor, image:s.backgroundImage};
                      };
                      const heading = root.querySelector("h2");
                      const copy = root.querySelector("li, p");
                      const rgb = (value) => value.match(/[0-9.]+/g).slice(0,3).map(Number);
                      const luminance = (value) => {
                        const channels = rgb(value).map(v => {
                          v /= 255;
                          return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
                        });
                        return .2126*channels[0] + .7152*channels[1] + .0722*channels[2];
                      };
                      const contrast = (a,b) => {
                        const x=luminance(a), y=luminance(b);
                        return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
                      };
                      const bg = pick(root);
                      const h = pick(heading);
                      const p = pick(copy);
                      return {
                        background:bg.background,
                        backgroundImage:bg.image,
                        heading:h.color,
                        copy:p.color,
                        cardBackground:p.background,
                        headingContrast:contrast(h.color,bg.background),
                        copyContrast:contrast(p.color,p.background),
                        itemCount:root.querySelectorAll("li").length
                      };
                    }""")
                    self.assertNotIn("missing", result, "lesson-outcomes root missing or changed")
                    self.assertGreaterEqual(result["headingContrast"], 4.5, f"heading contrast {result}")
                    self.assertNotEqual(result["cardBackground"], "rgba(0, 0, 0, 0)", f"outcome card surface must be explicit {result}")
                    self.assertGreaterEqual(result["copyContrast"], 4.5, f"body contrast {result}")
                    self.assertGreater(result["itemCount"], 0)
                    page.close()

    def test_713_intrinsic_posthoc_diagram_is_complete_and_not_clipped(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.1.3")
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                page = self.open_page(lesson, locale, width=375, theme="light")
                svg = page.locator("#lesson-sections svg.xai-svg").first
                svg.wait_for()
                result = svg.evaluate("""el => {
                  const vb=el.viewBox.baseVal;
                  const texts=Array.from(el.querySelectorAll("text")).map(node => {
                    const b=node.getBBox();
                    return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,text:node.textContent};
                  });
                  const rects=el.querySelectorAll("rect").length;
                  const arrows=el.querySelectorAll("path").length;
                  const bounds=el.getBoundingClientRect();
                  const figure=el.closest("figure");
                  const fig=figure.getBoundingClientRect();
                  return {
                    viewBox:{width:vb.width,height:vb.height},
                    rects,arrows,texts,
                    width:bounds.width,figureWidth:fig.width,
                    clipped:el.scrollWidth>el.clientWidth+1
                  };
                }""")
                self.assertEqual(result["viewBox"], {"width":720,"height":320})
                self.assertEqual(result["rects"], 4, f"expected source and destination panels: {result}")
                self.assertEqual(result["arrows"], 2, f"both routes need connecting arrows: {result}")
                self.assertGreaterEqual(len(result["texts"]), 8)
                for label in result["texts"]:
                    self.assertGreaterEqual(label["x"], 0, label)
                    self.assertGreaterEqual(label["y"], 0, label)
                    self.assertLessEqual(label["right"], 720, label)
                    self.assertLessEqual(label["bottom"], 320, label)
                self.assertLessEqual(result["width"], result["figureWidth"]+1)
                self.assertFalse(result["clipped"])
                page.close()


    def test_721_outcomes_contrast_all_locales_both_themes(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.1")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                with self.subTest(locale=locale, theme=theme):
                    page = self.open_page(lesson, locale, width=1440, theme=theme)
                    result = page.evaluate("""() => {
                      const root = document.querySelector("main.lesson > #lesson-outcomes.outcomes");
                      if (!root) return {missing:true};
                      const color = el => getComputedStyle(el).color;
                      const bg = getComputedStyle(root).backgroundColor;
                      const rgb = value => value.match(/[0-9.]+/g).slice(0,3).map(Number);
                      const lum = value => rgb(value).map(v => {v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
                      const contrast = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
                      const heading=root.querySelector("h2"), copy=root.querySelector("li,p");
                      return {bg,heading:color(heading),copy:color(copy),headingRatio:contrast(color(heading),bg),copyRatio:contrast(color(copy),bg),items:root.querySelectorAll("li").length};
                    }""")
                    self.assertNotIn("missing", result)
                    self.assertGreaterEqual(result["headingRatio"], 4.5, str(result))
                    self.assertGreaterEqual(result["copyRatio"], 4.5, str(result))
                    self.assertGreaterEqual(result["items"], 5)
                    page.close()

    def test_721_feature_importance_illustration_is_complete_and_responsive(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.1")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                for width in (375, 768, 1440):
                    with self.subTest(locale=locale, theme=theme, width=width):
                        page = self.open_page(lesson, locale, width=width, theme=theme)
                        svg = page.locator("#lesson-sections svg.feature-importance-svg")
                        svg.wait_for()
                        result = svg.evaluate("""el => {
                          const vb=el.viewBox.baseVal;
                          const texts=Array.from(el.querySelectorAll("text")).map(node => {
                            const b=node.getBBox(); return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,text:node.textContent};
                          });
                          const figure=el.closest("figure");
                          const box=el.getBoundingClientRect(), fig=figure.getBoundingClientRect();
                          return {viewBox:{width:vb.width,height:vb.height},panels:el.querySelectorAll(".fi-panel").length,
                            bars:el.querySelectorAll(".fi-bar,.fi-negative").length,zeroAxis:el.querySelectorAll(".fi-zero").length,axisLabels:el.querySelectorAll(".fi-axis-label").length,contextLabels:el.querySelectorAll(".fi-context").length,panelsBottom:Array.from(el.querySelectorAll(".fi-panel")).map(n=>{const b=n.getBBox();return b.y+b.height}),texts,labelFontSize:getComputedStyle(el.querySelector(".fi-label")).fontSize,
                            width:box.width,figureWidth:fig.width,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
                        }""")
                        self.assertEqual(result["viewBox"], {"width":720,"height":370})
                        self.assertEqual(result["panels"], 2, str(result))
                        self.assertEqual(result["bars"], 6, str(result))
                        self.assertEqual(result["zeroAxis"], 1, str(result))
                        self.assertEqual(result["axisLabels"], 6, str(result))
                        self.assertEqual(result["contextLabels"], 2, str(result))
                        self.assertEqual(len(result["panelsBottom"]), 2, str(result))
                        self.assertLessEqual(max(result["panelsBottom"]), 370, str(result))
                        self.assertGreaterEqual(len(result["texts"]), 18, str(result))
                        self.assertGreaterEqual(float(result["labelFontSize"].replace("px","")), 20, str(result))
                        for label in result["texts"]:
                            self.assertGreaterEqual(label["x"], 0, str(label))
                            self.assertGreaterEqual(label["y"], 0, str(label))
                            self.assertLessEqual(label["right"], 720, str(label))
                            self.assertLessEqual(label["bottom"], 340, str(label))
                        self.assertLessEqual(result["width"], result["figureWidth"]+1, str(result))
                        self.assertLessEqual(result["scrollWidth"], result["clientWidth"]+1, str(result))
                        page.close()


    def test_721_outcomes_spacing_and_branded_python_code_render_in_browser(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.1")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                with self.subTest(locale=locale, theme=theme):
                    page = self.open_page(lesson, locale, width=375, theme=theme)
                    page.wait_for_selector("#lesson-practice .lesson-code-block pre[data-code-enhanced='1']")
                    result = page.evaluate("""() => {
                      const card=document.querySelector('#lesson-outcomes');
                      const heading=card.querySelector('h2');
                      const list=card.querySelector('li');
                      const code=document.querySelector('#lesson-practice .lesson-code-block');
                      const pre=code.querySelector('pre');
                      const token=pre.querySelector('.code-token-keyword');
                      const rgb=s=>s.match(/[\\d.]+/g).slice(0,3).map(Number);
                      const luminance=s=>{const c=rgb(s).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
                      const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
                      const hs=getComputedStyle(heading),ls=getComputedStyle(list),cs=getComputedStyle(code),ts=getComputedStyle(token),ps=getComputedStyle(pre);
                      return {
                        paddingTop:parseFloat(getComputedStyle(card).paddingTop),
                        headingMarginTop:parseFloat(hs.marginTop),
                        cardBackground:getComputedStyle(card).backgroundColor,
                        headingColor:hs.color,listColor:ls.color,
                        headingContrast:contrast(hs.color,getComputedStyle(card).backgroundColor),
                        listContrast:contrast(ls.color,getComputedStyle(card).backgroundColor),
                        codeBackground:cs.backgroundColor,preBackground:ps.backgroundColor,
                        tokenColor:ts.color,plainColor:getComputedStyle(pre.querySelector('.code-token-identifier')).color,
                        tokenCount:pre.querySelectorAll('[class^="code-token-"]').length,
                        lineCount:pre.querySelectorAll('.lesson-code-line').length,
                        copyButtons:code.querySelectorAll('.lesson-code-copy').length,
                        codeScrollWidth:pre.scrollWidth,codeClientWidth:pre.clientWidth,
                        pageScrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth
                      };
                    }""")
                    self.assertLessEqual(result["paddingTop"], 16, str(result))
                    self.assertLessEqual(result["headingMarginTop"], 1, str(result))
                    self.assertGreaterEqual(result["headingContrast"], 4.5, str(result))
                    self.assertGreaterEqual(result["listContrast"], 4.5, str(result))
                    self.assertNotEqual(result["codeBackground"], "rgba(0, 0, 0, 0)", str(result))
                    self.assertNotEqual(result["tokenColor"], result["plainColor"], str(result))
                    self.assertGreater(result["tokenCount"], 30, str(result))
                    self.assertGreater(result["lineCount"], 10, str(result))
                    self.assertEqual(result["copyButtons"], 1, str(result))
                    self.assertLessEqual(result["pageScrollWidth"], result["viewportWidth"], str(result))
                    page.close()


    def test_721_content_depth_localisation_and_quiz_interaction(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.1")
        expected = {"outcomes":5,"sections":6,"terms":14,"questions":10}
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                page = self.open_page(lesson, locale, width=1440, theme="light")
                result = page.evaluate("""() => {
                  const data=window.DCH_FEATURE_IMPORTANCE_LESSON;
                  return {outcomes:data.outcomes[document.documentElement.lang.startsWith('zh')?'zh':document.documentElement.lang.startsWith('en')?'en':'ru'].length,
                    sections:data.pages.length,
                    terms:data.glossary[document.documentElement.lang.startsWith('zh')?'zh':document.documentElement.lang.startsWith('en')?'en':'ru'].length,
                    questions:data.quiz.length,
                    renderedQuestions:document.querySelectorAll('#lesson-quiz fieldset').length,
                    glossaryCards:document.querySelectorAll('#lesson-glossary .glossary-entry').length};
                }""")
                self.assertEqual({k:result[k] for k in expected}, expected, str(result))
                self.assertEqual(result["renderedQuestions"], 10)
                self.assertEqual(result["glossaryCards"], 14)
                download = page.locator("#lesson-practice a[href='practice/xai-feature-importance.py']")
                self.assertEqual(download.count(), 1)
                download_url = page.evaluate("(href) => new URL(href, location.href).href", download.get_attribute("href"))
                self.assertEqual(page.request.get(download_url).status, 200)
                locale_suffix = "" if locale == "ru" else "-" + locale
                previous_name = "a-7-1-3-les-a-0170" + locale_suffix + ".html"
                self.assertEqual(page.locator("#lesson-navigation a[href$='" + previous_name + "']").count(), 1)
                next_name = "a-7-2-2-les-a-0172" + locale_suffix + ".html"
                self.assertEqual(page.locator("#lesson-navigation a[href$='" + next_name + "']").count(), 1)
                self.assertEqual(page.locator("#lesson-navigation [aria-disabled='true']").count(), 0)
                page.locator("#lesson-quiz .quiz-submit").click()
                self.assertTrue(page.locator("#lesson-quiz .quiz-feedback.is-visible").is_visible())
                self.assertIn("0 / 10", page.locator("#lesson-quiz .quiz-feedback").inner_text())
                page.close()


    def test_learning_outcomes_render_as_theme_aware_responsive_cards(self):
        for lesson in CANONICAL_LESSONS:
            for locale in ("ru", "en", "zh"):
                for theme in ("light", "dark"):
                    for width in (375, 768, 1440):
                        with self.subTest(code=lesson["code"], locale=locale, theme=theme, width=width):
                            page = self.open_page(lesson, locale, width=width, theme=theme)
                            result = page.evaluate("""() => {
                              const root = document.querySelector("main.lesson #lesson-outcomes, main.lesson .outcomes");
                              const list = root && root.querySelector(":scope > ul, :scope > ol");
                              const cards = list ? Array.from(list.children) : [];
                              const first = cards[0];
                              const last = cards[cards.length - 1];
                              const style = first ? getComputedStyle(first) : null;
                              const listStyle = list ? getComputedStyle(list) : null;
                              return {
                                heading: !!(root && root.querySelector(":scope > h2")),
                                count: cards.length,
                                display: listStyle && listStyle.display,
                                columns: listStyle && listStyle.gridTemplateColumns,
                                cardDisplay: style && style.display,
                                cardBackground: style && style.backgroundColor,
                                cardBorder: style && style.borderTopStyle,
                                cardRadius: style && parseFloat(style.borderRadius),
                                number: first && getComputedStyle(first, "::before").content,
                                lastSpan: last && getComputedStyle(last).gridColumn,
                                overflow: document.documentElement.scrollWidth - window.innerWidth, offenders: Array.from(document.querySelectorAll("body *")).map(el => [el.tagName, el.id, String(el.className || ""), Math.round(el.getBoundingClientRect().right)]).filter(x => x[3] > window.innerWidth + 1).slice(0, 10)
                              };
                            }""")
                            self.assertTrue(result["heading"], f"{lesson['uid']} / {locale}: outcomes heading missing")
                            self.assertGreaterEqual(result["count"], 1, f"{lesson['uid']} / {locale}: outcomes missing")
                            self.assertEqual(result["display"], "grid")
                            self.assertEqual(result["cardDisplay"], "flex")
                            self.assertNotEqual(result["cardBackground"], "rgba(0, 0, 0, 0)")
                            self.assertEqual(result["cardBorder"], "solid")
                            self.assertGreater(result["cardRadius"], 0)
                            self.assertTrue(result["number"] and result["number"] != "none")
                            self.assertLessEqual(result["overflow"], 1, "offenders=" + repr(result["offenders"]))
                            if width <= 650:
                                self.assertEqual(len(result["columns"].split()), 1)
                                self.assertEqual(result["lastSpan"], "auto")
                            else:
                                self.assertGreaterEqual(len(result["columns"].split()), 2)
                                if result["count"] % 2:
                                    self.assertEqual(result["lastSpan"], "1 / -1")
                            page.close()


    def test_722_outcomes_glossary_and_svg_are_readable_and_unclipped(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.2")
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                for width in (375, 768, 1440):
                    with self.subTest(locale=locale, theme=theme, width=width):
                        page = self.open_page(lesson, locale, width=width, theme=theme)
                        result = page.evaluate("""() => {
                          const root=document.querySelector("#lesson-outcomes"),card=root?.querySelector("li");
                          const glossary=document.querySelector("#lesson-glossary"),grid=glossary?.querySelector(".glossary-grid");
                          const rgb=v=>v.match(/[\\d.]+/g).slice(0,3).map(Number);
                          const lum=v=>rgb(v).map(x=>{x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)}).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);
                          const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
                          const svgs=Array.from(document.querySelectorAll("#lesson-sections .pfi-figure svg"));
                          return {count:root?.querySelectorAll("li").length||0,contrast:card?ratio(getComputedStyle(card).color,getComputedStyle(card).backgroundColor):0,
                            cards:grid?.querySelectorAll(".glossary-entry").length||0,legacy:glossary?.querySelectorAll("dl,dt,dd").length||0,
                            svgs:svgs.map(svg=>{const b=svg.viewBox.baseVal;return {right:b.x+b.width,bottom:b.y+b.height,text:Array.from(svg.querySelectorAll("text")).map(t=>{const x=t.getBBox();return [x.x,x.y,x.x+x.width,x.y+x.height]})}}),
                            overflow:document.documentElement.scrollWidth-window.innerWidth};
                        }""")
                        self.assertGreaterEqual(result["count"],5,str(result))
                        self.assertGreaterEqual(result["contrast"],4.5,str(result))
                        self.assertEqual(result["cards"],8,str(result))
                        self.assertEqual(result["legacy"],0,str(result))
                        self.assertEqual(len(result["svgs"]),2,str(result))
                        self.assertLessEqual(result["overflow"],1,str(result))
                        for svg in result["svgs"]:
                            for x,y,r,b in svg["text"]:
                                self.assertGreaterEqual(x,-1,str(svg))
                                self.assertGreaterEqual(y,-1,str(svg))
                                self.assertLessEqual(r,svg["right"]+1,str(svg))
                                self.assertLessEqual(b,svg["bottom"]+1,str(svg))
                        page.close()



    def test_722_svg_renderer_node_geometry_and_diagram_identity(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.2")
        expected = ["pfi-workflow", "pfi-correlation"]
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                for width in (375, 768, 1440):
                    with self.subTest(locale=locale, theme=theme, width=width):
                        page = self.open_page(lesson, locale, width=width, theme=theme)
                        result = page.evaluate("""() => Array.from(document.querySelectorAll('#lesson-sections svg[data-diagram-renderer="shared-v1"]')).map(svg => {
                          const vb=svg.viewBox.baseVal;
                          const nodes=Array.from(svg.querySelectorAll('[data-node-id]')).map(node => {
                            const rect=node.querySelector('rect').getBBox();
                            const texts=Array.from(node.querySelectorAll('[data-role="node-text"]')).map(text => {
                              const b=text.getBBox();
                              return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,font:parseFloat(getComputedStyle(text).fontSize)};
                            });
                            return {rect:{x:rect.x,y:rect.y,right:rect.x+rect.width,bottom:rect.y+rect.height},texts};
                          });
                          const rects=Array.from(svg.querySelectorAll('[data-node-id] rect')).map(x=>{const b=x.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};});
                          const arrows=Array.from(svg.querySelectorAll('path')).map(x=>{const b=x.getBBox();return b.y+b.height/2;});
                          const fills=Array.from(svg.querySelectorAll('[data-node-id]')).map(n=>({tone:n.dataset.tone,bg:getComputedStyle(n.querySelector('rect')).fill,fg:getComputedStyle(n.querySelector('text')).fill}));
                          const caption=svg.closest('figure')?.querySelector('figcaption')?.textContent||'';
                          const lum=c=>{const v=c.match(/[\\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
                          const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
                          fills.forEach(x=>x.ratio=contrast(x.fg,x.bg));
                          return {type:svg.dataset.diagramType,viewBox:{right:vb.x+vb.width,bottom:vb.y+vb.height},nodes,rects,arrows,fills,caption,
                            viewport:svg.closest('.pfi-diagram-viewport')?.clientWidth,svgWidth:svg.getBoundingClientRect().width};
                        })""")
                        self.assertEqual([x["type"] for x in result], expected, str(result))
                        self.assertEqual(len(result), 2, str(result))
                        flow=result[0]
                        self.assertEqual(len({round(x["height"],2) for x in flow["rects"]}),1,str(flow))
                        if flow["arrows"]:
                            self.assertLess(max(flow["arrows"])-min(flow["arrows"]),1.5,str(flow))
                        caption=flow["caption"].lower()
                        self.assertTrue(any(token in caption for token in ("individual","индивидуаль","单个特征")),str(flow))
                        self.assertNotIn("group permutation",caption)
                        self.assertNotIn("групповой перестановки",caption)
                        self.assertNotIn("联合置换",caption)
                        for item in flow["fills"]:
                            if item["tone"]=="accent":
                                self.assertGreaterEqual(item["ratio"],4.5,str(item))
                        self.assertTrue(result[1]["caption"],str(result))
                        for diagram in result:
                            for node in diagram["nodes"]:
                                r=node["rect"]
                                for label in node["texts"]:
                                    self.assertGreaterEqual(label["x"],r["x"]+5,str(diagram))
                                    self.assertGreaterEqual(label["y"],r["y"],str(diagram))
                                    self.assertLessEqual(label["right"],r["right"]-5,str(diagram))
                                    self.assertLessEqual(label["bottom"],r["bottom"]-5,str(diagram))
                                    self.assertGreaterEqual(label["font"],13.5,str(diagram))
                        page.close()


if __name__ == "__main__":
    unittest.main()


    def test_723_faithfulness_diagrams_are_complete_and_responsive(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.3")
        expected = ["faithfulness-plausibility", "faithfulness-deletion", "faithfulness-pipeline"]
        for locale in ("ru", "en", "zh"):
            for theme in ("light", "dark"):
                for width in (375, 768, 1440):
                    with self.subTest(locale=locale, theme=theme, width=width):
                        page = self.open_page(lesson, locale, width=width, theme=theme)
                        result = page.evaluate("""() => {
                          const root=document.querySelector("#lesson-outcomes");
                          const cards=root?.querySelectorAll("li").length||0;
                          const glossary=document.querySelectorAll("#lesson-glossary .glossary-entry").length;
                          const svgs=Array.from(document.querySelectorAll("#lesson-sections svg[data-diagram-renderer='shared-v1']")).map(svg=>{
                            const vb=svg.viewBox.baseVal;
                            const nodes=Array.from(svg.querySelectorAll("[data-node-id]")).map(node=>{
                              const r=node.querySelector("rect").getBBox();
                              const texts=Array.from(node.querySelectorAll("[data-role='node-text']")).map(t=>{
                                const b=t.getBBox();return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,font:parseFloat(getComputedStyle(t).fontSize)};
                              });
                              return {rect:{x:r.x,y:r.y,right:r.x+r.width,bottom:r.y+r.height},texts};
                            });
                            return {type:svg.dataset.diagramType,right:vb.x+vb.width,bottom:vb.y+vb.height,nodes,
                              viewport:svg.closest(".pfi-diagram-viewport")?.clientWidth};
                          });
                          return {cards,glossary,svgs,overflow:document.documentElement.scrollWidth-window.innerWidth};
                        }""")
                        self.assertEqual(result["cards"], 5, str(result))
                        self.assertEqual(result["glossary"], 12, str(result))
                        self.assertEqual([x["type"] for x in result["svgs"]], expected, str(result))
                        self.assertLessEqual(result["overflow"], 1, str(result))
                        for svg in result["svgs"]:
                            for node in svg["nodes"]:
                                r=node["rect"]
                                for label in node["texts"]:
                                    self.assertGreaterEqual(label["x"],r["x"]+5,str(svg))
                                    self.assertGreaterEqual(label["y"],r["y"],str(svg))
                                    self.assertLessEqual(label["right"],r["right"]-5,str(svg))
                                    self.assertLessEqual(label["bottom"],r["bottom"]-5,str(svg))
                                    self.assertGreaterEqual(label["font"],13.5,str(svg))
                        page.close()

    def test_723_quiz_explains_correct_and_incorrect_options_in_all_locales(self):
        lesson = next(item for item in CANONICAL_LESSONS if item.get("code") == "7.2.3")
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                page = self.open_page(lesson, locale, width=1440, theme="light")
                self.assertEqual(page.locator("#lesson-quiz fieldset").count(), 12)
                page.locator("#lesson-quiz .quiz-submit").click()
                self.assertTrue(page.locator("#lesson-quiz .quiz-feedback.is-visible").is_visible())
                self.assertEqual(page.locator("#lesson-quiz .quiz-feedback > ol > li").count(), 12)
                self.assertEqual(page.locator("#lesson-quiz .quiz-feedback ul").count(), 12)
                page.close()
