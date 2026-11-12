import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "ru": ROOT / "lessons/a-1-3-2.html",
    "en": ROOT / "lessons/a-1-3-2-en.html",
    "zh": ROOT / "lessons/a-1-3-2-zh.html",
}
CLUSTER_LABELS = {
    "ru": ("Компактный кластер", "Вытянутый кластер", "Неоднородная плотность", "Шум"),
    "en": ("Compact cluster", "Elongated cluster", "Uneven density", "Noise"),
    "zh": ("紧凑簇", "拉伸簇", "密度不均", "噪声"),
}
ENVIRONMENT_LABELS = {
    "ru": "<b>Среда:</b>",
    "en": "<b>Environment:</b>",
    "zh": "<b>运行环境：</b>",
}


class Lesson132Tests(unittest.TestCase):
    def test_locales_and_shell(self):
        for locale, path in FILES.items():
            with self.subTest(locale=locale):
                html = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}">', html)
                self.assertIn("1.3.2", html)
                for marker in (
                    'rel="canonical"', 'name="robots" content="noindex,nofollow"',
                    "lesson-planet-banner", "lesson-sources", "lesson-nav",
                    "lesson-glossary", "lesson-check", "© 2026 AI Research DCH School",
                ):
                    self.assertIn(marker, html)
                self.assertNotRegex(html, r'\{\{[A-Z_]+\}\}')

    def test_figures_glossary_and_assessment(self):
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(len(re.findall(r'<figure class="lesson-figure">', html)), 3)
            self.assertEqual(len(re.findall(r'class="glossary-entry"', html)), 10)
            self.assertEqual(len(re.findall(r'class="lesson-check-question"', html)), 6)
            self.assertEqual(len(re.findall(r'data-mode="multi"', html)), 1)
            self.assertIn('data-correct="a,c"', html)
            self.assertIn('language-python', html)
            self.assertIn('self-supervised learning', html.lower())

    def test_cluster_illustration_has_three_distinct_structures_and_noise(self):
        for locale, path in FILES.items():
            html = path.read_text(encoding="utf-8")
            match = re.search(r'<figure class="lesson-figure"><svg class="cluster-diagram"[\s\S]*?</svg>', html)
            self.assertIsNotNone(match, locale)
            svg = match.group(0)
            for label in CLUSTER_LABELS[locale]:
                self.assertIn(label, svg)
            self.assertIn("<ellipse", svg)
            self.assertIn("<path", svg)
            noise_group = re.search(r'<g class="cluster-noise">([\\s\\S]*?)</g>', svg)
            self.assertIsNotNone(noise_group)
            self.assertGreaterEqual(noise_group.group(1).count("<circle"), 6)
            self.assertIn('<circle class="cluster-noise"', svg)
            self.assertIn("class=\"cluster-panel\"", svg)
            self.assertIn("aria-labelledby=\"d2t d2d\"", svg)

    def test_environment_label_is_not_duplicated(self):
        for locale, path in FILES.items():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(html.count(ENVIRONMENT_LABELS[locale]), 1)
            self.assertNotRegex(html, r'(Среда:</b>\s*Среда:|Environment:</b>\s*Environment:|运行环境：</b>\s*环境：)')

    def test_theme_and_mobile_styles_cover_cluster_diagram(self):
        css = (ROOT / "styles/lesson-reference-111.css").read_text(encoding="utf-8")
        self.assertIn(".cluster-panel", css)
        self.assertIn('html[data-theme="light"] .lesson-figure .cluster-panel', css)
        self.assertIn('html[data-theme="light"] .lesson-figure .svg-label', css)
        self.assertIn("@media(max-width:560px)", css)
        self.assertIn("min-width:640px", css)
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(html.count("theme-system.js"), 1)
            self.assertEqual(html.count("lesson-reference-111.css"), 1)

    def test_sources_and_svg_accessibility(self):
        required = (
            "scikit-learn.org/stable/unsupervised_learning.html",
            "scikit-learn.org/stable/modules/clustering.html",
            "scikit-learn.org/stable/modules/unsupervised_reduction.html",
            "developers.google.com/machine-learning/clustering",
        )
        for path in FILES.values():
            html = path.read_text(encoding="utf-8")
            for source in required:
                self.assertIn(source, html)
            self.assertEqual(len(re.findall(r'<desc id=', html)), 3)


if __name__ == "__main__":
    unittest.main()
