import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOMEPAGES = {
    "ru": ROOT / "index.html",
    "en": ROOT / "index-en.html",
    "zh": ROOT / "index-zh.html",
}
EXPECTED_SECTIONS = [
    "hero container",
    "section container",
    "section container knowledge-home",
    "section foundation",
    "section container",
    "section container about",
]


class HomepageLocaleParityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {locale: path.read_text(encoding="utf-8") for locale, path in HOMEPAGES.items()}

    def test_all_homepages_exist_and_declare_their_locale(self):
        expected = {"ru": "ru", "en": "en", "zh": "zh"}
        for locale, html in self.pages.items():
            match = re.search(r'<html lang="([^"]+)"', html, re.IGNORECASE)
            self.assertIsNotNone(match, locale)
            self.assertTrue(match.group(1).lower().startswith(expected[locale]), locale)

    def test_homepages_share_the_same_primary_section_order(self):
        for locale, html in self.pages.items():
            sections = re.findall(r'<section\b[^>]*class="([^"]+)"', html)
            normalized = []
            for classes in sections:
                if classes == "hero container":
                    normalized.append(classes)
                elif "knowledge-home" in classes:
                    normalized.append("section container knowledge-home")
                elif classes == "section foundation":
                    normalized.append(classes)
                elif "about" in classes:
                    normalized.append("section container about")
                elif classes == "section container":
                    normalized.append(classes)
            self.assertEqual(normalized, EXPECTED_SECTIONS, locale)

    def test_shared_shell_assets_are_loaded_once_per_locale(self):
        for locale, html in self.pages.items():
            for asset in (
                "styles/main.css",
                "styles/account.css",
                "scripts/main.js",
                "scripts/supabase-config.js",
                "scripts/account-ui.js",
                "scripts/language-switcher.js",
                "scripts/catalog-compat.js",
                "scripts/home-knowledge-map.js",
                "scripts/theme-system.js",
            ):
                self.assertEqual(html.count(asset), 1, f"{locale}: {asset}")

    def test_all_locales_have_track_knowledge_news_and_about_sections(self):
        required = ('id="tracks"', 'id="knowledge-universe"', 'id="about"', 'class="latest"')
        for locale, html in self.pages.items():
            for marker in required:
                self.assertIn(marker, html, f"{locale}: {marker}")

    def test_homepages_do_not_define_locale_specific_inline_layout_styles(self):
        for locale, html in self.pages.items():
            self.assertNotIn("<style>", html.lower(), locale)

    def test_locale_switcher_supports_root_and_project_path_deployments(self):
        source = (ROOT / "scripts/language-switcher.js").read_text(encoding="utf-8")
        self.assertIn('const isHome = base === "index.html"', source)
        self.assertIn('if (isHome) return folder + "index" + suffix + ".html"', source)
        self.assertIn('if (!header || header.querySelector(".language-switcher")) return', source)

    def test_account_navigation_is_localized(self):
        source = (ROOT / "scripts/account-ui.js").read_text(encoding="utf-8")
        for label in ('My account', 'Sign in', '个人中心', '登录', 'Личный кабинет', 'Войти'):
            self.assertIn(label, source)


if __name__ == "__main__":
    unittest.main()
