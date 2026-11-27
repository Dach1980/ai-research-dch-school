"""Browser tests use local static files and mocked API; never submit real feedback."""
import functools
import http.server
import json
import threading
import unittest
from pathlib import Path
from urllib.parse import urlencode

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "index-en.html", "index-zh.html")
REFERENCE = "00000000-0000-4000-8000-000000000001"
MESSAGE = "Synthetic browser acceptance message"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class FeedbackBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.origin = "http://127.0.0.1:" + str(cls.server.server_port)
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def open_form(self, page, filename, source=None):
        source = source or self.origin + "/about/author.html?token=synthetic#fragment"
        page.goto(self.origin + "/feedback/" + filename + "?" + urlencode({"from": source}))
        button = page.locator("#feedback-form button[type=submit]")
        expect(button).to_be_enabled()
        return button

    def test_locales_viewports_success_and_errors(self):
        for filename in PAGES:
            for width in (390, 1280):
                for status in (201, 400, 429, 500, "offline"):
                    with self.subTest(page=filename, width=width, status=status):
                        context = self.browser.new_context(viewport={"width": width, "height": 900}, service_workers="block")
                        try:
                            page = context.new_page()
                            requests = []

                            def intercept(route):
                                req = route.request
                                if req.url == self.origin + "/api/feedback":
                                    requests.append((req.method, req.post_data_json, req.headers.get("content-type")))
                                    if status == "offline":
                                        route.abort("failed")
                                    else:
                                        route.fulfill(status=status, content_type="application/json",
                                                      body=json.dumps({"ok": status == 201, "status": "accepted" if status == 201 else "error", "id": REFERENCE}))
                                elif req.url.startswith(self.origin + "/"):
                                    route.continue_()
                                else:
                                    route.abort()

                            page.route("**/*", intercept)
                            button = self.open_form(page, filename)
                            form = page.locator("#feedback-form")
                            notice = page.locator("#feedback-notice")
                            related = form.locator("[name=pageUrl]")
                            message = form.locator("[name=message]")
                            expect(related).to_have_value(self.origin + "/about/author.html")
                            expect(form.locator("[name=website]")).to_be_hidden()
                            form.locator("[name=kind]").select_option("suggestion")
                            message.fill(MESSAGE)
                            button.click()
                            expect(notice).to_be_visible()
                            expect(button).to_be_enabled()
                            self.assertEqual(len(requests), 1)
                            method, data, content_type = requests[0]
                            self.assertEqual(method, "POST")
                            self.assertEqual(content_type, "application/json")
                            self.assertEqual(data, {"kind": "suggestion", "name": "", "replyEmail": "",
                                                   "pageUrl": self.origin + "/about/author.html",
                                                   "message": MESSAGE, "website": ""})
                            if status == 201:
                                expect(notice).to_have_text(form.get_attribute("data-success") + REFERENCE)
                                expect(message).to_have_value("")
                            else:
                                expect(notice).to_have_text(form.get_attribute("data-rate" if status == 429 else "data-error"))
                                expect(message).to_have_value(MESSAGE)
                            expect(related).to_have_value(self.origin + "/about/author.html")
                            self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), width + 1)
                        finally:
                            context.close()

    def test_invalid_form_and_double_submit(self):
        for filename in PAGES:
            with self.subTest(page=filename):
                context = self.browser.new_context(service_workers="block")
                try:
                    page = context.new_page()
                    requests = []
                    def intercept(route):
                        if route.request.url == self.origin + "/api/feedback":
                            requests.append(route.request.method)
                            route.fulfill(status=201, content_type="application/json",
                                          body=json.dumps({"ok": True, "status": "accepted", "id": REFERENCE}))
                        elif route.request.url.startswith(self.origin + "/"):
                            route.continue_()
                        else:
                            route.abort()
                    page.route("**/*", intercept)
                    button = self.open_form(page, filename, "https://example.invalid/private")
                    expect(page.locator("[name=pageUrl]")).to_have_value("")
                    button.click()
                    self.assertFalse(page.locator("#feedback-form").evaluate("(f) => f.checkValidity()"))
                    self.assertEqual(requests, [])
                    page.locator("[name=message]").fill(MESSAGE)
                    page.locator("#feedback-form").evaluate("(f) => { f.requestSubmit(); f.requestSubmit(); }")
                    expect(page.locator("#feedback-notice")).to_contain_text(REFERENCE)
                    self.assertEqual(requests, ["POST"])
                finally:
                    context.close()


if __name__ == "__main__":
    unittest.main()
