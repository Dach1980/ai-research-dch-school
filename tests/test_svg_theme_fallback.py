from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "lessons"
DESIGN_SYSTEM = ROOT / "styles" / "lesson-design-system.css"


def test_shared_svg_text_fallback_uses_theme_tokens():
    css = DESIGN_SYSTEM.read_text(encoding="utf-8")
    assert re.search(r"svg\\s+text\\s*\\{[^}]*fill\\s*:\\s*var\\(--lds-ink\\)", css)
    assert "--lds-ink:" in css
    assert 'html:not([data-theme="light"])' in css


def test_every_lesson_with_svg_loads_the_shared_theme_system():
    pages = sorted(LESSONS.glob("*.html"))
    assert pages, "No lesson HTML pages found"
    checked = 0
    for page in pages:
        html = page.read_text(encoding="utf-8")
        if "<svg" not in html.lower():
            continue
        checked += 1
        assert "lesson-design-system.css" in html, (
            f"{page.name} contains SVG but does not load the shared theme system"
        )
        assert not re.search(
            r"<text\\b[^>]*style=[\\\"'][^\\\"']*fill\\s*:\\s*(?:black|#000(?:000)?)(?:\\b|[;\\\"'])",
            html,
            re.IGNORECASE,
        ), f"{page.name} contains an inline black SVG text fill that bypasses theme tokens"
    assert checked > 0
