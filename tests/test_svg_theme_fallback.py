from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "lessons"
DESIGN_SYSTEM = ROOT / "styles" / "lesson-design-system.css"
REFERENCE_STYLES = ROOT / "styles" / "lesson-reference-111.css"


def test_shared_svg_text_fallback_uses_theme_tokens():
    css = DESIGN_SYSTEM.read_text(encoding="utf-8")
    assert re.search(r"svg\s+text\s*\{[^}]*fill\s*:\s*var\(--lds-ink\)", css)
    assert "--lds-ink:" in css
    assert 'html:not([data-theme="light"])' in css


def test_shared_diagram_styles_are_theme_aware():
    css = REFERENCE_STYLES.read_text(encoding="utf-8")
    for selector in (".svg-title", ".svg-label", ".svg-small", ".svg-box", ".svg-box2", ".svg-box3"):
        assert selector in css
    for token in ("--lds-ink", "--lds-muted", "--lds-surface", "--lds-line", "--lds-accent", "--lds-good"):
        assert token in css
    assert not re.search(r"html\[data-theme=\"light\"\] \.lesson-figure \.svg-(?:title|label|small)", css)


def test_every_lesson_with_svg_loads_the_shared_theme_system():
    pages = sorted(LESSONS.glob("*.html"))
    assert pages, "No lesson HTML pages found"
    checked = 0
    for page in pages:
        html = page.read_text(encoding="utf-8")
        svgs = re.findall(r"<svg\b[\s\S]*?</svg>", html, re.IGNORECASE)
        if not svgs:
            continue
        checked += 1
        assert "lesson-design-system.css" in html, (
            f"{page.name} contains SVG but does not load the shared theme system"
        )
        for svg in svgs:
            for match in re.finditer(r"<text\b([^>]*)>", svg, re.IGNORECASE):
                attrs = match.group(1)
                assert re.search(r"\bclass=[\"'][^\"']+[\"']", attrs), (
                    f"{page.name} contains SVG text without a semantic CSS class"
                )
                assert not re.search(r"\b(?:fill|style)\s*=", attrs, re.IGNORECASE), (
                    f"{page.name} contains inline SVG text color; use theme tokens"
                )
    assert checked > 0
