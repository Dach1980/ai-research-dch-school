import unittest
import subprocess
import sys
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class HierarchicalCatalogUITests(unittest.TestCase):
    def test_track_lesson_catalog_reads_v3_legacy_projection(self):
        script = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
        page = (ROOT / "tracks/understanding-ai.html").read_text(encoding="utf-8")
        self.assertIn("loadLegacyProjection", script)
        self.assertIn("data.themes", script)
        self.assertIn("data.modules", script)
        self.assertNotIn("lessons.json", script)
        self.assertLess(page.index("catalog-compat.js"), page.index("lesson-catalog.js"))

    def test_planet_map_reads_v3_legacy_projection(self):
        script = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
        page = (ROOT / "learning-map/index.html").read_text(encoding="utf-8")
        self.assertIn("loadLegacyProjection", script)
        self.assertIn("data.themes", script)
        self.assertIn("data.modules", script)
        self.assertNotIn('fetch("../data/catalog/lessons.json"', script)
        self.assertLess(page.index("catalog-compat.js"), page.index("planet-map-catalog.js"))

    def test_homepage_and_localized_maps_read_v3_projection(self):
        script = (ROOT / "scripts/home-knowledge-map.js").read_text(encoding="utf-8")
        self.assertIn("loadLegacyProjection", script)
        self.assertIn('root.dataset.catalogBase || "data/catalog"', script)
        for relative in ["index.html", "index-en.html", "index-zh.html", "learning-map/index-en.html", "learning-map/index-zh.html"]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("data-home-knowledge-map", page)
            self.assertLess(page.index("catalog-compat.js"), page.index("home-knowledge-map.js"))

    def test_all_track_and_lesson_catalogues_use_v2(self):
        for relative in [
            "tracks/understanding-ai.html", "tracks/understanding-ai-en.html",
            "tracks/understanding-ai-zh.html", "lessons/index.html",
            "lessons/index-en.html", "lessons/index-zh.html"
        ]:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("data-lesson-catalog", page, relative)
            self.assertLess(page.index("catalog-compat.js"), page.index("lesson-catalog.js"), relative)
        schema = (ROOT / "data/catalog/schema-v2.json").read_text(encoding="utf-8")
        self.assertIn('"title_i18n"', schema)

    def test_xai_review_lesson_has_multilingual_content_and_primary_sources(self):
        source = (ROOT / "lessons/data/xai-01-what-and-why.js").read_text(encoding="utf-8")
        for page_id in ["why", "xai-mi", "applications", "regulation", "terms", "taxonomy", "methods-passport", "summary"]:
            self.assertIn('"id": "' + page_id + '"', source)
        for locale in ["ru", "en", "zh"]:
            self.assertGreaterEqual(source.count('"' + locale + '":'), 8)
        for reference in [
            "arxiv.org/abs/1606.03490", "arxiv.org/abs/1702.08608",
            "doi.org/10.23915/distill.00024.001",
            "eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727",
            "protect.gost.ru/gost/details/"
        ]:
            self.assertIn(reference, source)
        catalog = __import__("json").loads((ROOT / "data/catalog/catalog-v2.json").read_text(encoding="utf-8"))
        draft = next(item for item in catalog["lessons"] if item["id"] == "A.1.2.1")
        self.assertEqual(draft["status"], "review")
        self.assertNotIn("A.1.2.1", {item["lesson_id"] for item in catalog["planets"]})

    def test_xai_lesson_has_live_multilingual_quizzes_and_explanations(self):
        source = (ROOT / "lessons/data/xai-01-what-and-why.js").read_text(encoding="utf-8")
        reader = (ROOT / "scripts/lesson-reader.js").read_text(encoding="utf-8")
        payload = source.split("window.DCH_DEMO_LESSON = ", 1)[1].rsplit(";", 1)[0]
        lesson = json.loads(payload)
        summary = next(page for page in lesson["pages"] if page["id"] == "summary")
        for locale in ["ru", "en", "zh"]:
            self.assertIn('data-quiz="1"', summary["content"][locale])
            self.assertIn('data-quiz="2"', summary["content"][locale])
            self.assertIn("Проверить ответы" if locale == "ru" else "Check answers" if locale == "en" else "检查答案", summary["content"][locale])
            self.assertIn('id="quiz-summary"', summary["content"][locale])
        self.assertIn("renderQuizFeedback", reader)
        self.assertIn("explanations[language]", reader)

    def test_xai_mini_lab_runs_without_external_dependencies(self):
        script = ROOT / "lessons/practice/xai-a1-2-1-passport.py"
        result = subprocess.run(
            [sys.executable, str(script)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Baseline score: 0.5917", result.stdout)
        self.assertIn("Instance A score: 0.6500", result.stdout)
        self.assertIn("delta=+0.0300", result.stdout)
        self.assertIn("not SHAP values", result.stdout)

    def test_uploaded_logo_and_favicon_resolve_on_every_html_page(self):
        logo_wrapper = (ROOT / "assets/logo.svg").read_text(encoding="utf-8")
        self.assertIn('href="logo.png"', logo_wrapper)
        self.assertTrue((ROOT / "assets/logo.png").is_file())
        self.assertTrue((ROOT / "assets/favicon.png").is_file())
        for page in ROOT.rglob("*.html"):
            relative = page.relative_to(ROOT)
            content = page.read_text(encoding="utf-8")
            match = re.search(r'<link\s+rel="icon"[^>]*href="([^"]+)"', content)
            self.assertIsNotNone(match, str(relative))
            icon_path = (page.parent / match.group(1)).resolve()
            self.assertTrue(icon_path.is_file(), f"{relative}: {match.group(1)}")
            for image in re.findall(r'<img[^>]+src="([^"]*assets/logo\.svg)"', content):
                logo_path = (page.parent / image).resolve()
                self.assertTrue(logo_path.is_file(), f"{relative}: {image}")

if __name__ == "__main__":
    unittest.main()
