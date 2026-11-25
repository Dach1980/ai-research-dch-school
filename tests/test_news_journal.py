import unittest
import threading
from pathlib import Path
from http.server import ThreadingHTTPServer
from test_canonical_lesson_browser import QuietHandler
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

class NewsJournalTests(unittest.TestCase):
    def test_static_news(self):
        for suffix,lang in (("","ru"),("-en","en"),("-zh","zh")):
            for slug in ("index","001-school-launch","002-open-beta"):
                html=(ROOT/"news"/f"{slug}{suffix}.html").read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{lang}">',html)
                self.assertIn("styles/news-journal.css",html)
                self.assertIn("scripts/language-switcher.js",html)
                self.assertIn("rel=\"canonical\"",html)
                self.assertEqual(html.count("<h1>"),1)
            article=(ROOT/"news"/f"002-open-beta{suffix}.html").read_text(encoding="utf-8")
            self.assertIn("mailto:itprof80@gmail.com",article)
            self.assertIn("images/002-open-beta.svg",article)
            self.assertIn('datetime="2026-11-26"',article)
            home=(ROOT/f"index{suffix}.html").read_text(encoding="utf-8")
            self.assertIn(f"news/002-open-beta{suffix}.html",home)
            self.assertIn(f"news/index{suffix}.html",home)

    def test_all_locales_themes_and_sizes(self):
        server=ThreadingHTTPServer(("127.0.0.1",0),QuietHandler)
        thread=threading.Thread(target=server.serve_forever,daemon=True)
        thread.start()
        base=f"http://127.0.0.1:{server.server_port}"
        try:
            with sync_playwright() as p:
                browser=p.chromium.launch()
                for suffix,locale in (("","ru"),("-en","en"),("-zh","zh")):
                    for theme in ("light","dark"):
                        for width in (375,768,1440):
                            with self.subTest(locale=locale,theme=theme,width=width):
                                page=browser.new_page(viewport={"width":width,"height":1000})
                                page.add_init_script(f"localStorage.setItem('dch-school-theme','{theme}')")
                                page.route("**/scripts/account-ui.js",lambda r:r.fulfill(status=200,content_type="application/javascript",body=""))
                                errors=[]
                                page.on("pageerror",lambda e:errors.append(str(e)))
                                for slug in ("index","002-open-beta","001-school-launch"):
                                    path=f"/news/{slug}{suffix}.html"
                                    self.assertEqual(page.goto(base+path,wait_until="domcontentloaded").status,200)
                                    self.assertEqual(page.locator("html").get_attribute("data-theme"),theme)
                                    self.assertEqual(page.locator("h1").count(),1)
                                    self.assertEqual(page.locator(".language-switcher").count(),1)
                                    self.assertEqual(page.locator("[data-dch-theme-control]").count(),1)
                                    self.assertEqual(page.locator(".language-switcher a").count(),3)
                                    for target in ("","-en","-zh"):
                                        href=f"/news/{slug}{target}.html"
                                        self.assertEqual(page.locator(f'.language-switcher a[href="{href}"]').count(),1)
                                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth-innerWidth"),1)
                                    page.wait_for_function("Array.from(document.querySelectorAll('main img')).every(i=>i.complete&&i.naturalWidth>0)")
                                    if slug=="002-open-beta":
                                        self.assertEqual(page.locator(".journal-stat").count(),4)
                                        self.assertEqual(page.locator(".journal-track").count(),4)
                                        self.assertEqual(page.locator(".journal-mail").get_attribute("href"),"mailto:itprof80@gmail.com")
                                self.assertEqual(errors,[])
                                page.close()
                browser.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)
