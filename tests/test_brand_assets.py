from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class BrandAssetTests(unittest.TestCase):
    def test_brand_logo_is_self_contained_svg(self):
        logo = (ROOT / "assets/logo.svg").read_text(encoding="utf-8")
        self.assertIn("<svg", logo)
        self.assertIn("viewBox=", logo)
        self.assertIn("<text", logo)
        self.assertIn("DCH", logo)
        self.assertNotIn("<image", logo)
        self.assertIsNone(re.search(r"""href=["'](?!#|data:)""", logo))

    def test_supplied_brand_icon_is_present_and_used_in_headers_and_footers(self):
        icon = ROOT / "assets/site-brand-icon.jpg"
        self.assertTrue(icon.is_file())
        self.assertGreater(icon.stat().st_size, 1000)
        pages = [
            "index.html", "index-en.html", "index-zh.html",
            "lessons/a-3-how-machines-learn-from-data.html",
            "lessons/reader.html", "tracks/understanding-ai.html",
            "learning-map/index.html",
        ]
        for relative in pages:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("site-brand-icon.jpg", page, relative)
            self.assertIn("assets/favicon.png", page, relative)

    def test_brand_icon_has_consistent_contrast_backing(self):
        sources = [
            (ROOT / "styles/main.css").read_text(encoding="utf-8"),
            (ROOT / "styles/account.css").read_text(encoding="utf-8"),
            (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8"),
        ]
        for source in sources:
            self.assertIn("border-radius:", source)
            self.assertIn("box-shadow:", source)
        palette = (ROOT / "styles/theme-system.css").read_text(encoding="utf-8")
        self.assertIn("--diagram-surface:", palette)
        self.assertIn("--diagram-text:", palette)
        self.assertIn("#f4f7ff", sources[0] + sources[1] + sources[2])


    def test_lesson_diagrams_have_explicit_svg_palette(self):
        theme = (ROOT / "styles/theme-system.css").read_text(encoding="utf-8")
        palette = (ROOT / "styles/lesson-visual-palette.css").read_text(encoding="utf-8")
        for token in ("#e3edff", "#172f50", "#f1f6ff", "#24364e", "#e8f1ff"):
            self.assertIn(token, theme)
        for selector in (".lesson-figure", ".lesson-diagram", ".svg-label", ".svg-title", ".svg-box"):
            self.assertIn(selector, palette)
        self.assertIn("var(--diagram-text)", palette)



if __name__ == "__main__":
    unittest.main()
