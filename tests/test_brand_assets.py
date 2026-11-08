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


def test_logo_has_contrast_tiles_in_all_site_headers():
    main_css = (ROOT / "styles/main.css").read_text(encoding="utf-8")
    account_css = (ROOT / "styles/account.css").read_text(encoding="utf-8")
    reader_css = (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8")
    for source in (main_css, account_css, reader_css):
        assert ".brand img" in source or ".reader-brand img" in source
        assert "linear-gradient(145deg,#172c4c,#0d172b)" in source


def test_lesson_diagrams_have_explicit_svg_palette():
    account_css = (ROOT / "styles/account.css").read_text(encoding="utf-8")
    reader_css = (ROOT / "styles/lesson-reader.css").read_text(encoding="utf-8")
    for source in (account_css, reader_css):
        assert ".lesson-diagram" in source
        assert ".svg-box" in source
        assert ".svg-label" in source
        assert "#e3edff" in source
        assert "#172f50" in source
