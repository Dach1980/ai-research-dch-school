import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRACKS = {
    "A": {"ru": "tracks/understanding-ai.html", "en": "tracks/understanding-ai-en.html", "zh": "tracks/understanding-ai-zh.html"},
    "B": {"ru": "tracks/inside-ai.html", "en": "tracks/inside-ai-en.html", "zh": "tracks/inside-ai-zh.html"},
    "C": {"ru": "tracks/building-with-ai.html", "en": "tracks/building-with-ai-en.html", "zh": "tracks/building-with-ai-zh.html"},
}


class TrackLocaleParityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {
            track: {locale: (ROOT / path).read_text(encoding="utf-8") for locale, path in variants.items()}
            for track, variants in TRACKS.items()
        }

    def test_track_pages_have_equal_section_counts(self):
        expected = {"A": 3, "B": 4, "C": 4}
        for track, variants in self.pages.items():
            for locale, html in variants.items():
                self.assertEqual(len(re.findall(r'class="content-section"', html)), expected[track], f"{track}/{locale}")

    def test_all_track_locales_load_shared_account_theme_and_language_controls_once(self):
        for track, variants in self.pages.items():
            for locale, html in variants.items():
                for asset in ("scripts/account-ui.js", "scripts/language-switcher.js", "scripts/theme-system.js"):
                    self.assertEqual(html.count(asset), 1, f"{track}/{locale}: {asset}")

    def test_track_a_has_same_sixteen_curriculum_themes(self):
        for locale, html in self.pages["A"].items():
            self.assertEqual(len(re.findall(r'class="track-module"', html)), 16, f"A/{locale}")
            self.assertIn("A.1.1.1–A.1.1.6", html, f"A/{locale}")

    def test_track_b_and_c_have_the_same_thirteen_module_items(self):
        for track in ("B", "C"):
            for locale, html in self.pages[track].items():
                self.assertEqual(len(re.findall(r'<div class="module"><strong>', html)), 13, f"{track}/{locale}")

    def test_all_track_pages_use_the_shared_stylesheet_without_inline_style_blocks(self):
        for track, variants in self.pages.items():
            for locale, html in variants.items():
                self.assertIn("../styles/main.css", html, f"{track}/{locale}")
                self.assertNotIn("<style>", html.lower(), f"{track}/{locale}")


if __name__ == "__main__":
    unittest.main()
