from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "lessons"
DESIGN_SYSTEM = ROOT / "styles" / "lesson-design-system.css"
REFERENCE_STYLES = ROOT / "styles" / "lesson-reference-111.css"

DARK_COLOR = re.compile(
    r"^(?:black|#(?:0{3}|0{6}|1{3}|1{6})|rgb\\(\\s*0\\s*,\\s*0\\s*,\\s*0\\s*\\))$",
    re.IGNORECASE,
)


def _text_color_declarations(attrs):
    """Return explicit fill/color values only; typography styles are harmless."""
    values = re.findall(r"""\\b(?:fill|color)\\s*=\\s*["']([^"']+)["']""", attrs, re.IGNORECASE)
    for style in re.findall(r"""\\bstyle\\s*=\\s*["']([^']*)["']""", attrs, re.IGNORECASE):
        values.extend(
            re.findall(r"""(?:^|;)\\s*(?:fill|color)\\s*:\\s*([^;]+)""", style, re.IGNORECASE)
        )
    return [value.strip() for value in values]


class SvgThemeFallbackTests(unittest.TestCase):
    def test_shared_svg_text_fallback_uses_theme_tokens(self):
        css = DESIGN_SYSTEM.read_text(encoding="utf-8")
        self.assertRegex(css, r"svg\\s+text\\s*\\{[^}]*fill\\s*:\\s*var\\(--lds-ink\\)")
        self.assertIn("--lds-ink:", css)
        self.assertIn('html:not([data-theme="light"])', css)

    def test_shared_diagram_styles_are_theme_aware(self):
        css = REFERENCE_STYLES.read_text(encoding="utf-8")
        for selector in (".svg-title", ".svg-label", ".svg-small", ".svg-box", ".svg-box2", ".svg-box3"):
            self.assertIn(selector, css)
        for token in ("--lds-ink", "--lds-muted", "--lds-surface", "--lds-line", "--lds-accent", "--lds-good"):
            self.assertIn(token, css)
        self.assertNotRegex(css, r'html\\[data-theme="light"\\] \\.lesson-figure \\.svg-(?:title|label|small)')

    def test_every_lesson_with_svg_loads_the_shared_theme_system(self):
        pages = sorted(LESSONS.glob("*.html"))
        self.assertTrue(pages, "No lesson HTML pages found")
        checked = 0
        for page in pages:
            html = page.read_text(encoding="utf-8")
            svgs = re.findall(r"<svg\\b[\\s\\S]*?</svg>", html, re.IGNORECASE)
            if not svgs:
                continue
            checked += 1
            self.assertIn("lesson-design-system.css", html, (
                f"{page.name} contains SVG but does not load the shared theme system"
            ))
            for svg in svgs:
                for match in re.finditer(r"<text\\b([^>]*)>", svg, re.IGNORECASE):
                    for value in _text_color_declarations(match.group(1)):
                        self.assertFalse(
                            DARK_COLOR.fullmatch(value.strip().lower()),
                            f"{page.name} contains hard-coded dark SVG text color: {value!r}",
                        )
        self.assertGreater(checked, 0)

    def test_legacy_figure_rules_use_theme_tokens_and_light_theme_has_contrast_override(self):
        components = (ROOT / "styles" / "lesson-content-components.css").read_text(encoding="utf-8")
        theme = (ROOT / "styles" / "theme-system.css").read_text(encoding="utf-8")
        figure_rules = re.search(r"\\.lesson-figure\\s*\\{[^}]*\\}", components)
        self.assertIsNotNone(figure_rules, "Legacy lesson figure rule is missing")
        self.assertIn("background:var(--lds-surface)", figure_rules.group(0))
        for token in ("--lds-ink", "--lds-muted", "--lds-accent", "--lds-good"):
            self.assertIn(token, components)
        self.assertIn('html[data-theme="light"] .article-body .lesson-figure', theme)
        self.assertIn('html[data-theme="light"] .article-body .lesson-nav a.primary{color:#fff}', theme)


if __name__ == "__main__":
    unittest.main()
