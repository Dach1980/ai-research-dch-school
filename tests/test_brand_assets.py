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
        self.assertIsNone(re.search(r'href=["\\'](?!#|data:)', logo))

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
            self.assertIn("#f4f7ff", source)
            self.assertIn("border-radius:", source)
            self.assertIn("box-shadow:", source)

    def test_lesson_diagrams_have_explicit_svg_palette(self):
        sources = [
            (ROOT / "styles/account.css").read_text(encoding="utf-8"),
            (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8"),
        ]
        for source in sources:
            self.assertIn(".lesson-diagram", source)
            self.assertIn(".svg-box", source)
            self.assertIn(".svg-label", source)
            self.assertIn("#e3edff", source)
            self.assertIn("#172f50", source)


if __name__ == "__main__":
    unittest.main()
