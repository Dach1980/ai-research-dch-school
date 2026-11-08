from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def test_brand_logo_is_self_contained_svg():
    logo = (ROOT / "assets/logo.svg").read_text(encoding="utf-8")
    assert "<svg" in logo
    assert "viewBox=" in logo
    assert "<text" in logo and "DCH" in logo
    assert "<image" not in logo
    assert not re.search(r'href=["\\'](?!#|data:)', logo)


def test_supplied_brand_icon_is_present_and_used_in_headers_and_footers():
    icon = ROOT / "assets/site-brand-icon.jpg"
    assert icon.is_file()
    assert icon.stat().st_size > 1000

    pages_with_brand = [
        "index.html", "index-en.html", "index-zh.html",
        "lessons/a-3-how-machines-learn-from-data.html",
        "lessons/reader.html", "tracks/understanding-ai.html",
        "learning-map/index.html",
    ]
    for relative in pages_with_brand:
        page = (ROOT / relative).read_text(encoding="utf-8")
        assert "site-brand-icon.jpg" in page, relative
        assert "assets/favicon.png" in page, relative


def test_brand_icon_has_consistent_contrast_backing():
    main_css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
    account_css = (ROOT / "styles/account.css").read_text(encoding="utf-8")
    reader_css = (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8")
    for source in (main_css, account_css, reader_css):
        assert "#f4f7ff" in source
        assert "border-radius:" in source
        assert "box-shadow:" in source


def test_lesson_diagrams_have_explicit_svg_palette():
    account_css = (ROOT / "styles/account.css").read_text(encoding="utf-8")
    reader_css = (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8")
    for source in (account_css, reader_css):
        assert ".lesson-diagram" in source
        assert ".svg-box" in source
        assert ".svg-label" in source
        assert "#e3edff" in source
        assert "#172f50" in source
