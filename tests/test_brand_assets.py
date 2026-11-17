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
            "about/author.html", "about/author-en.html", "about/author-zh.html",
        ]
        for relative in pages:
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("site-brand-icon.jpg", page, relative)
            self.assertIn("assets/favicon.png", page, relative)

    def test_author_profile_is_multilingual_and_uses_local_portrait(self):
        portrait = ROOT / "assets/author-portrait.jpg"
        self.assertTrue(portrait.is_file())
        self.assertGreater(portrait.stat().st_size, 100_000)
        pages = {
            "ru": "about/author.html",
            "en": "about/author-en.html",
            "zh": "about/author-zh.html",
        }
        for locale, relative in pages.items():
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{locale}">', page)
            self.assertIn("../assets/author-portrait.jpg", page)
            self.assertIn("../styles/author.css", page)
            self.assertIn("../scripts/language-switcher.js", page)
        for relative, href in (
            ("index.html", "about/author.html"),
            ("index-en.html", "about/author-en.html"),
            ("index-zh.html", "about/author-zh.html"),
        ):
            self.assertIn(href, (ROOT / relative).read_text(encoding="utf-8"))
        css = (ROOT / "styles/author.css").read_text(encoding="utf-8")
        self.assertIn("overflow-x:clip", css)
        self.assertIn("overflow-y:visible", css)
        self.assertIn("height:auto", css)
        self.assertIn("object-fit:contain", css)
        self.assertIn(".mission-highlight", css)
        for social_url in (
            "https://www.youtube.com/@DmitryCherkashin_AI",
            "https://rutube.ru/channel/54317674/",
            "https://t.me/DmitryCherkashin_AI",
            "https://max.ru/channel_dmitrycherkashin_ai",
            "https://vk.com/dmitrycherkashin_ai",
            "https://vkvideo.ru/@dmitrycherkashin_ai",
        ):
            self.assertIn(social_url, (ROOT / "about/author.html").read_text(encoding="utf-8"))
        self.assertNotIn("github.com", (ROOT / "about/author.html").read_text(encoding="utf-8"))
        self.assertIn("Проверять.", (ROOT / "about/author.html").read_text(encoding="utf-8"))
        for relative in ("about/author.html", "about/author-en.html", "about/author-zh.html"):
            page = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("social-max", page)
            self.assertIn("M12 2.25c-5.38 0-9.75 3.42", page)
            self.assertIn("social-vkvideo", page)
            self.assertIn("#ff4b55", page)
            self.assertIn("#3478f6", page)
        author_css = (ROOT / "styles/author.css").read_text(encoding="utf-8")
        self.assertIn("linear-gradient(135deg,#00bfff,#471aff 55%,#9500ff)", author_css)
        switcher = (ROOT / "scripts/language-switcher.js").read_text(encoding="utf-8")
        self.assertIn('const isAuthor = /^about\\/author\\.html$/.test(relativePage);', switcher)

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


    def test_author_dark_feature_cards_keep_contrast_in_light_theme(self):
        css = (ROOT / "styles/author.css").read_text(encoding="utf-8")
        self.assertIn('html[data-theme="light"] .author-pillar h3', css)
        self.assertIn('html[data-theme="light"] .author-mission h2 .mission-line:not(.mission-highlight)', css)
        self.assertIn('html[data-theme="light"] .author-pillar p', css)
        self.assertIn('html[data-theme="light"] .author-mission>p', css)
        self.assertIn('color:#f2f6ff', css)
        self.assertIn('color:#b9c9e2', css)


if __name__ == "__main__":
    unittest.main()
