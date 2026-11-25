import json
import os
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from playwright.sync_api import sync_playwright
from test_canonical_lesson_browser import QuietHandler

ROOT = Path(__file__).resolve().parents[1]

class LessonDesignV2Tests(unittest.TestCase):
    def test_opt_in_pilot(self):
        catalog = json.loads((ROOT / "data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0183")
        legacy = next(x for x in catalog["lessons"] if x["uid"] == "les-a-0182")
        server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        evidence = os.environ.get("DCH_V2_EVIDENCE")
        if evidence:
            evidence = Path(evidence)
            evidence.mkdir(parents=True, exist_ok=True)
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                for locale, route in lesson["url_i18n"].items():
                    for theme in ("light", "dark"):
                        for width in (375, 768, 1440):
                            with self.subTest(locale=locale, theme=theme, width=width):
                                page = browser.new_page(viewport={"width": width, "height": 1000}, reduced_motion="no-preference")
                                try:
                                    page.add_init_script(f"localStorage.setItem('dch-school-theme','{theme}');")
                                    page.route("**/scripts/account-ui.js", lambda r: r.fulfill(status=200, content_type="application/javascript", body=""))
                                    errors = []
                                    page.on("pageerror", lambda e: errors.append(str(e)))
                                    self.assertEqual(page.goto(f"http://127.0.0.1:{server.server_port}/"+route, wait_until="domcontentloaded").status, 200)
                                    page.locator("main[data-design-ready='true']").wait_for()
                                    self.assertEqual(page.locator("html").get_attribute("data-theme"), theme)
                                    self.assertEqual(page.locator("main h1").count(), 1)
                                    self.assertEqual(page.locator(".dch-v2-planet-code").text_content(), "10.1.2")
                                    self.assertEqual(page.locator(".lesson-planet-banner").count(), 0)
                                    self.assertEqual(page.locator("#lesson-outcomes li").count(), 9)
                                    self.assertEqual(page.locator("#lesson-sections > section").count(), 9)
                                    self.assertEqual(page.locator(".shap-compute-figure svg").count(), 5)
                                    self.assertEqual(page.locator("#lesson-glossary .glossary-entry").count(), 15)
                                    self.assertEqual(page.locator("#lesson-quiz fieldset").count(), 10)
                                    self.assertEqual(page.locator(".dch-v2-toc-link").count(), 13)
                                    self.assertEqual(page.evaluate("Array.from(document.querySelectorAll('.dch-v2-toc-link')).every(a=>document.getElementById(a.hash.slice(1)))"), True)
                                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth-innerWidth"), 1)
                                    self.assertLessEqual(page.evaluate("Math.abs(document.querySelector(\"main.lesson\").getBoundingClientRect().width-document.querySelector(\".lesson-standard-hero\").getBoundingClientRect().width)"), 2)
                                    if evidence:
                                        page.screenshot(path=str(evidence / f"{locale}-{theme}-{width}-page.png"), animations="allow")
                                    toggle = page.locator(".dch-v2-outcomes-toggle")
                                    toggle.click()
                                    self.assertEqual(toggle.get_attribute("aria-expanded"), "false")
                                    self.assertFalse(page.locator("#lesson-outcomes > ul").is_visible())
                                    toggle.click()
                                    self.assertTrue(page.locator("#lesson-outcomes > ul").is_visible())
                                    if locale == "ru" and theme == "light" and width == 1440:
                                        motion = page.locator(".dch-v2-motion")
                                        motion.scroll_into_view_if_needed()
                                        page.wait_for_function("document.querySelector('.dch-v2-planet').dataset.paused==='false'")
                                        sat = page.locator(".dch-v2-satellite-a")
                                        first = sat.evaluate("e=>getComputedStyle(e).offsetDistance")
                                        page.wait_for_timeout(300)
                                        self.assertNotEqual(first, sat.evaluate("e=>getComputedStyle(e).offsetDistance"))
                                        motion.click()
                                        self.assertEqual(motion.get_attribute("aria-pressed"), "true")
                                        self.assertEqual(sat.evaluate("e=>getComputedStyle(e).animationPlayState"), "paused")
                                        motion.click()
                                        self.assertEqual(motion.get_attribute("aria-pressed"), "false")
                                        page.emulate_media(reduced_motion="reduce")
                                        page.wait_for_function("document.querySelector('.dch-v2-motion').disabled")
                                        self.assertEqual(sat.evaluate("e=>getComputedStyle(e).animationName"), "none")
                                    page.locator(".dch-v2-primary").click()
                                    self.assertTrue(page.evaluate("location.hash.startsWith('#shap-1012-')"))
                                    self.assertEqual(errors, [])
                                finally:
                                    page.close()
                page = browser.new_page()
                page.route("**/scripts/account-ui.js", lambda r: r.fulfill(status=200, content_type="application/javascript", body=""))
                page.goto(f"http://127.0.0.1:{server.server_port}/"+legacy["url_i18n"]["ru"], wait_until="domcontentloaded")
                self.assertEqual(page.locator("main[data-lesson-design='v2']").count(), 0)
                self.assertEqual(page.locator(".dch-v2-planet").count(), 0)
                self.assertEqual(page.locator(".lesson-planet-banner").count(), 1)
                browser.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)
