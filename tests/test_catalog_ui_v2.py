from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_track_lesson_catalog_reads_hierarchical_v2():
    script = (ROOT / "scripts/lesson-catalog.js").read_text(encoding="utf-8")
    page = (ROOT / "tracks/understanding-ai.html").read_text(encoding="utf-8")
    assert "schemaVersion: 2" in script
    assert "data.themes" in script and "data.modules" in script
    assert "lessons.json" not in script
    assert page.index("catalog-compat.js") < page.index("lesson-catalog.js")


def test_knowledge_map_reads_hierarchical_v2():
    script = (ROOT / "scripts/planet-map-catalog.js").read_text(encoding="utf-8")
    page = (ROOT / "learning-map/index.html").read_text(encoding="utf-8")
    assert "schemaVersion:2" in script
    assert "data.themes" in script and "data.modules" in script
    assert 'fetch("../data/catalog/lessons.json"' not in script
    assert page.index("catalog-compat.js") < page.index("planet-map-catalog.js")


def test_homepage_displays_hierarchical_lesson_ids():
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    for number in range(1, 7):
        assert f"A.1.1.{number}" in page
