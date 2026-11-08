from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def test_brand_logo_is_self_contained_svg():
    logo = (ROOT / "assets/logo.svg").read_text(encoding="utf-8")
    assert "<svg" in logo
    assert "viewBox=" in logo
    assert "<text" in logo and "DCH" in logo
    assert "<image" not in logo
    assert not re.search(r'href=["\'](?!#|data:)', logo)
