import threading
import unittest
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sync_playwright = None

ROOT = Path(__file__).resolve().parents[1]
PAGE_PATHS = {
    "ru": "/lessons/a-7-1-2-les-a-0169.html",
    "en": "/lessons/a-7-1-2-les-a-0169-en.html",
    "zh": "/lessons/a-7-1-2-les-a-0169-zh.html",
}


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_args):
        pass


@unittest.skipIf(sync_playwright is None, "Playwright is installed in CI browser-acceptance jobs")
class CanonicalLessonBrowserAcceptanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
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

    def open_page(self, locale, width=1440, theme="light"):
        page = self.browser.new_page(viewport={"width": width, "height": 1000})
        page.add_init_script(f"localStorage.setItem('dch-school-theme', '{theme}');")
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(self.base + PAGE_PATHS[locale], wait_until="networkidle")
        self.assertEqual(response.status, 200)
        page.locator(".xai-canonical-section-title").first.wait_for()
        page.locator(".lesson-nav a.button").first.wait_for()
        self.assertEqual(errors, [], f"uncaught browser errors on {locale}: {errors}")
        return page

    def test_locale_switcher_is_in_header_only_and_preserves_lesson(self):
        for locale in ("ru", "en", "zh"):
            with self.subTest(locale=locale):
                page = self.open_page(locale)
                self.assertEqual(page.locator("header.site-header .language-switcher").count(), 1)
                self.assertEqual(page.locator("main .language-switcher, footer .language-switcher, .lesson-language-links, .locale-links").count(), 0)
                self.assertEqual(page.locator("header.site-header .language-switcher a").count(), 3)
                links = page.locator("header.site-header .language-switcher a")
                expected = {
                    "ru": "a-7-1-2-les-a-0169.html",
                    "en": "a-7-1-2-les-a-0169-en.html",
                    "zh": "a-7-1-2-les-a-0169-zh.html",
                }
                for i, target in enumerate(("ru", "en", "zh")):
                    self.assertTrue(links.nth(i).get_attribute("href").endswith(expected[target]))
                page.locator("header.site-header .language-switcher a[lang='en']").click()
                page.wait_for_url("**/a-7-1-2-les-a-0169-en.html")
                self.assertEqual(page.locator("html").get_attribute("lang"), "en")
                page.close()

    def test_shared_navigation_is_single_and_review_preview_is_safe(self):
        page = self.open_page("ru")
        self.assertEqual(page.locator("nav.lesson-nav").count(), 1)
        self.assertEqual(page.locator("nav.lesson-nav a").count(), 4)
        self.assertTrue(page.locator("nav.lesson-nav a").first.get_attribute("href").endswith("a-7-1-1-les-a-0018.html"))
        self.assertEqual(page.locator("nav.lesson-nav .is-disabled").count(), 1)
        self.assertEqual(page.locator("nav.lesson-nav .is-disabled").evaluate("(el) => el.tagName"), "SPAN")
        page.close()

    def test_theme_aware_heading_colors_and_responsive_layout(self):
        for theme, expected in (("light", "rgb(23, 35, 61)"), ("dark", "rgb(237, 243, 255)")):
            for width in (375, 768, 1440):
                with self.subTest(theme=theme, width=width):
                    page = self.open_page("ru", width=width, theme=theme)
                    heading = page.locator(".xai-canonical-section-title").first
                    self.assertEqual(heading.evaluate("(el) => getComputedStyle(el).color"), expected)
                    self.assertEqual(page.locator("header.site-header [data-dch-theme-control]").count(), 1)
                    self.assertEqual(page.locator("header.site-header .language-switcher").count(), 1)
                    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                    self.assertLessEqual(overflow, 1, f"page-level horizontal overflow {overflow}px at {width}px")
                    page.close()


if __name__ == "__main__":
    unittest.main()
