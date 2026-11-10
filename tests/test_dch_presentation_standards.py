import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DchPresentationStandardsTests(unittest.TestCase):
    def test_required_standards_are_documented(self):
        required = [
            "docs/roadmap/DCH_SCHOOL_FOUNDATION_ROADMAP.md",
            "docs/architecture/COURSE_HIERARCHY.md",
            "docs/design/DESIGN_SYSTEM.md",
            "docs/standards/CODE_PRESENTATION_STANDARD.md",
            "docs/standards/CODE_TEACHING_STANDARD.md",
            "docs/standards/ILLUSTRATION_STANDARD.md",
            "docs/standards/LESSON_QUALITY_GATE.md",
        ]
        for relative in required:
            with self.subTest(path=relative):
                self.assertTrue((ROOT / relative).is_file())

    def test_track_a_ru_uses_catalog_v3_without_legacy_roadmap_markup(self):
        page = (ROOT / "tracks/understanding-ai.html").read_text(encoding="utf-8")
        self.assertIn('data-lesson-catalog', page)
        self.assertIn("lesson-catalog.js", page)
        self.assertIn("code-blocks.js", page)
        self.assertNotIn("THEME A.", page)
        self.assertNotIn("A.1.1.1", page)

    def test_shared_styles_and_scripts_are_wired(self):
        main_css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
        reader_css = (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8")
        self.assertIn("theme-system.css", main_css)
        self.assertIn("code-blocks.css", main_css)
        self.assertIn("theme-system.css", reader_css)
        self.assertIn("code-blocks.css", reader_css)

        catalog = json.loads((ROOT / "data/catalog/catalog-v2.json").read_text(encoding="utf-8"))
        pages = {"index.html", "lessons/index.html", "learning-map/index.html"}
        pages.update(track["url"] for track in catalog["tracks"])
        for lesson in catalog["lessons"]:
            pages.add(lesson["url"])
            pages.update(lesson.get("url_i18n", {}).values())

        for relative in sorted(pages):
            page = ROOT / relative
            with self.subTest(page=relative):
                self.assertTrue(page.is_file(), f"Missing catalog page: {relative}")
                html = page.read_text(encoding="utf-8")
                self.assertIn("theme-system.js", html)
                self.assertIn("code-blocks.js", html)

    def test_code_block_styles_and_theme_tokens_exist(self):
        css = (ROOT / "styles/code-blocks.css").read_text(encoding="utf-8")
        for token in (
            "code-token-keyword", "code-token-function", "code-token-class",
            "code-token-string", "code-token-number", "code-token-operator",
            "code-token-comment", "lesson-code-copy", "lesson-code-line",
        ):
            with self.subTest(token=token):
                self.assertIn(token, css)

        theme_css = (ROOT / "styles/theme-system.css").read_text(encoding="utf-8")
        for token in ("data-theme=\"light\"", "--token-keyword", "--surface-code"):
            with self.subTest(token=token):
                self.assertIn(token, theme_css)


if __name__ == "__main__":
    unittest.main()
